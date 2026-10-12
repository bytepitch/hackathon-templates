# hackathon-bare-starter

A plain NestJS 12 app, as `nest new` creates it, with a few hackathon basics:

- Node 24 or newer: `.nvmrc`, and `engine-strict=true` in `.npmrc`
- Runs on port 3000
- CORS allows all origins, so a front end on another port or machine can call it
- No deployment setup: the `nest deploy` script and Mau are removed
- A `Dockerfile` and a `docker-compose.yml` with just the API, ready for the containers you add

Everything else is up to you: database, folder structure, validation, API docs. For a starter that makes those choices for you, see [hackathon-opinionated-starter](../hackathon-opinionated-starter).

## Run

The quickest way is to start it in Docker:

```bash
docker compose up
```

Or run it on your machine:

```bash
nvm install   # first time only: installs the Node version from .nvmrc
nvm use
npm i
npm run start:dev
```

Then open http://localhost:3000. When you save a file in `src/`, the server restarts by itself. Both options use port 3000, so pick one.

Good to know:

- If you add a package (`npm i some-package`) and you run the API in Docker, start it again with `docker compose up --build`.
- `docker compose` reads environment variables from `.env` if you create one.

See [nestjs/README.md](../README.md) for installing nvm, sharing the API on the local network and getting a public URL with ngrok.

## Add a container

`docker-compose.yml` only runs the API. Add what your project needs as another service. For example, a Postgres database:

```yaml
services:
  api:
    # ...
    environment:
      # Inside Docker the database host is "db", not "localhost"
      DATABASE_URL: postgres://postgres:postgres@db:5432/hackathon
    depends_on:
      - db

  db:
    image: postgres:17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: hackathon
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

## Scripts

| Command               | What it does                                   |
| --------------------- | ---------------------------------------------- |
| `npm run start:dev`   | Run in watch mode on port 3000                 |
| `npm run start`       | Run once on port 3000                          |
| `npm run start:debug` | Watch mode with the debugger attached          |
| `npm run build`       | Compile to `dist/`                             |
| `npm run start:prod`  | Run the compiled app (`PORT` env var, or 3000) |
| `npm test`            | Unit tests                                     |
| `npm run test:e2e`    | API tests                                      |
| `npm run test:cov`    | Unit tests with coverage                       |
| `npm run lint`        | Lint with oxlint                               |
| `npm run format`      | Format with Prettier                           |

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observe](https://observe.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
