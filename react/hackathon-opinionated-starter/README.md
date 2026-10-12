# hackathon-opinionated-starter

An opinionated [React](https://react.dev) starter for building a web app during a hackathon. It comes with React 19, Vite, routing, a component library, data fetching, forms and one example feature (`items`) that talks to a REST API. Any back end works, as long as it describes its endpoints in an OpenAPI document (see [What it expects from the API](#what-it-expects-from-the-api)).
TypeScript, Vitest, oxlint and Prettier are already set up.

See [react/README.md](../README.md) for the prerequisites, how the app talks to the API, sharing it on the local network and deploying.

## Opinions

The starter makes a few choices up front, so you don't spend the hackathon making them:

- **A single-page app, not Next.js.** Your API is the back end. The front end is a static site that calls it, so there's no second server to run or deploy.
- **[React Router](https://reactrouter.com)** for pages, set up in `src/routes.tsx`.
- **[Tailwind CSS](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com)** for styling. shadcn components are copied into `src/shared/ui/`, so you can edit them.
- **[TanStack Query](https://tanstack.com/query)** for everything that comes from the API: caching, loading and error states, refetching after changes.
- **A typed API client generated from the API's OpenAPI docs.** Paths, request bodies and responses are checked by TypeScript, so a renamed field shows up as a type error instead of a bug.
- **[React Hook Form](https://react-hook-form.com) and [Zod](https://zod.dev)** for forms and validation.
- **Feature folders.** Each feature keeps its page, API hooks and tests together. `npm run gen feature <name>` creates one.
- **Component tests with a mocked API.** [MSW](https://mswjs.io) answers the requests, so tests don't need the API running.

If these don't fit your project, use [hackathon-bare-starter](../hackathon-bare-starter) instead.

## Run

Start your API first, on port 3000. Then, in this folder, run the app on your machine:

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

Then open http://localhost:5173. The dot in the top right shows whether the app can reach the API. When you save a file in `src/`, the page updates by itself. Both options use port 5173, so pick one.

Good to know:

- To use an API on another address, copy `.env.example` to `.env` and change `VITE_API_URL`.
- Only variables that start with `VITE_` are available in the browser code, as `import.meta.env.VITE_...`. Don't put secrets in them: they end up in the built JavaScript.
- If you add a package (`npm i some-package`) and you run the app in Docker, start it again with `docker compose up --build`.

## What it expects from the API

Most back-end frameworks can produce an OpenAPI document (also called a Swagger document), either built in or with a plugin. The starter uses it to generate the API types. By default it reads it from `<VITE_API_URL>/api/openapi.json`. If your API serves it somewhere else, set `OPENAPI_URL` in `.env` (FastAPI, for example, serves it at `http://localhost:3000/openapi.json`).

Calls from the app start with `/api`. If your API's routes start at the root instead, add `rewrite: (path) => path.replace(/^\/api/, '')` to the proxy in `vite.config.ts`.

The example code uses these endpoints. Remove or change it if your API doesn't have them:

| Endpoint                 | Used by                                                          |
| ------------------------ | ---------------------------------------------------------------- |
| `GET /api/health`        | The "API online" dot (`features/health`). Any 2xx answer counts. |
| `GET /api/items`         | The items list. Returns `[{ id, name, createdAt }]`              |
| `POST /api/items`        | The form. Takes `{ name }`, returns the new item                 |
| `DELETE /api/items/{id}` | The delete button                                                |

The `schema.d.ts` that comes with the starter describes these endpoints. Run `npm run api:generate` against your own API to replace it (see [After changing the API](#after-changing-the-api)). TypeScript then points out every place in the example code that doesn't match your API.

## How the code is organised

```
src/
├── main.tsx                     starts the app
├── App.tsx                      providers: TanStack Query, the router, toasts
├── routes.tsx                   which page shows for which URL
├── layouts/RootLayout.tsx       header and navigation around every page
├── pages/                       pages that don't belong to a feature (home, not found)
├── features/                    one folder per feature
│   ├── health/HealthBadge.tsx   the "API online" dot in the header
│   └── items/
│       ├── api.ts               TanStack Query hooks: useItems, useCreateItem, useDeleteItem
│       ├── ItemsPage.tsx        the page: list, loading, empty and error states
│       ├── CreateItemForm.tsx   the form, validated with Zod
│       └── ItemsPage.test.tsx   tests against a mocked API
├── shared/
│   ├── api/
│   │   ├── client.ts            the typed API client and unwrap()
│   │   ├── query-client.ts      TanStack Query settings, error toasts for failed changes
│   │   ├── schema.d.ts          generated API types, don't edit by hand
│   │   └── types.ts             ResponseBody and RequestBody, to type an endpoint's data
│   ├── ui/                      shadcn/ui components
│   └── lib/utils.ts             cn() for combining Tailwind classes
└── test/                        test setup, the mock API server and renderWithProviders()
```

The rules:

- **Components don't call the API directly.** Each feature's `api.ts` wraps the calls in TanStack Query hooks, and components use those hooks.
- **Features don't import from each other.** Code that several features need goes in `shared/`.
- **Failed changes show a toast by themselves.** `query-client.ts` shows the API's error message for every failed mutation, so components only handle success. Failed loads are shown on the page instead (see `ItemsPage.tsx`).

## Calling the API

The client in `src/shared/api/client.ts` knows every endpoint, from `schema.d.ts`:

```ts
import { api, unwrap } from '@/shared/api/client';

const items = await unwrap(api.GET('/api/items'));
const item = await unwrap(api.POST('/api/items', { body: { name: 'Coffee' } }));
await unwrap(api.DELETE('/api/items/{id}', { params: { path: { id: 1 } } }));
```

`unwrap()` returns the response data, or throws an `ApiError` with the status and the API's error message. That's what TanStack Query expects, so use it in every `queryFn` and `mutationFn`.

To type an endpoint's data, use the helpers in `src/shared/api/types.ts`. They look the types up by path, so they work whatever the API names its schemas:

```ts
import type { RequestBody, ResponseBody } from '@/shared/api/types';

type Item = ResponseBody<'/api/items', 'get'>[number];
type CreateItemInput = RequestBody<'/api/items', 'post'>;
```

### After changing the API

When you add or change endpoints or DTOs in the API, regenerate the types with the API running:

```bash
npm run api:generate
```

It reads the OpenAPI document (`<VITE_API_URL>/api/openapi.json`, or `OPENAPI_URL` if you set it) and rewrites `src/shared/api/schema.d.ts`. Commit the result, so the app builds without the API running. Then fix whatever TypeScript complains about.

## Add a feature

Generate it:

```bash
npm run gen feature order
```

Leave out the name (`npm run gen`) and it asks for it. Give the name in the singular. A name with several words needs quotes (`npm run gen feature "support ticket"`).

This creates `src/features/orders/`, modelled on `items`:

- `api.ts`: `useOrders`, `useCreateOrder` and `useDeleteOrder`, calling `GET /api/orders`, `POST /api/orders` and `DELETE /api/orders/{id}`
- `OrdersPage.tsx` and `CreateOrderForm.tsx`: the list, with loading, empty and error states, and a form with a `name` field
- `OrdersPage.test.tsx`: tests against a mocked API

It also adds the page to `src/routes.tsx` at `/orders`, above the `` `npm run gen` adds new feature pages above this line `` comment, so keep that comment. It doesn't add a link to the page anywhere: where people reach it from (the header, another page, a button) is up to you. The header's links are in `links` in `src/layouts/RootLayout.tsx`.

Then:

1. Add the endpoints to the API, if they aren't there yet.
2. Run `npm run api:generate`. Until you do, TypeScript doesn't know `/api/orders` and flags it.
3. Make the page fit your data. The generated code only uses an `id` and a `name`. If the API uses other paths or fields, TypeScript shows you what to change.

The generator lives in `plopfile.js`, and the templates in `generators/feature/files/`. Change them to change what every new feature looks like. It's built with [Plop](https://plopjs.com).

Pages in `routes.tsx` use `lazy`, so each feature is only downloaded when someone opens it.

## Add UI components

shadcn/ui has [many more components](https://ui.shadcn.com/docs/components) (dialogs, selects, tables, tabs and more). Add one with:

```bash
npx shadcn@latest add dialog
```

It lands in `src/shared/ui/`, ready to import as `@/shared/ui/dialog`. Icons come from [Lucide](https://lucide.dev/icons): `import { PlusIcon } from 'lucide-react'`.

## Scripts

| Command                | What it does                                             |
| ---------------------- | -------------------------------------------------------- |
| `npm run dev`          | Run the dev server on port 5173                          |
| `npm run build`        | Type-check and build the static site to `dist/`          |
| `npm run preview`      | Serve the built `dist/` to check it                      |
| `npm run api:generate` | Regenerate the API types from the running API            |
| `npm run gen`          | Generate a feature (see [Add a feature](#add-a-feature)) |
| `npm test`             | Run the tests once                                       |
| `npm run test:watch`   | Run the tests on every save                              |
| `npm run lint`         | Lint with oxlint                                         |
| `npm run format`       | Format with Prettier                                     |

## Resources

- [React documentation](https://react.dev/learn) and [Vite guide](https://vite.dev/guide/)
- [React Router](https://reactrouter.com), [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview), [openapi-fetch](https://openapi-ts.dev/openapi-fetch/)
- [shadcn/ui](https://ui.shadcn.com/docs/components), [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/get-started), [Zod](https://zod.dev)
- [Vitest](https://vitest.dev), [Testing Library](https://testing-library.com/docs/react-testing-library/intro/), [MSW](https://mswjs.io/docs/)
