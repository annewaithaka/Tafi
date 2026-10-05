# Backlog

> Priorities: **P0** must · **P1** should · **P2** could · **P3** later.
> Status: Not started · Planned · In progress · Done · Blocked.

## Sprint 0

| ID | Task | Priority | Owner | Status |
|---|---|---|---|---|
| S0-01 | Confirm product owner, direction, first customer, billing model | P0 | Anne | Done |
| S0-02 | Decide architecture and delivery window | P0 | Anne, Herman | Done |
| S0-03 | Client acknowledges rebuild plan | P0 | Anne | Not started |
| S0-04 | Review MVP 1 scope and PROPOSED decisions with client | P0 | Anne | Not started |
| S0-05 | Make repo private; stop tracking `.env` | P0 | Anne | Not started |
| S0-06 | Confirm prototype data; client switches off prototype backend | P1 | Anne | Not started |
| S0-07 | Client starts Meta Business verification + WhatsApp number | P0 | Client | Not started |
| S0-08 | Client introduces a candidate pilot school | P0 | Client | Not started |
| S0-09 | At least 2 user conversations, notes in `ux-research.md` | P0 | Anne, Herman | Not started |
| S0-10 | Write Sprint 1 plan | P0 | Anne, Herman | Not started |

## MVP 1

| ID | User story / task | Priority | Sprint | Dependency | Status |
|---|---|---|---|---|---|
| MVP-01 | As the Tafi admin, I onboard a school and invite its first admin | P0 | 2 | Foundation | Not started |
| MVP-02 | As a user, I sign in, accept an invite and reset my password | P0 | 2 | MVP-01 | Not started |
| MVP-03 | Roles: platform admin, school admin, driver | P0 | 2 | MVP-02 | Not started |
| MVP-04 | As a school admin, I manage students and guardians (several per student, E.164 WhatsApp numbers) | P0 | 3 | MVP-03 | Not started |
| MVP-05 | As a school admin, I record each guardian's consent to WhatsApp messages | P0 | 3 | MVP-04 | Not started |
| MVP-06 | As a school admin, I manage routes and their stops | P0 | 3 | MVP-03 | Not started |
| MVP-07 | As a school admin, I manage vehicles and drivers and assign students to stops | P0 | 3 | MVP-04, MVP-06 | Not started |
| MVP-08 | As a school admin, I import students and guardians from CSV | P1 | 3 | MVP-04 | Not started |
| MVP-09 | As a driver, I see today's trips and start/end a trip | P0 | 4 | MVP-07 | Not started |
| MVP-10 | As a driver, I mark each child boarded, dropped off or absent | P0 | 4 | MVP-09 | Not started |
| MVP-11 | As a driver, my location is shared during an active trip | P0 | 4 | MVP-09, Sprint 1 spike | Not started |
| MVP-12 | As a parent, I get WhatsApp messages: trip started, boarded, dropped off | P0 | 5 | MVP-10, S0-07 | Not started |
| MVP-13 | As a parent, I get a "bus approaching" WhatsApp message | P0 | 5 | MVP-11 | Not started |
| MVP-14 | As a school admin, I see a log of messages and their delivery status | P0 | 5 | MVP-12 | Not started |
| MVP-15 | As a school admin, I see live trips and who is on each bus | P1 | 5 | MVP-10, MVP-11 | Not started |
| MVP-16 | As a school admin, I manage terms, invoices and payments for transport fees | P1 | 6 | MVP-04 | Not started |
| MVP-17 | As the Tafi admin, I edit plans and prices without developers | P1 | 6 | MVP-01 | Not started |
| MVP-18 | As the Tafi admin, I invoice schools from the configured pricing | P1 | 6 | MVP-17 | Not started |
| MVP-19 | Every action gives clear feedback; screens work on a phone | P0 | All | — | Not started |
| MVP-20 | Automated tests and CI for critical paths | P0 | 1 onward | Foundation | Not started |
| MVP-21 | Staging (Sprint 2) and production (Sprint 7) on DigitalOcean with backups | P0 | 2, 7 | Foundation | Not started |
| MVP-22 | Privacy checklist: consent wording, data retention, ODPC obligations | P1 | 1, 7 | Client | Not started |

## Later

| ID | Item | Priority |
|---|---|---|
| LATER-01 | QR-scan check-in | P2 |
| LATER-02 | SMS fallback when WhatsApp fails | P2 |
| LATER-03 | Simple reports | P2 |
| LATER-04 | Independent transport providers (organization type `operator`) | P3 |
| LATER-05 | M-Pesa payment automation | P3 |
