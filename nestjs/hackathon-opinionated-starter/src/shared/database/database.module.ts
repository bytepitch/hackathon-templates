import {
  Global,
  Inject,
  Module,
  type OnApplicationShutdown,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import type { Database } from './database.types.js';
import { createTables } from './schema.js';

export const KYSELY = Symbol('KYSELY');

export function createDb(pool: pg.Pool) {
  return new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
    plugins: [new CamelCasePlugin()],
  });
}

@Global()
@Module({
  providers: [
    {
      provide: KYSELY,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createDb(
          new pg.Pool({
            connectionString: config.get(
              'DATABASE_URL',
              'postgres://postgres:postgres@localhost:5432/hackathon',
            ),
          }),
        ),
    },
  ],
  exports: [KYSELY],
})
export class DatabaseModule implements OnModuleInit, OnApplicationShutdown {
  constructor(@Inject(KYSELY) private readonly db: Kysely<Database>) {}

  async onModuleInit() {
    await createTables(this.db);
  }

  async onApplicationShutdown() {
    await this.db.destroy();
  }
}
