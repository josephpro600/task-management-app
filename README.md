# TaskFlow

A React + Vite task management app using Supabase for PostgreSQL, authentication and realtime task updates. The frontend is designed for deployment to **Vercel**.

## Features in this starter

- Email/password sign up and sign in with Supabase Auth
- Personal dashboard with task metrics and a productivity chart
- Create, edit, complete, and delete tasks
- Task statuses: To do, In progress, Completed
- Task priorities and due dates
- Create projects and track their completion progress
- Calendar-style due-date list
- Supabase Realtime subscription for task changes
- Row Level Security policies for profiles, projects and tasks
- Responsive layout and Vercel SPA rewrite configuration

## 1. Requirements

- Node.js 20.19+ or 22.12+
- npm
- A Supabase account and project
- A Vercel account

## 2. Set up Supabase

1. Create a project at https://supabase.com/dashboard.
2. Open **SQL Editor** in your Supabase project.
3. Copy and run all SQL from `supabase/schema.sql`.
4. Open **Project Settings → API** (or the project's Connect dialog) and copy the Project URL and publishable key. The legacy `anon` key can also be used as the publishable client key.
5. In **Authentication → URL Configuration**, set your Site URL to your Vercel production URL after deployment. Add these Redirect URLs:
   - `http://localhost:5173/**`
   - `https://YOUR-VERCEL-DOMAIN.vercel.app/**`

For local development, Supabase email confirmation may be enabled. If enabled, confirm the signup email before signing in.

## 3. Run locally

```bash
cd client
npm install
```

Create `client/.env` by copying `client/.env.example`, then fill in your real values:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

Start Vite:

```bash
npm run dev
```

Open http://localhost:5173.

## 4. Deploy to Vercel

### Option A: GitHub (recommended)

1. Push the `taskflow` folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Set the project settings:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Add these Environment Variables in Vercel → Project → Settings → Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Deploy. Add the resulting `https://...vercel.app` domain to Supabase Authentication → URL Configuration → Redirect URLs and set it as the Site URL.
6. Redeploy if you changed environment variables after the first deployment.

### Option B: Vercel CLI

From the `client` directory:

```bash
npm install
npm run build
npx vercel
```

Follow the prompts. Add the same two environment variables in Vercel project settings, then deploy production with `npx vercel --prod`.

The root `vercel.json` includes an SPA rewrite for client-side routes. If you import the repository with `client` as the Vercel Root Directory, Vercel uses the app's Vite fallback handling; keep the rewrite configuration available at the deployment root if your project root is the repository root. The simplest setup is to set the Vercel Root Directory to `client` and use Vite's default SPA fallback.

## Security notes

- Never put a Supabase `service_role` or secret key in a `VITE_` variable or browser code.
- The publishable/legacy anon key is intended for browser use only when Row Level Security is enabled and policies are correct.
- The supplied SQL enables RLS and restricts personal records to their owner.
- This first release is a personal task manager with projects. Team workspaces, invitations, comments, attachments, and advanced role-based access are planned next; do not assume those features are implemented yet.

## Main structure

```text
taskflow/
├── client/                 # React + Vite frontend
│   ├── src/components/     # Shared UI components
│   ├── src/lib/            # Supabase client, auth and data functions
│   └── src/pages/          # Dashboard, tasks, projects, calendar, auth
├── supabase/schema.sql     # Database tables, triggers and RLS policies
├── vercel.json             # SPA rewrite configuration
└── README.md
```
