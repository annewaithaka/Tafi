# Sprint 0 — Project Discovery & Research

**Dates:** Mon 5 Oct – Fri 16 Oct 2026
**Goal:** Understand what Tafi should become before we decide what to build.

## Tasks

### Discovery and research

- [x] Review the prototype (discovery report)
- [x] Research competitors
- [x] UX research framework, user flows, IA draft
- [x] Technical research plan and architecture options

### Decisions

- [x] Confirm who the product owner is (client — D-03)
- [x] Confirm product direction (parent safety service — D-04)
- [x] Confirm first customer (schools — D-05)
- [x] Confirm billing model (D-06) and configurable pricing (D-07)
- [x] Decide architecture (rebuild — D-08) and drop Lovable (D-09)
- [x] Agree delivery window (D-11)
- [ ] Client acknowledges the rebuild plan and timeline — Anne
- [ ] Review MVP 1 scope and `PROPOSED` decisions with the client — Anne

### Security hygiene (allowed by D-02)

- [ ] Make the GitHub repo private — Anne
- [ ] Stop tracking `.env` and ignore env files (PR reviewed by Herman) — Anne
- [ ] Ask the client whether the prototype backend holds real data; client switches off the prototype backend
      and its Google Maps connector once we no longer need them — Anne

### Client actions (long lead time — start now)

- [ ] Client starts Meta Business verification and gets a dedicated phone number for Tafi's WhatsApp
- [ ] Client introduces at least one candidate pilot school

### User research

- [ ] At least 2 conversations (school transport admin, driver, parent) before schools close for the term —
      Anne and Herman
- [ ] Record findings in `docs/ux/ux-research.md`

### Close-out

- [ ] Update product docs with research findings
- [ ] Write `docs/sprints/sprint-1.md`
- [ ] Sprint 0 review

## Deliverables

- Updated: `AGENTS.md`, `README.md`, `docs/README.md`, `docs/STATUS.md`, `docs/DECISIONS.md`
- Updated: `docs/product/{owner-decisions,product-brief,mvp-scope}.md`
- Updated: `docs/architecture/architecture-decision.md`
- Updated: `docs/sprints/{roadmap,backlog,sprint-0}.md`
- New: `docs/sprints/sprint-1.md`
- User conversation notes in `docs/ux/ux-research.md`

## Definition of Done (exit criteria)

- [x] Product direction, first customer and billing model recorded in `DECISIONS.md`
- [x] Architecture direction decided
- [ ] MVP 1 scope reviewed with the client
- [ ] Repo private; no secrets tracked
- [ ] At least 2 user conversations recorded
- [ ] Client has started WhatsApp verification and the pilot school search
- [ ] Sprint 1 written and agreed

## Review

Fri 16 Oct — Anne, Herman and the client (30 minutes): decisions made, user findings, MVP 1 scope, Sprint 1 plan.

## Next sprint

**Sprint 1 (19–30 Oct): UX + project foundation.** Wireframes for the MVP 1 flows; repo layout, Docker Compose
and CI; technical spikes (driver location, maps/ETA, worker choice); WhatsApp message templates drafted.
