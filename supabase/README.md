# Database migrations

Schema is code. **Never hand-edit table structure in a dashboard.** Every change is
a new migration file here, applied to dev first, then promoted to prod.

Two projects:

| env  | project ref            | used by            |
|------|------------------------|--------------------|
| dev  | `tqobbcbmqtvwwmxiilbi`  | localhost          |
| prod | `kfrnhqbluvbjzvqhtrnb`  | the deployed site  |

**Dev is always ahead of prod** — new migrations land on dev, get tested on
localhost, then get promoted to prod.

## One-time setup

```bash
brew install supabase/tap/supabase   # or: npm i -g supabase
cd "/Users/kristin/Krisp App"
cp .env.example .env                  # then fill in token + DB passwords
```

## Shortcuts (Makefile)

Once `.env` is filled in, you don't need to remember refs:

```bash
make migration name=add_something   # new migration file
make dev-push                        # apply to dev, then test on localhost
make prod-push                       # promote to prod (asks you to type 'promote')
```

The manual equivalents are below if you prefer.

## Make a schema change

```bash
supabase migration new my_change   # creates a timestamped .sql in migrations/
# edit that file — write idempotent DDL (create ... if not exists, drop policy if exists ...)
```

## Apply to dev (do this first, then test on localhost)

```bash
supabase link --project-ref tqobbcbmqtvwwmxiilbi
supabase db push
```

## Promote to prod (only after it works on dev)

```bash
supabase link --project-ref kfrnhqbluvbjzvqhtrnb
supabase db push
```

The CLI records which migrations each project has already applied, so `db push`
only runs the pending ones. That difference — pending on prod, applied on dev — is
exactly "dev ahead of prod," tracked instead of accidental.

## Current baseline

- `0001_gardens` — applied to **both**.
- `0002_notes`   — applied to **dev only**. Promote to prod with the steps above
  when you want the guest wall backed by the database there (until then, prod's
  guest wall falls back to local storage).

## No CLI? Apply by hand

Every migration is idempotent, so you can paste a file's SQL into a project's
SQL Editor and run it. Re-running is harmless. Just remember the rule: dev first,
then prod.
