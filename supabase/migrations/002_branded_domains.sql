-- Add branded domain support to organizations.
-- A business can point their own domain (e.g. elevatedbeauty.com) at
-- the Common Ground platform. The middleware resolves it to the correct org.

alter table organizations
  add column if not exists branded_domain text;

create unique index if not exists organizations_branded_domain_unique
  on organizations (branded_domain)
  where branded_domain is not null;

-- Allow the public (unauthenticated) to read org identity data.
-- This is required so branded login pages can load business branding
-- before a user has authenticated. Only safe public fields are exposed;
-- sensitive business data lives in separate product tables.
create policy "organizations_public_select" on organizations
  for select using (true);
