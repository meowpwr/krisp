// KRISP <-> Supabase sync layer.
// Loaded after supabase-js and config.js; exposes window.KrispSync.
// Client-safe: uses only the PUBLISHABLE key. Data is protected by row-level
// security in the database, not by hiding anything here.
(function () {
  var cfg = window.KRISP_CONFIG || {};
  var URL = cfg.SUPABASE_URL, KEY = cfg.SUPABASE_KEY;
  var ROW_ID = 'me'; // single-owner: the whole garden lives in one row.

  var Sync = {
    enabled: false,
    client: null,
    session: null,
    ROW_ID: ROW_ID,
    _authCbs: []
  };

  if (URL && KEY && window.supabase && window.supabase.createClient) {
    try {
      Sync.client = window.supabase.createClient(URL, KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
      Sync.enabled = true;
    } catch (e) {
      console.warn('[krisp] Supabase init failed:', e);
    }
  } else if (URL && KEY && !window.supabase) {
    console.warn('[krisp] supabase-js did not load; running on local storage only.');
  }

  // Resolve the current session and start listening for auth changes.
  Sync.init = function () {
    if (!Sync.enabled) return Promise.resolve(null);
    return Sync.client.auth.getSession().then(function (res) {
      Sync.session = (res && res.data && res.data.session) || null;
      Sync.client.auth.onAuthStateChange(function (_evt, session) {
        Sync.session = session || null;
        Sync._authCbs.forEach(function (cb) { try { cb(session); } catch (e) {} });
      });
      return Sync.session;
    });
  };

  Sync.onAuth = function (cb) { Sync._authCbs.push(cb); };

  // Send a one-time magic link to the owner's email.
  Sync.signIn = function (email) {
    if (!Sync.enabled) return Promise.reject(new Error('Backend not configured.'));
    var redirect = window.location.origin + window.location.pathname;
    return Sync.client.auth.signInWithOtp({ email: email, options: { emailRedirectTo: redirect } });
  };

  Sync.signOut = function () {
    if (!Sync.enabled) return Promise.resolve();
    return Sync.client.auth.signOut();
  };

  // Read the garden document. Works for the public (anon) reader and the owner.
  Sync.loadDoc = function () {
    if (!Sync.enabled) return Promise.resolve(null);
    return Sync.client.from('gardens').select('doc,is_public').eq('id', ROW_ID).maybeSingle()
      .then(function (res) {
        if (res.error) { console.warn('[krisp] load error:', res.error.message); return null; }
        return res.data ? { doc: res.data.doc, is_public: res.data.is_public } : null;
      });
  };

  // Save the garden document. Requires an authenticated owner session (RLS).
  Sync.saveDoc = function (doc) {
    if (!Sync.enabled || !Sync.session) return Promise.resolve({ skipped: true });
    var uid = Sync.session.user.id;
    return Sync.client.from('gardens').upsert({
      id: ROW_ID, owner: uid, doc: doc, is_public: true, updated_at: new Date().toISOString()
    }, { onConflict: 'id' }).then(function (res) {
      if (res.error) console.warn('[krisp] save error:', res.error.message);
      return res;
    });
  };

  window.KrispSync = Sync;
})();
