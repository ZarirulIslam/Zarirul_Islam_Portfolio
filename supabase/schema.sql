-- =====================================================================
-- Portfolio CMS schema — run this once in Supabase → SQL Editor.
-- Then replace the email at the bottom with the one you log in with.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- Admins (only these emails can edit content) ----------
create table if not exists public.admins (
  email text primary key
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------- Profile (single row, id = 1) ----------
create table if not exists public.profile (
  id int primary key default 1 check (id = 1),
  name text not null default '',
  roles text[] not null default '{}',
  headline text,
  bio text,
  focus text,
  location text,
  email text,
  phone text,
  avatar_url text,
  resume_url text,
  available boolean not null default true,
  years_experience text,
  github text,
  linkedin text,
  kaggle text,
  twitter text,
  facebook text,
  updated_at timestamptz not null default now()
);

-- ---------- Skills ----------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Other',
  level int not null default 70 check (level between 0 and 100),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Projects ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  content text,
  category text,
  tech text[] not null default '{}',
  image_url text,
  github_url text,
  live_url text,
  report_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Experience & Education ----------
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'work' check (kind in ('work', 'education', 'volunteer')),
  title text not null,
  organization text not null,
  location text,
  start_date text,
  end_date text,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Certifications & Achievements ----------
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'certification' check (kind in ('certification', 'achievement')),
  title text not null,
  issuer text,
  date text,
  credential_url text,
  image_url text,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Blog posts ----------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_url text,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- Contact messages ----------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  subject text check (char_length(subject) <= 200),
  message text not null check (char_length(message) between 1 and 5000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Upgrades for databases created by an older version of this file ----------
alter table public.projects add column if not exists report_url text;
alter table public.certifications add column if not exists category text;
alter table public.experiences drop constraint if exists experiences_kind_check;
alter table public.experiences add constraint experiences_kind_check
  check (kind in ('work', 'education', 'volunteer'));

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.admins          enable row level security;
alter table public.profile         enable row level security;
alter table public.skills          enable row level security;
alter table public.projects        enable row level security;
alter table public.experiences     enable row level security;
alter table public.certifications  enable row level security;
alter table public.posts           enable row level security;
alter table public.messages        enable row level security;

-- Public read for portfolio content, admin-only writes
do $$
declare t text;
begin
  foreach t in array array['profile','skills','projects','experiences','certifications'] loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select using (true)', t);
    execute format('drop policy if exists "admin write" on public.%I', t);
    execute format('create policy "admin write" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- Posts: everyone sees published posts, admin sees everything
drop policy if exists "public read published" on public.posts;
create policy "public read published" on public.posts
  for select using (published or public.is_admin());
drop policy if exists "admin write" on public.posts;
create policy "admin write" on public.posts
  for all using (public.is_admin()) with check (public.is_admin());

-- Messages: anyone can send, only admin can read/manage
drop policy if exists "anyone can send" on public.messages;
create policy "anyone can send" on public.messages
  for insert with check (read = false);
drop policy if exists "admin manage" on public.messages;
create policy "admin manage" on public.messages
  for all using (public.is_admin()) with check (public.is_admin());

-- Admins table: admins can see it, nobody can change it through the API
drop policy if exists "admin read" on public.admins;
create policy "admin read" on public.admins for select using (public.is_admin());

-- =====================================================================
-- Storage bucket for images, CV and other uploads
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');
drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());

-- =====================================================================
-- >>> CHANGE THIS to the email you will use to log in to /admin <<<
-- =====================================================================
insert into public.admins (email) values ('zarir7116@gmail.com')
on conflict (email) do nothing;
