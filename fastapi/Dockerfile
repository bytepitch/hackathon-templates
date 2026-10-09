FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

# Keep the container's packages outside /app, away from your local .venv
ENV UV_PROJECT_ENVIRONMENT=/venv

# Install dependencies first, so Docker only repeats this when they change
COPY pyproject.toml uv.lock ./
RUN uv sync --locked

COPY . .

CMD ["uv", "run", "fastapi", "dev", "--host", "0.0.0.0", "--port", "8000"]
