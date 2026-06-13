# craf

A minimal FastAPI project.

## Setup

```bash
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
```

## Run

```bash
uvicorn app.main:app --reload
```

API docs at http://localhost:8000/docs

## Test

```bash
pytest
```

## Lint

```bash
ruff check .
ruff format .
```
