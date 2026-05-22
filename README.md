# AscendOS

Turn any desired state into tracked execution.

AscendOS is a premium, domain-agnostic execution dashboard for people who want to move from current state to desired state with measurable progress. Sprint 1 establishes the deployable foundation: authentication, MySQL persistence, seeded users, a premium landing page, and a protected dashboard shell.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- MySQL
- Auth.js / NextAuth credentials auth
- bcryptjs
- React Hook Form
- Zod
- Framer Motion
- Lucide React
- next-themes
- Recharts
- date-fns

## Sprint 1 Features

- Premium public landing page
- Signup and login pages
- Logout support
- Protected dashboard routes
- Session handling with credentials auth
- Prisma schema for `User` and `Role`
- MySQL-ready Prisma client setup
- Seed script with demo and admin users
- Dark-first dashboard shell with sidebar and top command bar
- Placeholder routes for future modules

## Project Structure

- `app/(auth)` authentication pages
- `app/(dashboard)` protected dashboard pages
- `components/ui` reusable UI primitives
- `components/layout` app shell and providers
- `components/forms` auth form
- `components/dashboard` placeholder route UI
- `lib` auth, Prisma, utilities, and validations
- `prisma` schema and seed files

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
copy .env.example .env
```

3. Set `DATABASE_URL` to a MySQL connection string.

4. Generate Prisma Client:

```bash
npx prisma generate
```

5. Run the first migration:

```bash
npx prisma migrate dev --name init
```

6. Seed the database:

```bash
npx prisma db seed
```

7. Start the app:

```bash
npm run dev
```

## MySQL Setup

AscendOS works with any MySQL provider, including Railway, Aiven, PlanetScale, and TiDB Cloud.

Use a connection string like this:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Prisma migrations are stored locally in `prisma/migrations`. Point production and local environments at separate databases.

## Environment Variables

Required:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

Optional future AI keys:

```env
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
```

## Prisma Commands

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npx prisma studio
```

## Seed Login Credentials

Demo user:

- Email: `demo@example.com`
- Password: `password123`

Admin user:

- Email: `admin@example.com`
- Password: `admin123`

## Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## Vercel Deployment

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Add the production environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. Run the Prisma migration against the production MySQL database.
5. Seed the database if you want the demo accounts available in production.

## Cloud MySQL Notes

- Use a provider that allows external connections from Vercel.
- Make sure SSL settings match the provider requirements.
- Keep local and production databases separate.
- Run migrations before seeding production data.

## Roadmap

- Onboarding flow
- Goal creation and tracking
- Daily logs
- Weekly reviews
- Domain configuration
- Time vs effort analytics
- Skill and language tracking
- Platform and event tracking
- Route planning
- AI-powered execution suggestions

## Current Status

Sprint 1 is intentionally limited to the foundation. The product is now ready for onboarding and goal-system expansion in the next sprint.
