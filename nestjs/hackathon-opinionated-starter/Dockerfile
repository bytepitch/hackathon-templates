FROM node:24-bookworm-slim

WORKDIR /app

# Watch mode needs `ps` to stop the old server before starting the new one on save
RUN apt-get update && apt-get install -y --no-install-recommends procps && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

CMD ["npm", "run", "start:dev"]
