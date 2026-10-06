# Itty Bitty Link

A small URL shortener built with Next.js 14, Prisma (PostgreSQL) and NextAuth.js. Users sign up with email and password or Google, create short links, and manage them from a dashboard.

## Setup

1. Install dependencies (this also generates the Prisma client):

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the values. `.env` is gitignored; never commit it.

   | Variable | Purpose |
   |---|---|
   | `POSTGRES_PRISMA_URL` | Pooled Postgres connection used by the app |
   | `POSTGRES_URL_NON_POOLING` | Direct connection used for migrations |
   | `AUTH_SECRET` | Session signing secret (`npx auth secret`) |
   | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |

3. Apply the database migrations:

   ```bash
   npx prisma migrate deploy
   ```

4. Start the dev server at http://localhost:3000:

   ```bash
   npm run dev
   ```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run storybook` | Component docs on port 6006 |

## Tests

The Playwright tests start the dev server and register real users and links in whichever database your environment points at. Run them against a local or throwaway database, not production. CI runs them against a Postgres service container.

## How it works

- Every link has its own unique `alias`. `/r/[alias]` looks the link up and redirects to its URL, so editing a link's URL keeps the same short link.
- Link create, update and delete are server actions in `src/app/actions/links.ts`. Each one checks the session and only touches links owned by the current user.
- `src/middleware.ts` redirects logged-out visitors away from `/dashboard`.
- Each user can keep up to `MAX_LINKS_PER_USER` links (`src/utils/limits.ts`).
