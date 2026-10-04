# Information Architecture (preliminary)

> **DRAFT — NOT APPROVED.** Based on repository structure + competitor patterns.
> Nothing here is implemented in this sprint.

## Public experience

```text
/ (marketing)
  How it works
  Product / pricing
  Sign in (school)   |   Tafi admin sign in
```

## Parent experience (proposed)

```text
WhatsApp message (no app)
  → link: live status / ETA / arrived
  → (optional) lightweight web view per child
```

## School experience (current / target)

```text
Dashboard
Students
Guardians
Routes
Vehicles
Drivers
Billing        (terms, invoices, payments)
Notifications  (PROPOSED)
Settings
```

## Driver experience (proposed)

```text
Today's route
  → student list
  → check-in / scan (pickup)
  → check-out (drop-off)
```

## Platform / admin experience (current)

```text
Platform overview (cross-school stats)
Schools
Users & invitations
Settings
```

## IA questions

- Do parents need a web view at all, or is WhatsApp enough for v1?
- Should billing live beside operations, or be a separate section?
- Should driver and parent be separate apps/views or the same shell with role-based nav?
- Do we keep the current two-shell split (school vs Tafi), or unify with role-based nav?
