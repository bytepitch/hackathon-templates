import { sql, type Kysely } from 'kysely';
import type { Database } from './database.types.js';

// Runs once when the server starts. Missing tables are created, existing ones are left as they are.
// Add new tables here (and their types in database.types.ts)
export async function createTables(db: Kysely<Database>) {
  await db.schema
    .createTable('items')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();
}
