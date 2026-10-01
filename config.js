/* Deployment configuration.

   The live site (shiftreadynursing.netlify.app, or any address without "--" in it) talks to the LIVE database.
   Test copies talk to the PRACTICE database instead, so testing can never touch anyone's real progress:
     - Netlify preview and branch links (their addresses contain "--", e.g. deploy-preview-12--shiftreadynursing.netlify.app)
     - a copy opened as a file, or from localhost
   Leave the PRACTICE values empty and test copies simply run with sign-in off (progress stays in that browser).

   Both keys are public "publishable" keys; row-level security in the database is what protects the data. */
(function () {
  const LIVE = {
    supabaseUrl: 'https://zenvotibmwyytvvcxjqx.supabase.co',
    supabaseAnonKey: 'sb_publishable_z9lFJ_JkW_0zGpFN7ugysQ_JMrrrfgx',
    privatePacks: false   // true once the pilot opens: professor-derived packs load only for their owner (docs/PILOT-CUTOVER.md)
  };
  const PRACTICE = {
    supabaseUrl: '',      // e.g. 'https://xxxx.supabase.co' of a second, practice-only Supabase project
    supabaseAnonKey: '',  // its publishable key (sb_publishable_...)
    privatePacks: false
  };
  const host = location.hostname;
  const testCopy = location.protocol === 'file:' || host === '' || host === 'localhost' || host === '127.0.0.1' ||
    (host.includes('--') && !host.startsWith('main--'));
  window.SR_CONFIG = Object.assign({ env: testCopy ? 'practice' : 'live' }, testCopy ? PRACTICE : LIVE);
})();
