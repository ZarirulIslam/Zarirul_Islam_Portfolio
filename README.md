# Data Analyst Portfolio + Admin CMS

A personal portfolio for a Data Analyst / Data Scientist, with a built-in admin panel for editing every section.

- **Site:** Hero (typing roles + notebook-style card), About, Skills, Projects (with case-study pages), Experience & Education, Certifications & Achievements, Blog, and a Contact form
- **Admin (`/admin`):** login, dashboard, Profile editor, create/edit/delete for Projects, Skills, Experience, Certifications and Blog posts, image/PDF uploads, a Markdown editor with preview, and an inbox for contact messages
- **Stack:** Next.js 16 (App Router) · Tailwind CSS 4 · Supabase (database, auth, storage) · hosted free on Vercel

---

## 1. Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Until Supabase is connected, the site shows the sample content from `src/lib/seed.ts`.

## 2. Connect Supabase (free)

1. Create a project at https://supabase.com.
2. Open **SQL Editor**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), **change `you@example.com` on the last line to your own email**, and click **Run**.
3. Go to **Authentication → Users → Add user → Create new user**. Use the same email, choose a password, and tick *Auto Confirm User*.
4. Optional but recommended: in **Authentication → Sign In / Providers**, turn off *Allow new users to sign up*. (Only emails in the `admins` table can edit content anyway.)
5. Go to **Project Settings → API** and copy the *Project URL* and the *anon / publishable* key.
6. Copy `.env.example` to `.env.local` and fill them in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

7. Restart `npm run dev`, open http://localhost:3000/admin and log in.
8. On the dashboard, click **Import starter content**, then edit everything to match you. Start with **Profile**, where you upload your photo and CV.

## 2b. Email notifications with Brevo (optional, free)

Every contact-form message is saved in `/admin/messages`. To also get it in your email inbox:

1. Create a free account at https://www.brevo.com (300 emails/day).
2. **Senders, Domains & Dedicated IPs → Senders → Add a sender** using your Gmail, then click the verification link Brevo emails you.
3. **SMTP & API → API Keys → Generate a new API key**.
4. Add to `.env` (and later to Vercel):

   ```
   BREVO_API_KEY=xkeysib-...
   BREVO_SENDER_EMAIL=your-verified@gmail.com
   BREVO_SENDER_NAME=Portfolio Contact Form
   CONTACT_NOTIFY_EMAIL=where-you-want-messages@gmail.com
   ```

Hitting **Reply** in your email answers the visitor directly. If Brevo is down, the message is still saved in the admin.

## 3. Deploy to Vercel (free `*.vercel.app` domain)

1. Push this folder to a GitHub repository.
2. At https://vercel.com, click **Add New → Project** and import the repo.
3. Under **Environment Variables**, add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` (your Vercel URL, e.g. `https://zarirul.vercel.app`), `DIRECT_URL` (so each build applies `schema.sql` automatically), and the Brevo variables from step 2b. Don't add `ADMIN_EMAIL` or `ADMIN_PASSWORD`; the site doesn't use them.
4. Click **Deploy**. You can rename the project in Vercel settings to get a nicer subdomain.

Changes you make in the admin appear on the live site immediately. There's no need to redeploy.

---

## Project structure

```
src/
  app/
    (site)/            public pages: home, /projects/[slug], /blog, /blog/[slug]
    admin/
      login/           login page
      (dashboard)/     dashboard, profile, messages, and generic [resource] list/edit pages
      actions.ts       server actions (save/delete/import/sign out); all check admin rights
    actions.ts         contact form action
  components/site/     public UI sections
  components/admin/    admin UI (sidebar, form fields, uploads, markdown editor)
  lib/
    resources.ts       ← field definitions for each admin section (add fields here)
    data.ts            public data loading (falls back to seed.ts when Supabase isn't set up)
    seed.ts            starter / sample content
  proxy.ts             protects /admin and refreshes the login session
supabase/schema.sql    tables, row-level security, storage bucket
```

### Adding a new field to a section
1. Add the column in Supabase, e.g. `alter table projects add column dataset_url text;`
2. Add it to the section's `fields` in `src/lib/resources.ts`, and to the type in `src/lib/types.ts`.
3. Show it in the matching component under `src/components/site/`.

### Security notes
- Row Level Security is enabled on every table. Visitors can only read public content and *insert* contact messages.
- Writes and uploads require a logged-in user whose email is in the `admins` table.
- The contact form has server-side validation and a hidden honeypot field against bots.
