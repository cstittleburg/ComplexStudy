/* Accounts and cloud sync (groundwork). Uses Supabase auth (email magic link) and one `progress` row per user.
   Only activates when config.js has a URL and anon key; otherwise the app stays local-only. */
(function () {
'use strict';
const { el, toast } = SR;
const cfg = window.SR_CONFIG || {};
const enabled = !!(cfg.supabaseUrl && cfg.supabaseAnonKey);
let client = null, user = null, pushTimer = null, lastPushed = 0, libError = null, lastError = null;

function loadLib() {
  return new Promise((res, rej) => { if (window.supabase) return res(); const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'; s.onload = res; s.onerror = rej; document.head.append(s); });
}
async function init() {
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
  const go = async () => { const st = SR.state(); const { error } = await client.from('progress').upsert({ user_id: user.id, state: st, updated_at: new Date().toISOString() }); if (error) { lastError = 'Could not save progress: ' + error.message; console.warn('sync failed', error); } else { lastPushed = Date.now(); lastError = null; } };
  if (now) go(); else pushTimer = setTimeout(go, 3000);
}
SR.hooks.onSave = () => push(false);

SR.hooks.settingsPanel = function () {
  const card = el('div', { class: 'card', style: 'margin-top:14px' }, el('div', { class: 'eyebrow' }, 'Account'));
  if (!enabled) { card.append(el('p', { class: 'hint' }, 'Sign-in is not configured on this copy. Progress stays in this browser. See docs/HOSTING.md to turn on accounts.')); return card; }
  if (libError || !client) { card.append(el('p', { class: 'hint' }, libError || 'The sign-in library is still loading. Reopen Settings in a moment.'), el('button', { class: 'btn sm', type: 'button', onclick: () => location.reload() }, 'Reload page')); return card; }
  if (user) {
    card.append(el('p', {}, 'Signed in as ', el('strong', {}, user.email)), el('p', { class: 'hint' }, lastPushed ? 'Last synced ' + new Date(lastPushed).toLocaleTimeString() : 'Syncing…'), el('div', { class: 'row', style: 'margin-top:8px' }, el('button', { class: 'btn sm', type: 'button', onclick: () => push(true) }, 'Sync now'), el('button', { class: 'btn sm ghost', type: 'button', onclick: async () => { await client.auth.signOut(); user = null; toast('Signed out. Progress stays on this device.'); SR.settingsView(); } }, 'Sign out')));
  } else {
    const email = el('input', { type: 'email', placeholder: 'you@example.com', style: 'flex:1;min-width:200px' });
    const status = el('p', { class: 'hint', style: 'margin-top:8px' });
    card.append(el('p', {}, el('strong', {}, 'No password.'), ' Enter your email and we send a one-time sign-in link. Click it on this same device and you are in.'), el('div', { class: 'row', style: 'margin-top:8px' }, email, el('button', { class: 'btn sm primary', type: 'button', onclick: async () => { if (!email.value) return toast('Enter your email'); status.textContent = 'Sending…'; try { const { error } = await client.auth.signInWithOtp({ email: email.value.trim(), options: { emailRedirectTo: location.origin + location.pathname } }); if (error) { lastError = error.message; status.textContent = 'Could not send the link: ' + error.message; } else status.textContent = 'Link sent to ' + email.value.trim() + '. Open the email on this device and click the link (check spam). The link expires in about an hour.'; } catch (e) { lastError = String(e.message || e); status.textContent = 'Sign-in failed: ' + lastError; } } }, 'Send sign-in link')), status);
  }
  card.append(el('details', { style: 'margin-top:10px' }, el('summary', { class: 'hint' }, 'Connection details'), el('p', { class: 'hint mono', style: 'font-size:.75rem' }, 'Project: ' + cfg.supabaseUrl + ' · key: ' + (cfg.supabaseAnonKey || '').slice(0, 18) + '… · library: ' + (window.supabase ? 'loaded' : 'not loaded') + ' · session: ' + (user ? user.email : 'none') + (lastError ? ' · last error: ' + lastError : ''))));
  return card;
};
init();
})();
