'use strict';
/* Coloured, animated marks for the sidebar shortcuts (Rewards, Upcoming Events, Bet Live, My Bets)
   and the discovery tabs (Popular, Live, Upcoming, Favourites). Other toolbar marks keep the line style. */
{
let uid = 0;
const NAV = {
  // Rewards: gold crown, teal outline, jewels, a glint that sweeps across
  rewards: id => '<defs><clipPath id="' + id + '"><path d="m2.6 8.2 4.9 3.7L12 4.6l4.5 7.3 4.9-3.7-2.5 10.6H5.1z"/></clipPath></defs>' +
    '<g class="nvCrown"><path d="m2.6 8.2 4.9 3.7L12 4.6l4.5 7.3 4.9-3.7-2.5 10.6H5.1z" fill="#f6c445" stroke="#2fd3bd" stroke-width="1.5"/>' +
    '<path d="M5.4 16.4h13.2" stroke="#c8901c" stroke-width="1.3"/>' +
    '<circle cx="12" cy="13" r="1.5" fill="#e8473f" stroke="none"/><circle cx="7.6" cy="14.2" r=".95" fill="#3d8fd6" stroke="none"/><circle cx="16.4" cy="14.2" r=".95" fill="#3d8fd6" stroke="none"/>' +
    '<g clip-path="url(#' + id + ')"><path class="nvGlint" d="M3 22 9 2h2.6L5.6 22z" fill="#fff" stroke="none" opacity=".75"/></g></g>' +
    '<path class="nvSpark" d="M20.2 1.6l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" fill="#fff3c4" stroke="none"/>',
  // Upcoming: desk calendar, red header, a page that flips, the next day lighting up
  upcoming: () => '<rect x="3" y="4.5" width="18" height="17" rx="2.6" fill="#eef4f3" stroke="#9fc7c0" stroke-width="1.1"/>' +
    '<path d="M3 9.6V7.1a2.6 2.6 0 0 1 2.6-2.6h12.8A2.6 2.6 0 0 1 21 7.1v2.5z" fill="#e8473f" stroke="none"/>' +
    '<g fill="#9fb4b6" stroke="none"><rect x="6" y="12" width="2.6" height="2.2" rx=".5"/><rect x="10.7" y="12" width="2.6" height="2.2" rx=".5"/>' +
    '<rect x="6" y="16.4" width="2.6" height="2.2" rx=".5"/><rect x="10.7" y="16.4" width="2.6" height="2.2" rx=".5"/><rect x="15.4" y="16.4" width="2.6" height="2.2" rx=".5"/></g>' +
    '<rect class="nvDay" x="15.4" y="12" width="2.6" height="2.2" rx=".5" fill="#18b39b" stroke="none"/>' +
    '<path class="nvPage" d="M3 9.6V7.1a2.6 2.6 0 0 1 2.6-2.6h12.8A2.6 2.6 0 0 1 21 7.1v2.5z" fill="#ff7a6f" stroke="none"/>' +
    '<path d="M7.5 2.4v4.2m9-4.2v4.2" stroke="#10252b" stroke-width="1.9"/>',
  // Live: a red broadcast dot with signal arcs that pulse outward
  live: () => '<g class="nvLive"><circle class="nvRing" cx="12" cy="12" r="4.6" fill="#ff3b3b" opacity=".28" stroke="none"/>' +
    '<circle class="nvRec" cx="12" cy="12" r="3" fill="#ff3b3b" stroke="#ffd0d0" stroke-width=".6"/>' +
    '<path class="nvWave w1" d="M7.4 8.2a5.6 5.6 0 0 0 0 7.6M16.6 8.2a5.6 5.6 0 0 1 0 7.6" fill="none" stroke="#ff6b6b" stroke-width="1.7" stroke-linecap="round"/>' +
    '<path class="nvWave w2" d="M4.6 5.6a9.4 9.4 0 0 0 0 12.8M19.4 5.6a9.4 9.4 0 0 1 0 12.8" fill="none" stroke="#ff6b6b" stroke-width="1.7" stroke-linecap="round"/></g>',
  // My Bets: cream bet slip, torn edge, folded corner, lines that write themselves, a green tick
  bets: () => '<g class="nvSlip"><path d="M4.5 2.5h11l4 4v15l-1.9-1.4-1.9 1.4-1.9-1.4-1.9 1.4-1.9-1.4-1.9 1.4-1.9-1.4-1.6 1.4z" fill="#f4ecd6" stroke="#c9b98c" stroke-width="1"/>' +
    '<path d="M15.5 2.5v4h4" fill="#ddd0aa" stroke="#c9b98c" stroke-width="1"/>' +
    '<path class="nvLine l1" d="M7.4 8h5.4" stroke="#7c6a45" stroke-width="1.3" pathLength="1"/>' +
    '<path class="nvLine l2" d="M7.4 11.4h8.6" stroke="#7c6a45" stroke-width="1.3" pathLength="1"/>' +
    '<path class="nvLine l3" d="M7.4 14.8h4.6" stroke="#7c6a45" stroke-width="1.3" pathLength="1"/>' +
    '<path class="nvTick" d="m13.4 15 1.5 1.5 2.8-3.2" stroke="#18b39b" stroke-width="1.6" pathLength="1"/></g>',
  // Favourites: an outlined gold star that redraws itself, with twinkles
  favorites: () => '<path d="m12 2.4 2.9 6 6.6.9-4.8 4.6 1.2 6.6L12 17.4l-5.9 3.1 1.2-6.6-4.8-4.6 6.6-.9z" fill="#f6c445" fill-opacity=".1" stroke="#7a6a3a" stroke-width="1.9" opacity=".55"/>' +
    '<path class="nvStar" d="m12 2.4 2.9 6 6.6.9-4.8 4.6 1.2 6.6L12 17.4l-5.9 3.1 1.2-6.6-4.8-4.6 6.6-.9z" fill="none" stroke="#f6c445" stroke-width="1.9" pathLength="1"/>' +
    '<path class="nvTw t1" d="M20.6 15.6l.45 1.15 1.15.45-1.15.45-.45 1.15-.45-1.15-1.15-.45 1.15-.45z" fill="#fff3c4" stroke="none"/>' +
    '<path class="nvTw t2" d="M3.4 16.4l.35.9.9.35-.9.35-.35.9-.35-.9-.9-.35.9-.35z" fill="#fff3c4" stroke="none"/>',
  // Popular: a flickering flame (what's hot)
  popular: () => '<path class="nvFlame" d="M12 22c-4.3 0-7-2.8-7-6.6 0-3.4 2.4-5.6 3.6-8.6.6 1.6.9 2.6 2 3.4.2-3.2 1.6-5.9 4.2-7.8-.2 3 1 5 2.6 7 1.1 1.4 1.6 3 1.6 4.9 0 4.6-3 7.7-7 7.7z" fill="#ff7a2f" stroke="#ffb35c" stroke-width="1"/>' +
    '<path class="nvCore" d="M12 21.2c-2 0-3.3-1.3-3.3-3.1 0-1.9 1.4-2.9 2.2-4.6.4 1 .9 1.6 1.6 2 .2-1.3.8-2.3 1.7-3 .1 1.5.6 2.5 1.1 3.4.4.7.7 1.4.7 2.2 0 1.9-1.6 3.1-4 3.1z" fill="#ffd36b" stroke="none"/>'
};
const lineMark = toolbarMark;
toolbarMark = function(key) {
  if (!NAV[key]) return lineMark(key);
  return '<svg class="utilityMark navMark nv-' + key + '" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">' + NAV[key]('nvc' + (uid++)) + '</svg>';
};
window.toolbarMark = toolbarMark;
// The sidebar's Rewards button reuses the 'popular' key; give it the crown.
const renderBeforeNav = render;
render = function() {
  renderBeforeNav();
  document.querySelectorAll('.sideLinks button[aria-label="Rewards"] .utilityMark:not(.nv-rewards)').forEach(m => { m.outerHTML = toolbarMark('rewards'); });
};
window.render = render;
render();
}
