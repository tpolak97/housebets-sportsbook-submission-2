'use strict';
/* Sidebar sports, Stake-style. Below the shortcuts (Rewards, Upcoming, Live, My Bets) the sidebar shows:
   - Top sports: a short list of what's on (TOP), each a tile with a built-in arrow that drops down its leagues;
   - All sports / All esports / All racing: three dropdowns that list every sport in that category right in the
     sidebar (from sport-directory.js; motorsports count as racing). Their sports have league arrows too.
   A football league opens the Football page filtered to it; other leagues open their first match (live first), whose
   league bar lists that league's matches. Open dropdowns stay open across redraws. The homepage "All sports" button
   still opens the directory window. Collapsed sidebar: Top sports as icons, and each category icon opens the window. */
{
const TOP = ['Football', 'Basketball', 'American Football', 'Tennis', 'League of Legends'];
const CATS = [['Sports', 'All sports'], ['Esports', 'All esports'], ['Racing', 'All racing']];
const openLeagues = new Set(), openCats = new Set();
const SVG = {
  Sports: '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="2.5" width="6" height="6" rx="1.6"/><rect x="11.5" y="2.5" width="6" height="6" rx="1.6"/><rect x="2.5" y="11.5" width="6" height="6" rx="1.6"/><rect x="11.5" y="11.5" width="6" height="6" rx="1.6"/></svg>',
  Esports: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 6h8a4 4 0 0 1 3.9 4.9l-.8 3.4a2 2 0 0 1-3.4.9L12 13.5H8l-1.7 1.7a2 2 0 0 1-3.4-.9l-.8-3.4A4 4 0 0 1 6 6z"/><path d="M6.2 8.6v2.8M4.8 10h2.8" stroke="#0a1c22" stroke-width="1.3" stroke-linecap="round"/><circle cx="13.6" cy="9.2" r=".9" fill="#0a1c22"/><circle cx="15" cy="10.8" r=".9" fill="#0a1c22"/></svg>',
  Racing: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 2.5v15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M5 3h11v8H5z" fill="none"/><path d="M5 3h3.7v2.7H5zM12.3 3H16v2.7h-3.7zM8.7 5.7h3.6v2.6H8.7zM5 8.3h3.7V11H5zM12.3 8.3H16V11h-3.7z"/><path d="M5 3h11v8H5z" fill="none" stroke="currentColor" stroke-width="1"/></svg>'
};
const CHEVRON = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 8l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const js = s => E(JSON.stringify(s));
const fromHtml = html => { const t = document.createElement('template'); t.innerHTML = html; return t.content.firstElementChild; };

// Leagues for a sport, from the fixtures: [name, matches, live, first match index (live first)].
const leaguesFor = name => {
  const map = new Map();
  events.forEach((e, i) => {
    if (sportOf(e) !== name || window.isHiddenFixture?.(i)) return;
    const l = leagues[e[2]] || 'Other', m = map.get(l) || {n: 0, live: 0, first: -1, firstLive: -1};
    m.n++; if (e[3]) { m.live++; if (m.firstLive < 0) m.firstLive = i; } if (m.first < 0) m.first = i;
    map.set(l, m);
  });
  return [...map].map(([l, m]) => [l, m.n, m.live, m.firstLive >= 0 ? m.firstLive : m.first]).sort((a, b) => b[2] - a[2] || b[1] - a[1]);
};
const leagueMark = l => window.leagueLogos?.[l] ? '<span class="rbLeagueLogo"><img src="' + E(leagueLogos[l]) + '" alt=""></span>' : '<span class="rbLeagueLogo rbLeagueDot" aria-hidden="true">' + E(l.slice(0, 1)) + '</span>';

window.rbToggle = (name, btn) => {
  openLeagues.has(name) ? openLeagues.delete(name) : openLeagues.add(name);
  const row = btn.closest('.rbRow');
  row.classList.toggle('rbOpen', openLeagues.has(name));
  btn.setAttribute('aria-expanded', openLeagues.has(name));
};
window.rbLeague = (name, l, first) => {
  if (name === 'Football') {
    league = l; if (typeof footballView !== 'undefined') footballView.team = 'All teams'; sport = 'All'; q = '';
    if (p === 'football') render(); else location.hash = href('football');
  } else if (first >= 0) location.hash = href('match', first);
};
window.rbCat = (tab, btn) => {
  if (document.documentElement.classList.contains('sidebarHidden')) { window.openSportDirectory?.(tab); return; }
  openCats.has(tab) ? openCats.delete(tab) : openCats.add(tab);
  const cat = btn.closest('.rbCat');
  cat.classList.toggle('rbCatOpen', openCats.has(tab));
  btn.setAttribute('aria-expanded', openCats.has(tab));
  const body = cat.querySelector('.rbCatList');
  if (openCats.has(tab) && !body.childElementCount) fillCat(tab, body);
};

// One sport: its sidebar tile (railSport) inside a bubble, with a league arrow when it has fixtures.
const row = name => {
  const btn = fromHtml(railSport(name));
  const wrap = document.createElement('div');
  wrap.className = 'rbRow' + (openLeagues.has(name) ? ' rbOpen' : '');
  btn.classList.add('rbItem');
  wrap.append(btn);
  const list = leaguesFor(name);
  if (list.length) {
    btn.insertAdjacentHTML('afterend', '<button class="rbExpand" aria-expanded="' + openLeagues.has(name) + '" aria-label="Show ' + E(name) + ' leagues" title="Leagues" onclick="rbToggle(' + js(name) + ',this)">' + CHEVRON + '</button>');
    wrap.insertAdjacentHTML('beforeend', '<div class="rbLeagues" role="list">' + list.map(([l, n, live, first]) =>
      '<button role="listitem" class="rbLeague' + (name === 'Football' && league === l && p === 'football' ? ' on' : '') + '" onclick="rbLeague(' + js(name) + ',' + js(l) + ',' + first + ')">' + leagueMark(l) +
      '<span>' + E(l) + '</span>' + (live ? '<em class="rbLive">' + live + '</em>' : '<em>' + n + '</em>') + '</button>').join('') + '</div>');
  }
  return wrap;
};
const fillCat = (tab, body) => {
  const counts = window.sportCountsAll?.() || {};
  const names = (window.sportDirectoryTabs?.[tab] || []).map(r => r[0]).filter(n => n !== 'Esports Hub');
  // Sports with fixtures first, then the rest, each in directory order.
  names.sort((a, b) => (counts[b] ? 1 : 0) - (counts[a] ? 1 : 0));
  names.forEach(n => body.append(row(n)));
};
const section = (cls, title, short) => {
  const s = document.createElement('section');
  s.className = 'rbGroup ' + cls;
  s.innerHTML = '<div class="rbHead" data-short="' + E(short) + '"><span>' + E(title) + '</span></div><div class="rbGrid"></div>';
  return s;
};

const build = rail => {
  if (!rail || rail.dataset.rb) return;
  rail.dataset.rb = '1';
  const first = rail.querySelector(':scope > .sportsHeading, :scope > small');
  if (!first) return;
  for (let el = first; el;) { const next = el.nextElementSibling; el.remove(); el = next; }
  const top = section('rbTop', 'Top sports', 'Top');
  top.querySelector('.rbHead').insertAdjacentHTML('beforeend', '<i class="rbFlame" aria-hidden="true">🔥</i>');
  TOP.forEach(n => top.querySelector('.rbGrid').append(row(n)));
  const browse = section('rbBrowse', 'Browse', 'All');
  const counts = window.sportCountsAll?.() || {};
  CATS.forEach(([tab, label]) => {
    const n = (window.sportDirectoryTabs?.[tab] || []).reduce((a, [k]) => a + (k === 'Esports Hub' ? 0 : counts[k] || 0), 0);
    const cat = fromHtml('<div class="rbCat rbCat' + tab + (openCats.has(tab) ? ' rbCatOpen' : '') + '"><button class="rbCatHead" aria-expanded="' + openCats.has(tab) + '" title="' + E(label) + '" onclick="rbCat(' + js(tab) + ',this)">' +
      '<span class="rbCatIcon">' + SVG[tab] + '</span><span class="rbCatLabel">' + E(label) + '</span>' + (n ? '<em>' + n + '</em>' : '') + '<span class="rbCatChevron">' + CHEVRON + '</span></button><div class="rbCatList"></div></div>');
    if (openCats.has(tab)) fillCat(tab, cat.querySelector('.rbCatList'));
    browse.querySelector('.rbGrid').append(cat);
  });
  rail.append(top, browse);
};

/* Collapsed sidebar: hovering a sport opens a flyout beside it with that sport's leagues and their games
   (teams, live score or kickoff); hovering a category lists its sports. Everything in it is clickable.
   The flyout lives on <body>, so page redraws don't close it. */
const fly = document.createElement('div');
fly.id = 'rbFly';
fly.setAttribute('role', 'dialog');
fly.hidden = true;
document.body.append(fly);
let flyFor = null, hideTimer = 0, quiet = false;  // quiet: after a click, wait until the mouse leaves the sidebar
const collapsed = () => document.documentElement.classList.contains('sidebarHidden') && matchMedia('(hover: hover) and (min-width: 751px)').matches;
const teamCrest = (e, k) => sportOf(e) === 'Football' && window.clubShield && window.footballClub ? clubShield(footballClub(e[k]), 'sm') : '';
const gameRow = i => {
  const e = events[i], live = !!e[3];
  return '<button class="rbFlyGame' + (live ? ' live' : '') + '" onclick="rbFlyGo(' + i + ')">' +
    '<span class="rbFlyTeams"><span>' + teamCrest(e, 0) + '<b>' + E(e[0]) + '</b></span><span>' + teamCrest(e, 1) + '<b>' + E(e[1]) + '</b></span></span>' +
    '<span class="rbFlyWhen">' + (live ? '<i></i>' + E(e[4]) : E(e[4])) + '</span></button>';
};
const sportFly = name => {
  const ls = leaguesFor(name);
  const body = ls.length ? ls.map(([l, n, live, first]) => {
    const games = events.map((e, i) => [e, i]).filter(([e, i]) => sportOf(e) === name && !window.isHiddenFixture?.(i) && (leagues[e[2]] || 'Other') === l)
      .sort((a, b) => (b[0][3] ? 1 : 0) - (a[0][3] ? 1 : 0)).slice(0, 4).map(([, i]) => gameRow(i)).join('');
    return '<section class="rbFlyLeague"><button class="rbFlyLeagueHead" onclick="rbLeague(' + js(name) + ',' + js(l) + ',' + first + ');rbFlyHide(true)">' + leagueMark(l) +
      '<span>' + E(l) + '</span>' + (live ? '<em class="rbLive">' + live + ' live</em>' : '<em>' + n + '</em>') + '</button>' + games + '</section>';
  }).join('') : '<p class="rbFlyNone">No events right now.</p>';
  const total = events.filter((e, i) => sportOf(e) === name && !window.isHiddenFixture?.(i)).length, liveN = events.filter((e, i) => sportOf(e) === name && e[3] && !window.isHiddenFixture?.(i)).length;
  return '<header><strong>' + E(window.sportLabel ? sportLabel(name) : name) + '</strong><span class="rbFlyMeta">' + (liveN ? '<em class="rbLive">' + liveN + ' live</em>' : '') + '<em>' + total + ' games</em></span></header><div class="rbFlyBody">' + body + '</div>';
};
const catFly = tab => {
  const counts = window.sportCountsAll?.() || {}, label = (CATS.find(c => c[0] === tab) || [])[1] || tab;
  const names = (window.sportDirectoryTabs?.[tab] || []).map(r => r[0]).filter(n => n !== 'Esports Hub').sort((a, b) => (counts[b] ? 1 : 0) - (counts[a] ? 1 : 0));
  return '<header><strong>' + E(label) + '</strong></header><div class="rbFlyBody rbFlySports">' + names.map(n =>
    '<button class="rbFlySport" onclick="rbFlyHide(true);enterSport(' + js(n) + ')">' + icon(n) + '<span>' + E(window.sportLabel ? sportLabel(n) : n) + '</span>' + (counts[n] ? '<em>' + counts[n] + '</em>' : '') + '</button>').join('') +
    '</div><button class="rbFlyAll" onclick="rbFlyHide(true);openSportDirectory(' + js(tab) + ')">Open ' + E(label.toLowerCase()) + ' window</button>';
};
const showFly = (anchor, key, html) => {
  clearTimeout(hideTimer);
  if (flyFor !== key) { fly.innerHTML = html; flyFor = key; fly.scrollTop = 0; }
  fly.hidden = false;
  const nav = document.getElementById('productSidebar')?.getBoundingClientRect(), r = anchor.getBoundingClientRect();
  fly.style.left = Math.round((nav ? nav.right : r.right) + 8) + 'px';
  const h = fly.offsetHeight;
  fly.style.top = Math.round(Math.max(72, Math.min(r.top - 8, innerHeight - h - 12))) + 'px';
};
window.rbFlyHide = now => { clearTimeout(hideTimer); const go = () => { fly.hidden = true; flyFor = null; }; now ? go() : (hideTimer = setTimeout(go, 160)); };
window.rbFlyGo = i => { rbFlyHide(true); quiet = true; location.hash = href('match', i); };
fly.addEventListener('click', ev => { if (ev.target.closest('button')) quiet = true; });
document.addEventListener('mouseover', ev => {
  if (!collapsed()) { if (!fly.hidden) rbFlyHide(true); return; }
  if (fly.contains(ev.target)) { clearTimeout(hideTimer); return; }
  const inSide = ev.target.closest?.('#productSidebar');
  if (quiet) { if (inSide) return; quiet = false; }
  const rowEl = ev.target.closest?.('#productSidebar .rbRow'), cat = ev.target.closest?.('#productSidebar .rbCat');
  if (rowEl) { const name = rowEl.querySelector('.rbItem')?.dataset.sport; if (name) showFly(rowEl, 's:' + name, sportFly(name)); }
  else if (cat) { const tab = [...cat.classList].find(c => /^rbCat(Sports|Esports|Racing)$/.test(c))?.slice(5); if (tab) showFly(cat, 'c:' + tab, catFly(tab)); }
  else if (!fly.hidden) rbFlyHide();
});
document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && !fly.hidden) rbFlyHide(true); });
const renderBefore = render;
render = function() { renderBefore(); build(document.querySelector('.railDirectory')); };
window.render = render;
render();
}
