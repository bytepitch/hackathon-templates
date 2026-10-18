FROM hexpm/elixir:1.20.4-erlang-29.1.2-debian-bookworm-20261005-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential \
      ca-certificates \
      git \
      inotify-tools \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN mix local.hex --force && mix local.rebar --force

# Install dependencies first, so Docker only repeats this when they change
COPY mix.exs mix.lock ./
RUN mix deps.get

COPY . .

EXPOSE 4000

CMD ["sh", "-c", "mix deps.get && mix ecto.create && mix ecto.migrate && mix assets.setup && mix phx.server"]
