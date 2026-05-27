# Pull Request: Bold Ideas Platform Renewal

## Summary

This PR renews the Bold Ideas codebase into a full Next.js platform for the public website, admin operations, client collaboration, staff workflows, CRM, finance, support tickets, blog content, and service purchasing. It also adds the database layer, authentication, integrations, UI system, seed scripts, and project tooling needed to run and maintain the application.

## Major Changes

### Website and Brand Experience

- Built the public marketing website under `src/app/(website)` with pages for home, about, services, service details, projects, locations, booking, contact, privacy, and terms.
- Added a reusable public layout, header, footer, CTA sections, service blocks, pricing, audience strategy, community blueprint, story sections, and location/service data files.
- Added brand assets and app icons in `public/` and `src/app/icon.png`.
- Added blog routes, blog rendering, share buttons, sample content, seed data, and cover-image update scripts.
- Added purchase success and cancel pages for service/product checkout flows.

### Authentication and Access

- Added auth routes and screens for sign in, sign up, forgot password, reset password, and admin setup.
- Integrated `better-auth` with shared auth client/server helpers.
- Added user role handling and role-specific layouts for admin, client, and staff areas.
- Added profile/settings flows and password visibility improvements.

### Admin Platform

- Added admin dashboard and layout with sidebar navigation, active link handling, quick actions, charts, activity feeds, notifications, and settings.
- Added admin modules for CRM, projects, tasks, tickets, team/users, finance, marketing, calendar, inbox/messages, training, purchases, and blog management.
- Added reusable admin components for tables, modals, sheets, forms, detail views, pagination, status toggles, delete confirmations, and user role management.

### CRM and Sales Operations

- Added CRM actions, forms, detail pages, analytics, activity timeline, pipeline management, and follow-up fields.
- Added contact capture, booking, chat, and agency actions to support lead generation and client onboarding.
- Added a test CRM page and shared CRM form components.

### Client Portal

- Added client dashboard, layout, projects, project detail, tickets, new ticket creation, messages, and settings pages.
- Added client portal server actions and database support.
- Added shared project cards, project detail client UI, comment system, and ticket utilities.

### Staff Portal

- Added staff dashboard, layout, inbox, projects, settings, and timer component.
- Added staff actions for internal workflows and operational updates.

### Tickets, Tasks, and Project Management

- Added ticketing flows for admin and client users, including list views, detail pages, comments, status updates, and new ticket creation.
- Added task board, task detail modal, edit sheet, form modal, and task actions.
- Added project management actions, project list/detail screens, project cards, and project creation modal.

### Finance and Payments

- Added finance actions and enhanced finance logic for invoices, receipts, expenses, payments, purchases, and reporting.
- Added invoice and receipt pages with print-oriented views.
- Added Stripe checkout session and webhook routes, plus shared Stripe helpers.
- Added finance dashboard components, invoice managers, payment modals, expense manager, and purchase manager.

### Marketing, Blog, and Content

- Added blog editor, blog admin pages, post forms, markdown rendering, seed scripts, and blog test/sample data.
- Added marketing board and preview pages.
- Added email/resend helper setup and marketing actions.

### Database and Backend

- Added Drizzle ORM configuration, database schema, migrations, migration metadata, and database helpers.
- Added PostgreSQL and Docker Compose setup.
- Added a baseline SQL dump and seed/update scripts for blog content and cover images.
- Added server actions across activity, agency, auth, blog, booking, calendar, chat, client portal, contact, CRM, dashboard, direct messages, finance, marketing, notifications, PM, purchases, staff, team, tickets, time, training, and users.

### MCP and Automation

- Added MCP server files for agent resources, tools, database access, and server entrypoint.
- Added context extraction helper scripts and saved context snapshots.

### UI System and Styling

- Added Tailwind, PostCSS, ESLint, TypeScript, and Next.js configuration.
- Added shadcn/Radix-based UI primitives including buttons, cards, dialogs, dropdowns, tables, forms, sheets, tabs, charts, toasts, tooltips, calendars, accordions, and more.
- Added global styles, theme utilities, toast hooks, shared loading/error components, and common utility helpers.

### Tooling and Repository Hygiene

- Added `package.json`, `package-lock.json`, and full dependency setup for Next.js, React, Drizzle, Stripe, Better Auth, Radix UI, TipTap, Recharts, Resend, Zod, Zustand, and supporting packages.
- Added Husky hooks and Commitlint conventional commit enforcement.
- Added `.gitignore`, `.hintrc`, TypeScript config, Tailwind config, Dockerfile deployment support, and project documentation notes.

### VPS and Coolify Deployment

- Added a production `Dockerfile` for Coolify/VPS deployments.
- Enabled Next.js standalone output in `next.config.ts`.
- Added `.dockerignore` to keep local dependencies, build output, Git metadata, and local env files out of Docker builds.
- Updated deployment documentation to target Coolify instead of Vercel.
- Added `.env.example` with the required production environment variable names.

## Files and Areas Touched

- `src/app/(website)`: public website pages and layouts
- `src/app/(auth)`: authentication screens and layout
- `src/app/admin`: admin portal pages
- `src/app/client`: client portal pages
- `src/app/staff`: staff portal pages
- `src/app/api`: auth and Stripe API routes
- `src/actions`: server actions for application features
- `src/components`: public, admin, auth, CRM, PM, blog, shared, staff, and UI components
- `src/lib`: auth, database, Stripe, Resend, upload, ticket, and utility helpers
- `src/data`: services, pricing, and location data
- `drizzle`: database migrations and metadata
- `mcp`: MCP server and tools
- `scripts`: blog seed and cover image utilities
- `public`: brand and website image assets
- `Dockerfile`: production container build for Coolify
- `.dockerignore`: Docker build context exclusions
- `.env.example`: environment variable reference

## Testing and Validation

- Build validation was performed with:

```bash
npm run build
```

- Lint was also checked with `npm run lint`, but the current branch has existing project-wide lint errors unrelated to the Coolify deployment change.
- Database changes should be validated against the configured PostgreSQL database before deployment.
- Stripe webhook behavior should be tested with the configured Stripe CLI or dashboard webhook tooling.
- Role-based flows should be checked manually for admin, client, and staff users.

## Deployment Notes

- Deployment target is VPS through Coolify, not Vercel.
- Coolify should use the repository Dockerfile and expose port `3000`.
- Requires environment variables for database, authentication, Stripe, email, and any AI/chat integrations used by the app.
- `NEXT_PUBLIC_APP_URL` should be set to the production domain, for example `https://getboldideas.com`.
- Requires database migrations to be applied before using the admin, CRM, finance, ticketing, and portal features.
- Stripe webhook endpoints must be configured for the Coolify production domain.
- GitHub/Vercel preview deployment failures can be ignored or stopped by disconnecting the Vercel GitHub integration from this repository.
- The branch includes commitlint and Husky hooks, so future commits must follow Conventional Commit format.

## Suggested PR Title

```text
feat: renew Bold Ideas platform
```

## Review Checklist

- [ ] Confirm required environment variables are present in the deployment environment.
- [ ] Run database migrations successfully.
- [ ] Verify public website pages render correctly on desktop and mobile.
- [ ] Verify authentication and role redirects for admin, client, and staff users.
- [ ] Verify CRM lead creation and follow-up fields.
- [ ] Verify project, task, and ticket workflows.
- [ ] Verify finance invoice, receipt, payment, and purchase flows.
- [ ] Verify Stripe checkout and webhook handling.
- [ ] Verify blog creation, rendering, and seeded content.
- [ ] Run `npm run build`.
- [ ] Resolve existing lint errors or decide whether lint should block deployment.
