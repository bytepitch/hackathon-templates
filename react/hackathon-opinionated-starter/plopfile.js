// Code generators. Run `npm run gen` and pick one, or `npm run gen feature <name>`
import pluralize from 'pluralize';
import { format, resolveConfig } from 'prettier';
import { readFile, writeFile } from 'node:fs/promises';

const ROUTES_MARKER =
  /^(\s*)\/\/ `npm run gen` adds new feature pages above this line$/m;

/** @param {import('plop').NodePlopAPI} plop */
export default function (plop) {
  // Formats the files a generator wrote, so they match the rest of the code
  plop.setActionType('prettier', async (_answers, config) => {
    for (const file of config.files) {
      const source = await readFile(file, 'utf8');
      const options = await resolveConfig(file);
      await writeFile(
        file,
        await format(source, { ...options, filepath: file }),
      );
    }
    return `formatted ${config.files.length} files`;
  });

  plop.setGenerator('feature', {
    description:
      'A feature folder with a page, a form, API hooks and tests, plus its route',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Feature name, singular (e.g. project, todo item):',
        validate: (value) =>
          /^[a-zA-Z][a-zA-Z0-9 _-]*$/.test(value.trim()) ||
          'Use letters, numbers, spaces, - or _, starting with a letter',
      },
    ],
    actions: (answers) => {
      const singular = pluralize.singular(answers.name.trim());
      const plural = pluralize.plural(singular);
      const camel = plop.getHelper('camelCase');
      const pascal = plop.getHelper('pascalCase');
      const kebab = plop.getHelper('kebabCase');
      const sentence = plop.getHelper('sentenceCase');

      // Names used in the templates, e.g. for "todo item":
      Object.assign(answers, {
        entity: camel(singular), // todoItem
        Entity: pascal(singular), // TodoItem
        entities: camel(plural), // todoItems
        Entities: pascal(plural), // TodoItems
        entityPath: kebab(singular), // todo-item
        entitiesPath: kebab(plural), // todo-items, for the folder, URL and API path
        entitiesText: sentence(plural).toLowerCase(), // todo items
        EntitiesText: sentence(plural), // Todo items
      });

      const folder = `src/features/${answers.entitiesPath}`;
      const page = `${folder}/${answers.Entities}Page.tsx`;

      return [
        {
          type: 'addMany',
          destination: folder,
          base: 'generators/feature/files',
          templateFiles: 'generators/feature/files/*.hbs',
          stripExtensions: ['hbs'],
        },
        {
          type: 'modify',
          path: 'src/routes.tsx',
          pattern: ROUTES_MARKER,
          template: [
            '$1{',
            "$1  path: '/{{entitiesPath}}',",
            '$1  lazy: async () => ({',
            "$1    Component: (await import('@/features/{{entitiesPath}}/{{Entities}}Page')).{{Entities}}Page,",
            '$1  }),',
            '$1},',
            '$1// `npm run gen` adds new feature pages above this line',
          ].join('\n'),
        },
        {
          type: 'prettier',
          files: [
            `${folder}/api.ts`,
            `${folder}/Create${answers.Entity}Form.tsx`,
            page,
            `${folder}/${answers.Entities}Page.test.tsx`,
            'src/routes.tsx',
          ],
        },
        [
          '',
          `Created ${folder}/ and added /${answers.entitiesPath} to the routes.`,
          `The code calls /api/${answers.entitiesPath}. If the API has these endpoints, run`,
          '`npm run api:generate` to get their types. Until then TypeScript flags the paths.',
        ].join('\n'),
      ];
    },
  });
}
