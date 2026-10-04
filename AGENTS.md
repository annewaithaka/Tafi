<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Tafi Agent Instructions

## Project Principle

Do not jump directly into implementation. Follow:

Discovery → Research → Product decision → UX/UI → Architecture → Implementation → Testing → Deployment

## Current Phase

**Project Discovery / Sprint 0.** Therefore:

- do not implement MVP features unless explicitly instructed
- do not refactor current code casually
- use documentation to capture decisions
- ask for clarification where product requirements are ambiguous
- distinguish **FACT / OBSERVATION / ASSUMPTION / UNKNOWN**
- keep documentation concise
- prefer simple, maintainable architecture
- avoid over-engineering

## Preferred Technical Direction

Baseline (not an absolute requirement):

React · FastAPI · PostgreSQL · SQLAlchemy · Alembic · Redis where required · Docker · Docker Compose · Nginx/Caddy · Linux · Git

Technology choices must be justified by project requirements.

## Architecture Principle

Prefer a **modular monolith** for the MVP. Do not introduce microservices without a demonstrated requirement.

## Development Principles

- mobile-first
- accessibility-conscious
- responsive
- reusable components
- clear API boundaries
- typed contracts
- database migrations
- automated tests
- environment-based configuration
- secure secrets
- structured logging
- health checks
- production-ready Docker setup

## Documentation Principle

Documentation must be short, useful, current, decision-oriented, and owner-readable.
Do not create documentation for the sake of documentation. See `docs/README.md`.

## Git Workflow

Use `main` → `feature/<name>` · `fix/<name>` · `research/<name>` · `codex/<name>`.

Do not commit directly to `main`. Every meaningful change should be independently reviewable.

> **Lovable note:** do not rewrite published history on the connected branch (no force push /
> rebase / amend of pushed commits). Keep it in a working state.

## Sprint Discipline

Every sprint should have: **Goal · Tasks · Deliverables · Definition of Done · Review · Next sprint.**
