# LabTech

LabTech is a role-based project management platform for a technology solutions company. It handles clients, project heads and developers across web, app, AI and cyber security work, with real-time chat and a points-based reward system.

## Roles

- **Admin** - manages users, tasks, client projects, announcements and rewards
- **Head** - receives assigned tasks, assigns developers and reviews submissions
- **Developer** - updates progress on subtasks and submits work for review
- **Client** - registers projects, tracks progress and approves/rejects completed work

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- TypeScript
- Prisma + PostgreSQL
- NextAuth (credentials + Google + GitHub)
- Socket.io (real-time chat)
- Tailwind CSS v4
- Framer Motion

## Getting Started

### 1. Environment variables

Create a `.env.local` file with the following keys:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

```bash
npm run db:push
npm run seed
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Accounts

All seeded accounts use the password `password123`:

| Role | Email |
|------|-------|
| Admin | `saad@gmail.com` |
| Head | `ahmed@labtech.com` / `sara@labtech.com` / `usman@labtech.com` / `fatima@labtech.com` |
| Developer | `ali@labtech.com` / `zain@labtech.com` / `hira@labtech.com` / `omar@labtech.com` / `ayesha@labtech.com` / `bilal@labtech.com` |
| Client | `client@labtech.com` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed the database with demo data |
| `npm run db:push` | Push the Prisma schema to the database |
| `npm run db:studio` | Open Prisma Studio |
