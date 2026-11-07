'use strict';
/* Beta v2: featured players are shown as Hubie wearing the club's colours with the player's shirt number,
   instead of real photos. Three painted poses (Gemini, assets/generated/hubie-kit-sheet.png) are cut by
   portrait-worker/cut-hubie-kits.py into an art layer, a grey kit-shading layer, shirt/shorts/socks masks and a
   loose ball. Each kit part is filled with its own colour (the shirt can carry a generic pattern in the club's two
   colours), then the shading is multiplied back on so folds and shadows survive.
   Fixture cards and the match header show no players: each side is one side-on Hubie in its team's kit (five poses
   from cut-hubie-side.py), facing the other, and the two play a loop across the card (chest it down, juggle, kick
   across, then the other way). hubieKitArt() still draws
   a single posed player for the player card. Loops run only with the Animations switch on and while on screen
   (styles in hubie-kits.css). Kits are generic: plain shirts, stripes, hoops, halves, a sash or a chest band in club
   colours. No crests, sponsors, maker logos or copies of real kit designs. */
{
const G = 'assets/generated/hubie-kit-';
const META = {striker: {w: 340, h: 445, chest: [.446, .458], shirtWidth: .365, ball: [244, 285, 91, 91]},
  juggler: {w: 286, h: 469, chest: [.568, .459], shirtWidth: .413, ball: [6, 85, 90, 90]},
  keeper: {w: 355, h: 427, chest: [.522, .485], shirtWidth: .324}};
const POSE = {F: 'striker', M: 'juggler', D: 'striker', G: 'keeper'};
const WHITE = '#ffffff', BLACK = '#151a1e';
// Clubs whose colours are usually worn as a pattern or with different shorts/socks. a = shirt base, b = second colour.
// Anything not listed uses its colours from club-badges.js with the default rule in kitFor().
const KITS = {
  'Arsenal': {shorts: WHITE, sleeves: WHITE, trim: '#1b2a5a'},
  'Manchester City': {shorts: WHITE},
  'Manchester United': {shorts: WHITE, socks: BLACK},
  'Chelsea': {socks: WHITE},
  'Liverpool': {shorts: '#c8102e'},
  'Tottenham Hotspur': {shorts: '#0b1426'},
  'Everton': {shorts: WHITE},
  'Aston Villa': {a: '#670e36', shorts: WHITE, sleeves: '#95bfe5', trim: '#95bfe5'},
  'Fulham': {shorts: BLACK},
  'Leeds United': {shorts: WHITE},
  'Nottingham Forest': {shorts: WHITE},
  'Newcastle United': {pattern: 'stripes', a: BLACK, b: WHITE, shorts: BLACK},
  'Brentford': {pattern: 'stripes', a: '#e30613', b: WHITE, shorts: BLACK},
  'Sunderland': {pattern: 'stripes', a: '#eb172b', b: WHITE, shorts: BLACK},
  'Crystal Palace': {pattern: 'stripes', a: '#1b458f', b: '#c4122e', shorts: '#1b458f'},
  'Barcelona': {pattern: 'stripes', a: '#a50044', b: '#004d98', shorts: '#004d98'},
  'Atlético Madrid': {pattern: 'stripes', a: '#ca3624', b: WHITE, shorts: '#272e61'},
  'Athletic Club': {pattern: 'stripes', a: '#c8142f', b: WHITE, shorts: BLACK, socks: BLACK},
  'Real Betis': {pattern: 'stripes', a: '#0bb363', b: WHITE, shorts: '#0bb363'},
  'Real Sociedad': {pattern: 'stripes', a: '#0067b1', b: WHITE, shorts: WHITE},
  'Deportivo': {pattern: 'stripes', a: '#3366cc', b: WHITE, shorts: '#3366cc'},
  'Espanyol': {pattern: 'stripes', a: '#007fc8', b: WHITE, shorts: '#007fc8'},
  'Levante': {pattern: 'stripes', a: '#004b9d', b: '#c8142f', shorts: '#004b9d'},
  'Málaga': {pattern: 'stripes', a: '#6cb4e4', b: WHITE, shorts: WHITE},
  'Rayo Vallecano': {pattern: 'sash', a: WHITE, b: '#e53027', shorts: WHITE},
  'Elche': {pattern: 'band', a: WHITE, b: '#288a00', shorts: WHITE},
  'Internazionale': {pattern: 'stripes', a: '#0050a5', b: BLACK, shorts: BLACK},
  'AC Milan': {pattern: 'stripes', a: '#e4002b', b: BLACK, shorts: WHITE, socks: BLACK},
  'Juventus': {pattern: 'stripes', a: WHITE, b: BLACK, shorts: WHITE},
  'Atalanta': {pattern: 'stripes', a: '#1157bf', b: BLACK, shorts: BLACK},
  'Udinese': {pattern: 'stripes', a: WHITE, b: BLACK, shorts: BLACK},
  'Bologna': {pattern: 'stripes', a: '#a21c26', b: '#1a2f48', shorts: WHITE},
  'Lecce': {pattern: 'stripes', a: '#fced0b', b: '#d71920', shorts: '#d71920'},
  'Genoa': {pattern: 'halves', a: '#a51d2d', b: '#08305d', shorts: '#08305d'},
  'Cagliari': {pattern: 'halves', a: '#a71930', b: '#002350', shorts: '#002350'},
  'Real Madrid': {shorts: WHITE, trim: '#1b2a5a'}, 'Sevilla': {shorts: WHITE}, 'Valencia': {shorts: BLACK},
  'RB Leipzig': {shorts: WHITE}, 'FC Cologne': {shorts: WHITE},
  'Lazio': {shorts: WHITE}, 'Napoli': {shorts: WHITE}, 'AS Roma': {shorts: WHITE},
  'VfB Stuttgart': {pattern: 'band', a: WHITE, b: '#da0308', shorts: WHITE},
  'Club Brugge': {pattern: 'stripes', a: '#0081ff', b: BLACK, shorts: BLACK},
  'Sporting CP': {pattern: 'hoops', a: '#008127', b: WHITE, shorts: BLACK},
  'PSV Eindhoven': {pattern: 'stripes', a: '#ef2f24', b: WHITE, shorts: BLACK},
  'Feyenoord Rotterdam': {pattern: 'halves', a: WHITE, b: '#ef2f24', shorts: BLACK},
  'Galatasaray': {pattern: 'halves', a: '#aa0031', b: '#fdb912', shorts: '#aa0031'},
  'Fenerbahce': {pattern: 'stripes', a: '#ffed00', b: '#002d72', shorts: WHITE},
  'Shakhtar Donetsk': {pattern: 'stripes', a: '#ff5900', b: BLACK, shorts: BLACK},
  'FC Porto': {pattern: 'stripes', a: WHITE, b: '#0044c8', shorts: '#0044c8'},
  'Slavia Prague': {pattern: 'halves', a: WHITE, b: '#dc1f26', shorts: WHITE},
  // National teams (the international friendly): colours only, no federation crests.
  'France': {a: '#1f3a93', b: WHITE, shorts: WHITE, socks: '#d6202f', trim: WHITE},
  'England': {a: WHITE, b: '#1b2a5a', shorts: '#1b2a5a', socks: WHITE, trim: '#1b2a5a'}
};
const hex = c => /^#[0-9a-f]{6}$/i.test(c || '') ? c.toLowerCase() : null;
const lum = c => { const n = parseInt(c.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255].map(v => { v /= 255; return v <= .04 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0); };
const neutral = c => { const l = lum(c), n = parseInt(c.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255; return l > .8 || l < .03 || Math.max(r, g, b) - Math.min(r, g, b) < 24; };
const keeperColour = main => { const yellowish = /^#(f|e|d)[0-9a-f](c|d|e|f|b|a)/i.test(main); return yellowish ? '#2bb673' : '#f2c230'; };
// footballPlayers' club objects carry no name, so find it once to look up club-badges.js and KITS.
let names = null;
const clubName = club => {
  if (!club) return '';
  if (!names) { names = new Map(); for (const [n, c] of Object.entries(window.footballPlayers || (typeof footballPlayers !== 'undefined' ? footballPlayers : {}))) names.set(c, n); }
  return names.get(club) || club.name || '';
};
function kitFor(club, pose, name = clubName(club)) {
  const badge = (window.clubBadges || {})[name] || {}, o = KITS[name] || {};
  const main = hex(o.a) || hex(badge.color) || hex(club?.color) || '#2b5960';
  if (pose === 'keeper') { const k = keeperColour(main); return {shirt: k, shorts: k, socks: k}; }
  const alt = hex(o.b) || hex(badge.alt) || hex(club?.alternateColor);
  // Default shorts: the second colour if it is white, black or grey; otherwise white under a dark shirt, dark under a light one.
  const shorts = hex(o.shorts) || (alt && neutral(alt) && alt !== main ? alt : lum(main) > .5 ? '#1b2a3a' : WHITE);
  // Trim (collar and cuffs): the pattern colour, else the second colour if it stands out from the shirt, else the
  // shorts colour, else white or navy. Sleeves only differ where KITS sets them (e.g. Arsenal's white sleeves).
  const differs = c => c && c !== main && Math.abs(lum(c) - lum(main)) > .12;
  const trim = hex(o.trim) || (o.pattern && alt) || (differs(alt) ? alt : differs(shorts) ? shorts : lum(main) > .5 ? '#1b2a3a' : WHITE);
  return {shirt: main, second: o.pattern ? alt : null, pattern: o.pattern || null, shorts, socks: hex(o.socks) || main,
    sleeves: hex(o.sleeves), trim};
}
function patternSvg(kit, id, m, cx, cy, sw) {
  const b = kit.second, W = m.w, H = m.h;
  if (kit.pattern === 'stripes') {
    const s = sw / 5;  // five stripes across the chest, a base-colour stripe centred under the number
    return {defs: '<pattern id="' + id + 'p" patternUnits="userSpaceOnUse" width="' + (2 * s).toFixed(1) + '" height="' + H + '" x="' + (cx + s / 2).toFixed(1) + '" y="0"><rect width="' + s.toFixed(1) + '" height="' + H + '" fill="' + b + '"/></pattern>',
      fill: 'url(#' + id + 'p)'};
  }
  if (kit.pattern === 'hoops') {
    const s = sw / 4.4;
    return {defs: '<pattern id="' + id + 'p" patternUnits="userSpaceOnUse" width="' + W + '" height="' + (2 * s).toFixed(1) + '" x="0" y="' + (cy + s / 2).toFixed(1) + '"><rect width="' + W + '" height="' + s.toFixed(1) + '" fill="' + b + '"/></pattern>',
      fill: 'url(#' + id + 'p)'};
  }
  const shapes = {halves: '<rect x="' + cx.toFixed(1) + '" width="' + W + '" height="' + H + '"/>',
    sash: '<rect x="' + (cx - W).toFixed(1) + '" y="' + (cy - sw * .14).toFixed(1) + '" width="' + (2 * W) + '" height="' + (sw * .28).toFixed(1) + '" transform="rotate(-38 ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')"/>',
    band: '<rect x="0" y="' + (cy - sw * .37).toFixed(1) + '" width="' + W + '" height="' + (sw * .14).toFixed(1) + '"/>'};
  return shapes[kit.pattern] ? {shape: '<g fill="' + b + '">' + shapes[kit.pattern] + '</g>'} : null;
}
// One posed Hubie in a kit: masks/patterns for <defs>, and the drawing (kit, optional number, fur and hat).
// m.trim: the pose has sleeve and collar/cuff masks (side-on poses only).
function kitLayer(pose, kit, id, num = '', dx = 0, dy = 0, m = META[pose], file = G + pose) {
  const [cx, cy] = [m.chest[0] * m.w, m.chest[1] * m.h], sw = m.shirtWidth * m.w, size = sw * (num.length > 1 ? .5 : .6);
  const pat = kit.pattern && kit.second && kit.second !== kit.shirt ? patternSvg(kit, id, m, cx, cy, sw) : null;
  // Number colour: contrast with the colour under it (a sash crosses the chest), firmer outline on two-colour shirts.
  const under = pat && kit.pattern === 'sash' ? kit.second : kit.shirt;
  const ink = lum(under) > .42 ? '#10252b' : WHITE, edge = ink === WHITE ? '#000a' : '#fffb';
  const img = part => '<image href="' + file + '-' + part + '.webp" width="' + m.w + '" height="' + m.h + '"/>';
  const mask = part => '<mask id="' + id + part + '" style="mask-type:alpha">' + img(part) + '</mask>';
  const fill = (part, f) => '<rect width="' + m.w + '" height="' + m.h + '" fill="' + f + '" mask="url(#' + id + part + ')"/>';
  const extra = m.trim ? (kit.sleeves ? ['sleeves'] : []).concat(kit.trim ? ['trim'] : []) : [];
  return {defs: mask('shirt') + mask('shorts') + mask('socks') + extra.map(mask).join('') + (pat?.defs || ''),
    body: '<g' + (dx || dy ? ' transform="translate(' + dx + ' ' + dy + ')"' : '') + '><g style="isolation:isolate">' +
      fill('shirt', kit.shirt) +
      (pat ? (pat.fill ? fill('shirt', pat.fill) : '<g mask="url(#' + id + 'shirt)">' + pat.shape + '</g>') : '') +
      extra.map(p => fill(p, kit[p])).join('') + fill('shorts', kit.shorts) + fill('socks', kit.socks) +
      '<image href="' + file + '-kit.webp" width="' + m.w + '" height="' + m.h + '" style="mix-blend-mode:multiply"/></g>' +
      crestOnShirt(kit, id, cx, cy, sw) +
      (num ? '<text x="' + cx.toFixed(1) + '" y="' + cy.toFixed(1) + '" dy=".36em" text-anchor="middle" font-family="Bahnschrift,Segoe UI,sans-serif" font-weight="800" font-size="' + size.toFixed(1) +
        '" fill="' + ink + '" stroke="' + edge + '" stroke-width="' + (size * (pat ? .09 : .05)).toFixed(1) + '" paint-order="stroke" opacity=".95">' + E(num) + '</text>' : '') +
      img('art') + '</g>'};
}
// Club crest on the shirt front (side-on poses face right, so the chest front is right of the body centre).
// Masked to the shirt; on the mirrored away side it is flipped back so it reads the right way round.
// Set kit.crest = image URL (duelSide does, from club-crests.js); CREST tunes size and placement.
const CREST = {size: .26, dx: .2, dy: .1};
function crestOnShirt(kit, id, cx, cy, sw) {
  if (!kit.crest) return '';
  const w = sw * CREST.size, x = cx + sw * CREST.dx - w / 2, y = cy + sw * CREST.dy;
  const flip = kit.crestFlip ? ' transform="translate(' + (2 * (x + w / 2)).toFixed(1) + ' 0) scale(-1 1)"' : '';
  return '<g mask="url(#' + id + 'shirt)"><g' + flip + '><image class="hkCrest" href="' + E(kit.crest) + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
    '" width="' + w.toFixed(1) + '" height="' + w.toFixed(1) + '" preserveAspectRatio="xMidYMid meet"/></g></g>';
}
let uid = 0;
window.hubieKitArt = function(player, club, cls = '') {
  const pose = POSE[player.position] || 'juggler', m = META[pose], kit = kitFor(club, pose);
  const id = 'hk' + (uid++), layer = kitLayer(pose, kit, id, String(player.jersey || '').slice(0, 2));
  const [cx, cy] = [m.chest[0] * m.w, m.chest[1] * m.h];
  const ballBox = m.ball || [cx - 38, cy - 38, 76, 76];  // the keeper borrows the juggler's ball for the save
  const ballSrc = G + (m.ball ? pose : 'juggler') + '-ball.webp';
  return '<svg class="footballKit hubieKit hk-' + pose + ' ' + cls + '" viewBox="0 0 ' + m.w + ' ' + m.h + '" preserveAspectRatio="xMidYMax meet" aria-hidden="true" style="--kd:' + (-Math.random() * 3).toFixed(2) + 's">' +
    '<defs>' + layer.defs + '</defs><g class="hkBody">' + layer.body + '</g>' +
    '<image class="hkBall" href="' + ballSrc + '" x="' + ballBox[0] + '" y="' + ballBox[1] + '" width="' + ballBox[2] + '" height="' + ballBox[3] + '"/></svg>';
};

/* Fixture duel. Each side is a 420 x 470 box holding five side-on poses (cut-hubie-side.py, hubie-side.json),
   stacked with their body centres on x = 190 and feet on the bottom edge, all facing right. The away side is
   mirrored so the two face each other. Only one pose shows at a time (hubie-kits.css hkd-* keyframes). The shared
   ball is an overlay on the element holding both sides, moved between points measured on the drawings. */
const SIDE = {trap: {w: 386, h: 452, cx: 194.6}, juggle: {w: 247, h: 467, cx: 100.6}, strike: {w: 318, h: 455, cx: 137.5},
  follow: {w: 367, h: 457, cx: 160.4}, ready: {w: 248, h: 443, cx: 116.3}};
const DUEL = {w: 420, h: 470, cx: 190, ball: 80, juggle: 95, arc: 120};
const sideAt = (pose, x, y) => [x + DUEL.cx - SIDE[pose].cx, y + DUEL.h - SIDE[pose].h];
// Ball centres: on the chest as it arrives (trap), on top of the raised knee (juggle), at the boot as it is struck.
DUEL.chest = sideAt('trap', 296, 212);  // on the shirt front, so the ball visibly lands on the chest
DUEL.knee = sideAt('juggle', 203, 222);
DUEL.strike = sideAt('strike', 332, 348);
function duelSide(team, club, side, key) {
  const kit = kitFor(club, 'juggler', team), id = 'hd' + (uid++);
  kit.crest = window.clubCrests?.[team] || ''; kit.crestFlip = side === 1;
  const poses = Object.entries(SIDE).map(([pose, s]) => {
    const m = {w: s.w, h: s.h, chest: [s.cx / s.w, .45], shirtWidth: 135 / s.w, trim: true};
    const [dx, dy] = sideAt(pose, 0, 0).map(v => +v.toFixed(1));
    return [pose, kitLayer(pose, kit, id + pose[0], '', dx, dy, m, 'assets/generated/hubie-side-' + pose)];
  });
  return '<svg class="footballKit hubieKit hkDuel hkSide' + side + '" data-duel="' + key + '" data-side="' + side + '" viewBox="0 0 ' + DUEL.w + ' ' + DUEL.h +
    '" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs>' + poses.map(p => p[1].defs).join('') + '</defs>' +
    '<g class="hkBody">' + poses.map(([pose, l]) => '<g class="hkPose hkPose-' + pose + '">' + l.body + '</g>').join('') + '</g></svg>';
}
// Beta v2 shows teams, not players: no names, numbers, rotation or player card on the fixture art.
teamVisual = function(i, side) {
  if (sportOf(events[i]) !== 'Football') return footballPreviousVisual(i, side);
  const team = footballClub(events[i][side]), club = footballPlayers[team], badge = (window.clubBadges || {})[team];
  if (!club && !badge && !KITS[team]) return footballPreviousVisual(i, side);
  const colour = hex(KITS[team]?.a) || hex(badge?.color) || hex(club?.color) || '#4a7a80';
  return '<span class="rosterPortrait footballRoster hkDuelFrame" style="--club:' + colour + '" aria-label="' + E(team) + ' kit"><span class="portraitLayer shown" aria-hidden="true">' +
    duelSide(team, club, side, i) + '</span></span>';
};
const place = box => {
  const c = box.getBoundingClientRect(), ball = box.querySelector(':scope > .hkDuelBall'), v = {};
  if (!ball) return;
  for (const svg of box.querySelectorAll('svg.hkDuel[data-duel="' + ball.dataset.duel + '"]')) {
    const r = svg.getBoundingClientRect(), side = svg.dataset.side === '1' ? 'a' : 'h';
    if (!r.width) return;
    const k = Math.min(r.width / DUEL.w, r.height / DUEL.h);
    const ox = r.left + (r.width - DUEL.w * k) / 2 - c.left - box.clientLeft, oy = r.top + r.height - DUEL.h * k - c.top - box.clientTop;
    const pt = ([x, y]) => [ox + (side === 'a' ? DUEL.w - x : x) * k, oy + y * k];
    [['k', DUEL.knee], ['c', DUEL.chest], ['s', DUEL.strike]].forEach(([n, p]) => { const [x, y] = pt(p); v[side + n + 'x'] = x; v[side + n + 'y'] = y; });
    v[side + 'scale'] = k;
  }
  if (v.hscale == null || v.ascale == null) return;
  const k = (v.hscale + v.ascale) / 2;
  v.bs = DUEL.ball * k; v.jh = DUEL.juggle * k; v.fy = Math.min(v.hcy, v.acy) - DUEL.arc * k;
  for (const [n, x] of Object.entries(v)) if (n !== 'hscale' && n !== 'ascale') ball.style.setProperty('--' + n, x.toFixed(1) + 'px');
};
// Animate only what is on screen; hubie-kits.css plays the loops on .hkLive (single kits) and .hkDuelLive (duels).
const live = cls => 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle(cls, e.isIntersecting)), {rootMargin: '40px'}) : null;
const io = live('hkLive');
// Duels on the match page header always play, on the page clock (startTime 0), so a header that is re-rendered
// (switching market tabs, odds updates) or scrolled back into view carries on mid-loop instead of starting over.
// Duels on fixture cards stand still (both ready, ball at the home feet) and play from the kick while the card is
// hovered; leaving the card puts them back at rest.
const sync = box => box.classList.contains('hkAlways') && box.getAnimations({subtree: true}).forEach(a => { if (a.startTime !== 0) a.startTime = 0; });
const duelIo = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
  e.target.classList.toggle('hkDuelLive', e.isIntersecting);
  if (e.isIntersecting) sync(e.target);
}), {rootMargin: '40px'}) : null;
// Turning the Animations switch on starts the loops; put them on the page clock too.
new MutationObserver(() => document.querySelectorAll('.hkDuelBox.hkDuelLive').forEach(sync)).observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
const sizer = 'ResizeObserver' in window ? new ResizeObserver(es => es.forEach(e => place(e.target))) : null;
let queued = false;
const watch = () => {
  queued = false;
  document.querySelectorAll('svg.hubieKit:not(.hkDuel):not([data-hk])').forEach(s => { s.dataset.hk = 1; io ? io.observe(s) : s.classList.add('hkLive'); });
  document.querySelectorAll('svg.hkDuel[data-side="0"]:not([data-hk])').forEach(s => {
    s.dataset.hk = 1;
    let box = s.parentElement;
    while (box && !box.querySelector('svg.hkDuel[data-side="1"][data-duel="' + s.dataset.duel + '"]')) box = box.parentElement;
    if (!box || box === document.body) return;
    if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
    box.classList.add('hkDuelBox');
    box.insertAdjacentHTML('beforeend', '<span class="hkDuelBall" data-duel="' + s.dataset.duel + '" aria-hidden="true"><span class="hkdX"><span class="hkdY"><img class="hkdSpin" alt="" src="' + G + 'juggler-ball.webp"></span></span></span>');
    place(box);
    sizer?.observe(box);
    const card = box.closest('.snapCard, .footballMatchCard');
    if (card) {
      box.style.setProperty('--hk0', '-1.57s');  // start at the kick (29% of the 5.4 s loop)
      const on = () => box.classList.add('hkPlay'), off = () => box.classList.remove('hkPlay');
      card.addEventListener('mouseenter', on); card.addEventListener('mouseleave', off);
      if (card.matches(':hover') && !matchMedia('(hover: none), (pointer: coarse)').matches) on();  // phones keep a sticky :hover after a tap; phone-play.js decides there
    } else box.classList.add('hkPlay', 'hkAlways');
    duelIo ? duelIo.observe(box) : (box.classList.add('hkDuelLive'), sync(box));
    // Already on screen: play now (the observer reports a frame later, which showed a frozen duel after each redraw).
    const r = box.getBoundingClientRect();
    if (r.bottom > -40 && r.top < innerHeight + 40) { box.classList.add('hkDuelLive'); sync(box); }
  });
};
window.hkWatchNow = watch;  // anim-keep.js runs this right after every render
new MutationObserver(() => { if (!queued) { queued = true; setTimeout(watch, 30); } }).observe(document.body, {childList: true, subtree: true});
addEventListener('load', () => document.querySelectorAll('.hkDuelBox').forEach(place));
// Photos are switched off in beta-config.js; anything still calling footballKit() gets a posed Hubie.
footballKit = (player, club) => hubieKitArt(player, club);
render();
watch();
}
