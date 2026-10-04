# UX Research Foundation

> A research **framework**, not an audit. Store evidence here, not opinions.
> Created from repository evidence; current code is **not** proof of user needs.

## Users

| User | Status | Note |
|---|---|---|
| School transport admin | Primary (ASSUMPTION — VALIDATE) | Owns roster, routes, billing |
| Parent/guardian | High-interest | Wants safety/status; no UI today |
| Driver | Secondary | Would check students in/out |
| Tafi platform admin | Internal | Operates across schools |
| Operator | Future | Multi-school |

## Jobs to be done

- **ASSUMPTION:** *When* my child is on the bus, *I want* to know they boarded and arrived, *so I can* stop worrying and calling the school.
- **ASSUMPTION:** *When* I run transport, *I want* one place to see students, routes and drivers, *so I can* run the day without spreadsheets.
- **ASSUMPTION:** *When* a term starts, *I want* to bill families and track who has paid, *so I can* collect fees reliably.

## Pain points (HYPOTHESIS — VALIDATE)

- Parents don't know bus status → repeated calls to school.
- Schools coordinate via WhatsApp groups and paper logs → error-prone.
- No reliable record of who boarded/dropped off.
- Billing tracked informally → missed revenue.

## User journeys

See [`user-flows.md`](user-flows.md) for the current mapped flows
(parent, school, driver, platform admin).

## Questions

- Who is the primary user for the MVP — school admin or parent?
- Which channel do parents actually want (WhatsApp, SMS, in-app)?
- What does a school admin do every morning, step by step?
- What is the minimum a driver must do, on what device?
- What is "good enough" for safety/status in v1?

## Assumptions (to test)

- **ASSUMPTION:** Adults have smartphones with WhatsApp.
- **ASSUMPTION:** Schools will pay per student/month.
- **ASSUMPTION:** A QR/tag scan is acceptable to drivers (no hardware).

## Evidence

- Repository current-state report (structure, screens, gaps).
- Competitor sites (UBUS, Paaza) — WhatsApp + no-app-download + operations-first patterns.
- **Gap:** no direct interviews or usability tests yet.

## Research gaps

- No real user interviews (school admins, parents, drivers).
- No usability tests of the current admin portal.
- No field observation of a real school run.
- No accessibility or mobile testing on real devices.
