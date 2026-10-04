# Tafi MVP Scope

> Built around **user value**, not database tables. **Existing code ≠ MVP requirement.**
> Priorities are hypotheses until the owner confirms [`owner-decisions.md`](owner-decisions.md).

## Must Have

- School onboarding + first admin user (fixes the current dead-end).
- Authentication (sign in, invite/accept, password reset).
- Students + guardians management.
- Routes + vehicles + drivers management.
- Assign students to routes; drivers to vehicles.
- Reliable feedback on every action (success/error).
- Mobile-usable core screens.

## Should Have

- Term-based billing: terms → invoices → record payments → status.
- Parent notification of the day's run (channel TBD: WhatsApp/SMS).
- Student QR/ID generation (read-only tag at minimum).

## Could Have

- Route pickup map / basic route ordering.
- Driver check-in scan flow.
- Simple reporting (outstanding balances, ridership).

## Not Now

- Live GPS tracking / telematics hardware.
- M-Pesa automation.
- Parent mobile app.
- Multi-school operator portal.
- Advanced analytics, exports, notifications center.

## Feature table

| Feature | User | Problem solved | MVP priority | Dependency | Status |
|---|---|---|---|---|---|
| School self-onboarding + first admin | School admin | Can't start using Tafi today | Must | Auth | Not started |
| Invite & accept users | School admin / Tafi | Controlled access | Must | Auth | Exists (needs review) |
| Password reset | All | Locked-out users | Must | Auth | Missing |
| Students & guardians | School admin | Know who travels | Must | Onboarding | Exists (needs QA) |
| Routes, vehicles, drivers | School admin | Run the fleet | Must | Onboarding | Exists (needs QA) |
| Action feedback (toasts) | All | Actions silently do nothing | Must | — | Broken |
| Terms → invoices → payments | School admin | Bill families | Should | Students | Exists (needs QA) |
| Parent notification of run | Parent | Safety / status | Should | Routes + students | Missing |
| QR tag generation | School admin | Identify students | Could | Students | Broken (regen) |
| Route pickup map | School admin | Plan trips | Could | Geo data | Exists |
| Driver scan check-in | Driver | Confirm boarding | Could | QR + roles | Missing |
| Live tracking | Parent | Real-time safety | Not now | Hardware/provider | Missing |
| M-Pesa automation | School/operator | Collect fees | Not now | Provider | Missing |

**Scope rule:** do not add a feature just because a table already exists for it.
