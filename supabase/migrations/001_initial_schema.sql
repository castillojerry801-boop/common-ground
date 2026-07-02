-- Common Ground Universal Identity Schema
-- Run this in the Supabase SQL editor or via Supabase CLI

-- ─────────────────────────────────────────────────────────
-- Profiles
-- Extends auth.users. Created automatically on signup.
-- ─────────────────────────────────────────────────────────
create table if not exists profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  full_name  text,
  avatar_url text,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────────────────
-- Organizations
-- Each product deployment (e.g. "Elevated Beauty" on BeautyBook)
-- ─────────────────────────────────────────────────────────
create table if not exists organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  product    text not null,   -- 'beautybook' | 'gameflohq' | 'flo' | future
  branding   jsonb not null default '{}',
  -- branding shape: { primaryColor, accentColor, logoUrl, fontFamily }
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────────────────
-- Memberships
-- Links a user to a role — either platform-level (no org)
-- or organization-level.
-- ─────────────────────────────────────────────────────────
create table if not exists memberships (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references profiles(id) on delete cascade not null,
  organization_id uuid references organizations(id) on delete cascade,
  role            text not null check (
                    role in ('owner', 'employee', 'business_owner', 'staff', 'customer')
                  ),
  permissions     jsonb not null default '{}',
  created_at      timestamptz default now()
);

-- Platform-level uniqueness: one role entry per user when org is null
create unique index if not exists memberships_platform_unique
  on memberships (user_id)
  where organization_id is null;

-- Org-level uniqueness: one role entry per user per org
create unique index if not exists memberships_org_unique
  on memberships (user_id, organization_id)
  where organization_id is not null;

-- ─────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────
alter table profiles     enable row level security;
alter table organizations enable row level security;
alter table memberships  enable row level security;

-- Profiles: users can only read/write their own
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- Memberships: users can read their own memberships
create policy "memberships_select_own" on memberships
  for select using (auth.uid() = user_id);

-- Organizations: members can read their org
create policy "organizations_select_member" on organizations
  for select using (
    exists (
      select 1 from memberships
      where memberships.organization_id = organizations.id
        and memberships.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────
-- Auto-create profile on signup
-- ─────────────────────────────────────────────────────────
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
