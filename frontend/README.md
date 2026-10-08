# Tafi web app

The school and platform admin experience. React 19 + TypeScript + Vite, Tailwind v4, TanStack Query
and React Router. Design tokens are carried over from the client's prototype (see `src/styles.css`).

## Run it

The easiest way is the whole stack from the repository root: `make up` (API on
<http://localhost:8000>, web on <http://localhost:5173>).

**Node 22.12 or newer is required** (Vite 8 does not run on Node 21). If you use nvm,
`nvm use` picks up `.nvmrc`. Docker and CI already use Node 22.

On its own:

```sh
npm install
npm run dev
```

The API base URL comes from `VITE_API_BASE_URL` and falls back to `http://localhost:8000`.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
```

## Layout

- `src/routes/` — one file per route.
- `src/components/ui/` — small accessible primitives. Add more as the wireframes land.
- `src/lib/api.ts` — the typed client for the FastAPI backend. Keep it the only place that talks HTTP.
