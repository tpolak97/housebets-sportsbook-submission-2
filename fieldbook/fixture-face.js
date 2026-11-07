'use strict';
/* Beta v2: livelier fixture lists and match-page fixture strip.
   - Fixture rows (Live now, Upcoming events, competitions) become a small scoreboard: big crest + name for each side,
     the score (or VS and kickoff) between them, with the live clock above and the 1x2 prices below.
   - Group headers get a sport mark and a pulsing LIVE / clock mark.
   - The match page's "other fixtures" strip becomes chips with both crests, short names, live score or kickoff time.
   Crests are the drawn club shields (club-shields.js), not official logos. */
{
const SPORT_MARK = {Football: '⚽', Tennis: '🎾', Basketball: '🏀', 'Ice Hockey': '🏒', 'American Football': '🏈', Baseball: '⚾', Cricket: '🏏',
  Volleyball: '🏐', Handball: '🤾', Rugby: '🏉', 'Rugby Union': '🏉', 'Rugby League': '🏉', 'Australian Football': '🏉', Boxing: '🥊', 'Mixed Martial Arts': '🥊',
  'Formula 1': '🏎️', 'Motor Racing': '🏎️', Darts: '🎯', Golf: '⛳', 'Table Tennis': '🏓', Badminton: '🏸', 'Horse Racing': '🏇'};
const scoreOf = e => (e[3] ? String(e[4]).match(/^(\d+)\s*[–-]\s*(\d+)$/) : null);
const crest = (i, k, size) => {
  const e = events[i];
  if (sportOf(e) === 'Football' && window.clubShield) { const s = clubShield(footballClub(e[k]), size); if (s) return s; }
  return '<span class="ffPennant">' + badgeFor(i, k) + '</span>';
};
const kickoff = e => { const m = String(e[4]).match(/\d{1,2}:\d{2}/); return m ? m[0] : E(e[4]); };

flightRow = function(i) {
  const e = events[i], live = !!e[3], score = scoreOf(e);
  const team = k => '<span class="ffTeam' + (k ? ' ffAway' : '') + '">' + crest(i, k, 'lg') + '<b title="' + E(e[k]) + '">' + E(e[k]) + '</b></span>';
  const mid = score ? '<span class="ffMid ffScore"><em>' + score[1] + '</em><i>:</i><em>' + score[2] + '</em></span>'
    : live ? '<span class="ffMid ffScore"><small>' + E(e[4]) + '</small></span>'
    : '<span class="ffMid"><i class="ffVs">VS</i><small>' + kickoff(e) + '</small></span>';
  const saved = favs.includes(favoriteKey(i));
  const star = '<button class="fixtureStar" aria-label="' + (saved ? 'Unsave' : 'Save') + ' fixture" aria-pressed="' + saved + '" onclick="' +
    E('follow(' + JSON.stringify(favoriteKey(i)) + ')') + '">' + (saved ? '★' : '☆') + '</button>';
  return '<article class="fixtureRow ffRow' + (live ? ' ffLive' : '') + '" data-shields="1"><a href="' + href('match', i) + '">' +
    '<span class="ffTop"><span class="ffSport" aria-hidden="true">' + (SPORT_MARK[sportOf(e)] || '🏅') + '</span>' + clock(e) + '</span>' +
    '<span class="ffFace">' + team(0) + mid + team(1) + '</span></a>' + prices(i) + star + '</article>';
};

fixtureGroup = function(label, ids, competition = false) {
  if (!ids.length) return '';
  const sport = sportOf(events[ids[0]]), liveGroup = /live/i.test(label), soonGroup = /upcoming|soon|kickoff/i.test(label);
  const mark = liveGroup ? '<span class="ffLiveMark" aria-hidden="true"><i></i></span>'
    : soonGroup ? '<span class="ffClockMark" aria-hidden="true">🕒</span>'
    : '<span class="ffSportMark" aria-hidden="true">' + (SPORT_MARK[sport] || '🏅') + '</span>';
  const follow = competition ? btn(favs.includes(label) ? '★ Following' : '☆ Follow', 'follow(' + JSON.stringify(label) + ')') : '';
  const count = '<span class="ffCount' + (liveGroup ? ' ffCountLive' : '') + '">' + ids.length + (liveGroup ? ' live' : ids.length === 1 ? ' match' : ' matches') + '</span>';
  return '<section class="fixtureGroup ffGroup' + (liveGroup ? ' ffGroupLive' : '') + '"><header><h2>' + mark + E(label) + '</h2>' + follow + count +
    '<small>Match result</small></header>' + ids.map(flightRow).join('') + '</section>';
};

// Match page: rebuild the other-fixtures strip as crest chips after each render.
const stripChip = a => {
  const i = +a.getAttribute('href').split('/').pop(), e = events[i];
  if (!e) return;
  const score = scoreOf(e), live = !!e[3];
  const short = k => E(String(e[k]).replace(/ & Hove Albion$/, ''));  // full names; CSS trims with an ellipsis
  a.classList.add('ffChip'); if (live) a.classList.add('ffChipLive');
  a.innerHTML = '<span class="ffChipHead">' + (live ? '<i class="ffDot"></i>LIVE' : 'Kickoff ' + kickoff(e)) +
    '<span>' + E(leagues[e[2]] || '') + '</span></span>' +
    '<span class="ffChipRow">' + crest(i, 0, 'sm') + '<b>' + short(0) + '</b>' + (score ? '<em>' + score[1] + '</em>' : '') + '</span>' +
    '<span class="ffChipRow">' + crest(i, 1, 'sm') + '<b>' + short(1) + '</b>' + (score ? '<em>' + score[2] + '</em>' : '') + '</span>';
};
const renderBefore = render;
render = function() {
  renderBefore();
  document.querySelectorAll('.fixtureStrip a[href*="/match/"]:not(.ffChip)').forEach(stripChip);
  const act = document.querySelector('.fixtureStrip a.active'), strip = act?.parentElement;
  if (act && strip.dataset.ff !== act.getAttribute('href')) { strip.dataset.ff = act.getAttribute('href'); strip.scrollLeft = act.offsetLeft - (strip.clientWidth - act.offsetWidth) / 2; }
};
window.render = render;
}
