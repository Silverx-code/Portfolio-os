-- Portfolio OS — MVP schema
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).

create extension if not exists "pgcrypto";

-- ── projects ────────────────────────────────────────────────────────
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  category text not null default 'web' check (category in ('web','mobile','backend','other')),
  technologies text[] not null default '{}',
  thumbnail_url text,
  live_url text,
  github_url text,
  status text not null default 'in-progress' check (status in ('in-progress','live','archived')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_slug_idx on projects (slug);
create index if not exists projects_featured_idx on projects (featured);

-- keep updated_at fresh
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();

-- ── analytics_events ────────────────────────────────────────────────
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (
    event_type in ('PAGE_VIEW','PROJECT_VIEW','DEMO_CLICK','GITHUB_CLICK','CONTACT_CLICK')
  ),
  project_id uuid references projects(id) on delete set null,
  session_id text not null,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_type_idx on analytics_events (event_type);
create index if not exists analytics_events_project_idx on analytics_events (project_id);
create index if not exists analytics_events_created_idx on analytics_events (created_at);

-- ── Row Level Security ──────────────────────────────────────────────
alter table projects enable row level security;
alter table analytics_events enable row level security;

-- Anyone can read projects (public showroom).
create policy "projects are publicly readable"
  on projects for select
  using (true);

-- Only a signed-in admin can write projects. This is a single-admin
-- MVP, so any authenticated user = the admin.
create policy "authenticated users can insert projects"
  on projects for insert
  to authenticated
  with check (true);

create policy "authenticated users can update projects"
  on projects for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated users can delete projects"
  on projects for delete
  to authenticated
  using (true);

-- Anyone (anonymous visitors) can write analytics events, but only the
-- admin can read them back for the dashboard.
create policy "anyone can record analytics events"
  on analytics_events for insert
  to anon, authenticated
  with check (true);

create policy "authenticated users can read analytics events"
  on analytics_events for select
  to authenticated
  using (true);

-- ── Storage bucket for thumbnails ───────────────────────────────────
insert into storage.buckets (id, name, public)
values ('project-thumbnails', 'project-thumbnails', true)
on conflict (id) do nothing;

create policy "thumbnails are publicly readable"
  on storage.objects for select
  using (bucket_id = 'project-thumbnails');

create policy "authenticated users can upload thumbnails"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-thumbnails');

create policy "authenticated users can update thumbnails"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-thumbnails');

create policy "authenticated users can delete thumbnails"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-thumbnails');

-- ── Seed data (optional — delete if you don't want sample rows) ─────
insert into projects (title, slug, description, category, technologies, status, featured, live_url, github_url)
values
  ('SilverLink', 'silverlink',
   'Connecting Nigerian students with SIWES placement opportunities across host companies and university coordinators.',
   'web', array['Next.js','Supabase','PostgreSQL','Socket.io'], 'live', true,
   'https://silverlink-zeta.vercel.app', 'https://github.com/Silverx-code'),
  ('ScholarLib', 'scholarlib',
   'A college digital library platform with role-based access and an admin portal.',
   'web', array['React','Vite','Express','Supabase'], 'live', true,
   'https://colcomlibrary.vercel.app', 'https://github.com/Silverx-code')
on conflict (slug) do nothing;
