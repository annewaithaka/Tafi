## Two small additions

### 1. "Home" link in both signed-in shells
Right now, after signing in, the only way back to the landing page is to sign out. Add a **Home** link (Home icon → `/`) that opens the public landing page in a new tab, so the user stays signed in.

- `src/lib/admin-shell.tsx` — add Home item in the sidebar footer (above Sign out).
- `src/routes/_authenticated/tafi.tsx` — same treatment in the Tafi sidebar footer.

### 2. Tafi admin can delete a school
Add school deletion to the Tafi Dashboard table (`src/routes/_authenticated/tafi.index.tsx`), since that's where every school is already listed with its stats.

- Add a **Delete** button on each row (trash icon, destructive style) with a confirmation dialog that spells out what gets removed and requires typing the school name to confirm.
- Deletion runs through a new `deleteSchool` server function in `src/lib/tafi.functions.ts`:
  - Guarded by `requireSupabaseAuth` + `has_role(super_admin)` check via `context.supabase`.
  - Uses `supabaseAdmin` (loaded inside the handler) to `DELETE FROM public.schools WHERE id = ...`. All child tables (students, guardians, routes, vehicles, drivers, invoices, payments, terms, scan_events, user_roles rows scoped to the school, invitations, and profile.school_id references) already cascade or null out via existing FKs — I'll verify each FK's `ON DELETE` before wiring the button and, if any are missing cascades, add them in a small migration in the same step.
- Refresh the dashboard query on success and toast the result.

No changes to the school admin's own portal — only the Tafi super admin can delete schools.
