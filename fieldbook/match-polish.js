'use strict';
/* Match fixture strip navigation and league filter. */
{
const q = s => JSON.stringify(s).replace(/"/g, '&quot;');
// ---- Fixture strip toolbar: Home and league filter ----
let stripLeague = null, stripFor = null;
const leagueOf = a => { const e = events[+a.getAttribute('href').split('/').pop()]; return e ? leagues[e[2]] || '' : ''; };
const logo = l => window.leagueLogos?.[l] ? '<span class="mpLogo"><img src="' + E(leagueLogos[l]) + '" alt=""></span>' : '<span class="mpLogo mpLogoAll">' + (l === 'All' ? '★' : E(l.slice(0, 1))) + '</span>';
function toolbar() {
  const strip = document.querySelector('.fixtureStrip');
  if (!strip || p !== 'match') return;
  if (stripFor !== id) { stripFor = id; stripLeague = leagues[events[id]?.[2]] || 'All'; }
  const chips = [...strip.querySelectorAll('a[href*="/match/"]')];
  const counts = new Map();
  chips.forEach(a => counts.set(leagueOf(a), (counts.get(leagueOf(a)) || 0) + 1));
  if (!counts.has(stripLeague)) stripLeague = 'All';
  chips.forEach(a => { a.hidden = stripLeague !== 'All' && leagueOf(a) !== stripLeague; });
  const pill = (l, n) => '<button class="mpLeague" aria-pressed="' + (l === stripLeague) + '" onclick="mpLeague(' + q(l) + ')">' + logo(l) + '<span>' + E(l === 'All' ? 'All matches' : l) + '</span><em>' + n + '</em></button>';
  const html = '<div class="mpBar"><div class="mpNav"><a class="mpHome" href="#6/home/0"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 9.5 10 3.5l7 6V17h-4.5v-4.5h-5V17H3z" fill="currentColor"/></svg>Home</a>' +
    '</div>' +
    '<div class="mpLeagues" role="group" aria-label="Filter other matches by league">' + pill('All', chips.length) + [...counts].map(([l, n]) => pill(l, n)).join('') + '</div></div>';
  document.querySelector('.mpBar')?.remove();
  strip.insertAdjacentHTML('beforebegin', html);
  document.body.classList.add('mpOn');
  const act = strip.querySelector('a.active:not([hidden])');
  if (act) strip.scrollLeft = act.offsetLeft - (strip.clientWidth - act.offsetWidth) / 2;
}
window.mpLeague = l => { stripLeague = l; toolbar(); document.querySelector('.fixtureStrip')?.scrollTo({left: 0}); };

const renderBefore = render;
render = function() {
  renderBefore();
  document.body.classList.toggle('mpOn', false);
  toolbar();
};
window.render = render;
render();
}
