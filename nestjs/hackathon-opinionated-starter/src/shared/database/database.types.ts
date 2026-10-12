import type { Generated } from 'kysely';

// One property per table. Columns are camelCase here and snake_case in Postgres
// (CamelCasePlugin converts between them)
export interface Database {
  items: ItemsTable;
}

export interface ItemsTable {
  id: Generated<number>;
  name: string;
  createdAt: Generated<Date>;
}
