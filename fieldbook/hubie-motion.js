'use strict';
/* Hubie plays every sport.
   Hubie is a jointed puppet assembled from Gemini cut-out parts (assets/hubie/, a 600×900 puppet space): neck, shoulders,
   elbows and hips rotate. Each sport keeps its scene (goals, nets, ball paths) from sport-motion.js, drops the old stick
   limbs, and places Hubie so his foot, paw or held prop meets the ball at the scene's contact moment. */
{
const SM = window.sportMotion;
if (!SM) throw Error('sport-motion.js must load first');
const art = SM.art;
const P = 'assets/hubie/';
const img = (file, x, y, w, h, extra = '') => '<image href="' + P + file + '.webp" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" preserveAspectRatio="none"' + extra + '/>';
const imgTux = img;
const g = (cls, body, extra = '') => '<g class="' + cls + '"' + extra + '>' + body + '</g>';
const line = (d, c, w, extra = '') => '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"' + extra + '/>';
const fill = (d, c, extra = '') => '<path d="' + d + '" fill="' + c + '"' + extra + '/>';
const dot = (x, y, r, c, extra = '') => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '"' + extra + '/>';
const net = (x1, y1, x2, y2, s) => { let d = ''; for (let x = x1 + s; x < x2; x += s) d += 'M' + x + ' ' + y1 + 'V' + y2; for (let y = y1 + s; y < y2; y += s) d += 'M' + x1 + ' ' + y + 'H' + x2; return line(d, '#7fa8ae', .5); };
const strip = (html, ...classes) => { for (const c of classes) { const el = SM.element(html, c); if (el) html = html.replace(el, ''); } return html; };
const shadow = (cx, cy, rx, cls = '') => g(cls || 'hbShadowStill', '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + (rx * .22).toFixed(2) + '" fill="url(#smShadowG)"/>');

// ---- puppet geometry (puppet px) ----
const J = {body: [300, 850], legB: [250, 625], legF: [350, 595], armB: [164, 395], foreB: [164, 528], armF: [433, 395], foreF: [433, 538], head: [330, 350]};
const PAW = [433, 760], TOE = [430, 850];
// Held props, drawn in the front forearm (grip at the paw).
const PROP = {
 racket: line('M433 735v115', '#e9b67a', 26) + '<ellipse cx="433" cy="930" rx="64" ry="92" fill="#163a44" stroke="#8be3d6" stroke-width="16"/>' + line('M385 890h96M380 930h106M385 970h96M410 845v170M456 845v170', '#8be3d6', 5),
 badminton: line('M433 735v170', '#e9b67a', 16) + '<ellipse cx="433" cy="960" rx="44" ry="62" fill="#163a44" stroke="#8be3d6" stroke-width="11"/>' + line('M400 940h66M400 975h66M420 905v110M446 905v110', '#8be3d6', 4),
 padel: line('M433 735v90', '#1e2f36', 30) + '<ellipse cx="433" cy="905" rx="62" ry="78" fill="#2f86d6" stroke="#9fd0ff" stroke-width="10"/>' + [[410, 880], [450, 880], [430, 910], [410, 940], [455, 940]].map(([x, y]) => dot(x, y, 9, '#163a44')).join(''),
 pingpong: line('M433 735v60', '#e9b67a', 30) + dot(433, 850, 62, '#e04848', ' stroke="#1e2f36" stroke-width="10"'),
 cricketBat: line('M433 720v90', '#2c5966', 30) + fill('M405 805h56l14 230q-42 26-84 0z', '#ecc488', ' stroke="#b98543" stroke-width="7"'),
 baseballBat: '<path d="M422 720l22 0 30 360q-2 34-37 34-35 0-40-34z" fill="#e9b67a" stroke="#b98543" stroke-width="7"/>' + line('M425 730h18', '#1e2f36', 26),
 hockey: line('M433 650 433 1120', '#d9a066', 26) + line('M433 1120q2 30 40 30h90', '#1e2f36', 32),
 floorball: line('M433 650 433 1110', '#f3f8f7', 22) + line('M433 1110q2 30 40 30h80', '#2f86d6', 30),
 golf: line('M433 700 433 1090', '#cfd8da', 12) + fill('M425 1080h52q10 0 10 14v10h-62z', '#9fb3b8'),
 lacrosse: line('M433 560 433 1000', '#cfd8da', 18) + fill('M400 1000q-6-110 70-104 52 10 26 108z', '#163a44', ' stroke="#f3f8f7" stroke-width="10"'),
 glove: dot(433, 790, 92, '#2f86d6', ' stroke="#174a78" stroke-width="8"') + fill('M378 700h110v60H378z', '#f3f8f7'),
 redGlove: dot(433, 790, 92, '#e8473f', ' stroke="#8e1f1b" stroke-width="8"'),
 dart: fill('M433 740l7-4v8z', '#9fb3b8') + line('M433 740h-60', '#cfd8da', 9) + fill('M373 740l-30-18v36z', '#ffde88'),
 rifle: line('M433 760 433 1170', '#10181c', 22) + line('M433 760l-40 -90', '#6b3f22', 34),
 pole: line('M433 740 433 1180', '#9fb3b8', 9),
 cue: line('M433 760 433 1500', '#e9b67a', 16),
 bowl: '',
 basketball: dot(433, 800, 100, '#f08a2c', ' class="hkHandBall"') + line('M333 800h200M433 700v200', '#6a3216', 14, ' class="hkHandBall"'),
 none: ''
};
// Beta v2: Hubie plays each sport in a kit instead of the tuxedo. Parts from the Gemini "puppet parts in kit" sheet
// (portrait-worker/cut-hubie-kit-parts.py -> assets/hubie-kit/): fur, socks and boots as they are, the jersey and the
// shorts as grey shading tinted by an SVG colour filter per sport (KIT_COLOURS below). Each part keeps its own width
// to height ratio inside the old part's box. o.tux keeps the tuxedo (the header brand Hubie).
const KP = 'assets/hubie-kit/';
const KIT_RATIO = {'torso': .778, 'upper-arm-back': .714, 'upper-arm-front': .578, 'forearm-back': .422, 'forearm-front': .411, 'leg-back': .586, 'leg-front': .586};
const kpart = (file, x, y, w, h, extra = '') => {
  const w2 = h * KIT_RATIO[file], x2 = x + (w - w2) / 2, layer = (s, f) => '<image href="' + KP + file + '-' + s + '.webp" width="100%" height="100%" preserveAspectRatio="none"' + (f ? ' filter="url(#hkf-HKKIT-' + f + ')"' : '') + '/>';
  return '<svg x="' + x2.toFixed(1) + '" y="' + y + '" width="' + w2.toFixed(1) + '" height="' + h + '" overflow="visible"' + extra + '>' + layer('ktop', 't') + layer('kbot', 'b') + layer('art') + '</svg>';
};
function hubie(pre, o = {}) {
  const head = o.rival ? imgTux('head-plain', 205, 106, 253, 256) : imgTux('head', 216, 50, 229, 312);
  const tint = o.rival ? ' style="filter:hue-rotate(150deg) saturate(1.3)"' : '';
  const w = o.h * 2 / 3;
  const part = o.tux ? imgTux : kpart;
  return (o.flip ? '<g transform="translate(' + (2 * o.x + w).toFixed(2) + ' 0) scale(-1 1)">' : '<g>') +
    '<svg class="hbPuppet" x="' + o.x.toFixed(2) + '" y="' + o.y.toFixed(2) + '" width="' + w.toFixed(2) + '" height="' + o.h.toFixed(2) + '" viewBox="0 0 600 900" overflow="visible"><g>' +
    g(pre + 'Body',
      (o.noLegs ? '' : g(pre + 'LegB', part('leg-back', 178, 618, 144, 232) + (o.skis ? line('M150 850h260', '#e8473f', 24) : ''))) +
      // gripB: slide the back arm toward the front one so both paws hold one club (golf).
      (o.gripB ? '<g transform="translate(' + o.gripB + ')">' : '') +
      g(pre + 'ArmB', part('upper-arm-back', 120, 385, 87, 159, tint) + g(pre + 'ForeB', part('forearm-back', 114, 520, 100, 229, tint) + (o.heldB ? PROP[o.heldB] .replace(/433/g, '164') : ''))) +
      (o.gripB ? '</g>' : '') +
      (o.noLegs ? '' : g(pre + 'LegF', part('leg-front', 274, 585, 152, 269) + (o.skis ? line('M260 855h300', '#e8473f', 24) : ''))) +
      part('torso', 130, 300, 344, 348, tint) +
      g(pre + 'Head', head) +
      g(pre + 'ArmF', part('upper-arm-front', 375, 385, 117, 166, tint) + g(pre + 'ForeF', part('forearm-front', 383, 530, 99, 229, tint) + (PROP[o.held] || '')))) +
    '</g></svg></g>';
}
// Hubie's head alone (drivers, jockeys, sailors): centred on cx,cy with the face about r wide.
const headOnly = (cx, cy, r) => '<image href="' + P + 'head.webp" x="' + (cx - r * .95).toFixed(2) + '" y="' + (cy - r * 1.55).toFixed(2) + '" width="' + (r * 1.9).toFixed(2) + '" height="' + (r * 2.6).toFixed(2) + '" preserveAspectRatio="none"/>';

// Place the puppet so a point on it (after the given joint rotations) lands on an icon-space target.
const rot = ([x, y], [cx, cy], deg) => { const a = deg * Math.PI / 180, dx = x - cx, dy = y - cy; return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)]; };
function placeHubie(h, point, chain, target) {  // chain: [[pivot, deg], …] applied innermost first
  let p = point;
  for (const [pivot, deg] of chain) p = rot(p, pivot, deg);
  const s = h / 900;
  return {h, x: target[0] - p[0] * s, y: target[1] - p[1] * s};
}
const mirror = p => Object.assign({}, p, {x: 46 - p.x - p.h * 2 / 3, flip: true});
const at = (p, point, chain) => { let q = point; for (const [pivot, deg] of chain) q = rot(q, pivot, deg); const k = p.h / 900; return [p.x + q[0] * k, p.y + q[1] * k]; };
const stand = (h, toeX, ground) => ({h, x: toeX - TOE[0] * h / 900, y: ground - TOE[1] * h / 900});
const tip = (prop, len) => [PAW[0], PAW[1] + len];  // a point along a held prop, straight down the forearm

// ---- motion presets: keyframes per joint, contact at c% ----
const K = (...stops) => stops.map(([t, v]) => t + '{transform:' + v + '}').join('');
const R = d => 'rotate(' + d + 'deg)';
function pose(kind, pre, c = 40, o = {}) {
  const a = Math.max(4, c - 16), f = Math.min(92, c + 14), back = Math.min(96, c + 36);
  const F = {};
  const set = (j, frames) => { F[pre + j] = frames; };
  if (kind === 'kick') {
    set('LegF', K(['0%,100%', R(0)], [a + '%', R(32)], [c + '%', R(o.contact ?? -34)], [f + '%', R(-46)], [back + '%', R(0)]));
    set('LegB', K(['0%,100%', R(0)], [a + '%', R(-6)], [c + '%', R(4)]));
    set('ArmF', K(['0%,100%', R(0)], [a + '%', R(-30)], [c + '%', R(36)], [back + '%', R(0)]));
    set('ArmB', K(['0%,100%', R(0)], [a + '%', R(38)], [c + '%', R(-36)], [back + '%', R(0)]));
    set('Body', K(['0%,100%', 'none'], [a + '%', 'rotate(-5deg) translateX(-12px)'], [c + '%', 'rotate(6deg) translateX(10px)'], [back + '%', 'none']));
    set('Head', K(['0%,100%', R(0)], [a + '%', R(4)], [c + '%', R(-8)], [back + '%', R(0)]));
  } else if (kind === 'swing') {  // one-armed racket / bat / throw, armF angles given
    const [from, at, to, rest = 0] = o.arm;
    set('ArmF', K(['0%,100%', R(from)], [a + '%', R(from + (o.wind ?? 14))], [c + '%', R(at)], [f + '%', R(to)], [back + '%', R(from)]));
    set('ForeF', K(['0%,100%', R(o.fore?.[0] ?? 10)], [c + '%', R(o.fore?.[1] ?? -6)], [f + '%', R(o.fore?.[2] ?? -18)], [back + '%', R(o.fore?.[0] ?? 10)]));
    if (o.two) set('ArmB', F[pre + 'ArmF']);
    else set('ArmB', K(['0%,100%', R(-18)], [a + '%', R(-34)], [c + '%', R(30)], [back + '%', R(-18)]));
    set('Body', K(['0%,100%', R(-3)], [a + '%', 'rotate(-7deg) translateX(-10px)'], [c + '%', 'rotate(5deg) translateX(10px)'], [back + '%', R(-3)]));
    set('Head', K(['0%,100%', R(0)], [a + '%', R(5)], [c + '%', R(-6)], [back + '%', R(0)]));
    set('LegF', K(['0%,100%', R(0)], [a + '%', R(8)], [c + '%', R(-12)], [back + '%', R(0)]));
  } else if (kind === 'punch') {
    set('ArmF', K(['0%,100%', R(-40)], [a + '%', R(-30)], [c + '%', R(-90)], [f + '%', R(-84)], [back + '%', R(-40)]));
    set('ForeF', K(['0%,100%', R(-60)], [a + '%', R(-80)], [c + '%', R(0)], [back + '%', R(-60)]));
    set('ArmB', K(['0%,100%', R(-50)], [c + '%', R(-40)]));
    set('ForeB', K(['0%,100%', R(-90)]));
    set('Body', K(['0%,100%', 'none'], [a + '%', 'translateX(-10px)'], [c + '%', 'rotate(6deg) translateX(30px)'], [back + '%', 'none']));
  } else if (kind === 'push') {
    set('ArmF', K(['0%,100%', R(-80)], [c + '%', R(-92)]));
    set('ArmB', K(['0%,100%', R(-70)], [c + '%', R(-84)]));
    set('Body', K(['0%,100%', 'rotate(8deg)'], [c + '%', 'rotate(14deg) translateX(40px)'], [f + '%', 'rotate(12deg) translateX(46px)'], [back + '%', 'rotate(8deg)']));
  } else if (kind === 'aim') {
    const A = o.at ?? -90;
    set('ArmF', K(['0%,100%', R(A)], [c + '%', R(A - 2)], [(c + 3) + '%', R(A + 6)], [(c + 10) + '%', R(A)]));
    set('ArmB', K(['0%,100%', R(-70)]));
    set('Head', K(['0%,100%', R(-4)]));
  } else if (kind === 'ski') {
    set('ArmF', K(['0%,100%', R(-30)], ['50%', R(30)]));
    set('ArmB', K(['0%,100%', R(30)], ['50%', R(-30)]));
    set('LegF', K(['0%,100%', R(-14)], ['50%', R(14)]));
    set('LegB', K(['0%,100%', R(14)], ['50%', R(-14)]));
    set('Body', K(['0%,100%', 'rotate(14deg)'], ['50%', 'rotate(16deg) translateY(-6px)']));
  } else if (kind === 'tuck') {
    set('Body', K(['0%,100%', 'rotate(22deg) translateY(0)'], ['50%', 'rotate(26deg) translateY(10px)']));
    set('ArmF', K(['0%,100%', R(-60)]));
    set('ArmB', K(['0%,100%', R(-50)]));
    set('LegF', K(['0%,100%', R(-20)]));
    set('LegB', K(['0%,100%', R(-10)]));
  } else if (kind === 'cheer') {
    set('ArmF', K(['0%,100%', R(-150)], ['50%', R(-175)]));
    set('ArmB', K(['0%,100%', R(160)], ['50%', R(178)]));
    set('Body', K(['0%,100%', 'translateY(0)'], ['50%', 'translateY(-30px)']));
    set('Head', K(['0%,100%', R(-4)], ['50%', R(6)]));
  } else if (kind === 'think') {
    set('ArmF', K(['0%,100%', R(-40)], [c + '%', R(-110)], [f + '%', R(-100)], [back + '%', R(-40)]));
    set('ForeF', K(['0%,100%', R(-90)], [c + '%', R(-20)], [back + '%', R(-90)]));
    set('Head', K(['0%,100%', R(4)], [c + '%', R(-4)]));
  } else if (kind === 'roll') {
    set('ArmF', K(['0%,100%', R(40)], ['8%', R(30)], ['16%', R(-50)], ['30%', R(-70)], ['60%', R(0)]));
    set('Body', K(['0%,100%', 'rotate(12deg) translateY(30px)'], ['16%', 'rotate(16deg) translateY(36px)'], ['60%', 'rotate(4deg)']));
    set('LegF', K(['0%,100%', R(-30)]));
    set('LegB', K(['0%,100%', R(20)]));
  }
  return F;
}

// ---- scenes ----
const FR = {};
const ORIGIN_EXTRA = {};  // keyframes, merged from every scene
const scene = (name, html, frames) => { art[name] = html; Object.assign(FR, frames); };
const G31 = (y = 31.4, c = '#24553c', edge = '#4f9e6e') => '<rect x="0" y="' + y + '" width="46" height="' + (34 - y) + '" fill="' + c + '"/>' + line('M0 ' + (y + .1) + 'h46', edge, .7);

// Football / Basketball / Tennis (pilot scenes, now through the shared depth pipeline)
{
  const h = 30, place1 = stand(h, 17, 31.6);
  scene('Football', G31() + line('M30 12.5 43.5 14V31.5', '#b9cdd1', 1) + g('hfNet', net(30.6, 13, 43.5, 31.5, 2.2)) +
    shadow(11, 32.6, 7) + shadow(20, 32.4, 2.6, 'hfBallSh') + hubie('hf', place1) +
    g('hfBall', dot(20, 29.4, 2.5, '#eef4f3', ' stroke="#10252b" stroke-width=".35"') + fill('M20 28.2l1.1.8-.4 1.3h-1.4l-.4-1.3z', '#1d3b44')) + line('M30 12.2V31.6', '#f3f8f7', 1.8),
    Object.assign(pose('kick', 'hf', 34), {
      hfBall: '0%,34%{transform:none;opacity:1}44%{transform:translate(6px,-8px) rotate(200deg)}54%{transform:translate(12px,-11px) rotate(400deg)}62%{transform:translate(16px,-10.4px) rotate(520deg)}70%{transform:translate(17px,-9.4px) rotate(560deg);opacity:1}76%,92%{transform:translate(17px,-9.4px);opacity:0}100%{transform:none;opacity:1}',
      hfBallSh: '0%,34%{transform:none;opacity:1}44%{transform:translateX(6px) scale(.6);opacity:.6}54%{transform:translateX(12px) scale(.45);opacity:.4}70%{transform:translateX(17px) scale(.5);opacity:.4}76%,92%{opacity:0}100%{transform:none;opacity:1}',
      hfNet: '0%,61%{transform:none}67%{transform:translateX(1.6px) scaleY(1.04)}76%{transform:translateX(-.4px)}84%,100%{transform:none}'}));
}
{
  const p = stand(30, 15, 31.8);
  scene('Basketball', '<rect x="0" y="31.6" width="46" height="2.4" fill="#9a6a44"/>' + line('M0 31.7h46', '#7a5236', .5) +
    g('hkBoard', fill('M40 2.4l5.4-.8v13.4l-5.4.8z', '#e8f4f5', ' stroke="#9fb3b8" stroke-width=".4"') + line('M41.2 7.2l2.8-.4v3.8l-2.8.4z', '#ff7a3d', .6)) +
    g('hkRim', line('M30 13a4.5 1.2 0 0 1 9 0', '#c65a1e', 1)) + shadow(11, 32.7, 7, 'hkShadow') +
    g('hkJump', hubie('hk', Object.assign(p, {held: 'basketball'}))) +
    g('hkBall', dot(34.5, 9.4, 3.4, '#f08a2c') + line('M31.1 9.4h6.8M34.5 6v6.8', '#6a3216', .5)) +
    g('hkRim', line('M30 13a4.5 1.2 0 0 0 9 0', '#ff7a3d', 1.4) + line('M39 13h1', '#ff7a3d', 1.1) +
      g('hkNet', line('M30.4 13.4 31.8 19.6M32.4 14 33.2 19.8M34.5 14.2v5.6M36.6 14 35.8 19.8M38.6 13.4 37.2 19.6M31.8 19.6h5.4M31.2 16.6h6.6', '#e6f3f2', .45))),
    {hkJump: '0%,100%{transform:none}14%{transform:translateY(1px) scaleY(.94)}34%{transform:translate(4px,-2px)}48%{transform:translate(6px,-2.6px)}56%{transform:translate(6px,-1.6px)}66%{transform:translate(6px,-1px)}84%{transform:none}',
     hkShadow: '0%,100%{transform:none;opacity:1}34%{transform:translateX(4px) scale(.8);opacity:.6}48%{transform:translateX(6px) scale(.75);opacity:.55}84%{transform:none;opacity:1}',
     hkArmF: '0%,100%{transform:rotate(0)}14%{transform:rotate(-20deg)}34%{transform:rotate(-100deg)}48%{transform:rotate(-125deg)}56%{transform:rotate(-98deg)}66%{transform:rotate(-90deg)}84%{transform:rotate(0)}',
     hkForeF: '0%,100%{transform:rotate(0)}34%{transform:rotate(-18deg)}48%{transform:rotate(-8deg)}56%{transform:rotate(12deg)}84%{transform:rotate(0)}',
     hkArmB: '0%,100%{transform:rotate(0)}14%{transform:rotate(20deg)}34%{transform:rotate(46deg)}56%{transform:rotate(30deg)}84%{transform:rotate(0)}',
     hkLegF: '0%,100%{transform:rotate(0)}34%{transform:rotate(-18deg)}56%{transform:rotate(-10deg)}84%{transform:rotate(0)}',
     hkLegB: '0%,100%{transform:rotate(0)}34%{transform:rotate(14deg)}56%{transform:rotate(8deg)}84%{transform:rotate(0)}',
     hkHead: '0%,100%{transform:rotate(0)}34%{transform:rotate(-12deg)}56%{transform:rotate(6deg)}84%{transform:rotate(0)}',
     hkHandBall: '0%,55%{opacity:1}56%,95%{opacity:0}100%{opacity:1}',
     hkBall: '0%,55%{opacity:0;transform:translateY(2.6px)}56%{opacity:1;transform:translateY(3px)}64%{transform:translateY(9px)}72%{transform:translateY(19px) scale(1.12,.86)}76%{transform:translate(-1px,14px)}82%{transform:translate(-2px,19px);opacity:1}90%,100%{opacity:0;transform:translate(-2px,19px)}',
     hkRim: '0%,55%{transform:none}59%{transform:rotate(8deg)}64%{transform:rotate(-4deg)}69%{transform:rotate(2deg)}74%,100%{transform:none}',
     hkNet: '0%,56%{transform:none}63%{transform:scale(.9,1.38)}70%{transform:scaleY(.9)}77%,100%{transform:none}',
     hkBoard: '0%,56%,100%{transform:none}59%{transform:translateX(.4px)}63%{transform:translateX(-.3px)}67%{transform:none}'});
}
// Racket / bat / stick sports: keep the scene, remove the old tool, Hubie holds the new one and meets the ball.
// Find a body size and joint angle so the contact point meets the target AND the feet stand on the ground line.
const FEET = 852;
function solveStance(point, chainFor, target, ground, prefH, prefA, span = 40) {
  let best = null;
  for (let h = 14; h <= 34; h += .5) for (let a = prefA - span; a <= prefA + span; a += 1) {
    const p = placeHubie(h, point, chainFor(a), target), w = h * 2 / 3;
    if (p.x < -2 || p.x + w > 47 || p.y < -3) continue;
    const err = Math.abs(p.y + FEET * h / 900 - ground);
    const score = err * 10 + Math.abs(h - prefH) * .3 + Math.abs(a - prefA) * .05;
    if (!best || score < best.score) best = Object.assign(p, {a, score, err});
  }
  return best;
}
const toolSport = (name, pre, oldTools, held, propLen, armAt, foreAt, target, c, h, o = {}) => {
  const ground = o.ground ?? 31;
  const solved = solveStance([PAW[0] + (o.dx || 0), PAW[1] + propLen], a => [[J.foreF, foreAt], [J.armF, a]], target, ground, h, armAt, o.span ?? 40);
  if (solved) { const d = solved.a - armAt; if (o.arm) o.arm = o.arm.map(v => v + d); armAt = solved.a; h = solved.h; }
  const p = Object.assign(placeHubie(h, [PAW[0] + (o.dx || 0), PAW[1] + propLen], [[J.foreF, foreAt], [J.armF, armAt]], target), {held, heldB: o.heldB});
  const base = strip(art[name], ...oldTools);
  const at = o.insertBefore && base.indexOf(o.insertBefore) >= 0 ? base.indexOf(o.insertBefore) : base.length;
  const html = base.slice(0, at) + shadow(p.x + 11 * h / 30, ground + .4, 6 * h / 30) + hubie(pre, p) + base.slice(at);
  scene(name, html, pose('swing', pre, c, {arm: o.arm || [armAt + 110, armAt, armAt - 40], fore: [10, foreAt, foreAt - 12], two: o.two, wind: o.wind}));
};
toolSport('Tennis', 'ht', ['tnRacket'], 'racket', 170, -70, -6, [27, 13], 46, 30, {ground: 31.8, insertBefore: '<g class="tnBall">'});
{  // Cricket: Hubie stands at the crease; the delivery bounces up onto the bat's sweet spot
  const p = Object.assign(stand(22, 13, 31), {held: 'cricketBat'}), hit = at(p, [433, 940], [[J.foreF, -10], [J.armF, -55]]);
  const dx = hit[0] - 41, dy = hit[1] - 19;
  scene('Cricket', strip(art.Cricket, 'ckBat').replace('<g class="ckBall">', shadow(p.x + 8, 32.4, 5) + hubie('cr', p) + '<g class="ckBall">'),
    Object.assign(pose('swing', 'cr', 46, {arm: [120, -55, -110], fore: [10, -10, -22], two: true}),
      {ckBall: '0%{transform:none;opacity:1}26%{transform:translate(' + ((30 - 41)) + 'px,' + (29 - 19) + 'px)}46%{transform:translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px);opacity:1}66%{transform:translate(' + (dx + 14).toFixed(1) + 'px,' + (dy - 20).toFixed(1) + 'px);opacity:1}72%,92%{opacity:0;transform:translate(' + (dx + 16).toFixed(1) + 'px,' + (dy - 23).toFixed(1) + 'px)}100%{transform:none;opacity:1}'}));
}
toolSport('Badminton', 'bd', ['bmRacket'], 'badminton', 200, -175, -10, [17, 11], 45, 22, {arm: [-60, -175, -230], insertBefore: '<g class="bmShuttle">'});
{  // Baseball: Hubie in the box, level swing meets the pitch over the plate
  const p = Object.assign(stand(24, 12, 31), {held: 'baseballBat'}), hit = at(p, [433, 1000], [[J.foreF, -10], [J.armF, -100]]);
  const dx = hit[0] - 42, dy = hit[1] - 20, sx = hit[0] - 27, sy = hit[1] - 24;
  scene('Baseball', strip(art.Baseball, 'bsBat').replace('<g class="bsSpark">', shadow(p.x + 8, 32.4, 5) + hubie('bb', p) + '<g class="bsSpark">'),
    Object.assign(pose('swing', 'bb', 45, {arm: [-200, -100, -50], fore: [10, -10, -22], two: true, wind: -14}),
      {bsBall: '0%{transform:none;opacity:1}45%{transform:translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px);opacity:1}64%{transform:translate(' + (dx + 16).toFixed(1) + 'px,' + (dy - 20).toFixed(1) + 'px);opacity:1}70%,92%{transform:translate(' + (dx + 18).toFixed(1) + 'px,' + (dy - 23).toFixed(1) + 'px);opacity:0}100%{transform:none;opacity:1}',
       bsSpark: '0%,43%{opacity:0;transform:translate(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px) scale(.4)}47%{opacity:1;transform:translate(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px) scale(1.1)}56%,100%{opacity:0;transform:translate(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px) scale(1.3)}'}));
}
toolSport('Ice Hockey', 'ih', ['ihStick', 'ihSpray'], 'hockey', 380, -18, 0, [21, 29.4], 37, 28, {ground: 31.4, two: true, arm: [40, -18, -50], insertBefore: '<g class="ihPuck">'});
toolSport('Floorball', 'fl', ['flStick'], 'floorball', 370, -18, 0, [21, 28.6], 37, 28, {ground: 31.4, two: true, arm: [40, -18, -50], insertBefore: '<g class="flBall">'});
toolSport('Table Tennis', 'tt', ['ttBat'], 'pingpong', 90, -100, -10, [16.6, 12.8], 24, 18, {arm: [-40, -100, -140], insertBefore: '<g class="ttBall">'});
toolSport('Padel Tennis', 'pd', ['pdRacket'], 'padel', 150, -80, -6, [20, 16.4], 39, 28, {arm: [30, -80, -120], insertBefore: '<g class="pdBall">'});
toolSport('Lacrosse', 'lx', ['lxStick'], 'lacrosse', 280, -165, -6, [21, 7], 43, 22, {arm: [-60, -165, -215], insertBefore: '<g class="lxBall">'});
// Throws and spikes: the paw meets the ball.
toolSport('Volleyball', 'vb', ['vbArm'], 'none', 10, -170, -10, [18.4, 9], 42, 24, {arm: [-60, -170, -220], insertBefore: '<g class="vbBall">'});
toolSport('Handball', 'hb', ['hbArm'], 'none', 10, -165, -10, [19.6, 10.4], 42, 24, {arm: [-60, -165, -215], insertBefore: '<g class="hbBall">'});
{
  const name = 'Water Polo', p = placeHubie(20, [PAW[0], PAW[1] + 10], [[J.foreF, -10], [J.armF, -165]], [19.4, 11]);
  const base = strip(art[name], 'wpArm').replace(/<circle cx="9" cy="22.4"[^>]*\/>/, '').replace('<path d="M7 21.6h4"', '<path d="M0 0"');
  const at = base.indexOf('<g class="wpBall">');
  scene(name, base.slice(0, at) + hubie('wp', Object.assign(p, {noLegs: true})) + base.slice(at), pose('swing', 'wp', 42, {arm: [-60, -165, -215], fore: [10, -10, -22]}));
}
// Kicking sports
const kickSport = (name, pre, oldLeg, ball, c, h, ballAt) => {
  // Hubie stands full size on the ground; the ball (and its flight) shifts to meet his boot at contact.
  const p0 = stand(h, 0, 31.2), toe = at(p0, TOE, [[J.legF, -34]]);
  const p = Object.assign({}, p0, {x: p0.x + (ballAt[0] - 2.4 - toe[0])});
  // Keep all of Hubie inside the icon: slide him and the ball (with its flight) right if he would be cut off.
  const room = Math.max(0, 1 - p.x); p.x += room;
  const dy = (toe[1] - 1.4) - ballAt[1];
  const base = strip(art[name], oldLeg), el = SM.element(base, ball);
  const tr = '<g transform="translate(' + room.toFixed(2) + ' ' + dy.toFixed(2) + ')">';
  const shifted = base.replace(el, tr + el + '</g>');
  const at2 = shifted.indexOf(tr);
  scene(name, shifted.slice(0, at2) + shadow(p.x + 11 * h / 30, 31.6, 6 * h / 30) + hubie(pre, p) + shifted.slice(at2), pose('kick', pre, c));
};
kickSport('American Football', 'af', 'afThigh', 'afBall', 38, 24, [10.6, 26.2]);
kickSport('Rugby', 'rg', 'rgThigh', 'rgBall', 35, 24, [10.8, 25.6]);
kickSport('Aussie Rules', 'ar', 'arThigh', 'arBall', 34, 24, [10, 22.5]);
art['Rugby League'] = art.Rugby.replace(/#2f86d6/g, '#e8473f');
// Fighting and pushing
{
  const p = placeHubie(26, [433, 790], [[J.foreF, 0], [J.armF, -90]], [28.6, 15.6]);
  const base = strip(art.Boxing, 'bxGlove');
  scene('Boxing', shadow(p.x + 10, 32.6, 6) + hubie('bx', Object.assign(p, {held: 'glove', heldB: 'glove'})) + base, pose('punch', 'bx', 40));
}
{
  const base = strip(art.MMA, 'mmLeft', 'mmRight');
  const me = Object.assign(stand(24, 15, 31.4), {held: 'redGlove', heldB: 'redGlove'});
  const rival = Object.assign(mirror(stand(24, 15, 31.4)), {held: 'glove', heldB: 'glove', rival: true});
  scene('MMA', base + hubie('mm', me) + hubie('mr', rival), Object.assign(pose('punch', 'mm', 28), pose('punch', 'mr', 76)));
}
{
  const base = strip(art.Sumo, 'smLeft', 'smRight');
  const me = stand(24, 17, 31.4), rival = Object.assign(mirror(stand(24, 17, 31.4)), {rival: true});
  scene('Sumo', base + hubie('su', me) + hubie('sr', rival), Object.assign(pose('push', 'su', 40), pose('push', 'sr', 70)));
}
{
  const base = strip(art.Kabaddi, 'kbRaider', 'kbDefender');
  const me = stand(24, 16, 29.4), rival = Object.assign(mirror(stand(24, 16, 29.4)), {rival: true});
  scene('Kabaddi', base + hubie('kb', me) + hubie('kr', rival), Object.assign(pose('punch', 'kb', 42), pose('cheer', 'kr', 50)));
}
// Darts, Biathlon, Snooker, Bowls, Chess
{
  // A bigger Hubie and a smaller board (the board and its thrown dart are scaled together).
  const p = solveStance(PAW, a => [[J.foreF, 0], [J.armF, a]], [15.4, 15], 30.6, 28, -90, 30);
  scene('Darts', G31(30.6, '#1e2f36', '#35606a') + shadow(p.x + 8, 33, 5) + hubie('dt', p) + '<svg x="19" y="7" width="27" height="20" viewBox="0 0 46 34" overflow="visible">' + art.Darts + '</svg>', pose('aim', 'dt', 8, {at: p.a}));
}
{
  const p = solveStance([PAW[0], PAW[1] + 400], a => [[J.foreF, 0], [J.armF, a]], [23.4, 12], 30.2, 18, -90, 30);
  const base = art.Biathlon.replace(/^[\s\S]*?(<g class="btRifle">)/, '$1');
  const keep = strip(base, 'btRifle');
  scene('Biathlon', fill('M0 30h46v4H0z', '#e6f6ff') + hubie('bt', Object.assign(p, {held: 'rifle', skis: true})) + g('btRifle', g('btFlash', fill('M22 11.2l3-1.2-1 2 3 .4-3 .8 1 1.8-3-1.2z', '#ffe08a'))) + keep, pose('aim', 'bt', 10, {at: p.a}));
}
{
  const base = art.Snooker;
  const p = stand(28, 13, 31);
  scene('Snooker', hubie('sn', Object.assign(p, {held: 'none'})) + base, pose('think', 'sn', 30));
}
{
  const p = placeHubie(16, PAW, [[J.foreF, 0], [J.armF, 0]], [7, 27]);
  scene('Bowls', art.Bowls.replace('<g class="blJack">', hubie('bw', p) + '<g class="blJack">'), pose('roll', 'bw', 16));
}
{ const pawn = SM.element(art.Chess, 'chPawn'); scene('Chess', strip(art.Chess, 'chPawn') + hubie('ch', stand(18, 9, 33.6)) + pawn, pose('think', 'ch', 40)); }
// Golf: putt into the hole
{
  const p = Object.assign(stand(26, 14, 31.2), {held: 'golf', gripB: '262 -70'}), club = at(p, [PAW[0] + 40, PAW[1] + 345], [[J.foreF, 0], [J.armF, -12]]);
  const bx = club[0] + 2.2, by = Math.min(30.2, club[1] - .8), roll = (38 - bx).toFixed(1);
  scene('Golf', G31(31) + '<ellipse cx="38" cy="31.3" rx="2.4" ry=".7" fill="#0b1a10"/>' + line('M38.4 31V6', '#cfd8da', .8) + fill('M38.6 6l6 2.2-6 2.4z', '#e8473f') +
    shadow(p.x + 9, 31.6, 5) + hubie('gf', p) + g('gfBall', dot(bx.toFixed(2), by.toFixed(2), 1.3, '#f3f8f7')),
    Object.assign(pose('swing', 'gf', 34, {arm: [30, -12, -40], fore: [0, 0, -6], two: true, wind: 10}),
      {gfBall: '0%,34%{transform:none;opacity:1}70%{transform:translate(' + roll + 'px,' + (31 - by - .3).toFixed(1) + 'px);opacity:1}74%{transform:translate(' + roll + 'px,' + (31.6 - by).toFixed(1) + 'px) scale(.6);opacity:0}92%{opacity:0;transform:none}100%{opacity:1}'}));
  ORIGIN_EXTRA.gfBall = bx.toFixed(2) + 'px ' + by.toFixed(2) + 'px';
}
// Winter sports
{
  const base = strip(art['Cross-Country'], 'ccBack', 'ccFront').replace(/<circle cx="22" cy="6.4"[^>]*\/>/, '').replace(/<path d="M20 6l2\.2[^>]*\/>/, '').replace(/<path d="M21 9 17 17"[^>]*\/>/, '');
  scene('Cross-Country', base + hubie('cc', Object.assign(stand(28, 24, 29.4), {held: 'pole', heldB: 'pole', skis: true})), pose('ski', 'cc'));
}
scene('Alpine Skiing', strip(art['Alpine Skiing'], 'asSkier') + g('asSkier', hubie('as', Object.assign(stand(20, 22, 26.6), {skis: true}))), Object.assign(pose('tuck', 'as'),
  {asSkier: '0%,100%{transform:rotate(-6deg) translateY(-1px)}50%{transform:rotate(6deg) translateY(1px)}'}));
scene('Ski Jumping', art['Ski Jumping'].replace(SM.element(art['Ski Jumping'], 'sjJumper'), g('sjJumper', hubie('sj', Object.assign({h: 11, x: 21, y: 9}, {skis: true})))), pose('tuck', 'sj'));
// Riders and drivers: Hubie's head replaces the helmet
const swapHead = (name, re, cx, cy, r) => { if (art[name]) art[name] = art[name].replace(re, headOnly(cx, cy, r)); };
swapHead('Formula 1', /<circle cx="24\.2" cy="15\.6" r="1\.4" fill="#ffd34d"\/>/, 24.2, 15.8, 2.6);
swapHead('Formula 2', /<circle cx="24\.2" cy="15\.6" r="1\.4" fill="#ffd34d"\/>/, 24.2, 15.8, 2.6);
swapHead('Motorcycle Racing', /<circle cx="26\.4" cy="11\.6" r="2\.2" fill="#ffd34d"\/>/, 26.4, 11.6, 2.8);
swapHead('Horse Racing', /<circle cx="23\.8" cy="4" r="1\.6" fill="#ffd34d"\/>/, 23.8, 4.6, 2.4);
swapHead('Harness', /<circle cx="14\.6" cy="8\.4" r="1\.8" fill="#ffd34d"\/>/, 14.6, 8.6, 2.4);
for (const n of ['Motor Racing', 'Nascar', 'Touring Car Racing']) if (art[n]) art[n] = art[n].replace('<path d="M17.6 16.4h6.4l3 2.8h-10.6z" fill="#163a44"/>', '<path d="M17.6 16.4h6.4l3 2.8h-10.6z" fill="#163a44"/>' + headOnly(22, 17, 2.2));
art.Sailing = art.Sailing.replace('<g class="slSail">', headOnly(17, 22.4, 2.6) + '<g class="slSail">');
art.Greyhound = hubie('gh', stand(12, 45, 29.6)) + art.Greyhound;
Object.assign(FR, pose('cheer', 'gh'));
// Cycling: Hubie on the bike, legs pedalling
{
  const base = art.Cycling.replace(/<path d="M17 12\.6 25\.6 8"[^>]*\/>/, '').replace(/<circle cx="27\.4" cy="6\.4"[^>]*\/>/, '').replace(/<path d="M25 8\.6l4\.6 3"[^>]*\/>/, '');
  const noLeg = strip(base, 'cyLeg');
  scene('Cycling', noLeg + hubie('cy', {h: 20, x: 12, y: -1.6}), Object.assign(pose('ski', 'cy'), {cyBody: '0%,100%{transform:rotate(28deg) translateY(0)}50%{transform:rotate(28deg) translateY(-8px)}',
    cyArmF: '0%,100%{transform:rotate(-70deg)}', cyArmB: '0%,100%{transform:rotate(-60deg)}', cyLegF: '0%,100%{transform:rotate(-40deg)}50%{transform:rotate(10deg)}', cyLegB: '0%,100%{transform:rotate(10deg)}50%{transform:rotate(-40deg)}'}));
}
// Esports Hub: Hubie with a headset
art['Esports Hub'] = headOnly(23, 20, 7) + art['Esports Hub'];

// ---- Esports: Hubie with cartoon blasters for the shooters, animated official marks for the rest ----
// Blasters are drawn down the forearm (grip at the paw); with the arm at -90deg they point forward.
PROP.blaster = fill('M396 690h74v300h-74z', '#2a3a44') + fill('M406 980h54v40h-54z', '#3b4f5c') + line('M433 1020v150', '#1e2a30', 26) +
  fill('M340 800h58v70h-58z', '#ff8a3d') + fill('M410 640h46v60h-46z', '#6b4a2c') + line('M470 760h26', '#8be3d6', 10) + dot(433, 1190, 14, '#10181c');
PROP.pistol = fill('M402 720h62v170h-62z', '#2a3a44') + line('M433 890v70', '#1e2a30', 24) + fill('M352 740h52v60h-52z', '#ff8a3d');
const flash = (cls, x, y, s = 1) => g(cls, '<path d="M' + x + ' ' + y + 'l' + 4 * s + '-1.6-1 1.6 3.6.6-3.6.8 1 1.8-4-1.4z" fill="#ffe08a"/>' + dot(x + .8 * s, y, 1.2 * s, '#fff6c8'));
const recoil = (at, shots) => K(['0%,100%', R(at)], ...shots.flatMap(t => [[t + '%', R(at - 3)], [(t + 3) + '%', R(at + 7)], [(t + 9) + '%', R(at)]]));
const flashes = shots => '0%,100%{opacity:0;transform:scale(.4)}' + shots.map(t => t + '%{opacity:0;transform:scale(.4)}' + (t + 1) + '%{opacity:1;transform:scale(1.1)}' + (t + 5) + '%{opacity:0;transform:scale(1.3)}').join('');
{  // Counter-Strike 2: Hubie fires at a supply crate
  const p = Object.assign(stand(28, 15, 31.2), {held: 'blaster'}), muzzle = at(p, [433, 1190], [[J.foreF, 0], [J.armF, -90]]);
  scene('Counter-Strike 2', G31(31.2, '#3b3427', '#5c5038') +
    g('csCrate', fill('M33 19h11v12H33z', '#9a6a3c', ' stroke="#5c3d20" stroke-width=".6"') + line('M33 19l11 12M44 19 33 31', '#6b4a2c', 1) + line('M33 25h11', '#5c3d20', .6)) +
    g('csSpark', line('M33.4 22l-2-1m2 3h-2.4m2.4 2-2 1', '#ffe08a', .8)) + shadow(p.x + 10, 31.6, 6) + hubie('cs', p) + flash('csFlash', muzzle[0], muzzle[1], 1.1),
    {csArmF: recoil(-90, [18, 46, 74]), csArmB: K(['0%,100%', R(-70)]), csForeB: K(['0%,100%', R(-40)]), csHead: K(['0%,100%', R(-3)]),
     csBody: K(['0%,100%', 'none'], ['20%', 'translateX(-8px)'], ['48%', 'translateX(-8px)'], ['76%', 'translateX(-8px)']),
     csFlash: flashes([18, 46, 74]), csSpark: flashes([20, 48, 76]),
     csCrate: K(['0%,19%,100%', 'none'], ['21%', 'translateX(.6px)'], ['25%,47%', 'none'], ['49%', 'translateX(.6px)'], ['53%,75%', 'none'], ['77%', 'translateX(.6px)'], ['81%', 'none'])});
  ORIGIN_EXTRA.csFlash = muzzle.map(v => v.toFixed(1) + 'px').join(' ');
  ORIGIN_EXTRA.csSpark = '32px 23px';
  ORIGIN_EXTRA.csCrate = '38.5px 31px';
}
{  // Call of Duty: Hubie behind sandbags, tracer rounds downrange
  const p = Object.assign(stand(28, 16, 33.4), {held: 'blaster'}), muzzle = at(p, [433, 1190], [[J.foreF, 0], [J.armF, -92]]);
  scene('Call of Duty', '<rect x="0" y="0" width="46" height="34" fill="#16231c"/>' + line('M0 30h46', '#3c4a34', 1) +
    hubie('cd', p) + g('cdSand', fill('M1 26q4-3 8 0 4-3 8 0 4-3 8 0v6H1z', '#8d7a52', ' stroke="#5c4f34" stroke-width=".5"')) +
    flash('cdFlash', muzzle[0], muzzle[1], 1.1) + g('cdTracer', line('M' + (muzzle[0] + 3).toFixed(1) + ' ' + muzzle[1].toFixed(1) + 'h7', '#ffd36b', .7)) +
    fill('M40 14h3v10h-3z', '#46553d') + dot(41.5, 12.6, 1.6, '#46553d'),
    {cdArmF: recoil(-92, [16, 30, 44, 70]), cdArmB: K(['0%,100%', R(-72)]), cdForeB: K(['0%,100%', R(-36)]), cdHead: K(['0%,100%', R(-4)]),
     cdFlash: flashes([16, 30, 44, 70]),
     cdTracer: '0%,100%{opacity:0;transform:none}' + [16, 30, 44, 70].map(t => t + '%{opacity:0;transform:none}' + (t + 1) + '%{opacity:1;transform:none}' + (t + 7) + '%{opacity:0;transform:translateX(16px)}').join('')});
  ORIGIN_EXTRA.cdFlash = muzzle.map(v => v.toFixed(1) + 'px').join(' ');
}
{  // CS2 Duels: Hubie and his rival trade pistol shots
  const me = Object.assign(stand(24, 14, 31.2), {held: 'pistol'}), rival = Object.assign(mirror(stand(24, 14, 31.2)), {held: 'pistol', rival: true});
  const m1 = at(me, [433, 960], [[J.foreF, 0], [J.armF, -90]]);
  scene('CS2 Duels', G31(31.2, '#3b3427', '#5c5038') + shadow(me.x + 9, 31.6, 5) + shadow(46 - me.x - 9, 31.6, 5) + hubie('dl', me) + hubie('dr', rival) +
    flash('dlFlash', m1[0], m1[1]) + '<g transform="translate(46 0) scale(-1 1)">' + flash('drFlash', m1[0], m1[1]) + '</g>',
    {dlArmF: recoil(-90, [14, 62]), drArmF: recoil(-90, [38, 86]), dlArmB: K(['0%,100%', R(-20)]), drArmB: K(['0%,100%', R(-20)]),
     dlBody: K(['0%,36%,100%', 'none'], ['40%', 'rotate(-6deg) translateX(-14px)'], ['50%', 'none']),
     drBody: K(['0%,12%,58%,100%', 'none'], ['16%', 'rotate(-6deg) translateX(-14px)'], ['26%', 'none'], ['64%', 'rotate(-6deg) translateX(-14px)'], ['74%', 'none']),
     dlFlash: flashes([14, 62]), drFlash: flashes([38, 86])});
  ORIGIN_EXTRA.dlFlash = ORIGIN_EXTRA.drFlash = m1.map(v => v.toFixed(1) + 'px').join(' ');
}
// Official marks (Simple Icons paths) on a soft glow, with a shine sweep and gentle pulse on hover/selection.
const MARKS = window.esportsMarks || {};
const markScene = (cls, path, color, glow) => '<circle cx="23" cy="17" r="15" fill="' + glow + '" opacity=".22"/>' +
  g(cls, '<path d="' + path + '" transform="translate(11 5)" fill="' + color + '"/>') +
  g(cls + 'Shine', '<path d="M4 34 14 0h5L9 34z" fill="#fff" opacity=".35"/>', ' style="opacity:0"');
const markFrames = cls => ({[cls]: K(['0%,100%', 'scale(1)'], ['50%', 'scale(1.08)']), [cls + 'Shine']: '0%,40%{transform:translateX(-14px);opacity:0}50%{opacity:1}80%,100%{transform:translateX(40px);opacity:0}'});
for (const [name, key, color, glow] of [['League of Legends', 'leagueoflegends', '#c8a254', '#c8a254'], ['Dota 2', 'dota2', '#e0382b', '#e0382b'],
    ['FIFA', 'ea', '#f3f8f7', '#2f86d6'], ['Madden', 'ea', '#f3f8f7', '#2f86d6'], ['NBA2K', '2k', '#e4002b', '#e4002b']]) {
  if (!MARKS[key]) continue;
  const cls = 'mk' + key.replace(/\W/g, '');
  art[name] = markScene(cls, MARKS[key], color, glow);
  Object.assign(FR, markFrames(cls));
  ORIGIN_EXTRA[cls] = '23px 17px';
}

// ---- Header brand: Hubie surfing a wave while doing keepy-ups (plays continuously beside the logo) ----
{
  const p = {h: 33, x: 13, y: 2.6};
  const knee = at(p, [362, 735], [[J.legF, -40]]), bx = knee[0] + .4, by = knee[1] - 2.8;
  const wave = (cls, y, c, o = 1) => g(cls, '<path d="M-16 ' + y + 'q8-5 16 0t16 0 16 0 16 0 16 0 16 0V46H-16z" fill="' + c + '" opacity="' + o + '"/>');
  window.hubieBrandScene = () => '<svg class="motionIcon brandScene" viewBox="0 0 60 46" aria-hidden="true">' +
    wave('hzWaveBack', 37, '#2a6fb5', .7) +
    g('hzRide', hubie('hz', Object.assign({tux: true}, p)) + '<ellipse cx="26" cy="35.6" rx="13.5" ry="1.7" transform="rotate(-5 26 35.6)" fill="#ffd36b" stroke="#c48a1e" stroke-width=".6"/>' +
      line('M14 36.6l23-2', '#e8473f', .7)) +
    g('hzBall', g('hzSpin', dot(bx.toFixed(2), by.toFixed(2), 2.6, '#eef4f3', ' stroke="#10252b" stroke-width=".35"') +
      fill('M' + bx.toFixed(2) + ' ' + (by - 1.2).toFixed(2) + 'l1.1.8-.4 1.3h-1.4l-.4-1.3z', '#1d3b44'))) +
    wave('hzWave', 39.5, '#3d8fd6') + g('hzSpray', dot(40, 36.4, .6, '#e6f6ff') + dot(42.4, 35.2, .5, '#e6f6ff') + dot(44, 36.8, .45, '#e6f6ff')) +
    '</svg>';
  Object.assign(FR, {
    hzLegF: K(['0%,100%', R(-40)], ['14%', R(-12)], ['50%', R(0)], ['86%', R(-12)]),
    hzLegB: K(['0%,100%', R(4)], ['50%', R(-2)]),
    hzArmF: K(['0%,100%', R(-62)], ['50%', R(-80)]),
    hzArmB: K(['0%,100%', R(58)], ['50%', R(74)]),
    hzHead: K(['0%,100%', R(4)], ['50%', R(-12)]),
    hzBody: K(['0%,100%', R(0)], ['50%', R(-3)]),
    hzRide: '0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-1.2px) rotate(2deg)}',
    hzBall: '0%{transform:none;animation-timing-function:cubic-bezier(.25,.6,.45,1)}50%{transform:translateY(-15px);animation-timing-function:cubic-bezier(.55,0,.75,.4)}100%{transform:none}',
    hzSpin: '0%{transform:rotate(0)}100%{transform:rotate(-360deg)}',
    hzWave: 'from{transform:translateX(0)}to{transform:translateX(16px)}',
    hzWaveBack: 'from{transform:translateX(0)}to{transform:translateX(-16px)}',
    hzSpray: '0%,100%{opacity:0;transform:none}40%{opacity:1}80%{opacity:0;transform:translate(3px,-2px)}'
  });
  Object.assign(ORIGIN_EXTRA, {hzRide: '26px 36px', hzBall: bx.toFixed(2) + 'px ' + by.toFixed(2) + 'px', hzSpin: bx.toFixed(2) + 'px ' + by.toFixed(2) + 'px',
    hzWave: '0 0', hzWaveBack: '0 0', hzSpray: '42px 36px'});
}

// ---- CSS for every Hubie joint and prop ----
const ORIGIN = {};
for (const pre of Object.keys(FR).map(k => k.replace(/(Body|LegB|LegF|ArmB|ForeB|ArmF|ForeF|Head)$/, '')).filter((v, i, a) => a.indexOf(v) === i))
  for (const [j, [x, y]] of Object.entries({Body: J.body, LegB: J.legB, LegF: J.legF, ArmB: J.armB, ForeB: J.foreB, ArmF: J.armF, ForeF: J.foreF, Head: J.head})) ORIGIN[pre + j] = x + 'px ' + y + 'px';
Object.assign(ORIGIN, {hfBall: '20px 29.4px', hfBallSh: '20px 32.4px', hfNet: '43.5px 20px', hkJump: '11px 33px', hkShadow: '11px 32.7px', hkHandBall: '433px 800px',
  hkBall: '34.5px 9.4px', hkRim: '39px 13px', hkNet: '34.5px 13px', hkBoard: '42px 8px'}, ORIGIN_EXTRA);
const triggers = [':is(button,a):is(:hover,:focus-visible,:active,[aria-pressed=true])', '.active', '.brandHubie'];
// Resting poses: the first keyframe of each joint, so idle icons show the ready stance.
let css = '.hbPuppet image{image-rendering:auto}.motionIcon .hkBall{opacity:0}';
for (const [cls, f] of Object.entries(FR)) {
  const first = /^[^{]*\{transform:([^;}]+)/.exec(f);
  css += '.motionIcon .' + cls + '{transform-origin:' + (ORIGIN[cls] || '0 0') + (first && /(Arm|Fore|Body|Leg|Head)/.test(cls) ? ';transform:' + first[1] : '') + '}' +
    '@keyframes hb-' + cls + '{' + f + '}' + triggers.map(t => 'html.iconMotionEnabled ' + t + ' .motionIcon .' + cls).join(',') + '{animation:hb-' + cls + ' 1.6s ease-in-out infinite!important}';
}
css += 'html:not(.iconMotionEnabled) .motionIcon *{animation:none!important}';
const style = document.createElement('style');
style.id = 'hubieMotion';
style.textContent = css;
document.head.appendChild(style);
// Kit colours per sport for the icon puppet: jersey (top) and shorts (bottom). Anything not listed wears Housebets teal.
const KIT_COLOURS = {'Football': ['#e8473f', '#f3f8f7'], 'Tennis': ['#f7f7f2', '#2c4f8c'], 'Basketball': ['#7a3fd1', '#7a3fd1'],
  'American Football': ['#1f4fa8', '#ece4cf'], 'Baseball': ['#f3f6f6', '#9aa7ad'], 'Ice Hockey': ['#c8102e', '#1d2226'],
  'Cricket': ['#f6f1e3', '#f6f1e3'], 'Rugby': ['#1d7a40', '#f3f8f7'], 'Rugby League': ['#e0a21b', '#1d2226'], 'Aussie Rules': ['#14325c', '#f3f8f7'],
  'Volleyball': ['#ffd23f', '#1f3b73'], 'Handball': ['#2fa4a8', '#163a44'], 'Badminton': ['#3fb7e8', '#f3f8f7'], 'Table Tennis': ['#e8473f', '#1d2226'],
  'Boxing': ['#f2c230', '#c8102e'], 'MMA': ['#25292d', '#e8473f'], 'Darts': ['#2c5aa0', '#1d2226'], 'Golf': ['#ff8fb1', '#e9e3cf'],
  'Snooker': ['#1d2226', '#1d2226'], 'Cycling': ['#f2c230', '#1d2226'], 'Water Polo': ['#2f86d6', '#2f86d6']};
const slug = n => n.replace(/\W+/g, '').toLowerCase();
const used = new Set();
for (const name of Object.keys(art)) if (art[name] && art[name].includes('HKKIT')) { art[name] = art[name].replace(/HKKIT/g, slug(name)); used.add(name); }
{
  const m = c => { const n = parseInt(c.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255].map(v => (v / 255).toFixed(3)); };
  const f = (id, c) => { const [r, gg, b] = m(c); return '<filter id="' + id + '" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="' + r + ' 0 0 0 0 0 ' + gg + ' 0 0 0 0 0 ' + b + ' 0 0 0 0 0 1 0"/></filter>'; };
  const defs = [...used].map(n => { const [t, b] = KIT_COLOURS[n] || ['#22b79c', '#173d47']; return f('hkf-' + slug(n) + '-t', t) + f('hkf-' + slug(n) + '-b', b); }).join('');
  const holder = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  holder.setAttribute('aria-hidden', 'true'); holder.setAttribute('width', '0'); holder.setAttribute('height', '0');
  holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  holder.innerHTML = '<defs>' + defs + '</defs>';
  document.body.appendChild(holder);
}
SM.rebuild();
window.hubieFrames = FR;
// Small icons (sidebar, sport bar) zoom in on Hubie and his action; the focus is his upper body, pulled toward the scene centre.
const focus = {};
for (const [name, html] of Object.entries(art)) {
  const m = /<svg class="hbPuppet" x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"/.exec(html);
  if (!m) continue;
  const [x, y, w, h] = m.slice(1).map(Number);
  focus[name] = [((x + w * .6) * .6 + 23 * .4).toFixed(1), ((y + h * .42) * .6 + 17 * .4).toFixed(1)];
}
const iconBeforeFocus = icon;
icon = function(name) {
  const html = iconBeforeFocus(name), f = focus[name];
  return f ? html.replace('<svg ', '<svg style="--zx:' + f[0] + 'px;--zy:' + f[1] + 'px" ') : html;
};
render();
}
