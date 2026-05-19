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
npm run build           # Production build
npm start               # Run production server

# Database
npm postinstall         # Generate Prisma client (runs automatically)

# Testing & Documentation
npm run storybook           # Run Storybook on port 6006
npm run build-storybook     # Build Storybook
npx playwright test         # Run Playwright E2E tests
npx playwright test --ui    # Run tests in UI mode
```

## Architecture Overview

### Database Models (Prisma)

The database has two main domain models:

1. **User**: Stores user identity and authentication data
   - Email-based credentials (with bcryptjs hashing) and OAuth accounts
   - Relations to links they've created
   - NextAuth integration via PrismaAdapter

2. **Link & LinkAlias**: Implements the URL shortening service
   - **Link**: Represents a user's saved link (with title, URL, image)
   - **LinkAlias**: The shortened alias for a URL; multiple Links can share one LinkAlias if they point to the same URL (optimization to avoid duplicate short codes)
   - The `linkAliasId` foreign key connects them

### Authentication Flow (src/app/auth.ts)

NextAuth.js is configured with two providers:
- **Credentials**: Email + bcryptjs password hashing
- **Google OAuth**: `allowDangerousEmailAccountLinking` enabled for flexibility

Key customizations:
- Session callback adds `userId` to session object
- JWT callback stores `user.id` in token
- Custom pages: `/login`, `/auth/signout`, `/error`, `/auth/verify-request`
- Middleware in `src/app/middleware.ts` exports auth as middleware for route protection

### Routes & Pages

**Public Routes:**
- `/` (Intro)
- `/login` (authentication page with GoogleLoginButton)
- `/register` (user registration)
- `/r/[id]` (redirect endpoint to actual URL using LinkAlias)

**Protected Routes** (require authentication):
- `/dashboard` (main dashboard with LinksList component)
- `/dashboard/create` (form to create new link)
- `/dashboard/edit/[id]` (form to edit existing link)

### Server Actions (src/app/actions/)

**links.ts** - All link CRUD operations as server actions:
- `generateAlias()`: Recursively generates unique 6+ character random alias
- `handleCreate()`: Creates new Link + LinkAlias, validates with Zod schema
- `handleUpdate()`: Updates existing Link, creates new LinkAlias if URL changes
- `handleDelete()`: Deletes a link

**authentication.ts**: Handles credential and registration logic (referenced in pages)

### API Routes (src/app/api/)

- `/api/auth/[...nextauth]/route.ts`: NextAuth endpoint
- `/api/links/route.ts`: Public link management API

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

2. **LinkAlias Optimization**: The LinkAlias model avoids creating duplicate short codes for the same URL. When creating/updating a link, check if the URL already has an alias before creating a new one.

3. **Session Management**: The auth session includes `userId` via the session callback. Always check `session?.user?.id` before accessing user-specific data.

4. **Error Handling**: Server actions throw errors with descriptive messages. Components should handle these gracefully and display validation errors from Zod schemas.

5. **Form Validation**: Links use Zod schemas (`linkSchema` and `updatelinkSchema`) with `safeParse()` for type-safe validation before database operations.

6. **Styling**: Tailwind classes are used throughout. Custom color values are defined in `tailwind.config.ts`, prefer those over arbitrary values.

7. **Storybook**: Component stories are in `.stories.tsx` files and can be run with `npm run storybook` for documentation and isolated testing.
