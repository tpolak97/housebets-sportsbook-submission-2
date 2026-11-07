'use strict';
/* Home page polish.
   - The bottom deck (Featured football / Top events / Top competitions) becomes: a featured-match banner on the stadium
     image (crests, score or kickoff, CTA) and a row of league banners, each in the league's colours with its logo,
     live and match counts, opening that league. "Top events" is gone: the card rail at the top already shows them.
   - Top card rail: the league name gets its logo and the kickoff becomes a pill, so both read at a glance. */
{
// Sharpen filter for the upscaled photo banners (used by home-polish.css).
if (!document.getElementById('hpSharpenDefs')) document.body.insertAdjacentHTML('beforeend', '<svg id="hpSharpenDefs" width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="hpSharpen"><feConvolveMatrix order="3" preserveAlpha="true" kernelMatrix="0 -0.6 0 -0.6 3.4 -0.6 0 -0.6 0"/></filter></svg>');
const LEAGUE_STYLE = {
  'Premier League': ['#3d195b', '#e90052', 'England'], 'Champions League': ['#0a1e5b', '#1f6feb', 'Europe'],
  'LaLiga': ['#ff4b44', '#7a1010', 'Spain'], 'Serie A': ['#0a5cc2', '#00b0e6', 'Italy'], 'Bundesliga': ['#d20515', '#3a0006', 'Germany']
};
const stats = l => { let n = 0, live = 0, first = -1; events.forEach((e, i) => { if (sportOf(e) === 'Football' && leagues[e[2]] === l) { n++; if (e[3]) live++; if (first < 0 || (e[3] && !events[first][3])) first = i; } }); return {n, live, first}; };
const crest = (i, k) => window.clubShield && window.footballClub ? clubShield(footballClub(events[i][k]), 'lg') : '';
const featuredId = () => {
  const live = all.find(i => sportOf(events[i]) === 'Football' && events[i][3]);
  return live ?? all.find(i => sportOf(events[i]) === 'Football') ?? 0;
};
const featured = () => {
  const i = featuredId(), e = events[i], l = leagues[e[2]] || '', live = !!e[3];
  const score = live ? String(e[4]).split(/[–-]/) : null;
  const logo = window.leagueLogos?.[l] ? '<span class="hpLogo"><img src="' + E(leagueLogos[l]) + '" alt=""></span>' : '';
  return '<a class="hpFeature" href="' + href('match', i) + '">' +
    '<span class="hpFeatureTop">' + logo + '<span>' + E(l) + '</span>' + (live ? '<em class="hpLive"><i></i>LIVE</em>' : '<em>Kickoff ' + E(e[4]) + '</em>') + '</span>' +
    '<span class="hpFeatureFace"><span class="hpSide">' + crest(i, 0) + '<b>' + E(e[0]) + '</b></span>' +
    '<span class="hpMid">' + (score && score.length === 2 ? '<strong>' + E(score[0]) + '<i>:</i>' + E(score[1]) + '</strong>' : '<strong class="hpVs">VS</strong>') + '</span>' +
    '<span class="hpSide">' + crest(i, 1) + '<b>' + E(e[1]) + '</b></span></span>' +
    '<span class="hpCta">View all markets →</span></a>';
};
const competitions = () => Object.keys(LEAGUE_STYLE).map(l => {
  const [a, b, country] = LEAGUE_STYLE[l], s = stats(l);
  return '<button class="hpLeague" style="--la:' + a + ';--lb:' + b + '" onclick="window.rbLeague ? rbLeague(\'Football\',' + E(JSON.stringify(l)) + ',' + s.first + ') : filterL(' + leagues.indexOf(l) + ')">' +
    (window.leagueLogos?.[l] ? '<img class="hpWatermark" src="' + E(leagueLogos[l]) + '" alt=""><span class="hpLogo"><img src="' + E(leagueLogos[l]) + '" alt=""></span>' : '') +
    '<span class="hpLeagueText"><small>' + E(country) + '</small><b>' + E(l) + '</b></span>' +
    '<span class="hpCounts">' + (s.live ? '<em class="hpLive"><i></i>' + s.live + ' live</em>' : '') + '<em>' + s.n + ' matches</em></span></button>';
}).join('');

const homeBefore = home;
home = function() {
  const html = homeBefore();
  if (!html.includes('lowerDeck') || q) return html;
  const t = document.createElement('template');
  t.innerHTML = html;
  const deck = t.content.querySelector('.lowerDeck');
  if (deck) {
    deck.className = 'hpDeck';
    deck.innerHTML = '<section class="hpFeatureWrap"><h2>Featured match</h2>' + featured() + '</section>' +
      '<section class="hpComps"><div class="hpCompsHead"><h2>Top competitions</h2><a href="' + href('football') + '">All football →</a></div><div class="hpLeagues">' + competitions() + '</div></section>';
  }
  return t.innerHTML;
};
// No "Decimal odds · Stakes in USDT" footer line (the slip and cards already say USDT and show decimal odds).
oddsSetting = () => '';
window.oddsSetting = oddsSetting;
// Home lists: 6 matches each, then "Show more" adds 6 at a time (remembered per sport and list while you browse),
// so the Featured match and Top competitions are a short scroll away.
const LIMIT = 6, shown = new Map();
window.hpMore = key => { shown.set(key, (shown.get(key) || LIMIT) + LIMIT); limitLists(); };
window.hpLess = key => { shown.set(key, LIMIT); limitLists(); document.querySelector('[data-hp-key="' + CSS.escape(key) + '"]')?.scrollIntoView({block: 'nearest'}); };
function limitLists() {
  if (p !== 'home' || q) return;
  document.querySelectorAll('#found .fixtureGroup').forEach(g => {
    const rows = [...g.querySelectorAll(':scope > .fixtureRow')];
    const key = sport + '|' + (g.querySelector('h2')?.textContent || '').trim();
    g.dataset.hpKey = key;
    g.querySelector(':scope > .hpMoreBar')?.remove();
    const n = shown.get(key) || LIMIT;
    rows.forEach((r, k) => { r.hidden = k >= n; });
    if (rows.length > LIMIT) {
      const left = rows.length - Math.min(n, rows.length);
      g.insertAdjacentHTML('beforeend', '<div class="hpMoreBar">' + (left > 0 ? '<button class="hpMore" onclick="hpMore(' + E(JSON.stringify(key)) + ')">Show more <em>' + left + ' more</em></button>' : '') +
        (n > LIMIT ? '<button class="hpLess" onclick="hpLess(' + E(JSON.stringify(key)) + ')">Show less</button>' : '') + '</div>');
    }
  });
}
// Top card rail: league logo beside the league name.
const renderBefore = render;
render = function() {
  renderBefore();
  limitLists();
  document.querySelectorAll('.snapCard .snapMeta > small:first-child:not(.hpTagged)').forEach(s => {
    s.classList.add('hpTagged');
    const l = s.textContent.trim();
    const when = s.parentElement.querySelector(':scope > small:not(:first-child)');
    if (when) when.textContent = when.textContent.replace(/^Kickoff\s*·\s*/, '');
    // Live badge: keep it short on the cards ("LIVE · 52′"); only plain text is trimmed, the ticking clock stays.
    const badge = s.parentElement.querySelector(':scope > .badge');
    if (badge) for (const n of badge.childNodes) if (n.nodeType === 3) n.textContent = n.textContent.replace(/(First|Second) half\s*·\s*|Half-time\s*·\s*/g, '');
    if (window.leagueLogos?.[l]) s.insertAdjacentHTML('afterbegin', '<span class="hpLogo hpLogoSm"><img src="' + E(leagueLogos[l]) + '" alt=""></span>');
  });
};
window.render = render;
render();
}
