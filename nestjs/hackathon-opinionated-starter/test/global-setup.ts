import { PostgreSqlContainer } from '@testcontainers/postgresql';
import type { TestProject } from 'vitest/node';

// Starts one real Postgres in Docker for the whole e2e run
export default async function setup(project: TestProject) {
  const container = await new PostgreSqlContainer('postgres:17').start();
  project.provide('databaseUrl', container.getConnectionUri());

  return async () => {
    await container.stop();
  };
}

declare module 'vitest' {
  export interface ProvidedContext {
    databaseUrl: string;
  }
}
