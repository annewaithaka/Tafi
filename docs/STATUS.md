# Tafi Status

_Last updated: 5 Oct 2026_

**Phase:** Sprint 0 — Discovery & Research (5–16 Oct 2026)

**Current objective:** Close the remaining Sprint 0 tasks and make Sprint 1 ready to start on Mon 19 Oct.

## Decided (see [`DECISIONS.md`](DECISIONS.md))

- The client is the product owner; Anne and Herman are the developers.
- Tafi is a **parent safety service**: parents get WhatsApp updates about their child's trip.
- **MVP 1 serves schools.** Other transport providers come later; the data model must allow for them.
- Billing: **Tafi bills schools; schools bill parents** for transport.
- Platform pricing is **configurable by the client** without developers. KES 450/child/month is a placeholder.
- **Rebuild on the team stack** (FastAPI · React · PostgreSQL · Redis · Docker · DigitalOcean). Lovable is not used.
- Delivery window: **3 months, 4 max** → pilot-ready by end of January 2027.

## In progress

- Security hygiene: make the repo private; stop tracking `.env`.
- User conversations (school transport admin, driver, parent).
- Finding a pilot school.

## Waiting on the client

- Whether the prototype backend holds any real data; switch the prototype backend off once confirmed.
- Meta Business verification and a dedicated phone number for Tafi's WhatsApp.
- Introduction to at least one candidate pilot school.
- Acknowledgement of the rebuild plan and timeline.

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| WhatsApp Business verification and template approval take time | Parent messages blocked in Sprint 5 | Client starts verification in Sprint 0; templates submitted by Sprint 3 |
| School calendar: Term 3 usually closes late Oct/early Nov; schools reopen in January | No one to interview or pilot with over the holidays | User conversations in October; pilot in Term 1 2027 |
| "Bus approaching" needs live location from a driver's phone; browsers may pause location when the screen locks (especially iPhone) | Core parent message unreliable | Sprint 1 technical spike before committing to an approach |
| No pilot school yet | Nothing to validate against | Client introduction is a Sprint 0 action |
| Children's personal data (Kenya Data Protection Act 2019) | Legal and trust risk | Privacy check in Sprint 1; guardian consent built into MVP 1 |
| 3–4 month window is tight | Scope creep delays pilot | 2-week sprints, strict MVP scope, billing can move after pilot if needed |

## Next

Finish Sprint 0 → Sprint 0 review on Fri 16 Oct → Sprint 1 (UX + project foundation) from Mon 19 Oct.
