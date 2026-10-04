# Tafi Product Brief

> Working product hypothesis — **not** a final spec. Anything marked ASSUMPTION is unconfirmed.

## Product

> **ASSUMPTION.** Tafi is a school-transport platform for the Kenyan market that keeps
> schools, drivers, and parents informed about every school run. The first MVP is a
> **school-operations tool** (roster, routes, fleet, and parent notifications) because
> that is what exists and is closest to real value; a parent-facing WhatsApp experience
> may follow once the operational core is proven.

## Problem

School transport in Kenya is coordinated informally — phone calls, WhatsApp groups,
paper logbooks, and spreadsheets. Parents don't know if the bus is coming, who is
driving, or whether their child boarded safely; schools can't easily see routes,
ridership, or who owes money. **ASSUMPTION — VALIDATE with owner/users.**

## Primary User

> **ASSUMPTION (most important question).** The **school transport administrator** is the
> primary MVP user, because they own the data and the process. The owner must confirm
> whether the real priority is instead the **parent**.

## Secondary Users

- **Parent/guardian** — wants safety and status for their child.
- **Driver** — runs the route; would check students in/out.
- **Tafi platform admin** — operates the service across schools.
- **Operator** — runs multiple schools (future).

## Core Value

> **ASSUMPTION.** Tafi makes school transport **visible and accountable**: fewer "where is
> the bus?" calls, a reliable record of who is on the bus, and a single place to run routes
> and billing.

## Core Workflow (hypothesis)

1. School signs up / is onboarded (school + first admin user).
2. Admin adds students, guardians, routes, vehicles, drivers.
3. Admin assigns students to routes and drivers to vehicles.
4. Daily run: students board/drop off (QR/scan — **ASSUMPTION, to confirm**).
5. Notifications go out to parents (WhatsApp — **ASSUMPTION, to confirm**).
6. Admin tracks attendance/billing; records payments.

## MVP Hypothesis

For Tafi to deliver real value, the MVP must let a **school** onboard itself, manage its
**roster and routes**, and **bill families** — reliably, on a phone, without the current
show-stopping gaps. Everything else is deferred until confirmed.

## Out of Scope (for the first MVP — draft)

- Live GPS tracking infrastructure, hardware, or telematics.
- M-Pesa/payment-gateway automation (manual recording only, unless confirmed).
- Full parent mobile app.
- Multi-school operator tooling.
- Complex analytics/reporting.

## Unknowns

- Who the primary user is; whether the parent WhatsApp product is the goal.
- How schools should be created (self-serve vs Tafi-created).
- Whether real-time tracking/QR/payments are MVP.
- Whether we keep or replace the current implementation.
