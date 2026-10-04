# User Flows (core)

> Only the flows we currently believe matter. Flows are hypotheses until validated.
> **DRAFT — NOT APPROVED.**

## Parent (proposed)

```mermaid
flowchart LR
  A[Discovery: school invite] --> B[Onboarding: phone/WhatsApp]
  B --> C[Child linked to guardian]
  C --> D[Transport status: bus/route]
  D --> E[Notification: boarded / ETA / arrived]
  E --> F[Safety event / question]
```

Evidence: marketing copy + `guardians.whatsapp`, `students.guardian_id`, `scan_events`.
Today: **not implemented** (no parent UI, no WhatsApp integration).

## School admin (current, needs fixes)

```mermaid
flowchart LR
  S1[Sign in] --> S2[Onboarding: create school]
  S2 --> S3[Students]
  S3 --> S4[Guardians]
  S4 --> S5[Routes]
  S5 --> S6[Vehicles & Drivers]
  S6 --> S7[Transport operations]
  S7 --> S8[Billing: terms → invoices → payments]
```

Evidence: `/admin` and sub-pages. Known breaks: **first-school dead-end**, invisible
feedback, QR regenerate.

## Driver (proposed)

```mermaid
flowchart LR
  D1[Login] --> D2[Assigned route]
  D2 --> D3[Student pickup]
  D3 --> D4[Scan / check-in]
  D4 --> D5[Drop-off]
```

Evidence: `driver` role + `scan_events` table. Today: **not implemented**.

## Platform admin (current)

```mermaid
flowchart LR
  P1[Platform setup] --> P2[School management]
  P2 --> P3[Users & invitations]
  P3 --> P4[Monitoring: cross-school stats]
```

Evidence: `/tafi`, `/tafi/users`. Working (needs QA + the first-school fix upstream).

## Open flow questions

- Is the parent flow WhatsApp-only (no app), or is a light web view acceptable?
- Where does billing sit relative to daily operations in the MVP?
- Is driver check-in manual (list) or scan-based for v1?
