import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('shows the API response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Hello World!')),
    );

    render(<App />);

    expect(await screen.findByText('Hello World!')).toBeInTheDocument();
  });

  it('shows an error when the API is down', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    );

    render(<App />);

    expect(
      await screen.findByText(/Couldn't reach the API/),
    ).toBeInTheDocument();
  });
});
