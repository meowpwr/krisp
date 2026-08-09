-- 0001 · gardens: the single-owner garden document.
-- Present in both dev and prod. Idempotent, so re-applying is a safe no-op.

create table if not exists gardens (
  id         text primary key,           -- always 'me' (single-owner app)
  owner      uuid references auth.users(id),
  doc        jsonb,
  is_public  boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table gardens enable row level security;

-- Anyone (anon reader) can read a garden marked public.
drop policy if exists gardens_public_read on gardens;
create policy gardens_public_read on gardens
  for select using (is_public = true);

-- Only the signed-in owner can create/update their row.
drop policy if exists gardens_owner_write on gardens;
create policy gardens_owner_write on gardens
  for all
  using (auth.uid() = owner)
  with check (auth.uid() = owner);
