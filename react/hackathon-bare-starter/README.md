# hackathon-bare-starter

A plain React 19 + TypeScript app, as `npm create vite` (react-ts template) creates it, with a few hackathon basics:

- Node 24 or newer: `.nvmrc`, and `engine-strict=true` in `.npmrc`
- Runs on port 5173 and listens on all network interfaces, so teammates can open it through your IP
- A dev proxy: requests to `/api/...` go to the API (http://localhost:3000 by default), so there are no CORS problems
- One page that calls the API and shows its answer, so you can see the wiring works
- Vitest and Testing Library, with one example test
- oxlint and Prettier
- A `Dockerfile` and a `docker-compose.yml` with just the front end

Everything else is up to you: routing, styling, data fetching, forms. For a starter that makes those choices for you, see [hackathon-opinionated-starter](../hackathon-opinionated-starter).

See [react/README.md](../README.md) for the prerequisites, how the app talks to the API, sharing it on the local network and deploying.

## Run

Run it on your machine:

```bash
nvm install   # first time only: installs the Node version from .nvmrc
nvm use
npm i
npm run dev
```

Or start it in Docker:

```bash
docker compose up
```

Then open http://localhost:5173. When you save a file in `src/`, the page updates by itself. Both options use port 5173, so pick one.

The page calls `GET /` on the API and shows the response, so start your API too. Any back end on port 3000 works.

Good to know:

- To use an API on another address, copy `.env.example` to `.env` and change `VITE_API_URL`.
- The proxy removes the `/api` prefix, for APIs whose routes start at the root: `/api/users` goes to `http://localhost:3000/users`. If your API's routes already start with `/api`, delete the `rewrite` line in `vite.config.ts`.
- Only variables that start with `VITE_` are available in the browser code, as `import.meta.env.VITE_...`. Don't put secrets in them: they end up in the built JavaScript.
- If you add a package (`npm i some-package`) and you run the app in Docker, start it again with `docker compose up --build`.

## Scripts

| Command              | What it does                                    |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Run the dev server on port 5173                 |
| `npm run build`      | Type-check and build the static site to `dist/` |
| `npm run preview`    | Serve the built `dist/` to check it             |
| `npm test`           | Run the tests once                              |
| `npm run test:watch` | Run the tests on every save                     |
| `npm run lint`       | Lint with oxlint                                |
| `npm run format`     | Format with Prettier                            |

## Resources

- [React documentation](https://react.dev/learn)
- [Vite guide](https://vite.dev/guide/)
- [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
