# Tafi Research Plan (Sprint 0)

Purpose: gather enough evidence to make **product, UX, and architecture** decisions
without guessing. Research happens **before** architecture is locked and before any build.

## Product research

- What problem do similar products solve, and for whom?
- How do parents interact with school transport today?
- How do schools/operators manage transport today (tools, gaps)?
- What operational workflows are common (routes, rosters, billing, notifications)?
- What is the Kenyan market reality (phones, connectivity, payments, WhatsApp use)?

**Evidence produced:** product/pattern notes; confirmed primary user; MVP problem statement.

## UX research

- Onboarding (school and parent)
- Parent experience (status, safety, notifications)
- School admin experience (daily operations)
- Driver experience (route, check-in)
- Notifications & safety events
- Payment workflows
- Mobile usability (assume phones-first)

**Evidence produced:** jobs-to-be-done, pain points, journey maps, prioritised open questions.

## Technical research

- Real-time tracking options (device/app vs driver phone vs none)
- WhatsApp integration options (Business API, providers) + SMS/email fallback
- QR scanning (driver device)
- Geolocation accuracy & privacy
- Notifications delivery
- Authentication & multi-tenancy
- Deployment (Docker on DigitalOcean)
- Monitoring & logging

**Evidence produced:** short options notes with cost/effort tradeoffs; feed architecture-options.md.

## Competitive research

Study existing school-transport and parent-communication products for **patterns**
(onboarding, dashboards, parent comms, driver flow, tracking, alerts, payments).
See [`competitor-notes.md`](competitor-notes.md). Do **not** copy competitors blindly.

| Product | Market | Main user | Key workflow | Useful idea | Tafi relevance |
|---|---|---|---|---|---|
| (see competitor-notes.md) | | | | | |

## Method & evidence standard

- Prefer **primary sources** (product sites, docs, pricing pages).
- Keep notes short; one entry per product/idea.
- Label each finding **FACT / ASSUMPTION / UNKNOWN**.
- Anything about user behaviour is a **HYPOTHESIS — VALIDATE** until confirmed with users.

## Research gaps (to close in Sprint 0/1)

- No interviews with real parents, drivers, or school admins yet.
- No verified Kenyan pricing/benchmark beyond public competitor pages.
- No confirmation of which channels schools actually want.
