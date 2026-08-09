# KRISP database migrations. See supabase/README.md for the full workflow.
# Rule: dev first, then promote to prod. Dev stays ahead of prod.

# Load .env (gitignored) so SUPABASE_ACCESS_TOKEN + DB passwords are available.
ifneq (,$(wildcard .env))
include .env
export
endif

DEV_REF  := tqobbcbmqtvwwmxiilbi   # localhost
PROD_REF := kfrnhqbluvbjzvqhtrnb   # deployed site

.PHONY: help migration dev-push prod-push

help:
	@echo "make migration name=add_something  - create a new timestamped migration"
	@echo "make dev-push                       - apply pending migrations to DEV (do this first)"
	@echo "make prod-push                      - promote pending migrations to PROD (asks to confirm)"

# Create a new migration file, e.g.  make migration name=add_reminders
migration:
	@test -n "$(name)" || { echo "usage: make migration name=describe_the_change"; exit 1; }
	supabase migration new $(name)

# Apply to dev — always run and test this before touching prod.
dev-push:
	supabase link --project-ref $(DEV_REF) --password "$(DEV_DB_PASSWORD)"
	supabase db push --password "$(DEV_DB_PASSWORD)"

# Promote to prod — guarded, because this changes the live database.
prod-push:
	@echo "About to apply pending migrations to PRODUCTION ($(PROD_REF))."
	@read -p "Type 'promote' to continue: " ok && [ "$$ok" = "promote" ] || { echo "aborted."; exit 1; }
	supabase link --project-ref $(PROD_REF) --password "$(PROD_DB_PASSWORD)"
	supabase db push --password "$(PROD_DB_PASSWORD)"
