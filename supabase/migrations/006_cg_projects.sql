-- CG Projects Registry
-- Tracks all sites built by Common Ground — live, in development, paused, or planned.
-- FLO reads and writes this table to stay current on all builds.

create table if not exists cg_projects (
  id          text primary key,
  name        text not null,
  client      text not null,
  type        text not null,
  url         text,
  github      text,
  status      text not null default 'in-development'
                check (status in ('live', 'in-development', 'paused', 'planning')),
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Auto-update updated_at on any row change
create or replace function update_cg_projects_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger cg_projects_updated_at
  before update on cg_projects
  for each row execute function update_cg_projects_updated_at();

-- Only the service role (FLO's server-side calls) can read/write this table.
-- No public access.
alter table cg_projects enable row level security;

create policy "Service role full access"
  on cg_projects
  for all
  to service_role
  using (true)
  with check (true);

-- Seed all existing projects
insert into cg_projects (id, name, client, type, url, github, status, notes) values
  (
    'common-ground',
    'Common Ground Workshop',
    'Common Ground (internal)',
    'Company site + FLO platform',
    'https://www.cg-workshop.com',
    'common-ground',
    'live',
    'Main company site. FLO lives here. Toolbox, contact form, products page.'
  ),
  (
    'gameflohq',
    'GameFloHQ',
    'Common Ground (internal)',
    'Youth sports SaaS platform',
    'https://app.gameflohq.com',
    'gameflohq',
    'live',
    'Youth sports operating system. Scheduling, rosters, payments, communication.'
  ),
  (
    'mltsa',
    'Mentoring Life Through Sports',
    'MLTSA',
    'Nonprofit',
    'https://www.mltsa.org',
    null,
    'live',
    'Nonprofit shaping young lives through sports.'
  ),
  (
    'burton-basketball',
    'Burton Basketball Academy',
    'Burton Basketball Academy',
    'Sports organization',
    'https://www.burtonbball.com',
    null,
    'live',
    'Basketball training and development. Connects players, families, and coaches.'
  ),
  (
    'elevated-beauty',
    'Elevated Beauty Studio',
    'Elevated Beauty Studio',
    'Beauty / booking business',
    'https://www.elevatedbeautystudio.com',
    null,
    'live',
    'Beauty business operating system. Bookings, clients, business management.'
  ),
  (
    'brilliant-beginnings',
    'Brilliant Beginnings Childcare',
    'Brilliant Beginnings',
    'Childcare / early learning',
    'https://brilliantbeginningsutah.com',
    null,
    'live',
    'Childcare platform in Utah. Connects families and caregivers around early childhood care.'
  )
on conflict (id) do nothing;
