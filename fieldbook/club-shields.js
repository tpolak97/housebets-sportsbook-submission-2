'use strict';
/* Club shields for football fixtures: drawn in each club's kit colours with its short code.
   (Not official crests: those are the clubs' trademarks and would need licensing.) */
{
const FIX = {'Bayern Munich': 'BAY', 'Borussia Dortmund': 'BVB', 'Paris Saint-Germain': 'PSG', 'Manchester United': 'MUN', 'Manchester City': 'MCI', 'Internazionale': 'INT',
  'AC Milan': 'MIL', 'Atlético Madrid': 'ATM', 'Real Madrid': 'RMA', 'Barcelona': 'BAR', 'Bayer Leverkusen': 'B04', 'RB Leipzig': 'RBL'};
// Standard sportsbook short names, used only where card space is tight (full name stays in the tooltip and lists).
const SHORT = {'Internazionale': 'Inter', 'Borussia Mönchengladbach': "M'gladbach", 'Nottingham Forest': "Nott'm Forest", 'AFC Bournemouth': 'Bourne­mouth',
  'Brighton & Hove Albion': 'Brighton', 'Paris Saint-Germain': 'PSG', 'Wolverhampton Wanderers': 'Wolves', 'Tottenham Hotspur': 'Tottenham', 'Feyenoord Rotterdam': 'Feyenoord',
  'Borussia Dortmund': 'Dortmund', 'Eintracht Frankfurt': 'Frankfurt', 'TSG Hoffenheim': 'Hoffenheim', '1. FC Union Berlin': 'Union Berlin', 'Shakhtar Donetsk': 'Shakhtar'};
const lum = hex => { const n = parseInt(hex.slice(1), 16), c = [n >> 16, n >> 8 & 255, n & 255].map(v => { v /= 255; return v <= .04 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const shade = (hex, k) => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.substr(i, 2), 16) * (1 - k)).toString(16).padStart(2, '0')).join('');
let uid = 0;
window.clubShield = function(team, size = 'md') {
  const b = window.clubBadges?.[team];
  if (!b) return '';
  const code = FIX[team] || b.abbr || team.slice(0, 3).toUpperCase();
  let main = /^#[0-9a-f]{6}$/i.test(b.color) ? b.color : '#2b5960', alt = /^#[0-9a-f]{6}$/i.test(b.alt) ? b.alt : '#ffffff';
  if (Math.abs(lum(main) - lum(alt)) < .08) alt = lum(main) > .4 ? '#10252b' : '#ffffff';
  const ink = lum(main) > .45 ? '#10252b' : '#ffffff', id = 'cs' + (uid++);
  return '<svg class="clubShield ' + size + '" viewBox="0 0 24 28" role="img" aria-label="' + E(team) + '">' +
    '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>' +
    '<clipPath id="' + id + 'c"><path d="M12 1.2 22.4 4.4v9.2c0 7.2-4.7 11.4-10.4 13.9C6.3 25 1.6 20.8 1.6 13.6V4.4z"/></clipPath></defs>' +
    '<path d="M12 1.2 22.4 4.4v9.2c0 7.2-4.7 11.4-10.4 13.9C6.3 25 1.6 20.8 1.6 13.6V4.4z" fill="' + main + '"/>' +
    '<g clip-path="url(#' + id + 'c)"><path d="M-2 22 26 4v6L-2 28z" fill="' + alt + '" opacity=".9"/><rect width="24" height="28" fill="url(#' + id + ')"/></g>' +
    '<path d="M12 1.2 22.4 4.4v9.2c0 7.2-4.7 11.4-10.4 13.9C6.3 25 1.6 20.8 1.6 13.6V4.4z" fill="none" stroke="' + shade(main, .45) + '" stroke-width="1.1"/>' +
    '<text x="12" y="15.6" text-anchor="middle" font-family="Bahnschrift,Segoe UI,sans-serif" font-weight="800" font-size="' + (code.length > 3 ? 5.4 : 6.6) + '" fill="' + ink + '" stroke="' + (ink === '#ffffff' ? shade(main, .55) : '#ffffff') + '" stroke-width=".5" paint-order="stroke">' + E(code) + '</text></svg>';
};
const badgeBefore = badgeFor;
badgeFor = function(i, k) {
  const e = events[i];
  if (e && sportOf(e) === 'Football') { const s = clubShield(footballClub(e[k])); if (s) return s; }
  return badgeBefore(i, k);
};
// Fixture rows build their own lettered pennants; swap those for shields on football rows after each render.
const renderBeforeShields = render;
render = function() {
  renderBeforeShields();
  document.querySelectorAll('.fixtureRow').forEach(rowEl => {
    const a = rowEl.querySelector('a[href^="#6/match/"]');
    if (!a || rowEl.dataset.shields) return;
    const e = events[+a.getAttribute('href').split('/').pop()];
    if (!e || sportOf(e) !== 'Football') return;
    rowEl.querySelectorAll('i.pennant').forEach((p, side) => { const s = clubShield(footballClub(e[side]), 'sm'); if (s) p.outerHTML = s; });
    rowEl.dataset.shields = '1';
  });
  // Football page match cards and home featured cards: a shield beside each club name.
  const tag = (card, link, sides) => {
    if (card.dataset.shields) return;
    const a = card.querySelector(link), e = a && events[+a.getAttribute('href').split('/').pop()];
    if (!e || sportOf(e) !== 'Football') return;
    card.querySelectorAll(sides).forEach((name, side) => {
      if (name.querySelector('.clubShield')) return;  // featured cards already carry one (badgeFor)
      const full = footballClub(e[side]), short = SHORT[full];
      if (short) { name.title = full; name.textContent = short; }
      const sh = clubShield(full, 'sm'); if (sh) name.insertAdjacentHTML('afterbegin', sh);
    });
    card.dataset.shields = '1';
  };
  document.querySelectorAll('.footballMatchCard').forEach(c => tag(c, 'a[href*="/match/"]', '.footballCardSide>b'));
  document.querySelectorAll('.snapCard').forEach(c => tag(c, 'a.snapTeams', '.snapTeams>span>b'));
  // The match page's 'other fixtures' strip reads raw events; keep only fixtures Beta actually lists.
  document.querySelectorAll('.fixtureStrip a[href*="/match/"]').forEach(a => { if (!all.includes(+a.getAttribute('href').split('/').pop())) a.remove(); });
  // Match page header: shields above each club name
  const head = document.querySelector('.flightScore');
  if (head && !head.dataset.shields && p === 'match' && events[id] && sportOf(events[id]) === 'Football') {
    head.querySelectorAll('.scoreSide').forEach((side, k) => {
      const nm = [...side.querySelectorAll('b')].pop();
      const sh = clubShield(footballClub(events[id][k]), 'md');
      if (nm && sh) nm.insertAdjacentHTML('beforebegin', '<span class="scoreShield">' + sh + '</span>');
    });
    head.dataset.shields = '1';
  }
};
window.render = render;
render();
}
