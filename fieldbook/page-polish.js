'use strict';
/* Beta v2 page polish for the five core pages (home, live, football, my bets, bet slip).
   Live: competitions with one or two live matches no longer take a full-width row each. Each section gets data-n
   (its match count) and the list becomes a grid (page-polish.css), so short competitions sit side by side.
   My bets: when there are no open bets but some settled ones, open on the Settled tab. */
{
const tagLive = () => {
  if (p !== 'live') return;
  const found = document.querySelector('#found');
  if (!found) return;
  found.classList.add('liveGrid');
  found.querySelectorAll(':scope > .fixtureGroup').forEach(g => { const n = g.querySelectorAll(':scope > .fixtureRow').length; g.dataset.n = n >= 3 ? '3' : String(n); });
};
// My bets: on arriving with no open bets but some settled, show Settled; empty lists get a way back to betting.
let lastPage = null;
const betsPage = () => {
  const arrived = p === 'bets' && lastPage !== 'bets';
  lastPage = p;
  if (p !== 'bets') return false;
  const tabs = [...app.querySelectorAll('button')].filter(b => /^(Open|Settled) \(\d+\)$/.test(b.textContent.trim()));
  const count = name => +((tabs.find(b => b.textContent.trim().startsWith(name))?.textContent.match(/\((\d+)\)/) || [])[1] || 0);
  if (arrived && status === 'Open' && count('Open') === 0 && count('Settled') > 0) { status = 'Settled'; return true; }
  const empty = [...app.querySelectorAll('p')].find(x => /^No (open|settled) bets/.test(x.textContent.trim()) && !x.children.length);
  if (empty) empty.outerHTML = '<div class="betsEmpty"><b>' + E(empty.textContent.trim()) + '</b><span>Picks you place show up here, with cash-out while they are open.</span>' +
    '<div><a href="#6/live/0">Browse live matches</a><a href="#6/football/0">Explore football</a></div></div>';
  return false;
};
// Home sport block: the heading becomes a pill, "Bet live →" becomes a Live bubble (the live mark and how many
// matches are live), and the sections under it are packed into a grid so one-match sections sit side by side.
const slate = () => {
  if (p !== 'home') return;
  const head = app.querySelector('.slateHeading');
  if (!head || head.dataset.polished) return;
  head.dataset.polished = '1';
  const a = head.querySelector('a[href*="/live/"]');
  if (a) {
    const n = events.filter(e => e[3] && (sport === 'All' || sportOf(e) === sport)).length;
    a.className = 'liveBubble';
    a.setAttribute('aria-label', n + ' live ' + (n === 1 ? 'match' : 'matches') + ' · open Live');
    a.innerHTML = (window.toolbarMark ? toolbarMark('live') : '') + '<span>Live</span>' + (n ? '<b>' + n + '</b>' : '');
  }
  const groups = [];
  for (let el = head.nextElementSibling; el && el.matches('.fixtureGroup'); el = el.nextElementSibling) groups.push(el);
  if (!groups.length) return;
  const wrap = document.createElement('div');
  wrap.className = 'slateGrid';
  groups[0].before(wrap);
  groups.forEach(g => { const k = g.querySelectorAll(':scope > .fixtureRow').length; g.dataset.n = k >= 3 ? '3' : String(k); wrap.append(g); });
};
const before = render;
render = function() { before(); tagLive(); slate(); if (betsPage()) { before(); slate(); } };
window.render = render;
render();
}
