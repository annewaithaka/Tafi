# Deployment Foundation

> Target model for when we build. **Do not build this yet.** Docker-first, DigitalOcean VPS.

## Conceptual topology

```text
Internet
  → Domain (DNS)
    → Caddy/Nginx (TLS, reverse proxy)
      → Frontend (static React build / web server)
      → FastAPI (API)
        → PostgreSQL (persistent volume)
        → Redis
          → Background worker (Celery/RQ)
```

## Docker Compose (services)

| Service | Role | Notes |
|---|---|---|
| `web` | Serve frontend build | Static assets via Caddy/Nginx |
| `api` | FastAPI app | Uvicorn/Gunicorn behind proxy |
| `db` | PostgreSQL | Named volume for persistence |
| `redis` | Cache + queue | Ephemeral |
| `worker` | Celery/RQ | Notifications, scheduled jobs |
| `proxy` | Caddy/Nginx | HTTPS + routing (may replace `web`) |

## Operational requirements

- **Persistent PostgreSQL volume** — never lose data on redeploy.
- **Environment variables & secrets** — via `.env`/secret store, **never committed**.
- **Backups** — scheduled `pg_dump` off-host + retention policy; test restores.
- **Health checks** — for `api`, `db`, `redis`; use `depends_on: condition: service_healthy`.
- **Logging** — structured JSON logs; container log rotation; centralise if needed.
- **HTTPS** — automatic certs (Caddy or Certbot + Nginx).
- **Rollback** — tag images per release; keep previous image to re-deploy.

## Deployment process (outline)

1. Build & tag images in CI (or locally).
2. Push to registry.
3. On the host: `docker compose pull` → `compose up -d`.
4. Run migrations (Alembic) as a one-shot job.
5. Verify health checks + smoke test.

## Rollback strategy (outline)

- Keep the last known-good image tag; redeploy it.
- Migrations must be **backwards-compatible** where possible; keep a down path.

## Open questions

- Managed Postgres (DO) vs containerised Postgres?
- Single VPS vs separate worker host?
- Which registry / CI runner?
