'use strict';
/* Esports icons: recognisable game-style emblems instead of generic figures (all submissions).
   - Counter-Strike 2: a counter-terrorist (navy helmet, goggles, M4) facing a terrorist (balaclava, AK), alternating
     muzzle flashes.
   - CS2 Duels: an AWP scope view with a target in the crosshair and a "1v1" tag, so it is clearly not CS2.
   - Call of Duty: a soldier bust (helmet with glowing quad night-vision goggles, skull mask, plate carrier).
   - The others: the game's mark on a brand-coloured app-style tile (official Simple Icons marks for League of Legends,
     Dota 2, EA and 2K from esports-marks.js; drawn emblems for the rest). Marks remain their owners' trademarks.
   Icons are 46 x 34 like the sport scenes; animation plays on hover/selection with the Animations switch on. */
{
const M = window.esportsMarks || {};
const svg = (name, body, cls = '') => '<svg aria-hidden="true" class="sportIcon actionIcon motionIcon esIcon ' + cls + '" data-esport="' + name + '" viewBox="0 0 46 34">' + body + '</svg>';
const tile = (id, a, b) => '<defs><linearGradient id="esg' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs>' +
  '<rect x="6" y="0.5" width="34" height="33" rx="8" fill="url(#esg' + id + ')"/><rect x="6.5" y="1" width="33" height="32" rx="7.5" fill="none" stroke="#ffffff22"/>';
const mark = (path, color, x = 11, y = 5, s = 1) => '<g class="esMark" transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="' + path + '" fill="' + color + '"/></g>';
const text = (t, color, size, y = 22, extra = '') => '<text x="23" y="' + y + '" text-anchor="middle" font-family="Bahnschrift,Segoe UI,sans-serif" font-weight="900" font-size="' + size + '" fill="' + color + '"' + extra + '>' + t + '</text>';

// Characters
const ct = '<g class="esCT">' +
  '<path d="M3 34v-6.5c0-3 2.4-5 5.4-5.4l3.4-.5 3.4.5c3 .4 5.3 2.4 5.3 5.4V34z" fill="#1f3a5c"/>' +            // vest
  '<path d="M7 26h10M7.6 29h9" stroke="#34587f" stroke-width="1.1"/>' +
  '<ellipse cx="11.8" cy="16.6" rx="3.6" ry="4.2" fill="#d9a77c"/>' +                                            // face
  '<path d="M7.6 15.6c0-4 2-6.6 4.3-6.6s4.4 2.4 4.4 6.4l-1-.4H8.6z" fill="#2a4766"/>' +                           // helmet
  '<rect x="9" y="15" width="7.6" height="2.6" rx="1.2" fill="#0d1620"/><rect x="9.6" y="15.5" width="6.4" height="1.4" rx=".7" fill="#7fd3ff" opacity=".9"/>' + // goggles
  '<path d="M9.3 19.7h5.2v2H9.3z" fill="#2a4766"/>' +                                                              // mask
  '<g class="esGunL"><path d="M13.6 24h9v1.8h-9zM15.5 22.8h3v1.2h-3zM16.2 25.8h1.8l-.6 3h-1.8z" fill="#1a1d22"/><path d="M22.6 24.9h1.4" stroke="#1a1d22" stroke-width=".9"/></g>' +
  '<g class="esFlashL"><path d="M24.2 25l3-1.4-1.4 1.4 2 .2-2 .7 1.4 1.2-3-1.1z" fill="#ffd166"/></g></g>';
const tt = '<g class="esT">' +
  '<path d="M43 34v-6.5c0-3-2.4-5-5.4-5.4l-3.4-.5-3.4.5c-3 .4-5.3 2.4-5.3 5.4V34z" fill="#6b4a2b"/>' +          // jacket
  '<path d="M39 26h-10M38.4 29h-9" stroke="#8a6340" stroke-width="1.1"/>' +
  '<path d="M30 16.4c0-4.6 1.8-7.6 4.2-7.6s4.2 3 4.2 7.6c0 3-1.8 5.4-4.2 5.4S30 19.4 30 16.4z" fill="#262626"/>' + // balaclava
  '<rect x="31.2" y="14.6" width="6" height="2.2" rx="1" fill="#d9a77c"/><circle cx="32.8" cy="15.7" r=".55" fill="#111"/><circle cx="35.6" cy="15.7" r=".55" fill="#111"/>' +
  '<path d="M30 13.6h8.4" stroke="#c0622b" stroke-width="1.2"/>' +                                                  // headband
  '<g class="esGunR"><path d="M32.4 24h-9v1.8h9zM30.5 22.8h-3v1.2h3zM29.8 25.8h-1.8l1.4 3h1.8z" fill="#2b1d12"/><path d="M27 25.8c.4 1.4.8 2.2 1.8 2.8" stroke="#2b1d12" stroke-width="1.3" fill="none"/><path d="M23.4 24.9h-1.4" stroke="#2b1d12" stroke-width=".9"/></g>' +
  '<g class="esFlashR"><path d="M21.8 25l-3-1.4 1.4 1.4-2 .2 2 .7-1.4 1.2 3-1.1z" fill="#ffb347"/></g></g>';
const cs2 = svg('Counter-Strike 2',
  '<defs><linearGradient id="esCsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9b86a"/><stop offset="1" stop-color="#8a5a2c"/></linearGradient></defs>' +
  '<rect width="46" height="34" rx="6" fill="url(#esCsSky)"/>' +
  '<path d="M0 22h46v12H0z" fill="#b98a4e" opacity=".55"/><path d="M17 22v-7a6 6 0 0 1 12 0v7z" fill="#6f4a25" opacity=".5"/>' +    // Dust-style arch
  ct + tt, 'esCs');
const duels = svg('CS2 Duels',
  '<rect width="46" height="34" rx="6" fill="#0f1a1f"/>' +
  '<defs><radialGradient id="esScope" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#4a6a5c"/><stop offset=".85" stop-color="#22362f"/><stop offset="1" stop-color="#05090a"/></radialGradient></defs>' +
  '<g class="esScopeG"><circle cx="23" cy="17" r="15" fill="url(#esScope)"/>' +
  '<path d="M30 20v-3.6c0-2.4 1.4-4 3-4s3 1.6 3 4V20zM31.4 12.6c0-1.6.7-2.8 1.6-2.8s1.6 1.2 1.6 2.8" fill="#151515" opacity=".85" transform="translate(-10 3)"/>' + // target silhouette
  '<path d="M23 2v30M8 17h30" stroke="#0b0b0b" stroke-width=".8"/><path d="M23 13.5v-3M23 20.5v3M19.5 17h-3M26.5 17h3" stroke="#0b0b0b" stroke-width="1.6"/>' +
  '<circle cx="23" cy="17" r="15" fill="none" stroke="#000" stroke-width="2.4"/></g>' +
  '<circle class="esDot" cx="23" cy="17" r="1" fill="#ff3b3b"/>' +
  '<rect x="30.5" y="25.5" width="14" height="7.5" rx="2" fill="#e8473f"/>' + text('1v1', '#fff', 6.4, 31.4, ' x="37.5"').replace('x="23" ', ''), 'esDuels');
const cod = svg('Call of Duty',
  '<defs><linearGradient id="esCod" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2e3a28"/><stop offset="1" stop-color="#11170f"/></linearGradient></defs>' +
  '<rect width="46" height="34" rx="6" fill="url(#esCod)"/>' +
  '<path class="esScan" d="M0 8h46" stroke="#9cff8a" stroke-width=".6" opacity=".25"/>' +
  '<path d="M8 34v-5c0-4 3-6.6 7-7.4l8-1.4 8 1.4c4 .8 7 3.4 7 7.4v5z" fill="#4b5536"/>' +                             // plate carrier
  '<path d="M16 25h14v9H16z" fill="#3a4229"/><path d="M17.5 27h4M24.5 27h4M17.5 30h4M24.5 30h4" stroke="#252b1a" stroke-width="1.4"/>' +
  '<path d="M16.4 17.4c0-5.4 3-8.8 6.6-8.8s6.6 3.4 6.6 8.8c0 4-2.8 6.8-6.6 6.8s-6.6-2.8-6.6-6.8z" fill="#1c1c1a"/>' +   // balaclava
  '<path d="M19.2 18.4c.8-1.2 2.2-1.4 3.8-1.4s3 .2 3.8 1.4l-.4 2.6c-.6 1.2-1.8 1.8-3.4 1.8s-2.8-.6-3.4-1.8z" fill="#e8e3d4"/>' + // skull mask
  '<path d="M21.2 19.6h1.2M23.6 19.6h1.2M21 21h4" stroke="#1c1c1a" stroke-width=".7"/>' +
  '<path d="M15 13.6c0-5.4 3.6-8.6 8-8.6s8 3.2 8 8.6l-1 .6H16z" fill="#56603f"/><path d="M15 13.6h16" stroke="#3a4229" stroke-width="1.2"/>' + // helmet
  '<g class="esNvg"><rect x="18" y="11.2" width="10" height="4.4" rx="1.4" fill="#141414"/>' +
  [19.6, 22, 24, 26.4].map(x => '<circle cx="' + x + '" cy="13.4" r="1.05" fill="#7dff6a"/>').join('') + '</g>' +
  '<path d="M33 30.4l3-1.6M34 32l3-1.6" stroke="#c9c9b0" stroke-width=".7"/>', 'esCod');

// Tiles for the rest
const tiles = {
  'League of Legends': () => svg('League of Legends', tile('lol', '#0a1428', '#123456') + mark(M.leagueoflegends || '', '#c8aa6e', 12, 5, 1), 'esTile'),
  'Dota 2': () => svg('Dota 2', tile('dota', '#c23c2a', '#5a120c') + mark(M.dota2 || '', '#ffffff', 12, 5, 1), 'esTile'),
  'FIFA': () => svg('FIFA', tile('fc', '#0b3d2e', '#0f6e4f') + mark(M.ea || '', '#ffffff', 12, 5, 1) + text('FC', '#7dffb5', 6, 31.6), 'esTile'),
  'Madden': () => svg('Madden', tile('md', '#0d1b3d', '#24345c') + mark(M.ea || '', '#ffffff', 12, 5, 1) + text('NFL', '#ffd166', 5.4, 31.6), 'esTile'),
  'NBA2K': () => svg('NBA2K', tile('2k', '#c8102e', '#6d0a1a') + mark(M['2k'] || '', '#ffffff', 12, 5, 1), 'esTile'),
  'Rainbow Six': () => svg('Rainbow Six', tile('r6', '#2b2f36', '#111317') + '<path class="esMark" d="M23 5l10 5.8v12.4L23 29l-10-5.8V10.8z" fill="none" stroke="#e9edf2" stroke-width="1.6"/>' + text('6', '#e9edf2', 15, 22.6), 'esTile'),
  'Overwatch': () => svg('Overwatch', tile('ow', '#fa9c1e', '#c45d0a') + '<g class="esMark"><circle cx="23" cy="17" r="10" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="44 6" transform="rotate(-62 23 17)"/><path d="M19 12.6l2.6 9.6h2.8l2.6-9.6-2.4 0-1.6 6.2-1.6-6.2z" fill="#fff"/></g>', 'esTile'),
  'Warcraft 3': () => svg('Warcraft 3', tile('wc', '#3a2410', '#120a04') + '<path class="esMark" d="M23 4l9 3.4V17c0 6-4 9.6-9 12-5-2.4-9-6-9-12V7.4z" fill="#2b1a0a" stroke="#e8b84a" stroke-width="1.4"/>' + text('W', '#f2c94c', 12, 21.6), 'esTile'),
  'King of Glory': () => svg('King of Glory', tile('kog', '#1d2b6b', '#0b123a') + '<path class="esMark" d="M14 22l-1.6-10 5 4.4L23 8l5.6 8.4 5-4.4-1.6 10z" fill="#f2c94c" stroke="#fff3c4" stroke-width=".6"/><rect x="14" y="23" width="18" height="3" rx="1" fill="#f2c94c"/>', 'esTile'),
  'Mobile Legends': () => svg('Mobile Legends', tile('ml', '#10204d', '#1c3b8f') + text('M', '#f2c94c', 17, 23.6, ' stroke="#7a5a12" stroke-width=".6"') + '<path d="M13 26.5h20" stroke="#f2c94c" stroke-width="1.2"/>', 'esTile'),
  'Arena of Valor': () => svg('Arena of Valor', tile('aov', '#0f2f5c', '#071530') + '<path class="esMark" d="M23 6l7 20h-3.6l-1.4-4.4h-4l-1.4 4.4H16zm-1.2 12.6h2.4L23 14.4z" fill="#e9c46a"/><path d="M12 13c3 1 5 3 6 6M34 13c-3 1-5 3-6 6" stroke="#7fc8ff" stroke-width="1.2" fill="none"/>', 'esTile')
};
const OURS = {'Counter-Strike 2': cs2, 'CS2 Duels': duels, 'Call of Duty': cod};
const before = icon;
icon = function(name) {
  if (OURS[name]) return OURS[name];
  if (tiles[name]) return tiles[name]();
  return before(name);
};
window.icon = icon;

const css = document.createElement('style');
const on = sel => 'html.iconMotionEnabled :is(button,a):is(:hover,:focus-visible,:active,[aria-pressed=true]) ' + sel + ',html.iconMotionEnabled .active ' + sel;
css.textContent =
  '.esIcon .esFlashL,.esIcon .esFlashR{opacity:0}' +
  on('.esCs .esFlashL') + '{animation:esFlash 1.2s steps(1) infinite}' + on('.esCs .esFlashR') + '{animation:esFlash 1.2s steps(1) .6s infinite}' +
  on('.esCs .esGunL') + '{animation:esKickL 1.2s ease-out infinite}' + on('.esCs .esGunR') + '{animation:esKickR 1.2s ease-out .6s infinite}' +
  '@keyframes esFlash{0%{opacity:1}12%,100%{opacity:0}}@keyframes esKickL{0%{transform:translateX(-.8px)}20%,100%{transform:none}}@keyframes esKickR{0%{transform:translateX(.8px)}20%,100%{transform:none}}' +
  on('.esDuels .esScopeG') + '{animation:esSway 2.4s ease-in-out infinite}' + on('.esDuels .esDot') + '{animation:esDot .8s ease-in-out infinite alternate}' +
  '@keyframes esSway{0%,100%{transform:translate(0,0)}30%{transform:translate(.8px,-.5px)}60%{transform:translate(-.6px,.6px)}}@keyframes esDot{from{opacity:.4}to{opacity:1}}' +
  '.esCod .esNvg circle{filter:drop-shadow(0 0 1.2px #7dff6a)}' + on('.esCod .esNvg') + '{animation:esNvg 1.6s ease-in-out infinite}' + on('.esCod .esScan') + '{animation:esScan 2s linear infinite}' +
  '@keyframes esNvg{0%,100%{opacity:1}50%{opacity:.55}}@keyframes esScan{from{transform:translateY(0)}to{transform:translateY(24px)}}' +
  on('.esTile .esMark') + '{animation:esPop 1.4s ease-in-out infinite}' + '.esTile .esMark{transform-box:fill-box;transform-origin:center}' +
  '@keyframes esPop{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}' +
  'html:not(.iconMotionEnabled) .esIcon *{animation:none!important}';
document.head.appendChild(css);
render();
}
