// KRISP backend configuration.
//
// SAFE TO COMMIT: only the PUBLISHABLE (client-safe) key belongs here.
//   - Publishable key looks like:  sb_publishable_...   (or a legacy "anon" key starting with eyJ...)
//   - NEVER put the sb_secret_... key here or anywhere in the app — it bypasses all security.
//
// Until SUPABASE_KEY is filled in, the app runs fully on local storage (offline).
window.KRISP_CONFIG = {
  SUPABASE_URL: 'https://kfrnhqbluvbjzvqhtrnb.supabase.co',
  SUPABASE_KEY: 'sb_publishable_nulQCwt9qtq0LbySgU4YbQ_1EpSEPHt',
};
