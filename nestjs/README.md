# nestjs

Starters for quickly building a back-end service API with [NestJS](https://docs.nestjs.com).
Your front end, Slack bot or other services talk to it over HTTP.

## Two starters

| Folder                                                                     | Use it when                                                                                                                                                |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`hackathon-opinionated-starter`](hackathon-opinionated-starter/README.md) | You want the structure, database and tests set up for you: Clean Architecture, Postgres, Kysely, Swagger, Testcontainers and a `nest g feature` generator. |
| [`hackathon-bare-starter`](hackathon-bare-starter/README.md)               | You want a plain `nest new` app and to make your own choices. It only adds Node 24, port 3000, CORS and a Docker setup with just the API.                  |

Each starter's README explains how to run it. The sections below apply to both.

## Prerequisites

- Node 24 or newer. If you use nvm, `nvm use` picks the version up from `.nvmrc`. `npm install` fails on older Node versions on purpose (`engine-strict=true` in `.npmrc`).
- [Docker](https://www.docker.com/products/docker-desktop/), to run the starters in containers. The opinionated starter also needs it for its database and API tests.

### Install nvm

Skip this if `nvm --version` already works.

On macOS, Linux or WSL:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
source ~/.zshrc   # or ~/.bashrc, depending on your shell
nvm --version
```

Check the [nvm README](https://github.com/nvm-sh/nvm#installing-and-updating) for the latest version number and troubleshooting.

On Windows, use [nvm-windows](https://github.com/coreybutler/nvm-windows) instead. It doesn't read `.nvmrc`, so run `nvm install 24` and `nvm use 24` instead of the `nvm install` and `nvm use` steps in the starter READMEs.

## Sharing it on the local network

The server listens on all network interfaces, so teammates on the same network (Wi-Fi or LAN) can call your API through your machine's IP address:

```bash
# macOS
ipconfig getifaddr en0

# Linux
hostname -I

# Windows (look for "IPv4 Address")
ipconfig
```

Then share `http://<your-ip>:3000`, for example `http://192.168.1.101:3000`. The opinionated starter's endpoints are under `/api`, so its docs are at `http://192.168.1.101:3000/api/docs`.

Both starters enable [CORS](https://docs.nestjs.com/security/cors) for all origins, so a browser front end running on another port or machine can call the API directly. In the opinionated starter you can allow only specific ones with `CORS_ORIGINS` in `.env`.

If it doesn't load on their side:

- Make sure you're on the same network. Guest and some office networks block devices from reaching each other.
- Allow incoming connections for Node (or Docker) in your firewall. macOS and Windows usually ask the first time the server starts.
- On WSL 2, the IP from inside WSL isn't reachable from other machines. Use the Windows IP from `ipconfig` and turn on [mirrored networking](https://learn.microsoft.com/en-us/windows/wsl/networking#mirrored-mode-networking).

## Public URL (ngrok)

If something outside your network needs to call your API (a Slack webhook, for example), install [ngrok](https://ngrok.com/download) and run:

```bash
ngrok http 3000
```

It prints a public URL that forwards to your local API.
