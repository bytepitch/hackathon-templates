# FastAPI template

A small API with a Postgres database and one example resource (`items`) that you can copy for your own.

## Prerequisites

- [uv](https://docs.astral.sh/uv/getting-started/installation/). It installs Python and the packages for you.
- [Docker](https://www.docker.com/products/docker-desktop/), for the database.

## Run

The quickest way is to start everything in Docker:

```
docker compose up
```

Then open:

- http://localhost:8000/api/health to see that it's alive
- http://localhost:8000/api/docs to try the endpoints in the browser

When you save a file in `app/`, the server restarts by itself.

You can also run the API on your machine and keep only the database in Docker:

```
docker compose up -d db
uv run fastapi dev
```

Pick one of the two. Both use port 8000, so they can't run at the same time.

Good to know:

- If you add a package (`uv add some-package`) and you run the API in Docker, start it again with `docker compose up --build`.
- Settings live in `app/config.py`. To change one, copy `.env.example` to `.env` and edit it there.
- If you already have Postgres running on your machine, stop it first. It uses the same port (5432).

## Add an endpoint

Where things are:

| File | What's in it |
|---|---|
| `app/main.py` | The app itself. Routers are registered here |
| `app/routers/items.py` | The example endpoints |
| `app/models.py` | The database table and the JSON shapes |
| `app/db.py` | The database connection |
| `app/config.py` | Settings |

To add your own endpoints, create a file in `app/routers/`:

```python
# app/routers/hello.py
from fastapi import APIRouter

router = APIRouter(prefix="/hello", tags=["hello"])


@router.get("")
def say_hello(name: str = "world"):
    return {"message": f"Hello {name}"}
```

Then register it in `app/main.py`, next to the `items` one:

```python
from app.routers import hello, items

api.include_router(hello.router)
```

Now http://localhost:8000/api/hello?name=you works, and it shows up in the docs page too.

If you need a database table, copy what `items` does: the `Item` classes in `app/models.py` and the endpoints in `app/routers/items.py`.

New tables are created when the server starts. Changes to a table that already exists are not picked up, so the easy way out is to start with a clean database:

```
docker compose down -v
docker compose up
```

## Tests

```
uv run pytest
```

The tests use their own database in memory, so Docker doesn't need to be running. Copy `tests/test_items.py` to test your own endpoints.

## Public URL (ngrok)

If something outside your laptop needs to call your API (a Slack webhook, for example), install [ngrok](https://ngrok.com/download) and run:

```
ngrok http 8000
```

It prints a public URL that forwards to your local API.
