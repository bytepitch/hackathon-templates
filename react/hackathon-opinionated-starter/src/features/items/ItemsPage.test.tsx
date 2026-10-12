import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { renderWithProviders } from '@/test/render';
import type { Item } from './api';
import { ItemsPage } from './ItemsPage';

// An in-memory version of the API's /api/items endpoints
function mockItemsApi(initial: Item[] = []) {
  let items = [...initial];
  let nextId = items.length + 1;

  server.use(
    http.get('*/api/items', () => HttpResponse.json(items)),
    http.post('*/api/items', async ({ request }) => {
      const { name } = (await request.json()) as { name: string };
      const item = { id: nextId++, name, createdAt: new Date().toISOString() };
      items.push(item);
      return HttpResponse.json(item, { status: 201 });
    }),
    http.delete('*/api/items/:id', ({ params }) => {
      items = items.filter((item) => item.id !== Number(params.id));
      return new HttpResponse(null, { status: 204 });
    }),
  );
}

describe('ItemsPage', () => {
  it('lists the items from the API', async () => {
    mockItemsApi([
      { id: 1, name: 'Coffee', createdAt: '2026-01-01T00:00:00Z' },
    ]);

    renderWithProviders(<ItemsPage />);

    expect(await screen.findByText('Coffee')).toBeInTheDocument();
  });

  it('adds an item', async () => {
    mockItemsApi();
    const user = userEvent.setup();
    renderWithProviders(<ItemsPage />);
    expect(await screen.findByText(/No items yet/)).toBeInTheDocument();

    await user.type(screen.getByLabelText('Name'), 'Tea');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByText('Tea')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('');
  });

  it("doesn't send an empty name", async () => {
    mockItemsApi();
    const user = userEvent.setup();
    renderWithProviders(<ItemsPage />);

    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
  });

  it('deletes an item', async () => {
    mockItemsApi([
      { id: 1, name: 'Coffee', createdAt: '2026-01-01T00:00:00Z' },
    ]);
    const user = userEvent.setup();
    renderWithProviders(<ItemsPage />);

    await user.click(
      await screen.findByRole('button', { name: 'Delete Coffee' }),
    );

    expect(await screen.findByText(/No items yet/)).toBeInTheDocument();
  });

  it('shows an error when the API fails', async () => {
    server.use(
      http.get('*/api/items', () =>
        HttpResponse.json(
          { statusCode: 500, message: 'Internal server error' },
          { status: 500 },
        ),
      ),
    );

    renderWithProviders(<ItemsPage />);

    expect(
      await screen.findByText(/Couldn't load items: Internal server error/),
    ).toBeInTheDocument();
  });
});
