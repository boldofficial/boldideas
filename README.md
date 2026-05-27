# Bold Ideas Official Website and Platform

The official Bold Ideas platform for the public website, admin operations, CRM, client portal, staff workflows, finance, support tickets, blog content, and service purchasing.

Live site: [getboldideas.com](https://getboldideas.com)

## Tech Stack

| Layer | Technology |
|---|---|
| App | Next.js / React |
| Styling | Tailwind CSS |
| Database | PostgreSQL / Drizzle ORM |
| Auth | Better Auth |
| Payments | Stripe |
| Email | Resend |
| Deployment | VPS through Coolify |

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app locally.

For a local PostgreSQL database:

```bash
docker compose up -d
```

## Required Environment Variables

Set these in `.env` locally and in the Coolify environment variable panel for production:

```bash
DATABASE_URL=
DATABASE_SSL=
BETTER_AUTH_SECRET=
NEXT_PUBLIC_APP_URL=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_THIN_WEBHOOK_SECRET=
RESEND_API_KEY=
FROM_EMAIL=
ADMIN_EMAIL=
GEMINI_API_KEY=
```

For Coolify, `NEXT_PUBLIC_APP_URL` should be the production URL, for example:

```bash
NEXT_PUBLIC_APP_URL=https://getboldideas.com
```

Set `DATABASE_SSL=true` only if the production database requires SSL.

## Coolify Deployment

This project is intended to deploy to a VPS through Coolify, not Vercel.

Recommended Coolify setup:

- Resource type: Git repository
- Build pack: Dockerfile
- Dockerfile path: `Dockerfile`
- Port: `3000`
- Start command: handled by Dockerfile
- Environment variables: add the required values listed above

The Dockerfile builds the Next.js app with `output: 'standalone'` and runs:

```bash
node server.js
```

## Production Checks

Before deploying, run:

```bash
npm run build
npm run lint
```

After deployment:

- Apply Drizzle migrations to the production database.
- Configure Stripe webhooks to point to the production Coolify domain.
- Confirm admin, client, and staff login flows.
- Confirm contact, booking, purchase, ticket, and invoice flows.

## GitHub Deployment Note

If GitHub still shows failed Vercel preview deployments, disconnect the Vercel GitHub integration from this repository. The repo should deploy from Coolify, so Vercel preview failures can be ignored until the Vercel integration is removed.

## Developer

Built and developed by **@zieecodes**

- GitHub: [github.com/zieeco](https://github.com/zieeco)
- X: [@zieecodes](https://x.com/zieecodes)

## License

This project is proprietary. All rights reserved by Bold Ideas.
