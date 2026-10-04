# Tafi Roadmap (proposed)

> Starting suggestions only — adjust after owner decisions. Sprints are 1–2 weeks unless noted.
> Definition of Done (DoD) is per sprint unless stated otherwise.

| Sprint | Goal | Deliverables | Dependencies | Definition of Done |
|---|---|---|---|---|
| 0 — Discovery & Research | Understand what Tafi should become | discovery, product, research, UX, architecture docs; owner decisions | — | product direction + MVP scope agreed; architecture direction agreed/deferred; Sprint 1 ready |
| 1 — Product Definition + UX Foundation | Lock MVP + UX direction | validated product brief, MVP scope, user flows, IA draft, wireframes | Sprint 0 | MVP scope signed off; key flows wireframed |
| 2 — Architecture + Project Foundation | Stand up the base stack | repo scaffold, Docker Compose, CI, envs, healthchecks, ADR approved | Sprint 1 | `docker compose up` runs api+db+redis; CI green |
| 3 — Auth + Core Data | Users, roles, tenancy | auth (JWT/session), school/tenant model, roles, migrations | Sprint 2 | school can be created; users can sign in/invite/reset |
| 4 — Core School/Ops Workflow | Manage roster, routes, fleet | students, guardians, routes, vehicles, drivers | Sprint 3 | full CRUD with feedback; mobile usable |
| 5 — Parent Experience | Parent visibility (channel TBD) | parent link/view or notification of run | Sprint 4 | parent receives status for their child |
| 6 — Driver/Safety Workflow | Driver check-in | driver route list + check-in/scan | Sprint 4 | driver can record pickup/drop-off |
| 7 — Notifications/Integrations | WhatsApp/SMS/email | notification service + templates + worker | Sprints 4–6 | notifications delivered reliably, logged |
| 8 — Billing/Payments (if confirmed) | Terms, invoices, payments | terms → invoices → payments (+M-Pesa if in scope) | Sprint 4 | balance tracked; status correct |
| 9 — Testing + Hardening | Reliability & security | test coverage, a11y pass, security review, perf | Sprints 3–8 | critical paths tested; no P0/P1 bugs |
| 10 — Deployment + Pilot | Ship to one pilot school | prod deploy, backups, monitoring, runbook | Sprint 9 | pilot live; rollback tested |

## Notes

- Sprints 5–8 may merge/reorder based on owner decisions (parent vs billing vs driver first).
- Sprint 8 only exists if the owner confirms billing is in the MVP.
