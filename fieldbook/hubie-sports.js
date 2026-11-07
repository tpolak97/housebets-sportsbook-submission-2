'use strict';
/* Beta v2: Hubie duels for sports other than football.
   Each side of a fixture card (and the match header) is a side-on Hubie in that sport's outfit, coloured from the
   team's pennant colour. The away side is mirrored so the two face each other. One script per sport (SPECS) says
   which pose each Hubie holds through a loop and where the ball goes. The script covers the home Hubie's turn; the
   away turn is the same, half a loop later and mirrored, so they take turns. Poses come from
   portrait-worker/cut-hubie-sport.py (assets/generated/sport, sizes and outlines in hubie-sports-meta.js).
   Everything runs on the page clock, so a redrawn card carries on mid-loop. Motion follows the Animations switch
   and only cards on screen are animated. */
{
const META = window.HUBIE_SPORTS || {};
const DIR = 'assets/generated/sport/hubie-';
const KEY = {'Tennis': 'tennis', 'Table Tennis': 'tabletennis', 'Badminton': 'badminton', 'Basketball': 'basketball',
  'Volleyball': 'volleyball', 'Handball': 'handball', 'American Football': 'americanfootball', 'Rugby': 'rugby',
  'Aussie Rules': 'aussierules', 'Baseball': 'baseball', 'Cricket': 'cricket', 'Ice Hockey': 'icehockey', 'Boxing': 'boxing',
  'MMA': 'boxing', 'Darts': 'darts', 'Golf': 'golf', 'Formula 1': 'racing', 'Motor Racing': 'racing', 'Horse Racing': 'horseracing'};
const BOX = {w: 420, h: 470, cx: 190};  // each side: poses stacked with body centres on x = cx and feet on the bottom

/* Points. {pose, y, dx}: on the pose's right edge at height y (0 top, 1 feet), dx ball widths further out.
   {ground: point}: on the floor under another point. {off: [x, y]}: a spot on the card, as fractions of its size. */
const at = (pose, y, dx = .55) => ({pose, y, dx});
// Scripts, home turn only. poses: [loop fraction, pose] for the home Hubie over the whole loop. ball: [from, to,
// start, end, options]; side 'h' is the home Hubie, 'a' the away one. arc: how high the ball rises (box units);
// bounce: where along the flight it hits the floor; hold: the ball stays at `from`; dribble: bounces to the floor.
const SPECS = {
  tennis: {period: 3.2, kind: 'tennis',
    poses: [[0, 'hit'], [.07, 'follow'], [.22, 'ready'], [.84, 'windup'], [.97, 'hit']],
    ball: [['h', at('hit', .58), 'a', at('hit', .58), 0, .5, {arc: 150, bounce: .74}]]},  // high over the net, bounces on the far side
  tabletennis: {period: 2.4, kind: 'pingpong',
    poses: [[0, 'hit'], [.07, 'follow'], [.24, 'ready'], [.82, 'windup'], [.96, 'hit']],
    ball: [['h', at('hit', .5), 'a', at('hit', .5), 0, .5, {arc: 90, bounce: .7}]]},
  badminton: {period: 3.4, kind: 'shuttle',
    poses: [[0, 'smash'], [.08, 'follow'], [.22, 'ready'], [.8, 'windup'], [.96, 'smash']],
    ball: [['h', at('smash', .02, .3), 'a', at('smash', .02, .3), 0, .5, {arc: 120}]]},
  volleyball: {period: 4.4, kind: 'volleyball',
    poses: [[0, 'bump'], [.07, 'ready'], [.12, 'set'], [.18, 'ready'], [.25, 'spike'], [.34, 'land'], [.44, 'ready'], [.96, 'bump']],
    ball: [['h', at('bump', .6), 'h', at('set', .02, -1.2), 0, .12, {arc: 70}],
           ['h', at('set', .02, -1.2), 'h', at('spike', .02, .1), .12, .25, {arc: 50}],
           ['h', at('spike', .02, .1), 'a', at('bump', .6), .25, .5, {arc: 40}]]},
  basketball: {period: 4.2, kind: 'basketball',
    poses: [[0, 'catch'], [.07, 'dribble'], [.24, 'pass'], [.34, 'defend'], [.95, 'catch']],
    ball: [['h', at('catch', .42), 'h', at('dribble', .62, .2), 0, .07, {}],
           ['h', at('dribble', .62, .2), null, null, .07, .22, {dribble: 2}],
           ['h', at('dribble', .62, .2), 'h', at('pass', .42), .22, .26, {}],
           ['h', at('pass', .42), 'a', at('catch', .42), .26, .5, {arc: 30}]]},  // chest pass across
  handball: {period: 3.8, kind: 'handball',
    poses: [[0, 'catch'], [.08, 'ready'], [.2, 'windup'], [.29, 'throw'], [.4, 'ready'], [.95, 'catch']],
    ball: [['h', at('catch', .2), 'h', at('windup', .05, -1.6), 0, .2, {arc: 10}],
           ['h', at('windup', .05, -1.6), 'h', at('throw', .2), .2, .29, {}],
           ['h', at('throw', .2), 'a', at('catch', .2), .29, .5, {arc: 45}]]},
  americanfootball: {period: 4.4, kind: 'americanfootball',
    poses: [[0, 'catch'], [.08, 'juke'], [.16, 'ready'], [.22, 'windup'], [.3, 'throw'], [.38, 'ready'], [.68, 'juke'], [.76, 'ready'], [.95, 'catch']],
    ball: [['h', at('catch', .12), 'h', at('ready', .45, -.4), 0, .08, {}],
           ['h', at('ready', .45, -.4), 'h', at('windup', .08, -1.7), .08, .22, {arc: 6}],
           ['h', at('windup', .08, -1.7), 'h', at('throw', .3), .22, .3, {}],
           ['h', at('throw', .3), 'a', at('catch', .12), .3, .5, {arc: 70, spiral: true}]]},
  rugby: {period: 4, kind: 'rugby',
    poses: [[0, 'catch'], [.08, 'step'], [.18, 'ready'], [.26, 'pass'], [.36, 'ready'], [.95, 'catch']],
    ball: [['h', at('catch', .45), 'h', at('ready', .45, -.3), 0, .2, {arc: 4}],
           ['h', at('ready', .45, -.3), 'h', at('pass', .45), .2, .28, {}],
           ['h', at('pass', .45), 'a', at('catch', .45), .28, .5, {arc: 30, spin: 2}]]},
  aussierules: {period: 4.6, kind: 'aussie', centre: 'aussieposts',
    poses: [[0, 'mark'], [.1, 'run'], [.2, 'handball'], [.24, 'ready'], [.28, 'kick'], [.38, 'ready'], [.95, 'mark']],
    ball: [['h', at('mark', .02, -.6), 'h', at('ready', .5, -.3), 0, .2, {arc: 5}],
           ['h', at('ready', .5, -.3), 'h', at('kick', .45, .1), .2, .3, {}],
           ['h', at('kick', .45, .1), 'a', at('mark', .02, -.6), .3, .5, {arc: 190, spin: 3}]]},
  // Bat-and-ball: the home Hubie bowls or pitches, the away one hits it out of the card; then they swap.
  baseball: {period: 5.4, kind: 'baseball', rest: .98,
    poses: [[0, 'windup'], [.12, 'pitch'], [.24, 'catch'], [.44, 'stance'], [.73, 'swing'], [.86, 'stance'], [.97, 'windup']],
    ball: [['h', at('windup', .3, -1.2), 'h', at('windup', .3, -1.2), .02, .12, {hold: true}],
           ['h', at('pitch', .35), 'a', at('swing', .42, -.2), .12, .23, {arc: 8}],
           ['a', at('swing', .42, -.2), 'off', [.08, -.35], .23, .42, {arc: 0, spin: 3}]]},
  cricket: {period: 5.4, kind: 'cricket', rest: .98,
    poses: [[0, 'runup'], [.1, 'bowl'], [.22, 'catch'], [.44, 'stance'], [.73, 'drive'], [.86, 'stance'], [.97, 'runup']],
    ball: [['h', at('runup', .35, -.8), 'h', at('bowl', .02, -.6), .02, .1, {}],
           ['h', at('bowl', .02, -.6), 'a', at('drive', .78, -.4), .1, .23, {arc: 20, bounce: .7}],
           ['a', at('drive', .78, -.4), 'off', [-.08, .82], .23, .4, {arc: 0, spin: 4}]]}
};
/* Scripts for the side-profile redraws (HUBIE-SPORTS-PROMPTS.md, "Redo prompts"). Each takes over once its sheet is
   cut, i.e. once hubie-sports-meta.js has the new pose names. American football becomes a field-goal duel: catch,
   set the ball on the tee, run up and kick it through the posts in the middle of the card. */
const REDO = {
  americanfootball: ['approach', {period: 4.6, kind: 'americanfootball', centre: 'posts',
    poses: [[0, 'catch'], [.07, 'ready'], [.16, 'approach'], [.22, 'kick'], [.28, 'follow'], [.4, 'ready'], [.95, 'catch']],
    ball: [['h', at('catch', .15, -.2), 'h', at('kick', .93, .3), 0, .1, {arc: 20}],
           ['h', at('kick', .93, .3), 'h', at('kick', .93, .3), .1, .23, {hold: true}],
           ['h', at('kick', .93, .3), 'a', at('catch', .15, -.2), .23, .5, {arc: 165, spin: 2}]]}],
  baseball: ['set', {period: 5.4, kind: 'baseball', rest: .14,
    poses: [[0, 'set'], [.06, 'windup'], [.14, 'pitch'], [.26, 'set'], [.44, 'stance'], [.72, 'swing'], [.86, 'stance'], [.97, 'set']],
    ball: [['h', at('pitch', .3, -.1), 'a', at('swing', .45, -.2), .14, .23, {arc: 8}],  // leaves the hand at release
           ['a', at('swing', .45, -.2), 'off', [.08, -.35], .23, .42, {arc: 0, spin: 3}]]}],
  cricket: ['through', {period: 5.4, kind: 'cricket', rest: .1,
    poses: [[0, 'runup'], [.1, 'bowl'], [.16, 'through'], [.44, 'stance'], [.72, 'drive'], [.86, 'stance'], [.97, 'runup']],
    ball: [['h', at('bowl', .02, -.3), 'a', at('drive', .8, -.1), .1, .23, {arc: 20, bounce: .7}],  // bowled, pitches, meets the bat
           ['a', at('drive', .8, -.1), 'off', [-.08, .7], .23, .4, {arc: 30, spin: 4}]]}]
};
for (const [sport, [marker, spec]] of Object.entries(REDO)) if (META[sport]?.[marker]) SPECS[sport] = spec;
// Things drawn in the middle of the card, behind the ball.
/* Ice hockey, boxing (MMA shares the boxing poses), darts and golf. */
Object.assign(SPECS, {
  icehockey: {period: 4, kind: 'puck',
    poses: [[0, 'receive'], [.1, 'ready'], [.2, 'windup'], [.3, 'shot'], [.4, 'ready'], [.88, 'block'], [.97, 'receive']],
    ball: [['h', at('receive', .97, .3), 'h', at('ready', .97, .2), 0, .2, {}],
           ['h', at('ready', .97, .2), 'a', at('receive', .97, .3), .3, .5, {}]]},
  // No ball: the two trade punches; the one being hit blocks or rocks back.
  boxing: {period: 3.2, kind: 'none', rest: .1, lunge: {guard: 40, jab: 95, cross: 120, block: 26, rocked: 4},  // step in to punch, sway back when hit
    poses: [[0, 'guard'], [.08, 'jab'], [.16, 'guard'], [.24, 'cross'], [.33, 'guard'], [.58, 'block'], [.74, 'rocked'], [.86, 'guard']],
    ball: []},
  // Each throws one dart into the board in the middle of the card; the dart sticks, then the other throws.
  darts: {period: 4.4, kind: 'dart', centre: 'board', rest: .96,
    poses: [[0, 'aim'], [.12, 'throw'], [.18, 'follow'], [.3, 'cheer'], [.42, 'stand'], [.9, 'aim']],
    ball: [['h', at('aim', .16, -.2), 'h', at('aim', .16, -.2), 0, .12, {hold: true}],
           ['h', at('aim', .16, -.2), 'off', [.485, .205], .12, .2, {arc: 14}],
           ['off', [.485, .205], 'off', [.485, .205], .2, .5, {hold: true}]]},  // sticks in the board
  // Each putts toward the hole in the middle; it drops, the other putts.
  golf: {period: 5, kind: 'golfball', centre: 'hole', rest: .95,
    poses: [[0, 'address'], [.08, 'back'], [.14, 'through'], [.32, 'cheer'], [.42, 'read'], [.9, 'address']],
    ball: [['h', at('address', .97, .6), 'h', at('address', .97, .6), 0, .14, {hold: true}],
           ['h', at('address', .97, .6), 'off', [.5, .905], .14, .34, {}],
           ['off', [.5, .905], 'off', [.5, .905], .34, .4, {hold: true, sink: true}]]}  // drops into the hole
});
// Racing: no ball; the drivers take turns gesturing at each other. Horse racing: both gallop (a 4-frame cycle).
const gallop = []; for (let i = 0; i < 16; i++) gallop.push([i / 16, 'g' + (i % 4 + 1)]);
Object.assign(SPECS, {
  racing: {period: 4, kind: 'none', rest: .9, cars: true,
    poses: [[0, 'thumbs'], [.12, 'point'], [.24, 'cheer'], [.36, 'spray'], [.48, 'helmet']], ball: []},
  horseracing: {period: 2.4, kind: 'none', rest: .1, poses: gallop, ball: []}
});
const CENTRE = {board: '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMin meet"><circle cx="50" cy="40" r="34" fill="#141a1d" stroke="#3b4a50" stroke-width="3"/><circle cx="50" cy="40" r="27" fill="#e8dcc0"/><path d="M50 13v54M23 40h54M31 21l38 38M69 21 31 59" stroke="#141a1d" stroke-width="6"/><circle cx="50" cy="40" r="27" fill="none" stroke="#c8102e" stroke-width="3"/><circle cx="50" cy="40" r="16" fill="none" stroke="#1d7a40" stroke-width="3"/><circle cx="50" cy="40" r="4" fill="#c8102e"/></svg>',
  hole: '<svg viewBox="0 0 60 100" preserveAspectRatio="xMidYMax meet"><ellipse cx="30" cy="94" rx="11" ry="3.4" fill="#06120a"/><ellipse cx="30" cy="93.4" rx="11" ry="2.6" fill="none" stroke="#e8f2e8" stroke-width=".8" opacity=".7"/><path d="M30.6 94V8" stroke="#f4f4f0" stroke-width="1.6"/><path d="M31.4 9l22 7-22 7z" fill="#e2333a"/></svg>',
  aussieposts: '<svg viewBox="0 0 80 100" preserveAspectRatio="xMidYMax meet"><path d="M30 100V6M50 100V6" stroke="#f4f4f0" stroke-width="3.2" stroke-linecap="round"/><path d="M12 100V34M68 100V34" stroke="#f4f4f0" stroke-width="2.2" stroke-linecap="round"/></svg>',
  posts: '<svg viewBox="0 0 60 100" preserveAspectRatio="xMidYMax meet"><path d="M30 100V58M8 58H52M8 58V4M52 58V4" fill="none" stroke="#f2c230" stroke-width="3.2" stroke-linecap="round"/><path d="M30 100V58" stroke="#0006" stroke-width="5" opacity=".25"/></svg>'};
const BALL = {  // drawn in a 100 x 100 box, centred; size in box units
  tennis: [34, '<circle cx="50" cy="50" r="48" fill="#d8ee3a" stroke="#9fb320" stroke-width="3"/><path d="M8 30q30 20 0 42M92 28q-30 22 0 44" fill="none" stroke="#fff" stroke-width="6"/>'],
  pingpong: [22, '<circle cx="50" cy="50" r="48" fill="#fff" stroke="#cfd6d8" stroke-width="4"/>'],
  shuttle: [30, '<path d="M50 96 22 8h56Z" fill="#fff" stroke="#c9d1d4" stroke-width="3"/><path d="M36 8 46 96M64 8 54 96" stroke="#d6dde0" stroke-width="2"/><circle cx="50" cy="88" r="11" fill="#e8e1d2"/>'],
  basketball: [62, '<circle cx="50" cy="50" r="48" fill="#e2702a" stroke="#7a3410" stroke-width="3"/><path d="M2 50h96M50 2v96M16 16q24 34 0 68M84 16q-24 34 0 68" fill="none" stroke="#3b1a08" stroke-width="3"/>'],
  volleyball: [58, '<circle cx="50" cy="50" r="48" fill="#f7f4ea" stroke="#9aa3a6" stroke-width="3"/><path d="M50 2q-10 40 20 60M8 72q36-6 54-40M82 86q-16-30-58-36" fill="none" stroke="#2f6bb8" stroke-width="5"/>'],
  handball: [48, '<circle cx="50" cy="50" r="48" fill="#f2f2f2" stroke="#8a9295" stroke-width="3"/><path d="M50 18l18 14-7 22H39l-7-22Z" fill="#2c74c9"/><path d="M50 18V2M68 32l26-10M61 54l16 20M39 54 23 74M32 32 6 22" stroke="#2c74c9" stroke-width="4"/>'],
  americanfootball: [58, '<ellipse cx="50" cy="50" rx="48" ry="29" fill="#7b4220" stroke="#3b1d0c" stroke-width="3"/><path d="M30 50h40M38 44v12M46 44v12M54 44v12M62 44v12" stroke="#fff" stroke-width="3"/><path d="M12 34q4 16 0 32M88 34q-4 16 0 32" stroke="#fff" stroke-width="3" fill="none"/>'],
  rugby: [58, '<ellipse cx="50" cy="50" rx="48" ry="31" fill="#f2efe6" stroke="#7d7a70" stroke-width="3"/><path d="M38 40h24M38 50h24M38 60h24" stroke="#555" stroke-width="3"/><path d="M14 30q6 20 0 40M86 30q-6 20 0 40" stroke="#c0392b" stroke-width="4" fill="none"/>'],
  aussie: [56, '<ellipse cx="50" cy="50" rx="48" ry="32" fill="#b4261f" stroke="#5a120f" stroke-width="3"/><path d="M36 42h28M36 50h28M36 58h28" stroke="#fff" stroke-width="3"/>'],
  baseball: [28, '<circle cx="50" cy="50" r="48" fill="#fbfaf5" stroke="#b9b5a8" stroke-width="3"/><path d="M18 14q20 36 0 72M82 14q-20 36 0 72" fill="none" stroke="#c0392b" stroke-width="5" stroke-dasharray="6 5"/>'],
  puck: [34, '<ellipse cx="50" cy="60" rx="48" ry="22" fill="#111"/><ellipse cx="50" cy="48" rx="48" ry="22" fill="#2a2e31"/>'],
  dart: [34, '<path d="M2 50h40" stroke="#c9d1d4" stroke-width="7"/><path d="M42 44h30l26 6-26 6H42z" fill="#2c5aa0"/><path d="M8 50 0 36v28z" fill="#f2c230"/>'],
  golfball: [22, '<circle cx="50" cy="50" r="46" fill="#fbfbf8" stroke="#b7bcbd" stroke-width="4"/>'],
  none: [1, ''],
  cricket: [28, '<circle cx="50" cy="50" r="48" fill="#a51d1d" stroke="#5c0d0d" stroke-width="3"/><path d="M2 50h96" stroke="#f3e3c3" stroke-width="5" stroke-dasharray="7 5"/>']
};
const hueOf = name => [...String(name)].reduce((h, c) => (h * 31 + c.codePointAt(0)) >>> 0, 9);
const colours = name => { const h = hueOf(name), hue = h % 360; return {top: 'hsl(' + hue + ' 62% 44%)', bottom: (h >> 3) & 1 ? '#eef2f3' : 'hsl(' + hue + ' 40% 16%)'}; };
let uid = 0;
// Sports whose drawings are much wider than a standing Hubie (horse and rider) are drawn smaller to fit the side's box.
const SCALE = {horseracing: .6};
function poseLayer(sport, pose, c, id) {
  const m = META[sport][pose], f = DIR + sport + '-' + pose + '-';
  const img = part => '<image href="' + f + part + '.webp" width="' + m.w + '" height="' + m.h + '"/>';
  const mask = part => '<mask id="' + id + part + '" style="mask-type:alpha">' + img(part) + '</mask>';
  const fill = (part, col) => '<rect width="' + m.w + '" height="' + m.h + '" fill="' + col + '" mask="url(#' + id + part + ')"/>';
  return {defs: mask('top') + mask('bottom'),
    body: '<g class="hsPose" data-pose="' + pose + '" transform="translate(' + (BOX.cx - m.cx * (SCALE[sport] || 1)).toFixed(1) + ' ' + (BOX.h - m.h * (SCALE[sport] || 1)).toFixed(1) + ') scale(' + (SCALE[sport] || 1) + ')" style="opacity:0">' +
      '<g style="isolation:isolate">' + fill('top', c.top) + fill('bottom', c.bottom) +
      '<image href="' + f + 'kit.webp" width="' + m.w + '" height="' + m.h + '" style="mix-blend-mode:multiply"/></g>' + img('art') + '</g>'};
}
function sportSide(sport, team, side, key) {
  const c = colours(team), id = 'hs' + (uid++);
  const layers = Object.keys(META[sport]).map(p => poseLayer(sport, p, c, id + p.slice(0, 3)));
  return '<svg class="footballKit hubieKit hsDuel hkSide' + side + '" data-sport="' + sport + '" data-duel="' + key + '" data-side="' + side +
    '" viewBox="0 0 ' + BOX.w + ' ' + BOX.h + '" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs>' + layers.map(l => l.defs).join('') + '</defs>' +
    '<g class="hsBody">' + layers.map(l => l.body).join('') + '</g></svg>';
}
const previous = teamVisual;
teamVisual = function(i, side) {
  const sport = KEY[sportOf(events[i])];
  if (!sport || !META[sport] || !SPECS[sport]) return previous(i, side);
  return '<span class="rosterPortrait footballRoster hkDuelFrame hsFrame" aria-label="' + E(events[i][side]) + '"><span class="portraitLayer shown" aria-hidden="true">' +
    sportSide(sport, events[i][side], side, i) + '</span></span>';
};

/* Sport icons (sidebar, sport bar, directory): Hubie in that sport's outfit in Housebets colours. He holds the
   first pose; on hover, focus or selection (and with Animations on) he swaps to the second pose and the ball
   appears where it meets him. [first pose, second pose, ball height on the second pose]. */
const ICON = {tennis: ['windup', 'hit', .58], tabletennis: ['windup', 'hit', .5], badminton: ['windup', 'smash', .02],
  basketball: ['dribble', 'shot', .0], volleyball: ['set', 'spike', .02], handball: ['windup', 'throw', .2],
  americanfootball: ['windup', 'throw', .3], rugby: ['ready', 'pass', .45], aussierules: ['run', 'kick', .45],
  baseball: ['stance', 'swing', .42], cricket: ['stance', 'drive', .78]};
const ICON_REDO = {americanfootball: ['approach', ['ready', 'kick', .93]], baseball: ['set', ['set', 'pitch', .3]], cricket: ['through', ['runup', 'bowl', .02]]};
for (const [sport, [marker, pair]] of Object.entries(ICON_REDO)) if (META[sport]?.[marker]) ICON[sport] = pair;
const BRAND = {top: '#22b79c', bottom: '#173d47'};
// Same frame and classes as the other sport icons (46 x 34, sportIcon), so the site sizes them alike; Hubie stands on a
// ground line at about the old puppet's size.
const ICON_OPEN = name => '<svg class="sportIcon actionIcon motionIcon hsIcon" data-sport-motion="' + name + '" viewBox="0 0 46 34" aria-hidden="true">' +
  '<path d="M2 31.5H44" stroke="#9fd6cc" stroke-width="1.2" stroke-linecap="round" opacity=".55"/>' +
  '<svg x="8" y="3" width="28" height="29" viewBox="-40 -30 520 500" preserveAspectRatio="xMidYMax meet" overflow="visible">';
function sportIcon(sport, name) {
  const [a, b, by] = ICON[sport], id = 'hi' + (uid++), kind = SPECS[sport].kind, r = BALL[kind][0] * .8;
  const layer = (pose, cls, suf) => poseLayer(sport, pose, BRAND, id + suf).body.replace('class="hsPose"', 'class="hsPose ' + cls + '"').replace(' style="opacity:0"', '');
  const m = META[sport][b], band = Math.min(23, Math.floor(by * 24)), right = Math.max(...m.prof.slice(Math.max(0, band - 1), band + 2));
  const bx = BOX.cx - m.cx + right + r * .9, byy = BOX.h - m.h + by * m.h;
  return ICON_OPEN(name) +
    '<defs>' + poseLayer(sport, a, BRAND, id + 'A').defs + poseLayer(sport, b, BRAND, id + 'B').defs + '</defs>' +
    layer(a, 'hsIA', 'A') + layer(b, 'hsIB', 'B') +
    '<svg class="hsIBall" x="' + (bx - r).toFixed(0) + '" y="' + (byy - r).toFixed(0) + '" width="' + (2 * r).toFixed(0) + '" height="' + (2 * r).toFixed(0) + '" viewBox="0 0 100 100">' + BALL[kind][1] + '</svg></svg></svg>';
}
// Football uses the side-on kit poses from hubie-kits.js (juggle, then strike with the ball at the boot).
const FB = {juggle: {w: 247, h: 467, cx: 100.6}, strike: {w: 318, h: 455, cx: 137.5}};
function footballIcon(name) {
  const id = 'hf' + (uid++), F = 'assets/generated/hubie-side-';
  const layer = (pose, cls) => {
    const m = FB[pose], f = F + pose + '-', img = p => '<image href="' + f + p + '.webp" width="' + m.w + '" height="' + m.h + '"/>';
    const mask = p => '<mask id="' + id + pose + p + '" style="mask-type:alpha">' + img(p) + '</mask>';
    const fill = (p, c) => '<rect width="' + m.w + '" height="' + m.h + '" fill="' + c + '" mask="url(#' + id + pose + p + ')"/>';
    return {defs: mask('shirt') + mask('shorts') + mask('socks'), body: '<g class="' + cls + '" transform="translate(' + (BOX.cx - m.cx).toFixed(1) + ' ' + (BOX.h - m.h) + ')"><g style="isolation:isolate">' +
      fill('shirt', BRAND.top) + fill('shorts', BRAND.bottom) + fill('socks', BRAND.top) + '<image href="' + f + 'kit.webp" width="' + m.w + '" height="' + m.h + '" style="mix-blend-mode:multiply"/></g>' + img('art') + '</g>'};
  };
  const A = layer('juggle', 'hsIA'), B = layer('strike', 'hsIB'), bx = BOX.cx - FB.strike.cx + 332, by = BOX.h - FB.strike.h + 348;
  return ICON_OPEN(name) +
    '<defs>' + A.defs + B.defs + '</defs>' + A.body + B.body +
    '<image class="hsIBall" href="assets/generated/hubie-kit-juggler-ball.webp" x="' + (bx - 40) + '" y="' + (by - 40) + '" width="80" height="80"/></svg></svg>';
}
// Off for now: the sport icons keep their animated scenes (hubie-motion.js) until Hubie's puppet parts are redrawn in
// the kit. Set HUBIE_POSE_ICONS = true to use these posed icons instead.
const HUBIE_POSE_ICONS = false;
const iconBefore = icon;
if (HUBIE_POSE_ICONS) icon = function(name) {
  if (name === 'Football') return footballIcon(name);
  const s = KEY[name]; return s && META[s] && ICON[s] ? sportIcon(s, name) : iconBefore(name);
};

/* Animation */
const boxes = new Set();
const poseAt = (list, t) => { let p = list[0][1]; for (const [s, q] of list) if (t >= s) p = q; return p; };
// Where a point is on the card, in px from the card's top-left. geo: per side, origin + scale of its drawing box.
function pointPx(box, side, pt) {
  const g = box._geo[side], s = META[box._sport];
  if (!g || !pt) return null;
  const m = s[pt.pose], band = Math.min(23, Math.max(0, Math.floor(pt.y * 24)));
  let right = m.prof[band]; for (let d = 1; right < 0 && d < 24; d++) right = Math.max(m.prof[Math.min(23, band + d)] ?? -1, m.prof[Math.max(0, band - d)] ?? -1);
  const r = BALL[SPECS[box._sport].kind][0] / 2;
  const x = BOX.cx - m.cx + right + pt.dx * 2 * r, y = BOX.h - m.h + pt.y * m.h;
  return [g.ox + (g.mirror ? BOX.w - x : x) * g.k, g.oy + y * g.k];
}
function measure(box) {
  const c = box.getBoundingClientRect(); box._geo = {};
  for (const svg of box.querySelectorAll('svg.hsDuel[data-duel="' + box._duel + '"]')) {
    const r = svg.getBoundingClientRect(); if (!r.width) continue;
    const k = Math.min(r.width / BOX.w, r.height / BOX.h);
    box._geo[svg.dataset.side === '1' ? 'a' : 'h'] = {k, mirror: svg.dataset.side === '1',
      ox: r.left + (r.width - BOX.w * k) / 2 - c.left - box.clientLeft, oy: r.top + r.height - BOX.h * k - c.top - box.clientTop};
  }
  box._size = [c.width, c.height];
}
const ease = t => t * t * (3 - 2 * t);
function ballAt(box, t) {
  const spec = SPECS[box._sport], g = box._geo;
  if (!g.h || !g.a) return null;
  const swap = t >= .5, local = swap ? t - .5 : t, flip = s => s === 'h' ? (swap ? 'a' : 'h') : s === 'a' ? (swap ? 'h' : 'a') : s;
  for (const [fs, fp, ts, tp, t0, t1, o] of spec.ball) {
    if (local < t0 || local > t1) continue;
    const u = (local - t0) / Math.max(1e-6, t1 - t0), k = (g.h.k + g.a.k) / 2, floor = g.h.oy + BOX.h * g.h.k - BALL[spec.kind][0] * k / 2;
    const offPt = q => [box._size[0] * (swap ? 1 - q[0] : q[0]), box._size[1] * q[1]];
    const A = fs === 'off' ? offPt(fp) : pointPx(box, flip(fs), fp);
    if (!A) return null;
    if (o.hold) return {x: A[0], y: A[1], rot: 0, fade: o.sink ? u : 0};
    if (o.dribble) { const v = Math.abs(Math.sin(u * Math.PI * o.dribble)); return {x: A[0], y: A[1] + (floor - A[1]) * v, rot: u * 90}; }
    let B = ts === 'off' ? offPt(tp) : pointPx(box, flip(ts), tp);
    if (!B) return null;
    const x = A[0] + (B[0] - A[0]) * u, dir = Math.sign(B[0] - A[0]) || 1, spin = (o.spin || 1.2) * 360 * u * dir;
    if (o.bounce) {  // down to the floor at `bounce`, then up to the receiver
      const b = o.bounce, lift = (o.arc || 0) * k;
      if (u < b) { const v = u / b, y = A[1] + (floor - A[1]) * v * v - lift * 4 * v * (1 - v) * .6; return {x, y, rot: spin}; }
      const v = (u - b) / (1 - b); return {x, y: floor + (B[1] - floor) * ease(v) - lift * Math.sin(v * Math.PI) * .5, rot: spin};
    }
    const y = A[1] + (B[1] - A[1]) * u - (o.arc || 0) * k * 4 * u * (1 - u);
    return {x, y, rot: o.spiral ? 0 : spin, tilt: o.spiral ? Math.atan2(B[1] - A[1] - (o.arc || 0) * k * 4 * (1 - 2 * u), B[0] - A[0]) * 180 / Math.PI : null};
  }
  return null;
}
// At rest the ball sits where the home Hubie's turn begins (the start of the first ball move).
function restBall(box) { if (!SPECS[box._sport].ball.length) return null; const [fs, fp] = SPECS[box._sport].ball[0]; const p = box._geo.h && box._geo.a && pointPx(box, fs, fp); return p && {x: p[0], y: p[1], rot: 0}; }
function draw(box, now) {
  const spec = SPECS[box._sport], moving = document.documentElement.classList.contains('iconMotionEnabled');
  // Match page header: always playing on the page clock. Fixture cards: playing from the start of the loop while
  // hovered, otherwise at rest (spec.rest: the home Hubie about to act, the ball with him).
  const playing = moving && (box._always || box._play != null);
  if (spec.cars) box.classList.toggle('hsRaceGo', playing);
  const rest = spec.rest ?? .93;
  const t = !playing ? rest : box._always ? (now / 1000 / spec.period) % 1 : ((now - box._play) / 1000 / spec.period) % 1;
  for (const svg of box.querySelectorAll('svg.hsDuel[data-duel="' + box._duel + '"]')) {
    const own = svg.dataset.side === '1' ? (t + .5) % 1 : t, pose = poseAt(spec.poses, own);
    if (svg._pose !== pose) { svg._pose = pose; svg.querySelectorAll('.hsPose').forEach(g => g.style.opacity = g.dataset.pose === pose ? 1 : 0);
      if (spec.lunge) { const body = svg.querySelector('.hsBody'); if (body) body.style.transform = 'translateX(' + (spec.lunge[pose] || 0) + 'px)'; } }
  }
  const b = playing ? ballAt(box, t) : restBall(box), el = box._ball;
  if (!b) { el.style.opacity = 0; return; }
  const size = BALL[spec.kind][0] * (box._geo.h.k + box._geo.a.k) / 2;
  el.style.opacity = 1 - (b.fade || 0); el.style.width = el.style.height = size.toFixed(1) + 'px';
  const noSpin = spec.kind === 'dart' || spec.kind === 'puck', flipX = spec.kind === 'dart' && t >= .5 ? ' scaleX(-1)' : '';
  el.style.transform = 'translate(' + (b.x - size / 2).toFixed(1) + 'px,' + (b.y - size / 2).toFixed(1) + 'px) rotate(' + (noSpin ? 0 : (b.tilt ?? b.rot)).toFixed(0) + 'deg)' + flipX;
}
/* Racing: two cars in the teams' colours. Each drives away down the track (rear view), shrinks into the distance,
   takes the turn out of sight and comes back toward the viewer (front view); the second car runs half a lap behind. */
const carRear = c => '<svg class="hsCarRear" viewBox="0 0 100 62"><ellipse cx="50" cy="58" rx="46" ry="4" fill="#000" opacity=".45"/>' +
  '<rect x="3" y="24" width="20" height="32" rx="5" fill="#141414"/><rect x="77" y="24" width="20" height="32" rx="5" fill="#141414"/>' +
  '<path d="M26 54 32 26h36l6 28z" fill="' + c.top + '"/><path d="M36 54 40 30h20l4 24z" fill="' + c.bottom + '" opacity=".55"/>' +
  '<rect x="12" y="6" width="76" height="9" rx="2" fill="#1b1b1b"/><rect x="12" y="6" width="76" height="3" fill="' + c.top + '"/><rect x="10" y="4" width="4" height="22" fill="#1b1b1b"/><rect x="86" y="4" width="4" height="22" fill="#1b1b1b"/>' +
  '<circle cx="50" cy="24" r="7.5" fill="' + c.top + '"/><path d="M43.5 23h13" stroke="#111" stroke-width="2.4"/><rect x="47" y="46" width="6" height="5" fill="#ff3b30"/></svg>';
const carFront = c => '<svg class="hsCarFront" viewBox="0 0 100 62"><ellipse cx="50" cy="58" rx="46" ry="4" fill="#000" opacity=".45"/>' +
  '<rect x="5" y="22" width="18" height="32" rx="5" fill="#141414"/><rect x="77" y="22" width="18" height="32" rx="5" fill="#141414"/>' +
  '<path d="M34 50 40 24h20l6 26z" fill="' + c.top + '"/><path d="M46 30h8l2 20H44z" fill="' + c.bottom + '" opacity=".6"/>' +
  '<rect x="8" y="49" width="84" height="7" rx="2" fill="' + c.top + '"/><rect x="8" y="53" width="84" height="3" fill="#1b1b1b"/>' +
  '<circle cx="50" cy="21" r="7.5" fill="' + c.top + '"/><path d="M44 19.6h12" stroke="#7fd3ff" stroke-width="3"/><path d="M41 22c3-7 15-7 18 0" fill="none" stroke="#222" stroke-width="2.4"/></svg>';
function raceCars(e) {
  const car = (c, cls) => '<span class="hsCar ' + cls + '">' + carRear(c) + carFront(c) + '</span>';
  // Two clearly different liveries: if the teams' hues are close, turn the second car to the opposite side of the wheel.
  const ha = hueOf(e[0]) % 360, hb = hueOf(e[1]) % 360, gap = Math.min(Math.abs(ha - hb), 360 - Math.abs(ha - hb));
  const cb = gap >= 70 ? colours(e[1]) : {top: 'hsl(' + ((ha + 180) % 360) + ' 70% 48%)', bottom: '#eef2f3'};
  return '<span class="hsRace" aria-hidden="true">' + car(colours(e[0]), 'hsCarA') + '<span class="hsLaneB">' + car(cb, 'hsCarB') + '</span></span>';
}
let running = false;
const loop = now => {
  running = false;
  for (const box of boxes) { if (!box.isConnected) { boxes.delete(box); continue; } if (box._live) draw(box, now); }
  if ([...boxes].some(b => b._live && (b._always || b._play != null)) && document.documentElement.classList.contains('iconMotionEnabled')) { running = true; requestAnimationFrame(loop); }
};
const kick = () => { if (!running) { running = true; requestAnimationFrame(loop); } };
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { e.target._live = e.isIntersecting; if (e.isIntersecting) { measure(e.target); draw(e.target, performance.now()); kick(); } }), {rootMargin: '40px'}) : null;
const ro = 'ResizeObserver' in window ? new ResizeObserver(es => es.forEach(e => { measure(e.target); draw(e.target, performance.now()); })) : null;
new MutationObserver(() => { boxes.forEach(b => b._live && draw(b, performance.now())); kick(); }).observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
let queued = false;
const watch = () => {
  queued = false;
  document.querySelectorAll('svg.hsDuel[data-side="0"]:not([data-hs])').forEach(s => {
    s.dataset.hs = 1;
    let box = s.parentElement;
    while (box && !box.querySelector('svg.hsDuel[data-side="1"][data-duel="' + s.dataset.duel + '"]')) box = box.parentElement;
    if (!box || box === document.body) return;
    if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
    box.classList.add('hsBox', 'hsSport-' + s.dataset.sport);
    box._sport = s.dataset.sport; box._duel = s.dataset.duel;
    const centre = CENTRE[SPECS[box._sport].centre];
    if (centre) box.insertAdjacentHTML('beforeend', '<span class="hsCentre" aria-hidden="true">' + centre + '</span>');
    if (SPECS[box._sport].cars) box.insertAdjacentHTML('beforeend', raceCars(events[+box._duel] || ['Home', 'Away']));
    box.insertAdjacentHTML('beforeend', '<span class="hsBall" aria-hidden="true"><svg viewBox="0 0 100 100">' + BALL[SPECS[box._sport].kind][1] + '</svg></span>');
    box._ball = box.lastElementChild;
    boxes.add(box); measure(box); draw(box, performance.now());
    const card = box.closest('.snapCard, .footballMatchCard');
    if (card) {
      const on = () => { box._play = performance.now(); kick(); }, off = () => { box._play = null; draw(box, performance.now()); };
      card.addEventListener('mouseenter', on); card.addEventListener('mouseleave', off);
      if (card.matches(':hover') && !matchMedia('(hover: none), (pointer: coarse)').matches) on();  // phones keep a sticky :hover after a tap; phone-play.js decides there
    } else box._always = true;
    io ? io.observe(box) : (box._live = true, kick());
    ro?.observe(box);
    const r = box.getBoundingClientRect();  // already on screen: draw and play now, not a frame later
    if (r.bottom > -40 && r.top < innerHeight + 40) { box._live = true; draw(box, performance.now()); kick(); }
  });
};
window.hsWatchNow = watch;  // anim-keep.js runs this right after every render
new MutationObserver(() => { if (!queued) { queued = true; setTimeout(watch, 30); } }).observe(document.body, {childList: true, subtree: true});
render();
watch();
}
