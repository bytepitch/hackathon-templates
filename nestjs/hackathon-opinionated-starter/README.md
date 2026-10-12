# hackathon-opinionated-starter

An opinionated [NestJS](https://docs.nestjs.com) starter for building a back-end service API during a hackathon. It comes with NestJS 12 (Express), a Postgres database, Swagger docs and one example feature (`items`) to copy or generate new ones from.
TypeScript, Vitest, oxlint and Prettier are already set up.

See [nestjs/README.md](../README.md) for the prerequisites (Node 24 and Docker), installing nvm, sharing the API on the local network and ngrok.

## Opinions

The starter makes a few choices up front, so you don't spend the hackathon making them:

- **Clean Architecture with feature modules.** Business rules live in a domain layer, separate from HTTP and the database (see [How the code is organised](#how-the-code-is-organised)).
- **PostgreSQL** is the database, in Docker for development and for the API tests.
- **Kysely, not an ORM.** Every query is written out in a repository, so there's no lazy loading and no hidden N+1 queries.
- **Tables are created when the server starts.** There are no migrations, which is fine for a hackathon but not for production.
- **API tests run against a real Postgres**, started by Testcontainers.
- **`nest g feature`** generates new features in this layout.

If these don't fit your project, use [hackathon-bare-starter](../hackathon-bare-starter) instead.

## Run

The quickest way is to start everything in Docker:

```bash
docker compose up
```

Then open:

- http://localhost:3000/api/health to see that it's alive
- http://localhost:3000/api/docs to try the endpoints in the browser

When you save a file in `src/`, the server restarts by itself.

You can also run the API on your machine and keep only the database in Docker. You'll need Node 24 (see [Install nvm](../README.md#install-nvm)):

```bash
nvm install   # first time only: installs the Node version from .nvmrc
nvm use
npm i
docker compose up -d db
npm run start:dev
```

Pick one of the two. Both use port 3000, so they can't run at the same time.

Good to know:

- If you add a package (`npm i some-package`) and you run the API in Docker, start it again with `docker compose up --build`.
- Settings are read from environment variables. To change one, copy `.env.example` to `.env` and edit it there.
- CORS allows all origins. To allow only specific ones, set `CORS_ORIGINS` in `.env` (comma-separated).
- If you already have Postgres running on your machine, stop it first. It uses the same port (5432).

To share the API with teammates on your network, or get a public URL for it, see [nestjs/README.md](../README.md#sharing-it-on-the-local-network).

## How the code is organised

The starter follows [Clean Architecture](https://medium.com/@sebastian.iwanczyszyn/building-maintainable-nestjs-apps-with-clean-architecture-056248f04cef) with feature modules.
Each feature keeps its business logic away from HTTP and the database, so the rules are easy to test and the outside parts can change without touching them.

```
src/
├── main.ts                         starts the HTTP server
├── features/                       one folder per feature
│   └── items/
│       ├── domain/                 business rules: the Item entity, its errors, the ItemRepository port
│       ├── application/            use cases, one class per action (CreateItem, GetItem, ...)
│       ├── infrastructure/         talks to the outside world: PostgresItemRepository
│       ├── http/                   the controller, request/response shapes and ItemsHttpModule
│       └── items.module.ts         the core: wires it up and exports only the use cases
├── shared/
│   ├── database/                   the Kysely connection, table types and table creation
│   └── domain/errors.ts            NotFoundError / ValidationError for business rules
└── transport/
    └── http/                       app-wide HTTP: root module, setup, error filter, health check
```

Each feature has two Nest modules. `ItemsModule` is the core and knows nothing about HTTP. `ItemsHttpModule` imports it and adds the controller. A future queue worker would import `ItemsModule` alone, without pulling in controllers or Swagger.

The rules:

- **Dependencies point inward.** `domain` imports nothing from the other layers. `application` only uses `domain`. `infrastructure` implements the ports that `domain` defines. `http/` sits on the outside: it uses the use cases, but `domain`, `application`, `infrastructure` and the core module never import from it. Nothing in `features/` imports from `transport/`.
- **Controllers stay thin.** They turn a request into a use case call, and the result into a response. Business rules (like "an item name can't be empty") live in the domain.
- **Errors are plain classes.** Use cases throw `NotFoundError` or `ValidationError` subclasses, and `transport/http/domain-error.filter.ts` turns them into 404 and 400 responses.
- **Modules only expose what others may use.** `ItemsModule` exports its use cases, and the repository stays private.

To expose the same features over another transport (a message queue, for example), add a `transport/amqp/` root module and a bootstrap file such as `worker.ts` next to `main.ts`, plus an `amqp/` folder in each feature that needs it. The feature cores stay the same.

Endpoints that combine several features (an order with its user and payment, for example) don't belong to any one feature. Put them in `transport/http/`.

## Add a feature

Generate one with the Nest CLI:

```bash
npx nest g feature orders
```

This creates `src/features/orders/` as a copy of `items`, renamed: an `Order` entity, its use cases, `PostgresOrderRepository`, the controller at `/api/orders`, and a unit test and an API test. It also registers the feature for you:

- `OrdersHttpModule` in `transport/http/http-api.module.ts`
- the `orders` table in `shared/database/database.types.ts` and `shared/database/schema.ts`

Then change what it generated to fit your feature. Every new feature starts with a single `name` field, like `items`.

Good to know:

- The name can be singular or plural, and multi-word names use dashes: `nest g feature order-line` creates `features/order-lines`, an `OrderLine` entity and an `order_lines` table.
- `--no-spec` skips the tests, and `--dry-run` shows the files without writing them.
- The other Nest generators (`nest g service`, `nest g resource`, ...) still work, but they don't follow this layout.
- The generator lives in `schematics/`: change the templates in `schematics/feature/files/` to change what every new feature looks like.

To add a feature by hand, copy `features/items` and rename it, then:

1. **Domain:** write the entity with its rules, its errors, and the repository port (an abstract class).
2. **Application:** add one use case class per action. Each one gets the repository port injected.
3. **Database:** add the table's type to `shared/database/database.types.ts` and create the table in `shared/database/schema.ts`.
4. **Infrastructure:** implement the port for Postgres, like `PostgresItemRepository` (it builds its queries with Kysely).
5. **Module:** register the use cases and `{ provide: YourRepository, useClass: PostgresYourRepository }`, and export the use cases.
6. **HTTP:** add a controller with request/response classes in the feature's `http/` folder, and a `<Feature>HttpModule` that imports the core module and declares the controller. Add that module to `imports` in `transport/http/http-api.module.ts`.

The database uses [Kysely](https://kysely.dev), a query builder: you write queries that look like SQL, and TypeScript checks the table and column names. There's no ORM, so every query that runs is one you can see in a repository.

Columns are snake_case in Postgres (`created_at`) and camelCase in TypeScript and JSON (`createdAt`). Kysely converts between them.

New tables are created when the server starts. Changes to a table that already exists are not picked up, so the easy way out is to start with a clean database:

```bash
docker compose down -v
docker compose up
```

## Tests

```bash
npm test           # unit tests (src/**/*.spec.ts)
npm run test:e2e   # API tests (test/*.e2e-spec.ts), needs Docker running
```

The unit tests check the domain rules (see `features/items/domain/item.spec.ts`). They're plain functions, so the tests need no database or Nest.

The API tests cover everything else: each endpoint from the HTTP request, through the use case, down to the database. If a use case gets real logic of its own (several repositories, branches, calculations), give it a unit test too, with an in-memory fake of the repository port.

The API tests run against a real Postgres, the same `postgres:17` image as `docker compose`. [Testcontainers](https://node.testcontainers.org) starts it in Docker on a random port when the tests begin and removes it when they finish, so Docker must be running but the compose database doesn't need to be. Every test starts with empty tables. Copy `test/items.e2e-spec.ts` to test your own endpoints.

## Scripts

| Command                     | What it does                                   |
| --------------------------- | ---------------------------------------------- |
| `npm run start:dev`         | Run in watch mode on port 3000                 |
| `npm run start`             | Run once on port 3000                          |
| `npm run start:debug`       | Watch mode with the debugger attached          |
| `npm run build`             | Compile to `dist/`                             |
| `npm run start:prod`        | Run the compiled app (`PORT` env var, or 3000) |
| `npm test`                  | Unit tests                                     |
| `npm run test:e2e`          | API tests                                      |
| `npm run test:cov`          | Unit tests with coverage                       |
| `npm run lint`              | Lint with oxlint                               |
| `npm run format`            | Format with Prettier                           |
| `npx nest g feature <name>` | Generate a feature (see Add a feature)         |

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Auto-instrument your application with [NestJS Observe](https://observe.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
