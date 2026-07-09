create table if not exists contact_submissions (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  business_name text not null,
  email         text not null,
  phone         text,
  business_type text not null,
  looking_for   text not null,
  notes         text,
  read          boolean not null default false,
  created_at    timestamptz default now()
);

alter table contact_submissions enable row level security;

-- Anyone can submit the contact form (public, no auth required)
create policy "contact_submissions_insert_public"
  on contact_submissions for insert
  with check (true);

-- Only authenticated users (FLO dashboard) can read submissions
create policy "contact_submissions_select_authenticated"
  on contact_submissions for select
  using (auth.uid() is not null);

-- Only authenticated users can mark submissions as read
create policy "contact_submissions_update_authenticated"
  on contact_submissions for update
  using (auth.uid() is not null);
