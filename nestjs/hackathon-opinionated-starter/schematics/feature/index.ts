import { join } from 'node:path';
import { strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  renameTemplateFiles,
  SchematicsException,
  template,
  url,
  type Rule,
  type Tree,
} from '@angular-devkit/schematics';
import pluralize from 'pluralize';
import * as prettier from 'prettier';
import ts from 'typescript';

interface FeatureOptions {
  name: string;
  spec: boolean;
  sourceRoot: string;
}

type Names = ReturnType<typeof namesFor>;

// `nest g feature order-lines` (or `order-line`) generates src/features/order-lines
// with an OrderLine entity, an order_lines table and /api/order-lines endpoints
export function feature(options: FeatureOptions): Rule {
  return (tree) => {
    const names = namesFor(options.name);
    const sourceRoot = options.sourceRoot ?? 'src';
    const featureDir = `${sourceRoot}/features/${names.entitiesPath}`;

    if (tree.getDir(featureDir).subfiles.length > 0) {
      throw new SchematicsException(`${featureDir} already exists`);
    }

    const touched: string[] = [];
    const render = (source: string, target: string) =>
      mergeWith(
        apply(url(source), [
          options.spec === false
            ? filter((path) => !path.endsWith('.spec.ts.template'))
            : noop(),
          template(names),
          renameTemplateFiles(),
          move(target),
          (generated) => {
            generated.visit((path) => touched.push(path));
          },
        ]),
      );

    return chain([
      render('./files', featureDir),
      options.spec === false ? noop() : render('./test-files', 'test'),
      registerHttpModule(
        `${sourceRoot}/transport/http/http-api.module.ts`,
        names,
        touched,
      ),
      registerTable(`${sourceRoot}/shared/database`, names, touched),
      formatFiles(touched),
    ]);
  };
}

function namesFor(input: string) {
  const name = strings.dasherize(input.trim());
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
    throw new SchematicsException(
      `"${input}" is not a valid feature name. Use letters, digits and dashes, like "orders" or "order-lines"`,
    );
  }

  const words = name.split('-');
  const last = words.pop()!;
  const singular = [...words, pluralize.singular(last)].join('-');
  const plural = [...words, pluralize.plural(last)].join('-');
  const label = singular.replaceAll('-', ' ');

  return {
    Entity: strings.classify(singular),
    Entities: strings.classify(plural),
    entity: strings.camelize(singular),
    entities: strings.camelize(plural),
    entityFile: singular,
    entitiesPath: plural,
    table: strings.underscore(plural),
    label,
    labels: plural.replaceAll('-', ' '),
    Label: strings.capitalize(label),
    aLabel: `${/^[aeiou]/.test(label) ? 'an' : 'a'} ${label}`,
  };
}

function registerHttpModule(
  path: string,
  names: Names,
  touched: string[],
): Rule {
  return (tree) => {
    const source = parse(tree, path);
    const moduleName = `${names.Entities}HttpModule`;
    const imports = findModuleImports(source);
    if (!imports) {
      throw new SchematicsException(
        `Couldn't find @Module({ imports: [...] }) in ${path}`,
      );
    }

    const recorder = tree.beginUpdate(path);
    insertImport(
      recorder,
      source,
      `../../features/${names.entitiesPath}/http/${names.entitiesPath}-http.module.js`,
      moduleName,
    );
    const lastElement = imports.elements.at(-1);
    if (lastElement) {
      recorder.insertRight(lastElement.end, `, ${moduleName}`);
    } else {
      recorder.insertRight(imports.getStart(source) + 1, moduleName);
    }
    tree.commitUpdate(recorder);
    touched.push(path);
  };
}

function registerTable(dir: string, names: Names, touched: string[]): Rule {
  return (tree) => {
    const typesPath = `${dir}/database.types.ts`;
    const types = parse(tree, typesPath);
    const database = types.statements.find(
      (node): node is ts.InterfaceDeclaration =>
        ts.isInterfaceDeclaration(node) && node.name.text === 'Database',
    );
    if (!database) {
      throw new SchematicsException(
        `Couldn't find the Database interface in ${typesPath}`,
      );
    }

    const typesRecorder = tree.beginUpdate(typesPath);
    typesRecorder.insertLeft(
      database.end - 1,
      `${names.entities}: ${names.Entities}Table;\n`,
    );
    typesRecorder.insertLeft(
      types.end,
      `
export interface ${names.Entities}Table {
  id: Generated<number>;
  name: string;
  createdAt: Generated<Date>;
}
`,
    );
    tree.commitUpdate(typesRecorder);

    const schemaPath = `${dir}/schema.ts`;
    const schema = parse(tree, schemaPath);
    const createTables = schema.statements.find(
      (node): node is ts.FunctionDeclaration =>
        ts.isFunctionDeclaration(node) && node.name?.text === 'createTables',
    );
    if (!createTables?.body) {
      throw new SchematicsException(
        `Couldn't find the createTables function in ${schemaPath}`,
      );
    }

    const schemaRecorder = tree.beginUpdate(schemaPath);
    schemaRecorder.insertLeft(
      createTables.body.end - 1,
      `
  await db.schema
    .createTable('${names.table}')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql\`now()\`))
    .execute();
`,
    );
    tree.commitUpdate(schemaRecorder);
    touched.push(typesPath, schemaPath);
  };
}

function formatFiles(paths: string[]): Rule {
  return async (tree) => {
    for (const path of new Set(paths)) {
      const filepath = join(process.cwd(), path);
      const config = await prettier.resolveConfig(filepath);
      const content = tree.readText(path);
      tree.overwrite(
        path,
        await prettier.format(content, { ...config, filepath }),
      );
    }
  };
}

function parse(tree: Tree, path: string): ts.SourceFile {
  if (!tree.exists(path)) {
    throw new SchematicsException(`${path} not found`);
  }
  return ts.createSourceFile(
    path,
    tree.readText(path),
    ts.ScriptTarget.Latest,
    true,
  );
}

function findModuleImports(
  source: ts.SourceFile,
): ts.ArrayLiteralExpression | undefined {
  for (const statement of source.statements) {
    if (!ts.isClassDeclaration(statement)) continue;
    for (const decorator of ts.getDecorators(statement) ?? []) {
      const call = decorator.expression;
      if (
        !ts.isCallExpression(call) ||
        call.expression.getText(source) !== 'Module'
      )
        continue;
      const [metadata] = call.arguments;
      if (!metadata || !ts.isObjectLiteralExpression(metadata)) continue;
      for (const property of metadata.properties) {
        if (
          ts.isPropertyAssignment(property) &&
          property.name.getText(source) === 'imports' &&
          ts.isArrayLiteralExpression(property.initializer)
        ) {
          return property.initializer;
        }
      }
    }
  }
  return undefined;
}

// Keeps the relative imports sorted by path, like the rest of the code base
function insertImport(
  recorder: ReturnType<Tree['beginUpdate']>,
  source: ts.SourceFile,
  from: string,
  name: string,
) {
  const line = `import { ${name} } from '${from}';\n`;
  const imports = source.statements.filter(ts.isImportDeclaration);
  const next = imports.find((node) => {
    const path = (node.moduleSpecifier as ts.StringLiteral).text;
    return path.startsWith('.') && path > from;
  });
  if (next) {
    recorder.insertLeft(next.getStart(source), line);
  } else {
    recorder.insertLeft(imports.at(-1)?.end ?? 0, `\n${line}`);
  }
}
