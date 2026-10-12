import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { createTestApp } from './test-app.js';

describe('Items (e2e)', () => {
  let app: INestApplication<App>;
  let api: ReturnType<typeof request>;

  beforeEach(async () => {
    app = await createTestApp();
    api = request(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates an item', async () => {
    const response = await api.post('/api/items').send({ name: 'Coffee' });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Coffee');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('createdAt');
  });

  it('rejects an item without a name', async () => {
    const missing = await api.post('/api/items').send({});
    const blank = await api.post('/api/items').send({ name: '   ' });

    expect(missing.status).toBe(400);
    expect(blank.status).toBe(400);
    expect(blank.body.message).toBe('Item name cannot be empty');
  });

  it('lists items', async () => {
    await api.post('/api/items').send({ name: 'Coffee' });
    await api.post('/api/items').send({ name: 'Tea' });

    const response = await api.get('/api/items');

    expect(response.status).toBe(200);
    expect(response.body.map((item: { name: string }) => item.name)).toEqual([
      'Coffee',
      'Tea',
    ]);
  });

  it('gets an item', async () => {
    const created = (await api.post('/api/items').send({ name: 'Coffee' }))
      .body;

    const response = await api.get(`/api/items/${created.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(created);
  });

  it('returns 404 for a missing item', async () => {
    const response = await api.get('/api/items/999');

    expect(response.status).toBe(404);
  });

  it('deletes an item', async () => {
    const created = (await api.post('/api/items').send({ name: 'Coffee' }))
      .body;

    const response = await api.delete(`/api/items/${created.id}`);

    expect(response.status).toBe(204);
    expect((await api.get(`/api/items/${created.id}`)).status).toBe(404);
  });

  it('returns 404 when deleting a missing item', async () => {
    const response = await api.delete('/api/items/999');

    expect(response.status).toBe(404);
  });
});
