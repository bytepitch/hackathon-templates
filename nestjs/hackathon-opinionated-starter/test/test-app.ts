import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { sql } from 'kysely';
import { Pool } from 'pg';
import type { App } from 'supertest/types.js';
import { inject } from 'vitest';
import { createDb, KYSELY } from '../src/shared/database/database.module.js';
import { HttpApiModule } from '../src/transport/http/http-api.module.js';
import { configureHttpApp } from '../src/transport/http/http.setup.js';

// Starts the whole app on the test Postgres container, with every table emptied
export async function createTestApp(): Promise<INestApplication<App>> {
  const db = createDb(new Pool({ connectionString: inject('databaseUrl') }));

  const moduleFixture = await Test.createTestingModule({
    imports: [HttpApiModule],
  })
    .overrideProvider(KYSELY)
    .useValue(db)
    .compile();

  const app = moduleFixture.createNestApplication<INestApplication<App>>();
  configureHttpApp(app);
  await app.init();

  const tables = await db.introspection.getTables();
  if (tables.length > 0) {
    const names = tables.map((table) => sql.table(table.name));
    await sql`truncate ${sql.join(names)} restart identity cascade`.execute(db);
  }

  return app;
}
