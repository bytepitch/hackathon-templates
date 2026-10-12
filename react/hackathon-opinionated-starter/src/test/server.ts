import { setupServer } from 'msw/node';

// Mock API for tests. Each test adds the endpoints it needs with server.use(...)
export const server = setupServer();
