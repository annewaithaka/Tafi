# Architecture Decision

> Status: **RECOMMENDATION — not final.** Product requirements are not yet confirmed, so we
> do not lock architecture now. Final approval happens after owner decisions.

## Current Recommendation

Adopt a **modular monolith** built on the team's baseline stack:

```text
React (frontend)
  → FastAPI (backend API)
    → PostgreSQL (SQLAlchemy + Alembic)
    → Redis (cache + queue)
      → Celery/RQ worker (notifications, scheduled jobs)
Docker + Docker Compose · Nginx/Caddy · Linux VPS (DigitalOcean) · Git
```

- Auth: JWT/session-based (final choice depends on parent/driver channel needs).
- Tests: Pytest (backend) + frontend tests.

## Why

- Matches both developers' strongest stack → fastest **sustainable** velocity.
- Natural home for **background work** (WhatsApp/SMS notifications, reminders, invoices).
- **Deployable to DigitalOcean** with Docker, the target environment.
- Full **database control** (migrations, constraints, reporting).
- Avoids over-engineering; a modular monolith is enough for MVP.

## What could change the decision

- If the owner wants the fastest possible **pilot** and no notify/worker needs → Option B
  (keep current Supabase app) could win for speed.
- If the team standardises on managed Postgres → Option C (Hybrid) becomes the pick.
- If real-time tracking becomes core and demands a specialised service, revisit (still no microservices).
- If the current front end is deemed reusable as-is, we may keep it and only swap the backend.

## Decisions still blocked by product research

- Primary user and MVP workflow (drives API surface).
- Required channels (WhatsApp/SMS) → worker/queue necessity.
- Tracking/QR scope → device/services.
- Payments scope → external integrations.
- Whether we **migrate data** from the current Supabase project.

## Next step

Confirm **owner decisions 1–2 and 5–11**, then approve Option A (or C) and record it in
[`../DECISIONS.md`](../DECISIONS.md).
