# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**itty-bitty-link** is a Next.js-based URL shortening service with user authentication. Users can create accounts, generate short links for long URLs, and manage their links through a dashboard.

## Tech Stack

- **Framework**: Next.js 14.2.4 with TypeScript
- **Database**: PostgreSQL (via Neon) with Prisma ORM
- **Authentication**: NextAuth.js 5 (Credentials + Google OAuth)
- **UI**: React 18, Tailwind CSS 3.4, Font Awesome icons
- **Testing**: Playwright for E2E tests, Storybook for component documentation
- **Password Hashing**: bcryptjs

## Core Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run lint            # Run ESLint
npm run typecheck       # Run the TypeScript compiler without emitting
npm run build           # Production build
npm start               # Run production server

# Database
npm postinstall         # Generate Prisma client (runs automatically)

# Testing & Documentation
npm run storybook           # Run Storybook on port 6006
npm run build-storybook     # Build Storybook
npm run test:e2e            # Run Playwright E2E tests (writes to the configured database; never point at production)
npx playwright test --ui    # Run tests in UI mode
```

## Architecture Overview

### Database Models (Prisma)

The database has two main domain models:

1. **User**: Stores user identity and authentication data
   - Email-based credentials (with bcryptjs hashing) and OAuth accounts
   - Relations to links they've created
   - NextAuth integration via PrismaAdapter

2. **Link**: Implements the URL shortening service
   - Represents a user's saved link (with title, URL, image)
   - Each link has its own unique `alias`, the short code used in `/r/[alias]`

### Authentication Flow (src/app/auth.ts)

NextAuth.js is configured with two providers:
- **Credentials**: Email + bcryptjs password hashing
- **Google OAuth**: email account linking is deliberately off; registration does not verify emails, so linking would allow account takeover

Key customizations:
- Session callback adds `userId` to session object
- JWT callback stores `user.id` in token
- Custom pages: `/login` (also shows sign-in errors from the `?error=` query param)
- `src/app/auth.config.ts` holds the edge-safe config (session, callbacks, pages); `auth.ts` adds the Prisma adapter and providers
- `src/middleware.ts` uses the edge-safe config to redirect logged-out visitors away from `/dashboard/*`

### Routes & Pages

**Public Routes:**
- `/` (Intro)
- `/login` (authentication page with GoogleLoginButton)
- `/register` (user registration)
- `/r/[id]` (redirect endpoint; looks the link up by its `alias`)

**Protected Routes** (require authentication):
- `/dashboard` (main dashboard with LinksList component)
- `/dashboard/create` (form to create new link)
- `/dashboard/edit/[id]` (form to edit existing link)

### Server Actions (src/app/actions/)

**links.ts** - All link CRUD operations as server actions:
- `handleCreate()` / `handleUpdate()`: `useFormState` actions that return `{ errors }` for validation problems and redirect on success; rendered by `src/app/dashboard/LinkForm.tsx`
- `handleDelete()` / `handleDeleteMany()`: Delete links
- Every action checks the session and scopes queries to the current `userId`
- Aliases are 7-character base62 strings from `crypto.randomInt`, assigned once at creation by the internal `createLinkWithAlias()` helper

**authentication.ts**: Handles credential and registration logic (referenced in pages)

### API Routes (src/app/api/)

- `/api/auth/[...nextauth]/route.ts`: NextAuth endpoint
- `/api/links/route.ts`: Paginated list of the signed-in user's links (401 when logged out)

### Component Structure (src/components/)

Organized by feature with Storybook documentation:
- **Button**: Primary and secondary button components with stories
- **Header**: Page header with authentication state awareness
- **Logo**: Brand logo component
- **Footer**: Site footer
- **Forms**: Input fields and SubmitButton
- **SessionProviderWrapper**: NextAuth context provider wrapper for client-side session access

### Key Utilities

- `src/utils/prisma.ts`: Singleton PrismaClient instance (prevents connection pool exhaustion in development)

## Configuration Files

- **tsconfig.json**: Strict mode enabled, `@/*` path alias points to `./src/`
- **tailwind.config.ts**: Custom color palette (darkgreen, teal, lime, mustard, burntorange) with modular typography scale
- **playwright.config.ts**: E2E tests in `./tests` directory, HTML reporter, retries on CI only
- **.env.example**: Template for required env vars (database URLs, NextAuth secret, Google OAuth credentials)

## Important Development Notes

1. **Database Migrations**: Prisma migrations exist in `prisma/migrations/`. Use `npx prisma migrate dev` for schema changes.

2. **One Alias Per Link**: A link's alias is set at creation and never changes, even when its URL is edited. Aliases are not shared between links or users.

3. **Session Management**: The auth session includes `userId` via the session callback. Always check `session?.user?.id` before accessing user-specific data.

4. **Error Handling**: Link actions return field errors as form state instead of throwing; the registration action still throws errors with descriptive messages.

5. **Form Validation**: Links use Zod schemas (`linkSchema` and `updatelinkSchema`) with `safeParse()` for type-safe validation before database operations. Only `http:`/`https:` URLs are accepted.

6. **Link Limit**: The per-user limit lives in `src/utils/limits.ts` (`MAX_LINKS_PER_USER`); do not hard-code it.

7. **Styling**: Tailwind classes are used throughout. Custom color values are defined in `tailwind.config.ts`, prefer those over arbitrary values.

8. **Storybook**: Component stories are in `.stories.tsx` files and can be run with `npm run storybook` for documentation and isolated testing.
