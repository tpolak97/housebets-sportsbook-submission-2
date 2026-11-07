'use strict';
/* Drop the demo "International friendly" (France v England, added by rivalry.js) from everything the player sees:
   the shared fixture lists (all / live / soon), the sidebar league dropdowns and flyout, and the match-page strip.
   The Football page already left it out. Load after rivalry.js and before the pages that build lists. */
{
const FRIENDLY = 'International friendly';
const idx = events.findIndex(e => leagues[e[2]] === FRIENDLY);
if (idx >= 0) {
  for (const list of [all, live, soon]) { const k = list.indexOf(idx); if (k >= 0) list.splice(k, 1); }
  window.hiddenFixtures = new Set([idx]);
}
window.isHiddenFixture = i => !!window.hiddenFixtures?.has(+i);
// The match-page strip lists every fixture of the sport: remove the friendly's chip after each render.
const renderBefore = render;
render = function() {
  renderBefore();
  document.querySelectorAll('.fixtureStrip a[href*="/match/"]').forEach(a => { if (isHiddenFixture(a.getAttribute('href').split('/').pop())) a.remove(); });
};
window.render = render;
}
