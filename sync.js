/* Accounts and cloud sync (groundwork). Uses Supabase auth (email magic link) and one `progress` row per user.
   Only activates when config.js has a URL and anon key; otherwise the app stays local-only. */
(function () {
'use strict';
const { el, toast } = SR;
const cfg = window.SR_CONFIG || {};
const enabled = !!(cfg.supabaseUrl && cfg.supabaseAnonKey);
let client = null, user = null, pushTimer = null, lastPushed = 0;

function loadLib() {
  return new Promise((res, rej) => { if (window.supabase) return res(); const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js'; s.onload = res; s.onerror = rej; document.head.append(s); });
}
async function init() {
  if (!enabled) return;
  try { await loadLib(); } catch (e) { console.warn('Supabase library failed to load; staying local.'); return; }
  client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  const { data } = await client.auth.getSession(); user = data.session ? data.session.user : null;
  client.auth.onAuthStateChange((_evt, session) => { user = session ? session.user : null; if (user) pull(); });
  if (user) pull();
}
async function pull() {
  if (!client || !user) return;
  const { data, error } = await client.from('progress').select('state, updated_at').eq('user_id', user.id).maybeSingle();
  if (error) { console.warn(error); return; }
  const local = SR.state();
  if (!data) { push(true); return; }
  const remote = data.state || {}; const remoteAt = remote.updatedAt || 0;
  if (remoteAt > (local.updatedAt || 0) && (local.answered === 0 || confirm('Your saved progress in the cloud is newer than this browser. Load it here? (Cancel keeps this browser\'s progress and uploads it.)'))) { SR.replaceState(remote); toast('Progress loaded from your account'); }
  else push(true);
}
function push(now) {
  if (!client || !user) return;
  clearTimeout(pushTimer);
  const go = async () => { const st = SR.state(); const { error } = await client.from('progress').upsert({ user_id: user.id, state: st, updated_at: new Date().toISOString() }); if (error) console.warn('sync failed', error); else lastPushed = Date.now(); };
  if (now) go(); else pushTimer = setTimeout(go, 3000);
}
SR.hooks.onSave = () => push(false);

SR.hooks.settingsPanel = function () {
  const card = el('div', { class: 'card', style: 'margin-top:14px' }, el('div', { class: 'eyebrow' }, 'Account'));
  if (!enabled) { card.append(el('p', { class: 'hint' }, 'Sign-in is not configured on this copy. Progress stays in this browser. See docs/HOSTING.md to turn on accounts.')); return card; }
  if (user) {
    card.append(el('p', {}, 'Signed in as ', el('strong', {}, user.email)), el('p', { class: 'hint' }, lastPushed ? 'Last synced ' + new Date(lastPushed).toLocaleTimeString() : 'Syncing…'), el('div', { class: 'row', style: 'margin-top:8px' }, el('button', { class: 'btn sm', type: 'button', onclick: () => push(true) }, 'Sync now'), el('button', { class: 'btn sm ghost', type: 'button', onclick: async () => { await client.auth.signOut(); user = null; toast('Signed out. Progress stays on this device.'); SR.settingsView(); } }, 'Sign out')));
  } else {
    const email = el('input', { type: 'email', placeholder: 'you@example.com', style: 'flex:1;min-width:200px' });
    card.append(el('p', { class: 'hint' }, 'Sign in with your email to keep progress across browsers and devices. You will get a one-time link; no password.'), el('div', { class: 'row', style: 'margin-top:8px' }, email, el('button', { class: 'btn sm primary', type: 'button', onclick: async () => { if (!email.value) return toast('Enter your email'); const { error } = await client.auth.signInWithOtp({ email: email.value, options: { emailRedirectTo: location.origin + location.pathname } }); if (error) toast('Could not send the link: ' + error.message); else toast('Check your email for the sign-in link.'); } }, 'Send sign-in link')));
  }
  return card;
};
init();
})();
