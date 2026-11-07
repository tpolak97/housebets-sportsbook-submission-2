'use strict';
/* Player card: tap a featured player's photo (fixture cards, match page) to see their 2026/27 season numbers and
   a few player bets for that fixture. Every bet is a single; prices are demo prices modelled from the season stats. */
{
const POS = {F: 'Forward', M: 'Midfielder', D: 'Defender', G: 'Goalkeeper'};
// Per-game priors keep small samples sensible (early season, few appearances).
const PRIOR = {F: [.36, .14, 1.15, .11], M: [.16, .17, .62, .17], D: [.06, .07, .26, .21], G: [.004, .01, .02, .05]};
const price = p => Math.min(41, Math.max(1.12, 1 / (p * 1.08))).toFixed(2);
let open = null;  // {i, side, k}

function markets(pl) {
  const [g0, a0, s0, book] = PRIOR[pl.position] || PRIOR.M;
  const apps = Math.max(0, pl.appearances || 0), w = 4;
  const gr = ((pl.goals || 0) + g0 * w) / (apps + w), ar = ((pl.assists || 0) + a0 * w) / (apps + w);
  const pGoal = 1 - Math.exp(-gr), pAssist = 1 - Math.exp(-ar), pEither = 1 - Math.exp(-(gr + ar));
  const pTwo = 1 - Math.exp(-gr) * (1 + gr), sot = s0 * Math.sqrt(Math.max(.25, gr / Math.max(g0, .01)));
  return [
    ['Anytime goalscorer', 'Scores at any point in 90 minutes', pGoal],
    ['First goalscorer', 'Scores the first goal of the match', pGoal * .3],
    ['To assist', 'Provides an assist', pAssist],
    ['Score or assist', 'Scores or provides an assist', pEither],
    ['Over 0.5 shots on target', '1+ shots on target', Math.min(.88, 1 - Math.exp(-sot))],
    ['2 or more goals', 'Scores at least twice', pTwo],
    ['To be booked', 'Receives a yellow or red card', book]
  ].map(([market, hint, p]) => ({market, hint, odds: price(Math.max(.02, Math.min(.92, p)))}));
}
function photo(pl, club) {
  if (!pl.image && window.hubieKitArt) return '<span class="pcHubie">' + hubieKitArt(pl, club) + '</span>';
  return pl.image ? '<img src="' + E(pl.image) + '" alt="">' :
    '<span class="pcKit" style="--club:' + (club.color || '#4a7a80') + '"><b>' + E(pl.jersey || '') + '</b></span>';
}
function cardHtml() {
  const {i, side, k} = open, e = events[i], team = footballClub(e[side]), club = footballPlayers[team], pl = club.players[k];
  const apps = Math.round(pl.appearances || 0), goals = Math.round(pl.goals || 0), assists = Math.round(pl.assists || 0);
  const perGame = apps ? ((goals + assists) / apps).toFixed(2) : '0.00';
  const fixture = e[0] + ' v ' + e[1];
  const rows = markets(pl).map(m => {
    const key = 'pp:' + i + ':' + pl.id + ':' + m.market, chosen = slip?.key === key;
    return '<div class="pcBet"><div><b>' + E(m.market) + '</b><small>' + E(m.hint) + '</small></div>' +
      '<button class="pcOdds" aria-pressed="' + chosen + '" aria-label="' + E(pl.name + ' ' + m.market + ' at ' + m.odds) + '" ' +
      'onclick="pickPlayerBet(' + i + ',' + side + ',' + k + ',' + JSON.stringify(m.market).replace(/"/g, '&quot;') + ')">' + m.odds + '</button></div>';
  }).join('');
  const others = club.players.map((p, n) => '<button class="pcSwitch" aria-pressed="' + (n === k) + '" onclick="openPlayerCard(' + i + ',' + side + ',' + n + ')">' + E(p.name.split(' ').slice(-1)[0]) + '</button>').join('');
  return '<header class="pcHead" style="--club:' + (club.color || '#4a7a80') + '"><div class="pcPhoto">' + photo(pl, club) + '</div>' +
    '<div class="pcWho"><small>' + E(team) + '</small><h2>' + E(pl.name) + '</h2><p>' + (pl.jersey ? '#' + E(pl.jersey) + ' · ' : '') + E(POS[pl.position] || 'Player') + '</p>' +
    '<div class="pcSwitches" role="group" aria-label="' + E(team) + ' featured players">' + others + '</div></div>' +
    '<button class="pcClose" aria-label="Close player card" onclick="closePlayerCard()">×</button></header>' +
    '<section class="pcStats" aria-label="2026/27 season"><h3>2026/27 season</h3><div>' +
    [['Apps', apps], ['Goals', goals], ['Assists', assists], ['G+A / game', perGame]].map(([l, v]) => '<p><b>' + v + '</b><small>' + l + '</small></p>').join('') + '</div></section>' +
    '<section class="pcBets"><h3>Player bets <small>' + E(fixture) + ' · ' + (e[3] ? 'Live' : 'Today ' + E(e[4])) + '</small></h3>' + rows +
    '<p class="pcNote">Singles only · fictional players · demo odds and stats · 18+ · Bet responsibly</p></section>';
}
window.playerBetMarkets = markets;  // used by the match page Players tab (match-polish.js)
window.openPlayerCard = function(i, side, k) {
  const team = footballClub(events[i][side]);
  if (!footballPlayers[team]?.players?.[k]) return;
  open = {i, side, k};
  let d = document.getElementById('playerCard');
  if (!d) {
    d = document.createElement('dialog');
    d.id = 'playerCard';
    d.addEventListener('click', ev => { if (ev.target === d) d.close(); });
    d.addEventListener('close', () => { open = null; });
    document.body.appendChild(d);
  }
  d.setAttribute('aria-label', footballPlayers[team].players[k].name + ' player card');
  d.innerHTML = cardHtml();
  if (!d.open) d.showModal();
};
window.closePlayerCard = () => document.getElementById('playerCard')?.close();
window.pickPlayerBet = function(i, side, k, market) {
  const team = footballClub(events[i][side]), pl = footballPlayers[team].players[k], m = markets(pl).find(x => x.market === market);
  betaSetSlip({key: 'pp:' + i + ':' + pl.id + ':' + market, id: i, fixtureId: feedEvents.get(events[i])?.id, g: 0, market: market + ' · Player',
    name: pl.name + ' · ' + market, fixture: events[i].slice(0, 2).join(' v '), price: Number(m.odds), player: pl.name});
  closePlayerCard();
  if (matchMedia('(max-width:750px)').matches) { sheet = true; render(); }
  else if (!desktopSlip) openDeskSlip();
};
// Tap a photo/kit on any fixture card or the match page: open the card for whoever is showing.
document.addEventListener('click', ev => {
  const frame = ev.target.closest?.('.footballRoster[data-turn]');
  if (!frame) return;
  ev.preventDefault();
  ev.stopPropagation();
  const [i, side] = frame.dataset.turn.split('-').map(Number);
  const layers = [...frame.querySelectorAll('.portraitLayer')];
  const k = Math.max(0, layers.findIndex(l => l.classList.contains('shown')));
  openPlayerCard(i, side, k);
}, true);
// Keyboard: photos become focusable buttons
const markFrames = () => document.querySelectorAll('.footballRoster[data-turn]:not([role])').forEach(f => {
  f.setAttribute('role', 'button'); f.setAttribute('tabindex', '0');
  f.setAttribute('aria-label', 'View player stats and bets for ' + (f.getAttribute('aria-label') || 'this team'));
});
document.addEventListener('keydown', ev => {
  if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches?.('.footballRoster[data-turn]')) { ev.preventDefault(); ev.target.click(); }
});
const renderBeforeCard = render;
render = function() { renderBeforeCard(); markFrames(); if (open) { const d = document.getElementById('playerCard'); if (d?.open) d.innerHTML = cardHtml(); } };
window.render = render;
render();
}
