# Tafi — Current State (condensed)

> Condensed from the full evidence report: [`../TAFI-CURRENT-STATE-AND-UX-DISCOVERY.md`](../TAFI-CURRENT-STATE-AND-UX-DISCOVERY.md).
> That report is the **reference/evidence** document; this page is the **decision input**.
> Inspected statically at commit `c9e74d8`. Tagged FACT / OBSERVATION / INFERENCE / UNKNOWN.

## 1. What Tafi currently is

A **Kenyan school-transport platform**. The public landing page markets a
**parent-facing WhatsApp safety service**; the shipped application is actually a
**school-admin transport operations tool** plus an internal **Tafi super-admin
console**. (FACT)

## 2. Current users

| Persona | Implemented? | Where |
|---|---|---|
| Tafi super admin | Yes | `/tafi`, `/tafi/users` |
| School admin | Yes (part-working) | `/admin` + 8 sub-pages |
| Transport manager | No | role exists, no UI |
| Driver | No | role + `scan_events` table, no UI |
| Parent | No | role + marketing only, no UI |
| Operator | No | role + marketing only, no UI |

## 3. Current features (working)

- Auth: email/password sign-in; invite acceptance; first-super-admin bootstrap.
- School admin: CRUD students, guardians, routes, vehicles, drivers; school settings.
- Billing: terms, invoice generation, payment recording (auto invoice status).
- Route pickups: Google map + nearest-neighbour ordering.
- Super admin: cross-school stats; invite/manage users; delete a school.

Missing but marketed: parent WhatsApp alerts, live tracking, driver QR check-in,
M-Pesa, password reset. (FACT)

## 4. Current stack

TanStack Start + React 19 + TanStack Router/Query · TypeScript · Vite 8 ·
Tailwind v4 + shadcn/ui + Radix + lucide · Supabase (Postgres/Auth/RLS) ·
Google Maps JS + Places · sonner. (FACT)

## 5. Current architecture

Browser talks **directly to Supabase** (RLS-protected) for most reads/writes; a
few privileged actions go through **TanStack server functions** using a
service-role Supabase client. `/_authenticated` is client-rendered (`ssr:false`).
Hosting/build appears to target Cloudflare via Nitro/Lovable. (FACT)

## 6. Major gaps

- **No reachable way to create the first school** (invite↔school dead-end). (FACT, code)
- **All toast feedback invisible** — `<Toaster />` never mounted. (FACT, code)
- **QR "Regenerate" wipes the code** (trigger is INSERT-only). (FACT, code)
- **No password reset.** (FACT)
- Parent/driver/operator experiences not built (data model partly ready). (FACT)
- **No tests, no CI.** (FACT)

## 7. Product contradictions

- Landing page sells a parent WhatsApp product the app does not contain.
- DB is designed for parents/drivers/operators; UI only serves admins.
- Two visual languages (bold marketing page vs plain admin app).
- `terms.fee_kes` captured but unused; `overdue` status never assigned.

## 8. Known risks

- `.env` **committed to git** (publishable keys + Google Maps browser key). (FACT)
- `claim_first_super_admin()` callable by any authenticated user. (FACT)
- Invite tokens in URLs; no email match on acceptance. (FACT)
- Architecture not aligned with the team's usual Docker/Python/FastAPI/Postgres stack. (FACT)
- Single-commit history; no tests; fragile client-side aggregation. (FACT)

## 9. Unknowns

Primary user; product direction; fate of parent/driver/WhatsApp features; how
schools are created; Supabase auth settings; demo vs production data; repo
visibility; deployment target. (UNKNOWN — see owner-decisions.md)

## 10. What must be confirmed before development

1. Is Tafi the **parent WhatsApp product**, the **school operations tool**, or a **staged combination**?
2. Who is the **MVP customer** (school, parent, operator)?
3. What is the **MVP workflow** that must work end to end?
4. Are **tracking / QR / WhatsApp / payments** in or out of the first MVP?
5. Do we **keep, migrate, or replace** the current TanStack/Supabase implementation?
