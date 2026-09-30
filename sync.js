/* Accounts and cloud sync. Uses Supabase auth (email magic link) and one `progress` row per user.
   Only activates when config.js has a URL and key for this copy of the app; otherwise the app stays local-only.
   Test copies (preview links, local files) use the practice database from config.js, or run with sign-in off.

   When signed in, each answered item is also uploaded to the `events` table (supabase/migrations/0002_events.sql)
   so study patterns can be looked at across students. Only the item's area, mode, score and timing go up, plus a
   short fingerprint of the item: never the text of the student's material. If that table does not exist yet, the
   upload quietly switches itself off and nothing else changes. */
(function () {
'use strict';
const { el, toast } = SR;
const cfg = window.SR_CONFIG || {};
const enabled = !!(cfg.supabaseUrl && cfg.supabaseAnonKey);
const practice = cfg.env === 'practice';
let client = null, user = null, pushTimer = null, lastPushed = 0, libError = null, lastError = null;
let eventsState = 'idle', eventsError = null;   // idle | ok | missing | error

function showBanner() {
  const b = document.getElementById('envBanner'); if (!b || !practice) return;
  b.textContent = enabled ? 'Test copy: signed-in progress goes to the practice database, never the real one.' : 'Test copy: sign-in is off here, so nothing can touch real progress. Anything you do stays in this browser.';
  b.hidden = false;
}
function loadLib() {
  return new Promise((res, rej) => { if (window.supabase) return res(); const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'; s.onload = res; s.onerror = rej; document.head.append(s); });
}
async function init() {
  showBanner();
  if (!enabled) return;
  try { await loadLib(); } catch (e) { libError = 'The sign-in library could not be downloaded (blocked network or ad blocker?). Reload the page to try again.'; console.warn('Supabase library failed to load; staying local.'); return; }
  client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  try { const { data } = await client.auth.getSession(); user = data.session ? data.session.user : null; } catch (e) { lastError = String(e.message || e); }
  client.auth.onAuthStateChange((_evt, session) => { user = session ? session.user : null; if (user) pull(); });
  if (user) pull();
}
async function pull() {
  if (!client || !user) return;
  const { data, error } = await client.from('progress').select('state, updated_at').eq('user_id', user.id).maybeSingle();
  if (error) { lastError = 'Could not read saved progress: ' + error.message; console.warn(error); toast(lastError); return; }
  const local = SR.state();
  if (!data) { push(true); return; }
  const remote = data.state || {}; const remoteAt = remote.updatedAt || 0;
  if (remoteAt > (local.updatedAt || 0) && (local.answered === 0 || confirm('Your saved progress in the cloud is newer than this browser. Load it here? (Cancel keeps this browser\'s progress and uploads it.)'))) { SR.replaceState(remote); toast('Progress loaded from your account'); }
  else push(true);
}
function push(now) {
  if (!client || !user) return;
  clearTimeout(pushTimer);
  const go = async () => { const st = SR.state(); const { error } = await client.from('progress').upsert({ user_id: user.id, state: st, updated_at: new Date().toISOString() }); if (error) { lastError = 'Could not save progress: ' + error.message; console.warn('sync failed', error); } else { lastPushed = Date.now(); lastError = null; pushEvents(); } };
  if (now) go(); else pushTimer = setTimeout(go, 3000);
}

/* ---------------- events table ---------------- */
/* A short, stable fingerprint (FNV-1a) so repeats of an item can be recognised without storing its text. */
function fingerprint(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); }
function eventRow(e) {
  const A = SR.adapt;
  return { user_id: user.id, cid: e.t.toString(36) + '-' + fingerprint((e.m || '') + '|' + (e.k || '') + '|' + e.sc), at: new Date(e.t).toISOString(), course: e.c || null, mode: e.m || null,
    method: A ? (A.MODE_METHOD[e.m] || null) : null, area: A ? A.eventArea(e) : (e.a || null), item: e.k ? fingerprint(e.k) : null,
    framework: e.f || null, step: e.s || null, score: e.sc, ms: e.ms || null, retry: !!e.re };
}
let uploading = false;
async function pushEvents() {
  if (!client || !user || uploading || eventsState === 'missing') return;
  const st = SR.state(); const mark = st.evSync && st.evSync.uid === user.id ? st.evSync.t : 0;
  const todo = st.events.filter(e => e.t > mark); if (!todo.length) return;
  uploading = true;
  try {
    for (let i = 0; i < todo.length; i += 500) {
      const chunk = todo.slice(i, i + 500);
      const { error } = await client.from('events').upsert(chunk.map(eventRow), { onConflict: 'user_id,cid', ignoreDuplicates: true });
      if (error) {
        const msg = (error.code || '') + ' ' + (error.message || '');
        if (/42P01|PGRST205|does not exist|could not find the table|schema cache/i.test(msg)) eventsState = 'missing'; else { eventsState = 'error'; eventsError = error.message; }
        return;
      }
      st.evSync = { uid: user.id, t: chunk[chunk.length - 1].t };   // saved with the next save; re-sending is harmless
    }
    eventsState = 'ok'; eventsError = null;
  } finally { uploading = false; }
}
SR.hooks.onSave = () => push(false);

SR.hooks.settingsPanel = function () {
  const card = el('div', { class: 'card', style: 'margin-top:14px' }, el('div', { class: 'eyebrow' }, 'Account'));
  if (!enabled) {
    card.append(el('p', { class: 'hint' }, practice
      ? 'This is a test copy (a preview link or a local file), so sign-in is switched off: it can never touch anyone\'s real progress. Everything you do here stays in this browser. To test sign-in, add a practice database in config.js (see docs/HOSTING.md).'
      : 'Sign-in is not configured on this copy. Progress stays in this browser. See docs/HOSTING.md to turn on accounts.'));
    return card;
  }
  if (practice) card.append(el('p', { class: 'hint' }, 'Test copy: this signs in to the practice database, not the real one.'));
  if (libError || !client) { card.append(el('p', { class: 'hint' }, libError || 'The sign-in library is still loading. Reopen Settings in a moment.'), el('button', { class: 'btn sm', type: 'button', onclick: () => location.reload() }, 'Reload page')); return card; }
  if (user) {
    card.append(el('p', {}, 'Signed in as ', el('strong', {}, user.email)), el('p', { class: 'hint' }, lastPushed ? 'Last synced ' + new Date(lastPushed).toLocaleTimeString() : 'Syncing…'), el('div', { class: 'row', style: 'margin-top:8px' }, el('button', { class: 'btn sm', type: 'button', onclick: () => push(true) }, 'Sync now'), el('button', { class: 'btn sm ghost', type: 'button', onclick: async () => { await client.auth.signOut(); user = null; toast('Signed out. Progress stays on this device.'); SR.settingsView(); } }, 'Sign out')));
  } else {
    const email = el('input', { type: 'email', placeholder: 'you@example.com', style: 'flex:1;min-width:200px' });
    const status = el('p', { class: 'hint', style: 'margin-top:8px' });
    card.append(el('p', {}, el('strong', {}, 'No password.'), ' Enter your email and we send a one-time sign-in link. Click it on this same device and you are in.'), el('div', { class: 'row', style: 'margin-top:8px' }, email, el('button', { class: 'btn sm primary', type: 'button', onclick: async () => { if (!email.value) return toast('Enter your email'); status.textContent = 'Sending…'; try { const { error } = await client.auth.signInWithOtp({ email: email.value.trim(), options: { emailRedirectTo: location.origin + location.pathname } }); if (error) { lastError = error.message; status.textContent = 'Could not send the link: ' + error.message; } else status.textContent = 'Link sent to ' + email.value.trim() + '. Open the email on this device and click the link (check spam). The link expires in about an hour.'; } catch (e) { lastError = String(e.message || e); status.textContent = 'Sign-in failed: ' + lastError; } } }, 'Send sign-in link')), status);
  }
  const evNote = eventsState === 'ok' ? 'answered items: uploaded' : eventsState === 'missing' ? 'answered items: not uploaded (the events table has not been created yet)' : eventsState === 'error' ? 'answered items: upload failed (' + eventsError + ')' : 'answered items: waiting';
  card.append(el('details', { style: 'margin-top:10px' }, el('summary', { class: 'hint' }, 'Connection details'), el('p', { class: 'hint mono', style: 'font-size:.75rem' }, 'Database: ' + (practice ? 'practice' : 'live') + ' · project: ' + cfg.supabaseUrl + ' · key: ' + (cfg.supabaseAnonKey || '').slice(0, 18) + '… · library: ' + (window.supabase ? 'loaded' : 'not loaded') + ' · session: ' + (user ? user.email : 'none') + ' · ' + evNote + (lastError ? ' · last error: ' + lastError : ''))));
  return card;
};
init();
})();
