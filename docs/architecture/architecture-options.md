# Architecture Options

> Evaluate the target architecture against the team's usual stack and the current code.
> Recommendation only — final decision in [`architecture-decision.md`](architecture-decision.md).

- **Option A (team baseline):** React + FastAPI + PostgreSQL + Redis + Docker Compose
- **Option B (current):** TanStack Start (React SSR) + Supabase (Postgres/Auth/RLS)
- **Option C:** Hybrid — React front end + FastAPI, but keep a managed Postgres (e.g. DO Managed DB) instead of self-hosted

## Comparison

| Concern | Option A | Option B | Recommendation |
|---|---|---|---|
| Developer familiarity (lead) | High (Python/FastAPI is core) | Low–Medium (TanStack/Supabase) | **A** |
| Co-developer familiarity | High | Low–Medium | **A** |
| Performance | Good (control over queries/ORM) | Good (managed, RLS) | Tie |
| Development speed (MVP) | Medium (build auth, CRUD, migrations) | High (auth + DB out of the box) | B for speed, A for control |
| Deployment | Docker on DigitalOcean (known) | Lovable/Cloudflare + Supabase | **A** (matches target host) |
| Cost | VPS + managed DB + Redis | Supabase + hosting tiers | A/B similar; A more predictable |
| Database control | Full (SQLAlchemy/Alembic, raw SQL) | Medium (hosted Postgres, RLS, migrations via SQL) | **A** |
| Authentication | Build with JWT/sessions | Supabase Auth (built-in) | B faster; A when custom roles/parent channels needed |
| Background jobs | Celery/RQ + Redis (natural) | Harder (no worker primitive in app) | **A** |
| Integrations (WhatsApp/SMS, M-Pesa) | Straightforward in Python services | Possible but off-stack | **A** |
| Testing | Pytest (+ frontend tests) | No framework currently; scaffold needed | **A** |
| Maintainability | Modular monolith, explicit boundaries | RLS-coupled, generated client | **A** |
| Scaling | Vertical + workers; horizontal later | Supabase scales; app on Cloudflare | Tie |
| DigitalOcean compatibility | Native (Docker) | Indirect | **A** |

## Notes

- **Option B is not bad** — it is fast and the current code exists. But it diverges from the
  team's stack, lacks background-job primitives, and couples logic to Supabase RLS.
- **Option A** matches the team, gives a natural place for WhatsApp/SMS/worker jobs, and
  deploys cleanly to the target host.
- **Option C** is a hedge if the team wants less ops: keep DO Managed Postgres instead of a
  containerised DB. Useful if a single-founder VPS feels fragile early.
- Do **not** introduce microservices. A **modular monolith** fits the MVP.

## Open questions fed from product

- Required channels (WhatsApp/SMS) drive whether we need workers early.
- Whether we keep the current front end affects how much of Option B is reused.
