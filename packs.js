/* Private course packs.

   The built-in NURS 4620 and NURS 4510 packs are built from a professor's handouts. That is fine for one student's
   own study, but the app must not hand them to other students. With `privatePacks: true` in config.js:
     - the pack files are not shipped with the site (see docs/PILOT-CUTOVER.md for the one-time steps),
     - each pack lives in the `private_packs` table (supabase/migrations/0003_private_packs.sql), readable only by
       the account it belongs to,
     - after that person signs in, this file loads their packs into the app, and the built-in courses appear.
   Everyone else sees only their own courses. With `privatePacks: false` (today), the pack files load as before
   and nothing here runs. */
(function () {
'use strict';
const cfg = window.SR_CONFIG || {};
const on = !!cfg.privatePacks;
const loaded = new Set();                 // pack names already injected
const courses = new Set();                // built-in course ids with content from a loaded pack
SR.packs = { private: on, courses, loaded, state: on ? 'waiting' : 'public' };
const REGISTRIES = ['CASES', 'WHO_FIRST', 'DELEGATION', 'TREND_TEMPLATES', 'QUICKFIRE', 'RHYMES'];

function inject(pack, data) {
  if (loaded.has(pack) || !data) return 0;
  let n = 0;
  for (const k of REGISTRIES) {
    const items = data[k]; if (!Array.isArray(items) || !Array.isArray(window[k])) continue;
    window[k].push(...items); n += items.length;
    items.forEach(x => courses.add(x.course || SR.courses.BUILTIN_ID));
  }
  loaded.add(pack); return n;
}
async function load(client) {
  SR.packs.state = 'loading';
  const { data, error } = await client.from('private_packs').select('pack, data');
  if (error) { SR.packs.state = SR.account.isMissing(error) ? 'missing' : 'error'; SR.packs.error = error.message; console.warn('private packs:', error.message); return; }
  let n = 0; (data || []).forEach(r => { n += inject(r.pack, r.data); });
  SR.packs.state = 'ok';
  if (!n) return;
  if (SR.adapt && SR.adapt.resetIndex) SR.adapt.resetIndex();
  SR.courses.all();                        // adds the built-in courses these packs belong to
  // Redraw whichever screen is showing, unless the student is in the middle of a question.
  const st = SR.state(); if (!st.activeCourse || !st.courses[st.activeCourse]) { st.activeCourse = [...courses][0]; SR.save(); }
  if (document.querySelector('.casecard.newcourse')) SR.courses.picker();
  else if (!document.querySelector('.qcard')) SR.homeView();
}
if (on) (SR.hooks.signedIn = SR.hooks.signedIn || []).push(client => { load(client); });
SR.packs.inject = inject;   // for tests and for the cutover check
})();
