/* Terms, privacy and consent.

   - The Terms of Service and Privacy Policy (docs/TERMS.md, docs/PRIVACY.md) open inside the app, and at
     ?legal=terms / ?legal=privacy so they can be linked.
   - Sign-in needs a tick: "I am 18 or older and agree to the Terms and Privacy Policy". The acceptance is kept
     with the student's progress and, once signed in, recorded in the `consents` table (0004_consents.sql).
   - Someone already signed in who has not accepted the current version sees a card on the course home until
     they do. Bump VERSION when the documents change and everyone is asked again.
   Nothing here applies to someone who never signs in: their data never leaves the browser. */
(function () {
'use strict';
const { el, show, toast } = SR;
const VERSION = '2026-10-draft';
const DOCS = { terms: { file: 'docs/TERMS.md', title: 'Terms of Service' }, privacy: { file: 'docs/PRIVACY.md', title: 'Privacy Policy' } };

/* ---------- a small Markdown renderer: headings, paragraphs, lists, tables, bold, italics, code, links ---------- */
function inline(s) {
  const e = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return e.replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/(^|\W)_([^_]+)_(?=\W|$)/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => /^(https?:|mailto:|#|\?)/.test(u) ? '<a href="' + u + '" rel="noopener">' + t + '</a>' : t);
}
function render(md) {
  const lines = md.replace(/\r/g, '').split('\n'); const out = []; let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    const h = /^(#{1,4})\s+(.*)$/.exec(l);
    if (h) { const n = Math.min(4, h[1].length + 1); out.push('<h' + n + '>' + inline(h[2]) + '</h' + n + '>'); i++; continue; }
    if (/^\|/.test(l)) {
      const rows = []; while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      const body = rows.filter(r => !/^\|\s*:?-+/.test(r));
      out.push('<div class="tablewrap"><table class="mixtable"><thead><tr>' + cells(body[0]).map(c => '<th>' + inline(c) + '</th>').join('') + '</tr></thead><tbody>' + body.slice(1).map(r => '<tr>' + cells(r).map(c => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>');
      continue;
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(l)) {
      const ordered = /^\s*\d+\./.test(l); const items = [];
      while (i < lines.length && (/^\s*([-*]|\d+\.)\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        if (/^\s*([-*]|\d+\.)\s+/.test(lines[i])) items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, '')); else items[items.length - 1] += ' ' + lines[i].trim();
        i++;
      }
      out.push('<' + (ordered ? 'ol' : 'ul') + ' class="list">' + items.map(x => '<li>' + inline(x) + '</li>').join('') + '</' + (ordered ? 'ol' : 'ul') + '>');
      continue;
    }
    const para = []; while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|\||\s*([-*]|\d+\.)\s)/.test(lines[i])) para.push(lines[i++].trim());
    out.push('<p>' + inline(para.join(' ')) + '</p>');
  }
  return out.join('\n');
}

async function view(which) {
  const d = DOCS[which] || DOCS.terms;
  const body = el('div', { class: 'card legal' }, el('p', { class: 'hint' }, 'Loading…'));
  show(el('div', {}, SR.backRow(d.title, el('button', { class: 'btn sm ghost', type: 'button', onclick: () => view(which === 'terms' ? 'privacy' : 'terms') }, which === 'terms' ? 'Privacy Policy' : 'Terms of Service')), body));
  try {
    const r = await fetch(d.file, { cache: 'no-cache' }); if (!r.ok) throw new Error(r.status);
    body.innerHTML = render(await r.text());
  } catch (e) { body.innerHTML = ''; body.append(el('p', {}, 'This page could not be loaded here. It is in the app\'s folder as ' + d.file + '.')); }
}
const link = (which, label) => el('button', { class: 'linkbtn', type: 'button', onclick: () => view(which) }, label);

/* ---------- consent ---------- */
const current = () => { const c = SR.state().consent; return !!(c && c.v === VERSION); };
function accept() { const st = SR.state(); st.consent = { v: VERSION, at: Date.now() }; SR.save(); record(); }
async function record() {
  const A = SR.account; const st = SR.state();
  if (!A || !A.client || !A.user || !st.consent || st.consent.v !== VERSION || st.consent.recorded === A.user.id + ':' + VERSION) return;
  const { error } = await A.client.from('consents').upsert({ user_id: A.user.id, version: VERSION, accepted_at: new Date(st.consent.at).toISOString() }, { onConflict: 'user_id,version', ignoreDuplicates: true });
  if (!error) { st.consent.recorded = A.user.id + ':' + VERSION; SR.save(); }
  else if (!A.isMissing(error)) console.warn('consent not recorded:', error.message);
}
(SR.hooks.signedIn = SR.hooks.signedIn || []).push(() => record());

/* The tick box for the sign-in form. Returns { el, ok() }. */
function checkbox() {
  const box = el('input', { type: 'checkbox', id: 'consentBox' });
  if (current()) box.checked = true;
  const wrap = el('label', { class: 'consent', for: 'consentBox' }, box, el('span', {}, 'I am 18 or older and I agree to the ', link('terms', 'Terms of Service'), ' and ', link('privacy', 'Privacy Policy'), '.'));
  return { el: wrap, ok: () => { if (!box.checked) return false; if (!current()) accept(); return true; } };
}
/* For someone already signed in who has not accepted this version (for example, signed in before terms existed). */
function homeCard() {
  const A = SR.account; if (!A || !A.enabled || !A.user || current()) return null;
  const c = checkbox();
  return el('div', { class: 'card reveal', style: 'margin-bottom:18px' }, el('div', { class: 'eyebrow' }, 'Your account'), el('h2', {}, 'Please review the terms'),
    el('p', { class: 'lead', style: 'margin:8px 0 12px' }, 'Your progress syncs to your account, so we need your agreement to how that works. It takes a minute to read, and it is written in plain language.'),
    c.el, el('div', { class: 'actions' }, el('button', { class: 'btn primary', type: 'button', onclick: () => { if (!c.ok()) return toast('Tick the box to continue.'); toast('Thank you.'); SR.homeView(); } }, 'Continue')));
}

SR.legal = { VERSION, view, render, checkbox, homeCard, current, link };
window.addEventListener('DOMContentLoaded', () => { const q = new URLSearchParams(location.search).get('legal'); if (q && DOCS[q]) setTimeout(() => view(q), 0); });
})();
