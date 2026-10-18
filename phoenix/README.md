# Phoenix

Starter for quickly building a fullstack web app with [Phoenix](https://www.phoenixframework.org) and [LiveView](https://phoenix-live-view.hexdocs.pm).
Phoenix is written in Elixir and runs on the Erlang VM. The database is Postgres.

The official Phoenix and Elixir documentation is pretty awesome, so this page mostly points to it.

## Starter

| Folder                                                                     | Use it when                                                                                                                                                        |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`hackathon-liveview-starter`](hackathon-liveview-starter/README.md)       | You want a fullstack Phoenix app with LiveView, Postgres, a copyable `items` example, a health endpoint and Docker.                                                |

For an API-only app (e.g. to pair with the [React template](../react/)), see [API-only app](#api-only-app).

## Prerequisites

- Elixir 1.20.4 and Erlang/OTP 29.1.2. The starter has a `.tool-versions` file for asdf and mise. For other install options, see [Install Elixir](https://elixir-lang.org/install/).
- [Docker](https://www.docker.com/products/docker-desktop/), only if you want to run the starter in containers.
- If you already have Postgres running on your machine, stop it first. Docker Compose uses the same port (5432).

You only need the Phoenix installer to generate new apps:

```bash
mix archive.install hex phx_new 1.8.15
```

The starter already has its dependencies declared in `mix.exs` and `mix.lock`.

## How it was generated

From this folder:

```bash
mix phx.new hackathon-liveview-starter --app hackathon_liveview --module HackathonLiveView
cd hackathon-liveview-starter
mix phx.gen.live Items Item items name:string
```

The `phx.gen.live` generator prints the routes to add to `lib/hackathon_liveview_web/router.ex`. It also creates the migration, so run `mix ecto.migrate` before using the example.

Phoenix 1.8 also generates an `AGENTS.md` with guidelines for coding agents. The starter keeps it.

## API-only app

If you do not need HTML or LiveView, generate an API app instead:

```bash
mix phx.new hackathon_api --no-html --no-assets --no-mailer --no-dashboard --no-gettext
cd hackathon_api
mix ecto.create
```

`--no-html` already disables LiveView, so `--no-live` is not needed.

To call it from the browser, add [`cors_plug`](https://hexdocs.pm/cors_plug) to `mix.exs`:

```elixir
{:cors_plug, "~> 3.0"}
```

Then add the plug to `lib/hackathon_api_web/endpoint.ex`, before the router:

```elixir
plug CORSPlug
```

Generate JSON resources with [`mix phx.gen.json`](https://phoenix.hexdocs.pm/Mix.Tasks.Phx.Gen.Json.html).
The React template expects an API on port 3000, so set `VITE_API_URL=http://localhost:4000` and check the proxy rewrite in `vite.config.ts` if your Phoenix routes already start with `/api`.

## Sharing it on the local network

The dev server binds to `0.0.0.0`, so teammates on the same network (Wi-Fi or LAN) can open your app through your machine's IP address:

```bash
# macOS
ipconfig getifaddr en0

# Linux
hostname -I

# Windows (look for "IPv4 Address")
ipconfig
```

Then share `http://<your-ip>:4000`, for example `http://192.168.1.101:4000`.

If it does not load on their side:

- Make sure you are on the same network. Guest and some office networks block devices from reaching each other.
- Allow incoming connections for Elixir (or Docker) in your firewall. macOS and Windows usually ask the first time the server starts.
- On WSL 2, the IP from inside WSL is not reachable from other machines. Use the Windows IP from `ipconfig` and turn on [mirrored networking](https://learn.microsoft.com/en-us/windows/wsl/networking#mirrored-mode-networking).

## Public URL (ngrok)

If something outside your network needs to call your app (a Slack webhook, for example), install [ngrok](https://ngrok.com/download) and run:

```bash
ngrok http 4000
```

It prints a public URL that forwards to your local app.

## Learn Phoenix

Start here:

- [Install Elixir](https://elixir-lang.org/install/)
- [Install Phoenix](https://phoenix.hexdocs.pm/installation.html)
- [Phoenix overview and first app](https://phoenix.hexdocs.pm/overview.html)
- [Elixir getting started](https://elixir-lang.org/getting-started/introduction.html)

Build features:

- [Phoenix guides](https://phoenix.hexdocs.pm)
- [LiveView](https://phoenix-live-view.hexdocs.pm)
- [Ecto](https://hexdocs.pm/ecto) and [Ecto SQL](https://hexdocs.pm/ecto_sql)
- [Phoenix 1.8 release notes](https://www.phoenixframework.org/blog/phoenix-1-8-released)

Generators:

| Command                | What it generates                                      |
| ---------------------- | ------------------------------------------------------ |
| `mix phx.gen.live`     | A LiveView CRUD interface                              |
| `mix phx.gen.html`     | Controller, HTML views and context functions           |
| `mix phx.gen.json`     | Controller, JSON views and context functions           |
| `mix phx.gen.auth`     | Authentication with magic links or passwords           |

Test and ship:

- [Testing](https://phoenix.hexdocs.pm/testing.html)
- [Deployment](https://phoenix.hexdocs.pm/deployment.html)
- [Mix](https://hexdocs.pm/mix)

## Scripts

| Command                    | What it does                                              |
| -------------------------- | --------------------------------------------------------- |
| `mix phx.server`           | Run the dev server on port 4000                           |
| `iex -S mix phx.server`    | Run the dev server inside IEx                             |
| `mix test`                 | Run the tests                                             |
| `mix precommit`            | Compile with warnings as errors, format and run the tests |
| `mix format`               | Format the code                                           |
| `mix ecto.reset`           | Drop, recreate, migrate and seed the database             |
| `mix ecto.gen.migration`   | Generate a new migration                                  |
