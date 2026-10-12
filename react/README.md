# react

Starters for quickly building a front-end web app with [React](https://react.dev), [Vite](https://vite.dev) and TypeScript.
They run in the browser and talk to an API over HTTP. Any back end works, whatever it's written in.

## Two starters

| Folder                                                                     | Use it when                                                                                                                                                                                                                                       |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`hackathon-opinionated-starter`](hackathon-opinionated-starter/README.md) | You want routing, a component library, data fetching, forms and tests set up for you: React Router, Tailwind + shadcn/ui, TanStack Query, a typed API client generated from the API's OpenAPI docs, and an example feature that calls a REST API. |
| [`hackathon-bare-starter`](hackathon-bare-starter/README.md)               | You want a plain `npm create vite` app and to make your own choices. It only adds Node 24, a dev proxy to the API, Vitest and a Docker setup.                                                                                                     |

Each starter's README explains how to run it. The sections below apply to both.

## Prerequisites

- Node 24 or newer. If you use nvm, `nvm use` picks the version up from `.nvmrc`. `npm install` fails on older Node versions on purpose (`engine-strict=true` in `.npmrc`).
- [Docker](https://www.docker.com/products/docker-desktop/), only if you want to run the starters in containers.

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

## Talking to the API

Both starters run on http://localhost:5173 and expect the API on http://localhost:3000. To use another address, copy `.env.example` to `.env` and change `VITE_API_URL`.

In development the browser never calls the API directly. It calls `/api/...` on the Vite dev server, which forwards the request to `VITE_API_URL`. That means:

- No CORS problems, even if the API doesn't allow your origin.
- Teammates who open your app through your IP also reach your API, without changing anything.

## Sharing it on the local network

The dev server listens on all network interfaces, so teammates on the same network (Wi-Fi or LAN) can open your app through your machine's IP address. Vite prints it when it starts (the `Network:` line), for example `http://192.168.1.101:5173`.

You can also find your IP yourself:

```bash
# macOS
ipconfig getifaddr en0

# Linux
hostname -I

# Windows (look for "IPv4 Address")
ipconfig
```

Teammates don't need to reach your API themselves. Their requests go through your dev server, which forwards them to the API (see [Talking to the API](#talking-to-the-api)).

If it doesn't load on their side:

- Make sure you're on the same network. Guest and some office networks block devices from reaching each other.
- Allow incoming connections for Node (or Docker) in your firewall. macOS and Windows usually ask the first time the dev server starts.
- On WSL 2, the IP from inside WSL isn't reachable from other machines. Use the Windows IP from `ipconfig` and turn on [mirrored networking](https://learn.microsoft.com/en-us/windows/wsl/networking#mirrored-mode-networking).