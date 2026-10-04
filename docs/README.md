# Tafi Project Documentation

This folder is the single entry point for how Tafi is being planned and built.
It is written so a **non-technical owner**, the **developers**, and any **coding
agent** can find the current decision in under a minute.

## What this documentation is for

- Capture **product direction** and the **MVP** before we build.
- Record **decisions** (and the questions still open for the owner).
- Keep **research, UX, architecture, and sprint planning** in one predictable place.
- Give future agents a clear process so nobody jumps straight into code.

## Current phase

**Sprint 0 — Discovery & Research.** We are defining *what Tafi should become*
before deciding *what to build*. No MVP implementation happens in Sprint 0.

## Current branch

`codex/tafi-discovery-foundation` (planning/discovery work; `main` stays clean).

## Where things live

| Topic | Location |
|---|---|
| Full repository evidence report (detailed, ~800 lines) | [`TAFI-CURRENT-STATE-AND-UX-DISCOVERY.md`](TAFI-CURRENT-STATE-AND-UX-DISCOVERY.md) |
| Short current state | [`discovery/current-state.md`](discovery/current-state.md) |
| Product hypothesis | [`product/product-brief.md`](product/product-brief.md) |
| MVP scope | [`product/mvp-scope.md`](product/mvp-scope.md) |
| Owner decisions (to confirm) | [`product/owner-decisions.md`](product/owner-decisions.md) |
| Research plan | [`research/research-plan.md`](research/research-plan.md) |
| Tools & resources (FMHY-derived) | [`research/tools-and-resources.md`](research/tools-and-resources.md) |
| Competitor notes | [`research/competitor-notes.md`](research/competitor-notes.md) |
| UX research framework | [`ux/ux-research.md`](ux/ux-research.md) |
| User flows | [`ux/user-flows.md`](ux/user-flows.md) |
| Information architecture (draft) | [`ux/information-architecture.md`](ux/information-architecture.md) |
| Architecture options | [`architecture/architecture-options.md`](architecture/architecture-options.md) |
| Architecture decision | [`architecture/architecture-decision.md`](architecture/architecture-decision.md) |
| Deployment model | [`architecture/deployment.md`](architecture/deployment.md) |
| Roadmap | [`sprints/roadmap.md`](sprints/roadmap.md) |
| Sprint 0 plan | [`sprints/sprint-0.md`](sprints/sprint-0.md) |
| Backlog | [`sprints/backlog.md`](sprints/backlog.md) |
| Decision log | [`DECISIONS.md`](DECISIONS.md) |
| Live status | [`STATUS.md`](STATUS.md) |

## How we work (process flow)

```text
Discovery
  → Research
    → Product Definition
      → UX/UI
        → Architecture
          → MVP Planning
            → Sprint Execution
              → Testing
                → Deployment
```

## Documentation rules

- Short, skimmable, decision-oriented. No essays.
- Label claims **FACT / OBSERVATION / ASSUMPTION / UNKNOWN**.
- Update the relevant file when a decision changes; keep `STATUS.md` current.
