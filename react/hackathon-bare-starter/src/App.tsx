import { useEffect, useState } from 'react';

type ApiState =
  | { status: 'loading' }
  | { status: 'ok'; message: string }
  | { status: 'error'; error: string };

function App() {
  const [api, setApi] = useState<ApiState>({ status: 'loading' });

  // Calls GET / on the API through the dev server proxy (see vite.config.ts)
  useEffect(() => {
    fetch('/api/')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setApi({ status: 'ok', message: await res.text() });
      })
      .catch((err: unknown) => {
        setApi({
          status: 'error',
          error: err instanceof Error ? err.message : String(err),
        });
      });
  }, []);

  return (
    <main>
      <h1>Hackathon starter</h1>
      <p>
        Edit <code>src/App.tsx</code> and save to see your changes.
      </p>

      <h2>API</h2>
      {api.status === 'loading' && <p>Calling the API…</p>}
      {api.status === 'ok' && (
        <p>
          The API answered: <strong>{api.message}</strong>
        </p>
      )}
      {api.status === 'error' && (
        <p>
          Couldn't reach the API ({api.error}). Is it running on{' '}
          <code>http://localhost:3000</code>?
        </p>
      )}
    </main>
  );
}

export default App;
