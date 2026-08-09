// KRISP backend configuration.
//
// SAFE TO COMMIT: only the PUBLISHABLE (client-safe) key belongs here.
//   - Publishable key looks like:  sb_publishable_...   (or a legacy "anon" key starting with eyJ...)
//   - NEVER put the sb_secret_... key here or anywhere in the app — it bypasses all security.
//
// Until SUPABASE_KEY is filled in, the app runs fully on local storage (offline).
//
// Two backends: a DEV project used on localhost, and PROD used everywhere else.
// This keeps local testing (and its email rate-limit usage) off the live database.
(function () {
  var isLocal = ['localhost', '127.0.0.1', '[::1]', '0.0.0.0'].indexOf(location.hostname) !== -1;

  var PROD = {
    SUPABASE_URL: 'https://kfrnhqbluvbjzvqhtrnb.supabase.co',
    SUPABASE_KEY: 'sb_publishable_nulQCwt9qtq0LbySgU4YbQ_1EpSEPHt',
  };

  // DEV project — fill these in with your second Supabase project's values
  // (Dashboard → new project → Settings → API). Until then, localhost falls
  // back to PROD so the app keeps working.
  var DEV = {
    SUPABASE_URL: 'https://tqobbcbmqtvwwmxiilbi.supabase.co',
    SUPABASE_KEY: 'sb_publishable_xPQTTefBKYu4nunAysS5xA_LiIA6O4h',
  };

  var useDev = isLocal && DEV.SUPABASE_URL.indexOf('FILL_ME_IN') === -1;
  window.KRISP_CONFIG = useDev ? DEV : PROD;
  if (isLocal) console.log('[krisp] backend:', useDev ? 'DEV' : 'PROD (dev not configured yet)');
})();
