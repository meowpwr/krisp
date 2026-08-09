-- 0002 · notes: the public guest wall.
-- Currently applied to DEV only. Promote to prod when ready (see supabase/README.md).
-- Idempotent, so re-applying is a safe no-op.

create table if not exists notes (
  id         uuid primary key default gen_random_uuid(),
  garden_id  text not null default 'me',
  name       text,
  body       text not null,
  icon       text,
  created_at timestamptz not null default now()
);

alter table notes enable row level security;

drop policy if exists notes_read on notes;
create policy notes_read on notes for select using (true);

drop policy if exists notes_write on notes;
create policy notes_write on notes
  for insert with check (char_length(body) between 1 and 500);
