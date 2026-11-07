'use strict';
/* Beta sport icons: one small animated scene per sport (46×34 art, plays on hover, focus or when selected).
   Each scene is static art plus named groups; the keyframes below move those groups on one shared clock. */
{
const L = '#cfe9ea', DARK = '#10252b', SKIN = '#e2a77f', WOOD = '#e9b67a', GOLD = '#f6d26b';
const line = (d, c = L, w = 1.6, extra = '') => '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"' + extra + '/>';
const fill = (d, c, extra = '') => '<path d="' + d + '" fill="' + c + '"' + extra + '/>';
const dot = (x, y, r, c, extra = '') => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '"' + extra + '/>';
const g = (cls, body) => '<g class="' + cls + '">' + body + '</g>';
const ground = (y = 31, c = '#35606a') => line('M1 ' + y + 'H45', c, 1.2);
const soccerBall = (x, y, r = 3.3) => dot(x, y, r, '#f3f8f7', ' stroke="' + DARK + '" stroke-width=".6"') +
  fill('M' + x + ' ' + (y - 1.5) + 'l1.5 1.1-.6 1.8h-1.8l-.6-1.8z', '#1d3b44') +
  fill('M' + (x - 3) + ' ' + (y + .4) + 'l1 .8-.3 1.3-1-.5zM' + (x + 3) + ' ' + (y + .4) + 'l-1 .8.3 1.3 1-.5zM' + (x - .8) + ' ' + (y + 3.1) + 'h1.6l-.3-1h-1z', '#1d3b44');
const net = (x1, y1, x2, y2, step = 3) => {
  let d = '';
  for (let x = x1 + step; x < x2; x += step) d += 'M' + x + ' ' + y1 + 'V' + y2;
  for (let y = y1 + step; y < y2; y += step) d += 'M' + x1 + ' ' + y + 'H' + x2;
  return line(d, '#7fa8ae', .55);
};
const oval = (x, y, rx, ry, rot, c, laces) => '<g transform="rotate(' + rot + ' ' + x + ' ' + y + ')"><ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + c + '" stroke="' + DARK + '" stroke-width=".5"/>' +
  (laces ? line('M' + (x - 1.6) + ' ' + y + 'h3.2m-2.6-.8v1.6m1-1.6v1.6m1-1.6v1.6', laces, .6) : '') + '</g>';

const art = {
 Football: ground() +
  line('M31 30V9L43 11V30', '#f3f8f7', 1.8) + g('fbNet', net(31, 10, 43, 30, 3)) +
  g('fbLeg', line('M7 2 11 18', '#eef6f5', 4) + line('M7 2 9.5 11', '#2f6f86', 4.2) +
    fill('M9 17.5l5 1.6 6 2.6q2.2 1.4.2 3.1l-9.6.5q-3.2-.2-3.2-3.2z', '#7fd0e0') + line('M12 19.5l2 .7m.6-1.6 1.6.8', '#f3f8f7', .7) +
    line('M10.2 25.6v1.4m3-1.5v1.4m3.2-1.6v1.4m2.8-1.6v1.3', DARK, 1.2)) +
  g('fbBall', soccerBall(24, 26.5)),
 Tennis: ground(32) + line('M2 30.5h42', '#35606a', .6) +
  g('tnRacket', line('M6 31 13.5 21', '#f1b07a', 2.6) + line('M13.5 21l2-2.5', '#9fb7bb', 1.8) +
    '<ellipse cx="20" cy="13.5" rx="5.6" ry="7.6" transform="rotate(40 20 13.5)" fill="#163a44" stroke="#8be3d6" stroke-width="1.8"/>' +
    line('M16.4 10.6 22.8 17.2M18 8.6l6.2 6.5M15.6 13.2l5.4 5.6M17.2 15.8l6.6-6.2M15 13.4l6.6-6.2M19.6 17.8l6-5.6', '#8be3d6', .45)) +
  g('tnBall', dot(27, 13, 2.6, '#dcf25a') + line('M25.2 11.4q1.8 1.6.4 3.4m3.2-3.6q-1.6 1.8 0 3.6', '#f8ffe0', .5)),
 Cricket: ground(31, '#4b7a52') + line('M3.5 14v16M6.2 14v16M8.9 14v16', '#f2d5a0', 1.3) + line('M3 13.4h3.2m.4 0h2.8', '#f2d5a0', 1) +
  g('ckBat', line('M14 3l.6 8', '#2c5966', 2.4) + fill('M12.6 10.6h4.4l1 14.6q-3.2 2-6.4 0z', '#ecc488', ' stroke="#b98543" stroke-width=".5"') + line('M14.8 12.4l.4 11', '#d2a565', .6)) +
  g('ckBall', dot(41, 19, 2.4, '#d9483f') + line('M39.4 17.6l3.2 2.8', '#ffd9c7', .5)),
 Basketball: ground(32) +
  fill('M40 2h3v15h-3z', '#dfeff0') + line('M40 6.5h-1.5v6H40', '#ff7a3d', .8) +
  g('bbRim', line('M28 12.5h11', '#ff7a3d', 2) + line('M28.5 13 30.6 20h5.8L38.5 13M30 13l3 7m3-7-3 7M29.6 16.4h7.8', L, .55)) +
  g('bbBall', dot(13, 15, 4.3, '#ff9a45') + line('M8.8 15h8.6M13 10.7v8.6M9.9 12q3 3 0 6.2M16.1 12q-3 3 0 6.2', '#7a3a1e', .6)) +
  g('bbArm', line('M3 33 11.2 15', SKIN, 3.6) + fill('M9 12.4q4-4.6 8.6-.2l-.8 1.6q-3.6-2.8-6.6.2z', SKIN) + line('M10.2 10.8l.6 1.6m2-2.2.2 1.7m1.9-1.4-.3 1.7', '#b77a55', .5)),
 'American Football': ground(31, '#4b7a52') +
  line('M35 31V21M28 21h14M28 21V3M42 21V3', GOLD, 1.7) + fill('M33.8 27h2.4v4h-2.4z', '#5aa2b8') +
  fill('M9 29.6l1.6-2.6 1.6 2.6z', '#ff8a3d') +
  g('afBall', oval(10.6, 26.2, 3.6, 2.2, -28, '#a85a32', '#fff4e2')) +
  g('afLeg', line('M1 4 5 19', '#eef6f5', 3.6) + line('M1 4 3 11', '#2f6f86', 3.8) + fill('M3.6 18.4l4.4 1.4 3.2 2.2q1.2 2-1 2.4H3.8q-1.4-.6-.8-2.4z', '#1e2f36') + line('M5 21.6h4', '#f3f8f7', .7)),
 'Aussie Rules': ground(31, '#4b7a52') +
  line('M25 31V13M43 31V13', L, 1.3) + line('M31 31V3M37 31V3', '#f3f8f7', 1.7) + fill('M30 26h2v5h-2zM36 26h2v5h-2z', '#e8473f') +
  g('arBall', oval(10, 18.5, 3.6, 2.3, -60, '#c8473b', '#ffe7c7')) +
  g('arLeg', line('M2 5 6 20', '#f3d26b', 3.6) + line('M2 5 4 12', '#24435a', 3.8) + fill('M4.6 19.2l4.6 1.6 3 2.2q1 2-1.2 2.3H4.6q-1.4-.6-.6-2.4z', '#f3f8f7') + line('M6.2 22h3.6', '#e8473f', .8)),
 Badminton: ground(31) + line('M24 31V16', '#9fb7bb', 1.2) + fill('M22.6 16h2.8v7h-2.8z', '#cfe9ea', ' opacity=".25"') + net(22.6, 16, 25.4, 23, 1.4) + line('M22.4 15.8h3.2', '#f3f8f7', 1) +
  g('bmRacket', line('M5 31 9.6 21.5', '#f1b07a', 2) + line('M9.6 21.5l1.4-3', '#9fb7bb', 1) +
    '<ellipse cx="13" cy="13.4" rx="3.6" ry="5" transform="rotate(25 13 13.4)" fill="#163a44" stroke="#8be3d6" stroke-width="1.3"/>' + line('M11.4 10.6l3.6 5.6m-4.6-3.4 4.8-2.2', '#8be3d6', .4)) +
  g('bmShuttle', dot(18.6, 11, 1.5, '#ffbd7f') + fill('M17.4 10.2l-5.4-2.6.6 7.2 4.8-3z', '#f3f8f7', ' opacity=".95"') + line('M12.4 8.2 17 10.6m-4.4 3.4L17 11.6', '#9fb7bb', .4)),
 Baseball: ground(31, '#8a6a46') + fill('M5 30.6h5l1.2 1.2-3.7 1.3-3.7-1.3z', '#f3f8f7') +
  g('bsBat', '<path d="M8 25.2q-.9-.9-.2-1.8l12.6-11.6q2.2-1.8 3.9-.2 1.4 1.7-.4 3.8L11.2 25.8q-1.5 1-3.2-.6z" fill="' + WOOD + '" stroke="#b98543" stroke-width=".5"/>' + line('M7.6 25.6l1.6-1.4', DARK, 2)) +
  g('bsSpark', line('M27 21.5v-2.4m0 6.6v2.4m-3.3-3.3h-2.4m6.6 0h2.4m-5.4-2.7-1.7-1.7m4.8 4.8 1.7 1.7', '#ffe08a', .8)) +
  g('bsBall', dot(42, 20, 2.4, '#fff2db') + line('M40.6 18.6q1.4 1.4.2 3m2.6-3q-1.4 1.4-.2 3', '#d0453f', .5)),
 Boxing: line('M34 0v4.4', '#9fb7bb', 1) +
  g('bxBag', fill('M29.4 4.4h9.2q1.4 0 1.4 1.4v20.4q0 3-3 3h-6q-3 0-3-3V5.8q0-1.4 1.4-1.4z', '#c9423f', ' stroke="#7e2523" stroke-width=".6"') +
    fill('M28 9h12v1.6H28zM28 21h12v1.6H28z', '#7e2523') + line('M30.4 6.4v18', '#e8746e', .7) +
    g('bxHit', line('M26.4 12.4l-2-1.4m2 4.6h-2.6m2.6 3.2-2 1.4', '#ffe08a', .9))) +
  g('bxGlove', line('M1 20h6', '#e2a77f', 4.4) + fill('M7 13.6q4.4-2.6 7.6.4l.6 4.4q-.2 3.2-3.4 3.6H8.4q-2-.4-2-2.4z', '#2f86d6', ' stroke="#174a78" stroke-width=".6"') +
    fill('M5.6 16.6h2.4v6.6H5.6z', '#f3f8f7') + line('M9.2 15.6q2 .2 2.6 2.4', '#9fd0ff', .6)),
 MMA: line('M2 28 8 3h30l6 25', '#35606a', .7) + ground(31) +
  g('mmLeft', dot(12, 8, 2.6, SKIN) + line('M12 11v9', SKIN, 3.6) + fill('M9.6 18.4h4.8v3.6H9.6z', '#2f6f86') + line('M10.6 21.8 8.6 31m4.6-9.2 2.6 9.2', SKIN, 2) +
    line('M13 12.6l2.6 2.4 1.6-2', SKIN, 1.6) + dot(17.6, 12.4, 1.4, '#1e2f36') +
    g('mmJab', line('M13 12l4 .6', SKIN, 1.6) + dot(18, 12.4, 1.5, '#e8473f'))) +
  g('mmRight', g('mmRHead', dot(33, 8, 2.6, '#c98e66')) + line('M33 11v9', '#c98e66', 3.6) + fill('M30.6 18.4h4.8v3.6h-4.8z', '#e8473f') + line('M31.8 21.8 29 31m5-9.2 2 9.2', '#c98e66', 2) +
    line('M32 12.6 29.4 15l-1.6-2', '#c98e66', 1.6) + dot(27.4, 12.4, 1.4, '#1e2f36') +
    g('mmCross', line('M32 12l-4 .6', '#c98e66', 1.6) + dot(27, 12.4, 1.5, '#2f86d6'))),
 Darts: g('dtBoard', dot(33, 17, 12, '#1e2f36') + dot(33, 17, 10.6, '#f2e3c4') +
    line('M33 6.4v21.2M22.4 17h21.2M25.5 9.5l15 15M40.5 9.5l-15 15', '#1e2f36', 1.2) +
    '<circle cx="33" cy="17" r="10" fill="none" stroke="#d9483f" stroke-width="1" stroke-dasharray="3.9 3.9"/><circle cx="33" cy="17" r="10" fill="none" stroke="#2e9a5c" stroke-width="1" stroke-dasharray="3.9 3.9" stroke-dashoffset="3.9"/>' +
    '<circle cx="33" cy="17" r="6.2" fill="none" stroke="#d9483f" stroke-width=".9" stroke-dasharray="2.4 2.4"/>' + dot(33, 17, 1.8, '#2e9a5c') + dot(33, 17, .9, '#d9483f')) +
  g('dtDart', line('M9 16.4h11', '#cfd8da', 1.4) + fill('M20 15.6l3.4.8-3.4.8z', '#9fb7bb') + fill('M3 13.4l5.6 2.4v1.2L3 19.4l1.6-3z', '#ffde88')),
 'Formula 1': ground(31, '#35606a') +
  g('f1Lines', line('M0 15h9M2 20h7M0 25h10', '#7fa8ae', .8, ' opacity=".8"')) +
  g('f1Car', fill('M4 21.4l1-5.2h2.6l.6 3h5.2l3.4-2.4h6.2l1.8-2.6h2.4l1.8 3.4 6.6 1.6 4.4.4.6 2.6-1 .6H4.6z', '#e8473f', ' stroke="#8e1f1b" stroke-width=".5"') +
    fill('M3.6 15.6h4.6v1.4H3.6zM39 21.6h5.6v1.6H39z', '#1e2f36') + fill('M21.8 17.6h5.4l-1-2.2h-3z', '#1e2f36') + dot(24.2, 15.6, 1.4, '#ffd34d') +
    line('M14 20.4h20', '#f3f8f7', .6) +
    g('f1WheelA', dot(10, 24, 3.6, '#0d1418') + dot(10, 24, 1.5, '#9fb3b8') + line('M10 21.2v5.6', '#4a5a60', .7)) +
    g('f1WheelB', dot(34, 24, 3.6, '#0d1418') + dot(34, 24, 1.5, '#9fb3b8') + line('M34 21.2v5.6', '#4a5a60', .7))),
 Handball: ground(31) + line('M32 30V10h12', '#f3f8f7', 1.8) + line('M32 14v3m0 3v3m0 3v3', '#e8473f', 1.8) + g('hbNet', net(32, 11, 44, 30, 3)) +
  g('hbArm', line('M7 27 9.4 16', '#2f86d6', 4) + line('M9.4 16 13 8.6', SKIN, 2.4) + dot(13.4, 7.6, 1.6, SKIN)) +
  g('hbBall', dot(14.6, 5.6, 2.8, '#f0c04a') + line('M12.2 4.6q2.4 1.6 4.8 0m-4.4 3q2-1.2 4-.2', '#7a5a1e', .5)),
 'Ice Hockey': line('M1 31.5H45', '#bfe6f5', 1.4) +
  line('M33 31V19.6q5-1.4 10 .4V31', '#e0575b', 1.8) + g('ihNet', net(33, 20.6, 43, 31, 2.5)) +
  g('ihStick', line('M5 1 12.6 27.6', '#d9a066', 2.2) + line('M12.6 27.6q.4 1.6 2.4 1.6h5.6', '#1e2f36', 2.4)) +
  g('ihPuck', '<ellipse cx="22.6" cy="29.6" rx="2.8" ry="1.2" fill="#0d1418"/>' + line('M20 29.2h5.2', '#4a5a60', .4)) +
  g('ihSpray', line('M19 27.4l-1.2-1.4m2.6.6-.2-1.8m2.2 1.4.8-1.4', '#e6f6ff', .6)),
 'Horse Racing': g('hrRail', line('M-8 30.5H54', '#f3f8f7', 1) + line('M-6 30.5v-3m8 3v-3m8 3v-3m8 3v-3m8 3v-3m8 3v-3m8 3v-3', '#f3f8f7', .8)) +
  g('hrHorse',
    g('hrLegH1', line('M14 19.4l-2 6 1.2 4', '#6e452d', 2)) + g('hrLegF1', line('M30 19l1.4 6-1 4', '#6e452d', 2)) +
    fill('M8.6 15.6q1-4 8-4.2l11-.4 4.4-4.6q2.2-1.6 3.8-.6l3.4 2.2q.8 1-.4 1.6l-2.6.2-2.6 3.2q-.8 4.6-5 5.8-8 1.6-15.6.4-4-.8-4.4-3.6z', '#8a5a3c') +
    line('M8.8 14.4q-4 .6-6 5', '#4d2f1d', 1.6) + line('M33 6.4l1-2', '#4d2f1d', 1.2) +
    g('hrLegH2', line('M17 19.6l1.6 5.6-1.8 4.2', '#8a5a3c', 2)) + g('hrLegF2', line('M27 19.6l-1.2 6 1.6 3.8', '#8a5a3c', 2)) +
    line('M20.6 10.6l4.6-3.6 2.4 1.8', '#f3f8f7', 2) + line('M19.8 10.8 23 5.6', '#e8473f', 2.6) + dot(23.8, 4, 1.6, '#ffd34d') + line('M23.4 7.2l5.6 2.4', '#e8473f', 1)),
 Rugby: ground(31, '#4b7a52') + line('M29 31V2M39 31V2M29 18h10', '#f3f8f7', 1.7) + fill('M28 25.6h2v5.4h-2zM38 25.6h2v5.4h-2z', '#2f86d6') +
  fill('M9.4 29.6l1.4-2.4 1.4 2.4z', '#ff8a3d') +
  g('rgBall', oval(10.8, 25.6, 3.8, 2.4, -70, '#f3f8f7', '#2f86d6')) +
  g('rgLeg', line('M1 4 5 19', '#2f86d6', 3.6) + line('M1 4 3 11', '#f3f8f7', 3.8) + fill('M3.6 18.4l4.4 1.4 3.2 2.2q1.2 2-1 2.4H3.8q-1.4-.6-.8-2.4z', '#1e2f36')),
 'Table Tennis': line('M3 24h41', '#2f7fbf', 2.2) + line('M23.5 24v-4.6', '#f3f8f7', 1.2) + line('M7 25v6m33-6v6', '#9fb7bb', 1.2) + line('M3 23.1h41', '#f3f8f7', .4) +
  g('ttBat', line('M6.4 23 8.8 18.8', WOOD, 2.2) + dot(11.6, 14.6, 4.2, '#e04848', ' stroke="#1e2f36" stroke-width="1"')) +
  g('ttBall', dot(17.6, 12.6, 1.5, '#ffb15c')),
 Volleyball: ground(31) + line('M23 31V8', '#9fb7bb', 1.2) + fill('M23 8h0v7h0z', L) + net(21, 8.4, 25, 15, 1.3) + line('M20.8 8.4h4.4M20.8 15h4.4', '#f3f8f7', .9) +
  g('vbArm', line('M8 32 11.4 20', '#f0b25c', 3.6) + line('M11.4 20 14.6 10', SKIN, 2.2) + fill('M13.2 9.6q1.2-2.6 3.2-1.2l-.2 2.4-2.6.4z', SKIN)) +
  g('vbBall', dot(17.4, 6, 3.2, '#f6f2e4') + line('M14.6 4.6q3 .4 5.6 3.4M16 2.9q-.4 3 1.8 6.2M14.4 7.4q2.6-.6 4.6-4', '#3a7bd5', .7) + line('M17.4 2.8q2.6 2.6 2.8 5', '#f4c63d', .7)),
 'Motor Racing': line('M1 31q20-3 44-2', '#35606a', 1.2) + line('M1 27.6q20-3 44-2', '#5d8a92', .5, ' stroke-dasharray="2 2"') +
  g('mrFlag', line('M40 30V8', '#cfd8da', .9) + '<g>' + fill('M40.4 8.4h4.6v3.6h-4.6z', '#f3f8f7') + fill('M40.4 8.4h1.5v1.2h-1.5zM43 8.4h1.5v1.2H43zM41.9 9.6h1.5v1.2h-1.5zM40.4 10.8h1.5V12h-1.5zM43 10.8h1.5V12H43z', '#10181c') + '</g>') +
  g('mrLines', line('M0 16h7M1 21h6', '#7fa8ae', .8)) +
  g('mrCar', fill('M5 23.6l1.4-3.4 6-1 4-3.6h8.4l4.6 3.6 6 .8 1.6 3.6-1 .8H5.6z', '#3fb6a8', ' stroke="#1c6b62" stroke-width=".5"') +
    fill('M17.6 16.4h6.4l3 2.8h-10.6z', '#163a44') + line('M21 16.6v2.4', '#3fb6a8', .6) + fill('M33.6 20.4h2.4v1.2h-2.4z', '#ffd34d') + line('M8 21.6h28', '#f3f8f7', .5) +
    g('mrWheelA', dot(11, 24.6, 2.9, '#0d1418') + dot(11, 24.6, 1.2, '#9fb3b8') + line('M11 22.4v4.4', '#4a5a60', .6)) +
    g('mrWheelB', dot(31, 24.6, 2.9, '#0d1418') + dot(31, 24.6, 1.2, '#9fb3b8') + line('M31 22.4v4.4', '#4a5a60', .6)))
};

// [group, transform-origin, keyframes, duration, timing]
const motion = {
 Football: [
  ['fbLeg', '7px 2px', '0%,100%{transform:rotate(0)}24%{transform:rotate(34deg)}38%{transform:rotate(-16deg)}52%{transform:rotate(0)}'],
  ['fbBall', '24px 26.5px', '0%,37%{transform:none;opacity:1}58%{transform:translate(13px,-11px) rotate(320deg);opacity:1}66%{transform:translate(14.6px,-10.4px) rotate(360deg);opacity:1}76%,90%{transform:translate(14.6px,-10.4px);opacity:0}100%{transform:none;opacity:1}'],
  ['fbNet', '43px 20px', '0%,57%{transform:none}64%{transform:translateX(1.6px) scaleY(1.04)}76%{transform:translateX(-.4px)}84%,100%{transform:none}']],
 Tennis: [
  ['tnRacket', '6px 31px', '0%,100%{transform:rotate(-60deg)}36%{transform:rotate(-66deg)}48%{transform:rotate(4deg)}60%{transform:rotate(40deg)}80%{transform:rotate(-60deg)}'],
  ['tnBall', '27px 13px', '0%{transform:translate(0,-12px);opacity:0}10%{opacity:1}46%{transform:translate(-1px,0);opacity:1}66%{transform:translate(18px,-8px);opacity:1}72%,100%{transform:translate(20px,-9px);opacity:0}']],
 Cricket: [
  ['ckBat', '14px 3px', '0%,100%{transform:rotate(38deg)}34%{transform:rotate(44deg)}46%{transform:rotate(-26deg)}58%{transform:rotate(-46deg)}82%{transform:rotate(38deg)}'],
  ['ckBall', '41px 19px', '0%{transform:none;opacity:1}24%{transform:translate(-11px,9.6px)}46%{transform:translate(-21px,3px);opacity:1}66%{transform:translate(-6px,-20px);opacity:1}72%,92%{transform:translate(-4px,-24px);opacity:0}100%{transform:none;opacity:1}']],
 Basketball: [
  ['bbArm', '7px 30px', '0%,100%{transform:none}30%{transform:translate(5px,-9px)}46%{transform:translate(17.4px,-7.6px)}56%{transform:translate(18px,-2px)}64%{transform:translate(17.6px,-2.6px)}80%{transform:translate(8px,4px)}'],
  ['bbBall', '13px 15px', '0%{transform:none;opacity:1}30%{transform:translate(5px,-9px)}46%{transform:translate(17.4px,-7.6px)}56%{transform:translate(18px,2px)}68%{transform:translate(18px,12px);opacity:1}74%,90%{transform:translate(18px,13px);opacity:0}100%{transform:none;opacity:1}'],
  ['bbRim', '39px 12.5px', '0%,52%{transform:none}57%{transform:rotate(9deg)}63%{transform:rotate(-5deg)}69%{transform:rotate(3deg)}75%,100%{transform:none}']],
 'American Football': [
  ['afLeg', '1px 4px', '0%,100%{transform:rotate(0)}22%{transform:rotate(30deg)}36%{transform:rotate(-22deg)}52%{transform:rotate(0)}'],
  ['afBall', '10.6px 26.2px', '0%,35%{transform:none;opacity:1}62%{transform:translate(24px,-16px) rotate(-240deg) scale(.7);opacity:1}74%{transform:translate(26px,-22px) rotate(-320deg) scale(.5);opacity:0}92%{transform:none;opacity:0}100%{opacity:1}']],
 'Aussie Rules': [
  ['arLeg', '2px 5px', '0%,100%{transform:rotate(0)}24%{transform:rotate(28deg)}38%{transform:rotate(-22deg)}54%{transform:rotate(0)}'],
  ['arBall', '10px 18.5px', '0%{transform:translateY(-4px);opacity:1}34%{transform:translateY(4px)}62%{transform:translate(24px,-10px) rotate(-200deg) scale(.7);opacity:1}74%{transform:translate(25px,-14px) rotate(-260deg) scale(.5);opacity:0}92%{opacity:0;transform:translateY(-4px)}100%{opacity:1;transform:translateY(-4px)}']],
 Badminton: [
  ['bmRacket', '5px 31px', '0%,100%{transform:rotate(-40deg)}36%{transform:rotate(-46deg)}46%{transform:rotate(18deg)}58%{transform:rotate(34deg)}82%{transform:rotate(-40deg)}'],
  ['bmShuttle', '18.6px 11px', '0%{transform:translate(-2px,-6px) rotate(-30deg);opacity:0}12%{opacity:1}44%{transform:translate(-1px,0) rotate(-10deg)}58%{transform:translate(9px,-6px) rotate(10deg);opacity:1}74%{transform:translate(20px,16px) rotate(70deg);opacity:1}80%,100%{transform:translate(20px,17px) rotate(70deg);opacity:0}']],
 Baseball: [
  ['bsBat', '8px 25px', '0%,100%{transform:rotate(-36deg)}36%{transform:rotate(-42deg)}46%{transform:rotate(40deg)}58%{transform:rotate(82deg)}82%{transform:rotate(-36deg)}'],
  ['bsBall', '42px 20px', '0%{transform:none;opacity:1}44%{transform:translate(-15px,4px);opacity:1}64%{transform:translate(2px,-20px);opacity:1}70%,92%{transform:translate(3px,-23px);opacity:0}100%{transform:none;opacity:1}'],
  ['bsSpark', '27px 24px', '0%,43%{opacity:0;transform:scale(.4)}47%{opacity:1;transform:scale(1.1)}56%,100%{opacity:0;transform:scale(1.3)}']],
 Boxing: [
  ['bxGlove', '7px 18px', '0%,100%{transform:none}26%{transform:translateX(-3px)}40%{transform:translateX(14px)}50%{transform:translateX(12px)}66%{transform:none}'],
  ['bxBag', '34px 0px', '0%,39%{transform:none}52%{transform:rotate(-13deg)}66%{transform:rotate(6deg)}80%{transform:rotate(-3deg)}92%,100%{transform:none}'],
  ['bxHit', '25px 16px', '0%,38%{opacity:0}42%{opacity:1}54%,100%{opacity:0}']],
 MMA: [
  ['mmJab', '13px 12px', '0%,100%{transform:none}14%{transform:translateX(-1px)}26%{transform:translateX(9px)}36%{transform:none}'],
  ['mmRHead', '33px 10px', '0%,24%{transform:none}30%{transform:translate(1.6px,-.4px) rotate(14deg)}44%,100%{transform:none}'],
  ['mmCross', '32px 12px', '0%,50%{transform:none}64%{transform:translateX(1px)}76%{transform:translateX(-9px)}86%,100%{transform:none}'],
  ['mmLeft', '12px 31px', '0%,74%{transform:none}80%{transform:rotate(-7deg)}92%,100%{transform:none}']],
 Darts: [
  ['dtDart', '12px 17px', '0%{transform:translate(-8px,3px) rotate(4deg);opacity:0}12%{opacity:1}40%{transform:translate(12px,-1.4px) rotate(-2deg);opacity:1}46%{transform:translate(11.4px,-1.4px)}86%{transform:translate(11.4px,-1.4px);opacity:1}94%,100%{transform:translate(11.4px,-1.4px);opacity:0}'],
  ['dtBoard', '33px 17px', '0%,40%{transform:none}46%{transform:rotate(2.5deg)}54%{transform:rotate(-1.5deg)}62%,100%{transform:none}']],
 'Formula 1': [
  ['f1Car', '22px 22px', '0%{transform:translateX(-52px)}26%{transform:translateX(2px)}36%{transform:translateX(0)}60%{transform:translateX(0)}76%,100%{transform:translateX(56px)}', '1.8s', 'cubic-bezier(.6,0,.4,1)'],
  ['f1Lines', '0 0', '0%,20%{opacity:0;transform:translateX(0)}30%{opacity:1}60%{opacity:1;transform:translateX(-4px)}74%,100%{opacity:0;transform:translateX(-10px)}', '1.8s'],
  ['f1WheelA', '10px 24px', 'to{transform:rotate(360deg)}', '.28s', 'linear'],
  ['f1WheelB', '34px 24px', 'to{transform:rotate(360deg)}', '.28s', 'linear']],
 Handball: [
  ['hbArm', '7px 27px', '0%,100%{transform:rotate(0)}30%{transform:rotate(-26deg)}42%{transform:rotate(34deg)}56%{transform:rotate(20deg)}80%{transform:rotate(0)}'],
  ['hbBall', '14.6px 5.6px', '0%{transform:none;opacity:1}30%{transform:translate(-5px,1.4px) rotate(-60deg)}42%{transform:translate(6px,4px)}62%{transform:translate(24px,16px) rotate(260deg);opacity:1}72%,90%{transform:translate(25px,17px);opacity:0}100%{transform:none;opacity:1}'],
  ['hbNet', '44px 20px', '0%,60%{transform:none}67%{transform:translateX(1.4px)}78%,100%{transform:none}']],
 'Ice Hockey': [
  ['ihStick', '5px 1px', '0%,100%{transform:rotate(0)}26%{transform:rotate(26deg)}38%{transform:rotate(-12deg)}52%{transform:rotate(0)}'],
  ['ihPuck', '22.6px 29.6px', '0%,37%{transform:none;opacity:1}56%{transform:translate(15px,-2.6px);opacity:1}66%{transform:translate(16.6px,-2.6px);opacity:1}74%,92%{transform:translate(16.6px,-2.6px);opacity:0}100%{transform:none;opacity:1}'],
  ['ihNet', '43px 26px', '0%,55%{transform:none}63%{transform:translateX(1.4px)}75%,100%{transform:none}'],
  ['ihSpray', '20px 27px', '0%,36%{opacity:0;transform:none}42%{opacity:1}56%,100%{opacity:0;transform:translate(-2px,-2px)}']],
 'Horse Racing': [
  ['hrRail', '0 0', 'to{transform:translateX(-8px)}', '.32s', 'linear'],
  ['hrHorse', '22px 20px', '0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-1.4px) rotate(-2deg)}50%{transform:translateY(0) rotate(0)}75%{transform:translateY(-1px) rotate(2deg)}', '.64s', 'ease-in-out'],
  ['hrLegF1', '30px 19px', '0%,100%{transform:rotate(-30deg)}50%{transform:rotate(28deg)}', '.64s', 'ease-in-out'],
  ['hrLegF2', '27px 19.6px', '0%,100%{transform:rotate(26deg)}50%{transform:rotate(-30deg)}', '.64s', 'ease-in-out'],
  ['hrLegH1', '14px 19.4px', '0%,100%{transform:rotate(30deg)}50%{transform:rotate(-26deg)}', '.64s', 'ease-in-out'],
  ['hrLegH2', '17px 19.6px', '0%,100%{transform:rotate(-24deg)}50%{transform:rotate(30deg)}', '.64s', 'ease-in-out']],
 Rugby: [
  ['rgLeg', '1px 4px', '0%,100%{transform:rotate(0)}22%{transform:rotate(30deg)}36%{transform:rotate(-22deg)}52%{transform:rotate(0)}'],
  ['rgBall', '10.8px 25.6px', '0%,35%{transform:none;opacity:1}62%{transform:translate(23px,-17px) rotate(-280deg) scale(.7);opacity:1}74%{transform:translate(24px,-22px) rotate(-360deg) scale(.5);opacity:0}92%{transform:none;opacity:0}100%{opacity:1}']],
 'Table Tennis': [
  ['ttBat', '6.4px 23px', '0%,100%{transform:rotate(-24deg)}16%{transform:rotate(-28deg)}26%{transform:rotate(18deg)}40%{transform:rotate(-24deg)}'],
  ['ttBall', '17.6px 12.6px', '0%{transform:translate(4px,8px)}24%{transform:none}50%{transform:translate(17px,10px)}70%{transform:translate(27px,-2px);opacity:1}76%{opacity:0}94%{transform:translate(4px,8px);opacity:0}100%{transform:translate(4px,8px);opacity:1}']],
 Volleyball: [
  ['vbArm', '8px 32px', '0%,100%{transform:rotate(0)}30%{transform:rotate(-28deg)}42%{transform:rotate(24deg)}56%{transform:rotate(12deg)}80%{transform:rotate(0)}'],
  ['vbBall', '17.4px 6px', '0%{transform:translateY(6px);opacity:1}36%{transform:translate(-1px,-1px)}42%{transform:translate(1px,0)}60%{transform:translate(19px,22px) rotate(160deg)}72%{transform:translate(23px,15px) rotate(220deg);opacity:1}80%,92%{transform:translate(25px,17px);opacity:0}100%{transform:translateY(6px);opacity:1}']],
 'Motor Racing': [
  ['mrCar', '22px 22px', '0%{transform:translateX(-48px)}28%{transform:translateX(1px)}38%{transform:translateX(0)}60%{transform:translateX(0)}78%,100%{transform:translateX(52px)}', '1.8s', 'cubic-bezier(.6,0,.4,1)'],
  ['mrLines', '0 0', '0%,22%{opacity:0}32%,62%{opacity:1}76%,100%{opacity:0}', '1.8s'],
  ['mrFlag', '40px 8px', '0%,100%{transform:skewY(0)}50%{transform:skewY(-10deg)}', '.5s', 'ease-in-out'],
  ['mrWheelA', '11px 24.6px', 'to{transform:rotate(360deg)}', '.28s', 'linear'],
  ['mrWheelB', '31px 24.6px', 'to{transform:rotate(360deg)}', '.28s', 'linear']]
};

// ---- 2.5D pass: rebuilt Football and Basketball, jointed kicking legs ----
art.Football = fill('M0 29.4h46V34H0z', '#24553c') + fill('M8 29.4h8V34H8zM24 29.4h8V34h-8zM40 29.4h6V34h-6z', '#2c6346') + line('M0 29.6h46', '#4f9e6e', .8) +
  '<ellipse cx="37" cy="30.4" rx="7" ry="1" fill="url(#smShadowG)"/>' +
  line('M31 9 43 11V29.6', '#b9cdd1', 1.1) + g('fbNet', net(31.6, 10, 43, 29.6, 2.4)) +
  line('M7 6.4 7.6 16.6', SKIN, 2.8) + line('M7.6 16.6 6.6 26', '#f3f8f7', 2.4) + fill('M3.4 25.6h5.4q2.2 0 2.2 1.8v.8H3.4z', '#1e2f36') +
  g('fbBall', g('fbBallSquash', g('fbBallSpin', soccerBall(25.6, 26.2, 3.1)))) +
  g('fbThigh', line('M10 5 13 15', SKIN, 3) + g('fbShin', line('M13 15 15.8 23', '#f3f8f7', 2.6) + line('M13.8 17.6l2.6-.9', '#2f86d6', .9) +
    fill('M14.6 22l3.6 1.2 4.4 1.2q2.1.9 1 2.7h-8.8q-1.3-.6-.7-2.3z', '#7fd0e0', ' stroke="#2e7f91" stroke-width=".4"') +
    line('M17 24.2l2 .6m.6-1.2 1.4.5', '#f3f8f7', .6) + line('M15.6 27.6v1.1m2.6-1.1v1.1m2.8-1.1v1.1', DARK, 1))) +
  fill('M3.6 0h9l1 7.6H2.6z', '#1d4f8f') + line('M8 0v7', '#f3f8f7', .5) +
  line('M31 8.6V30', '#f3f8f7', 2) + g('fbBurst', line('M22.6 22.2l-1-1.6m3.6.8.2-1.8m2.2 2.4 1.2-1.2', '#fff3b0', .7));
art.Basketball = fill('M0 30h46v4H0z', '#9a6a44') + line('M0 30h46M0 32h46', '#7a5236', .4) + line('M12 30v4M27 30v4M40 30v4', '#7a5236', .3) +
  '<ellipse cx="33" cy="30.6" rx="5" ry=".8" fill="url(#smShadowG)"/>' +
  g('bbBoard', fill('M38 1l6.4-1v15.4l-6.4 1z', '#e8f4f5', ' stroke="#9fb3b8" stroke-width=".5"') + fill('M39.4 6.6l3.4-.5v4.6l-3.4.5z', 'none', ' stroke="#ff7a3d" stroke-width=".7"') + line('M44.4 7.6H46', '#9fb3b8', 1.4)) +
  g('bbRim', line('M28 13a5 1.4 0 0 1 10 0', '#c65a1e', 1.1)) +
  g('bbBall', g('bbSquash', g('bbSpin', dot(20, 13, 3.6, '#f08a2c') + line('M16.4 13h7.2M20 9.4v7.2M17.4 10.4q2.6 2.6 0 5.2M22.6 10.4q-2.6 2.6 0 5.2', '#6a3216', .55)))) +
  g('bbPlayer', line('M5.4 29.6 4.4 33M9.6 29.6l1 3.4', '#8d5a3c', 2.2) + fill('M3 21.6l7-1.4 1.6 10H4.4z', '#e8473f') + line('M6.6 23.6v3.4m1.4-3.4v3.4', '#f3f8f7', .7) +
    fill('M3.8 28.6h8v2.2h-8z', '#1e2f36') + dot(6.6, 17.4, 2.5, '#8d5a3c') + line('M4.4 22.6 2.6 27.4', '#8d5a3c', 1.8) +
    g('bbArm', line('M9.6 21.4l4.6-5.6 3.6-4.2', '#8d5a3c', 2.3) + fill('M16.2 9.4q2.6-2.8 5.4-.4l-.8 1.3q-2.2-1.6-3.8.2z', '#8d5a3c'))) +
  g('bbRim', line('M28 13a5 1.4 0 0 0 10 0', '#ff7a3d', 1.6) + line('M38 13h.8', '#ff7a3d', 1.2) +
    g('bbNet', line('M28.4 13.4 30 20.6M30.4 14.2 31.4 20.8M33 14.4v6.6M35.6 14.2 34.6 20.8M37.6 13.4 36 20.6M30 20.6h6M29.2 16.6h7.6M29.7 18.8h6.6', '#e6f3f2', .5) + line('M28.4 13.4l7.4 7.2M37.6 13.4l-7.4 7.2', '#e6f3f2', .35)));
const kickLeg = (pre, shorts, sock, boot) => g(pre + 'Thigh', line('M1 3 4 12.6', SKIN, 3) + fill('M-1 0h6l.6 6.4H-1.6z', shorts) +
  g(pre + 'Shin', line('M4 12.6 6.2 21', sock, 2.6) + fill('M5 20l3.4 1.2 3.6 1.4q1.6 1-.2 2.4H4.8q-1.2-.6-.6-2.2z', boot, ' stroke="#0d1418" stroke-width=".3"')));
art['American Football'] = art['American Football'].replace(/<g class="afLeg">[\s\S]*$/, kickLeg('af', '#eef6f5', '#eef6f5', '#1e2f36'));
art['Aussie Rules'] = art['Aussie Rules'].replace(/<g class="arLeg">[\s\S]*$/, kickLeg('ar', '#24435a', '#f3d26b', '#f3f8f7'));
art.Rugby = art.Rugby.replace(/<g class="rgLeg">[\s\S]*$/, kickLeg('rg', '#f3f8f7', '#2f86d6', '#1e2f36'));
const kickMotion = pre => [
  [pre + 'Thigh', '1px 3px', '0%,100%{transform:rotate(0)}20%{transform:rotate(30deg)}32%{transform:rotate(-4deg)}38%{transform:rotate(-30deg)}50%{transform:rotate(-44deg)}74%{transform:rotate(0)}'],
  [pre + 'Shin', '4px 12.6px', '0%,100%{transform:rotate(6deg)}20%{transform:rotate(72deg)}32%{transform:rotate(36deg)}38%{transform:rotate(-8deg)}50%{transform:rotate(-14deg)}74%{transform:rotate(6deg)}']];
motion['American Football'] = kickMotion('af').concat(motion['American Football'].filter(m => m[0] !== 'afLeg'));
motion['Aussie Rules'] = kickMotion('ar').concat(motion['Aussie Rules'].filter(m => m[0] !== 'arLeg'));
motion.Rugby = kickMotion('rg').concat(motion.Rugby.filter(m => m[0] !== 'rgLeg'));
motion.Football = [
  ['fbThigh', '10px 5px', '0%,100%{transform:rotate(0)}18%{transform:rotate(30deg)}30%{transform:rotate(-6deg)}36%{transform:rotate(-30deg)}48%{transform:rotate(-46deg)}72%{transform:rotate(0)}'],
  ['fbShin', '13px 15px', '0%,100%{transform:rotate(6deg)}18%{transform:rotate(72deg)}30%{transform:rotate(38deg)}36%{transform:rotate(-6deg)}48%{transform:rotate(-14deg)}72%{transform:rotate(6deg)}'],
  ['fbBall', '25.6px 26.2px', '0%,34%{transform:none;opacity:1}42%{transform:translate(4.6px,-6px)}50%{transform:translate(8.4px,-9.4px)}57%{transform:translate(11.4px,-10px)}63%{transform:translate(13.6px,-9px)}70%{transform:translate(14.2px,-8px);opacity:1}76%,92%{transform:translate(14.2px,-8px);opacity:0}100%{transform:none;opacity:1}'],
  ['fbBallSpin', '25.6px 26.2px', '0%,34%{transform:rotate(0)}70%,100%{transform:rotate(560deg)}'],
  ['fbBallSquash', '25.6px 29.3px', '0%,33%{transform:none}35.5%{transform:scale(.76,1.16)}39%{transform:scale(1.08,.94)}44%,57%{transform:none}60%{transform:scale(.8,1.12)}66%,100%{transform:none}'],
  ['fbNet', '43px 20px', '0%,57%{transform:none}63%{transform:translateX(1.8px) scaleY(1.05)}72%{transform:translateX(-.4px)}80%,100%{transform:none}'],
  ['fbBurst', '24px 22px', '0%,33%{opacity:0;transform:scale(.4)}37%{opacity:1;transform:scale(1.1)}46%,100%{opacity:0;transform:scale(1.3)}']];
motion.Basketball = [
  ['bbPlayer', '7px 30px', '0%,100%{transform:none}12%{transform:translateY(1.2px) scaleY(.94)}26%{transform:translate(3px,-3px)}44%{transform:translate(9px,-7px)}54%{transform:translate(10px,-5px)}62%{transform:translate(10px,-4px)}84%{transform:none}'],
  ['bbArm', '9.6px 21.4px', '0%,100%{transform:rotate(0)}26%{transform:rotate(-8deg)}44%{transform:rotate(4deg)}54%{transform:rotate(34deg)}62%{transform:rotate(26deg)}84%{transform:rotate(0)}'],
  ['bbBall', '20px 13px', '0%{transform:none;opacity:1}12%{transform:translateY(1.2px)}26%{transform:translate(4px,-6px)}44%{transform:translate(12.6px,-8.6px)}52%{transform:translate(13px,-2px)}58%{transform:translate(13px,3px)}66%{transform:translate(13px,9px)}72%{transform:translate(13px,13.4px)}77%{transform:translate(12px,9.6px)}83%{transform:translate(11px,13.4px);opacity:1}90%,96%{transform:translate(11px,13.4px);opacity:0}100%{transform:none;opacity:1}'],
  ['bbSpin', '20px 13px', '0%,26%{transform:rotate(0)}44%{transform:rotate(-80deg)}83%,100%{transform:rotate(-320deg)}'],
  ['bbSquash', '20px 16.6px', '0%,71%{transform:none}73%{transform:scale(1.16,.8)}76%,82%{transform:none}84%{transform:scale(1.1,.88)}87%,100%{transform:none}'],
  ['bbRim', '38px 13px', '0%,51%{transform:none}55%{transform:rotate(8deg)}60%{transform:rotate(-4deg)}65%{transform:rotate(2deg)}71%,100%{transform:none}'],
  ['bbNet', '33px 13px', '0%,53%{transform:none}60%{transform:scale(.9,1.38)}67%{transform:scaleY(.9)}74%,100%{transform:none}'],
  ['bbBoard', '41px 8px', '0%,53%,100%{transform:none}56%{transform:translateX(.5px)}60%{transform:translateX(-.3px)}64%{transform:none}']];

// ---- Directory sports added for the Sports / Esports / Racing directory ----
const runLegs = (p, cols) => p.map(([cls, d], k) => g(cls, line(d, cols[k % 2], 1.8))).join('');
const wheel = (cls, x, y, r, tyre = '#0d1418') => g(cls, '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="none" stroke="' + tyre + '" stroke-width="1.6"/>' +
  line('M' + x + ' ' + (y - r) + 'V' + (y + r) + 'M' + (x - r) + ' ' + y + 'H' + (x + r) + 'M' + (x - r * .7) + ' ' + (y - r * .7) + 'l' + (r * 1.4) + ' ' + (r * 1.4) + 'm0 ' + (-r * 1.4) + 'l' + (-r * 1.4) + ' ' + (r * 1.4), '#9fb3b8', .4) + dot(x, y, .9, '#9fb3b8'));
const waves = cls => g(cls, line('M-12 26q3-2.4 6 0t6 0 6 0 6 0 6 0 6 0 6 0 6 0 6 0 6 0', '#5fb7d6', 1.2) + line('M-9 30q3-2 6 0t6 0 6 0 6 0 6 0 6 0 6 0 6 0 6 0', '#3d8fb0', 1));
Object.assign(art, {
 Snooker: fill('M1 13h44v20H1z', '#1f7a45') + line('M1 13.6h44', '#6b3f22', 2.4) + dot(43.4, 14.8, 2.2, '#071410') + dot(2.6, 14.8, 2.2, '#071410') +
  g('snRed', dot(33, 20.6, 2.1, '#d9483f') + dot(32.4, 20, .6, '#ffb3a8')) + g('snWhite', dot(20, 23.4, 2.1, '#f3f8f7')) +
  g('snCue', line('M-6 33.4 17.4 24.4', WOOD, 1.7) + line('M15.6 25.1l1.8-.7', '#3a6f8a', 1.7)),
 'Water Polo': line('M33 23V12h11', '#f3f8f7', 1.6) + g('wpNet', net(33, 12.6, 44, 23, 2.6)) +
  g('wpArm', line('M10.6 22.4 13.4 11', SKIN, 2.2) + dot(13.6, 10.4, 1.4, SKIN)) + dot(9, 22.4, 2.8, '#2f86d6') + line('M7 21.6h4', '#f3f8f7', .6) +
  g('wpBall', dot(14.8, 8.4, 2.4, '#f0c04a') + line('M12.6 7.6q2.2 1.4 4.4 0', '#2f86d6', .6)) + waves('wpWaves'),
 'Cross-Country': fill('M0 29h46v5H0z', '#e6f6ff') + g('ccTrack', line('M-10 31h60M-10 32.6h60', '#a8c8d4', .5, ' stroke-dasharray="4 3"')) +
  g('ccBack', line('M17 17 11.6 27M18.4 11.6 9.4 26', '#3a7bd5', 1.4) + line('M6 28.4h12', '#e8473f', 1.4)) +
  dot(22, 6.4, 2.1, SKIN) + fill('M20 6l2.2-2.2 2.4 1.2-1 1.2z', '#e8473f') + line('M21 9 17 17', '#e8473f', 3) +
  g('ccFront', line('M17 17 23 27M20 11.6 29 26', '#1d4f8f', 1.4) + line('M18 28.4h12', '#e8473f', 1.4)),
 Floorball: line('M1 31.5H45', '#c79a5a', 1.4) + line('M34 31V21h10', '#e0575b', 1.6) + g('flNet', net(34, 21.6, 44, 31, 2.4)) +
  g('flStick', line('M5 1 13 26.6', '#f3f8f7', 1.8) + line('M13 26.6q.8 2.4 3.4 2.4h3.4', '#2f86d6', 2.2)) +
  g('flBall', dot(22.4, 28.6, 2.2, '#f3f8f7') + dot(21.6, 28, .45, '#7fa8ae') + dot(23.2, 28.4, .45, '#7fa8ae') + dot(22.2, 29.6, .45, '#7fa8ae')),
 Cycling: g('cyRoad', line('M-10 31.5h66', '#5d8a92', 1, ' stroke-dasharray="5 4"')) +
  wheel('cyWheelA', 11, 24, 5.6) + wheel('cyWheelB', 34, 24, 5.6) +
  line('M11 24h9l-3.4-10.4M20 24l9-10M16.6 13.6H29M29 13.6 34 24', '#e8473f', 1.4) + line('M15 13.2h3.6M29 13.6l.6-2.4h2.4', '#1e2f36', 1.2) +
  line('M17 12.6 25.6 8', '#2f86d6', 3) + dot(27.4, 6.4, 2, '#ffd34d') + line('M25 8.6l4.6 3', SKIN, 1.2) +
  g('cyLeg', line('M17.6 12.8 22.6 18.6 20 24', '#1e2f36', 2)) + g('cyCrank', line('M20 24v-3.4M20 24v3.4', '#cfd8da', 1) + dot(20, 24, 1.1, '#9fb3b8')),
 Lacrosse: ground(31, '#4b7a52') + line('M31 31V15h13', '#ff8a3d', 1.6) + g('lxNet', net(31, 15.6, 44, 31, 2.6)) +
  g('lxStick', line('M5 31 13.4 10', '#cfd8da', 1.6) + fill('M12.6 9.6q-1-6.4 4.6-6.6 4.2.6 2.4 5.6z', '#163a44', ' stroke="#f3f8f7" stroke-width=".9"') + line('M14 5.4l4.2 1.8M13.4 7.6l4.4.2M15.4 3.6l-.8 5.6', '#cfd8da', .35)) +
  g('lxBall', dot(16, 6.6, 1.7, '#f3f8f7')),
 'Alpine Skiing': fill('M0 8 46 30v4H0z', '#e6f6ff') + line('M0 8 46 30', '#a8c8d4', .8) +
  g('asGates', line('M30 15v8m.2 0', '#d9483f', .9) + fill('M30.2 15h4v3h-4z', '#d9483f') + line('M44 22v8', '#2f86d6', .9) + fill('M44.2 22h4v3h-4z', '#2f86d6') + line('M16 8v8', '#2f86d6', .9) + fill('M16.2 8h4v3h-4z', '#2f86d6')) +
  g('asSkier', line('M14 21.4l11 5.4', '#1e2f36', 1.4) + line('M17.4 21.4l2.4-5 3.6 1.6', '#e8473f', 2.6) + dot(23.8, 14.6, 1.9, '#ffd34d') + line('M19 18l5 2.6M21 17.6l4.4 4.8', '#cfd8da', .7)) +
  g('asSpray', dot(13, 20.4, .7, L) + dot(11.6, 19, .6, L) + dot(12.6, 18, .5, L)),
 Biathlon: fill('M0 30h46v4H0z', '#e6f6ff') + line('M2 30.6h13', '#e8473f', 1.4) + dot(8, 7, 2.1, SKIN) + fill('M6 6.6l2-2.4 2.4 1.4-.6 1.4z', '#2f86d6') +
  line('M8 9.6v10M8 19.6 5.6 29.6M8 19.6l3 10', '#2f86d6', 2.4) +
  g('btRifle', line('M8.4 12h13.4', '#10181c', 1.4) + line('M9 12l-1.6 2.6', '#6b3f22', 1.8) + line('M8 11 12 12', SKIN, 1.2) + g('btFlash', fill('M22 11.2l3-1.2-1 2 3 .4-3 .8 1 1.8-3-1.2z', '#ffe08a'))) +
  [28, 32, 36, 40, 44].map((x, k) => dot(x, 12, 1.7, '#10181c') + g('btT' + (k + 1), dot(x, 12, 1.7, '#f3f8f7'))).join('') + line('M26 14.6h20', '#5d8a92', .8),
 'Ski Jumping': fill('M0 4q8 0 14 16l2-1v15H0z', '#cfe2ea') + line('M0 4q8 0 14 16l2-1', '#7fa8ae', 1) + fill('M16 34q8-12 30-8v8z', '#e6f6ff') + line('M16 34q8-12 30-8', '#a8c8d4', 1) +
  g('sjJumper', line('M22 17.6l8.6-3.2M22.6 19.4l8.4-1.4', '#1e2f36', 1.1) + line('M23 15.6 30 14', '#e8473f', 2.2) + dot(31.2, 13.4, 1.4, '#ffd34d')),
 Sumo: '<ellipse cx="23" cy="30" rx="21" ry="3.4" fill="#d9c08a"/><ellipse cx="23" cy="30" rx="16" ry="2.2" fill="none" stroke="#9a7a3a" stroke-width=".9"/>' +
  g('smLeft', '<ellipse cx="14" cy="18" rx="6.6" ry="7.6" fill="' + SKIN + '"/>' + dot(16.4, 8.6, 2.6, SKIN) + fill('M16 6.6q.8-1.8 2-.4z', '#1e2f36') + fill('M7.6 20.4h12.8v3H7.6z', '#2f86d6') + line('M11 25l-1.4 4.4M17 25l1.4 4.4', SKIN, 2.4) + line('M19 15.4l4 1.4', SKIN, 2.2)) +
  g('smRight', '<ellipse cx="31" cy="18" rx="6.6" ry="7.6" fill="#c98e66"/>' + dot(28.6, 8.6, 2.6, '#c98e66') + fill('M29 6.6q-.8-1.8-2-.4z', '#1e2f36') + fill('M24.6 20.4h12.8v3H24.6z', '#7e2523') + line('M28 25l-1.4 4.4M34 25l1.4 4.4', '#c98e66', 2.4) + line('M26 15.4l-3 1.4', '#c98e66', 2.2)),
 'Motorcycle Racing': ground(31, '#35606a') + g('mcLines', line('M0 15h8M2 20h6', '#7fa8ae', .8)) +
  g('mcBike', wheel('mcWheelA', 10, 25, 4.6) + wheel('mcWheelB', 33, 25, 4.6) +
    fill('M10 25l6-6h9l3-4h4l2 3-3 1 3 7h-3l-3-5h-6l-3 4z', '#e8473f', ' stroke="#8e1f1b" stroke-width=".4"') + fill('M28 15l4-1.6 1 3.6-3 .8z', '#9fd0ff', ' opacity=".8"') +
    line('M18 18l6-5.4 4 1', '#1e2f36', 2.6) + dot(26.4, 11.6, 2.2, '#ffd34d') + line('M21 18.6l2.4 4.4 3.4.4', '#1e2f36', 1.8)),
 Chess: (() => { let b = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) b += fill('M' + (8 + c * 6) + ' ' + (10 + r * 6) + 'h6v6h-6z', (r + c) % 2 ? '#8a5a3c' : '#f2e3c4'); return b; })() +
  line('M8 10h36v24H8z', '#4d2f1d', .8) +
  g('chPawn', dot(29, 13.4, 1.3, '#1e2f36') + fill('M27.2 17h3.6l-.8-2.6h-2z', '#1e2f36')) +
  g('chKnight', fill('M15 33h6v-1.2q-.6-2.6.6-5.4l-.4-2.6q-2.8-1.4-4.4.6l-1.4 1.6 1 1 1.6-.6-1.2 3.4q-1.4 1.2-1.8 3.2z', '#f3f8f7', ' stroke="#1e2f36" stroke-width=".7"')),
 'Padel Tennis': ground(31) + fill('M40 4h5v27h-5z', '#9fd0ff', ' opacity=".28"') + line('M40 4v27', '#cfe9ea', .8) + line('M20 31v-4.4h4V31', '#9fb7bb', .8) +
  g('pdRacket', line('M5 31l4.4-6.6', '#1e2f36', 2.4) + fill('M9.4 24.4q-2.4-6.2 2-10.4 4.6-3.4 8 .6 2.2 4.4-2.6 8.8z', '#2f86d6', ' stroke="#9fd0ff" stroke-width=".8"') +
    [[12.4, 18], [14.8, 16.6], [15, 19.6], [17.4, 18], [12.8, 21]].map(([x, y]) => dot(x, y, .55, '#163a44')).join('')) +
  g('pdBall', dot(21, 16, 1.7, '#dcf25a')),
 Bowls: fill('M0 18h46v16H0z', '#2e7d4f') + line('M0 18h46', '#4b9a6a', .8) + g('blJack', dot(38, 23, 1.2, '#f3f8f7')) +
  g('blBowl', dot(7, 27, 3.2, '#1e2f36') + '<circle cx="7" cy="27" r="1.6" fill="none" stroke="#ffd34d" stroke-width=".6"/>'),
 Sailing: g('slBoat', fill('M9 24h26l-4 5H13z', '#f3f8f7', ' stroke="#2f5560" stroke-width=".6"') + line('M22 24V3', '#cfd8da', 1) +
    g('slSail', fill('M22.6 4q9 9 9.4 18.6H22.6z', '#f3f8f7', ' stroke="#9fb7bb" stroke-width=".5"') + fill('M21.4 6q-7 8-8.4 16.6h8.4z', '#ffd34d'))) + waves('slWaves'),
 Kabaddi: fill('M0 29h46v5H0z', '#c97b4a') + line('M23 29v-26', '#f3f8f7', .5, ' stroke-dasharray="1.5 1.5"') +
  g('kbRaider', dot(10, 8, 2.4, SKIN) + line('M10 11l1.4 8.4', '#e8473f', 3.4) + line('M11.4 19.4 8 28.6m3.4-9.2 3.6 9', SKIN, 2) + g('kbReach', line('M11 12.6l8.4-1.4', SKIN, 1.6))) +
  g('kbDefender', dot(34, 9, 2.4, '#c98e66') + line('M34 12l-1 8', '#2f86d6', 3.4) + line('M33 20l-2.4 8.6M33 20l3 8.6', '#c98e66', 2) + line('M33.4 13.4l-3.4 2.4m4 0 3.4 2', '#c98e66', 1.4)),
 Greyhound: g('ghRail', line('M-8 30.5H54', '#f3f8f7', 1) + line('M-6 30.5v-3m8 3v-3m8 3v-3m8 3v-3m8 3v-3m8 3v-3m8 3v-3', '#f3f8f7', .8)) +
  g('ghLure', fill('M41 14.6q2-2 3.6 0-1.6 2-3.6 0z', '#f3f8f7') + line('M44.4 14.6H47', '#9fb7bb', .4)) +
  g('ghDog', runLegs([['ghLegH1', 'M12 18l-3 5.6 1.4 4'], ['ghLegF1', 'M27 18l2.6 5 -1 4.4'], ['ghLegH2', 'M14.4 18.6l2 5-2 4.4'], ['ghLegF2', 'M25 18.4l-1.6 5.4 1.6 4']], ['#7f8c92', '#9aa7ad']) +
    fill('M9 15q3-4 10-3.4h6.4l4.6-3.4q2-1.2 3.4 0l2.6 2-.4 1.4-2.8.2-2.2 2.4q-1.4 4.6-7.4 5.2h-8q-4.6-.4-6.2-4.4z', '#9aa7ad') + line('M9.4 14.4q-4 0-7 4', '#7f8c92', 1) +
    fill('M15 11.8h8v4.4h-8z', '#e8473f') + dot(19, 14, 1.4, '#f3f8f7')),
 Harness: g('hsRail', line('M-8 30.5H54', '#f3f8f7', 1) + line('M-6 30.5v-3m8 3v-3m8 3v-3m8 3v-3m8 3v-3m8 3v-3m8 3v-3', '#f3f8f7', .8)) +
  wheel('hsWheel', 8, 24, 5.4, '#cfd8da') + line('M8 24l7-6h11', '#9fb7bb', 1) + line('M10.6 16.4l3.4-6', '#2f86d6', 2.6) + dot(14.6, 8.4, 1.8, '#ffd34d') + line('M13 12l8 3', '#2f86d6', 1) +
  g('hsHorse', runLegs([['hsLegH1', 'M27 19l-1.4 5.4 1 4.4'], ['hsLegF1', 'M39 18.6l1.4 5.2-1 4.6'], ['hsLegH2', 'M29 19.4l1.6 5-1.4 4.2'], ['hsLegF2', 'M37 19l-1.2 5.4 1.4 4']], ['#6e452d', '#8a5a3c']) +
    fill('M24 16q1-3.6 6-3.6h7.4l3-4q2-1.4 3.4-.6l1.6 2-1 1-2 .2-1.6 2.6q-.6 4-4.4 4.6h-8.4q-3.6-.2-4-2.2z', '#8a5a3c') + line('M24.4 15q-2.6.4-3.6 4', '#4d2f1d', 1.2)),
 // Esports emblems (original marks, not the publishers' logos)
 'Esports Hub': g('ehHead', line('M14 20v-4a9 9 0 0 1 18 0v4', L, 2) + fill('M11 18h5v8h-3a2 2 0 0 1-2-2zM30 18h5v6a2 2 0 0 1-2 2h-3z', '#2f86d6') + line('M33 26q0 4-6 4h-3', L, 1.2) + dot(23, 30, 1.2, '#ff7a3d')) +
  g('ehPulse', '<circle cx="23" cy="16" r="4" fill="none" stroke="#ff7a3d" stroke-width="1"/>'),
 'World of Tanks': ground(31, '#5d6a4a') + g('wtTank', fill('M6 24h32l-3 5H9z', '#56664a') + fill('M8 20h28v4H8z', '#6f8459') + fill('M15 15h12l2 5H13z', '#7f9466') +
    '<g class="wtGun">' + line('M27 16.6h14', '#56664a', 1.8) + '</g>' + [10, 15, 20, 25, 30, 34].map(x => dot(x, 27, 1.5, '#2b3324')).join('')) +
  g('wtFlash', fill('M41 15l4-2-1 3 2 1-4 .6 1 2-3-1.6z', '#ffe08a')),
 Crossfire: g('cfScope', '<circle cx="23" cy="17" r="11" fill="none" stroke="#e8473f" stroke-width="1.6"/><circle cx="23" cy="17" r="5" fill="none" stroke="' + L + '" stroke-width="1"/>' +
    line('M23 3v8M23 23v8M9 17h8M29 17h8', L, 1.2)) + g('cfDot', dot(23, 17, 1.4, '#e8473f')),
 'Cricket 24': g('c24Bat', line('M12 4l.6 8', '#2c5966', 2.4) + fill('M10.6 11.6h4.4l1 14.6q-3.2 2-6.4 0z', '#ecc488', ' stroke="#b98543" stroke-width=".5"')) +
  g('c24Ball', dot(30, 18, 2.6, '#d9483f') + line('M28.4 16.6l3.2 2.8', '#ffd9c7', .5)) + fill('M32 25h11v7H32z', '#163a44', ' stroke="#8be3d6" stroke-width=".8"') + dot(35, 28.5, 1, '#8be3d6') + dot(40, 28.5, 1, '#ff7a3d')
});
art.Nascar = art['Motor Racing'].replace(/#3fb6a8/g, '#ffd34d').replace(/#1c6b62/g, '#9a7a10').replace('<g class="mrWheelA">', dot(22, 20.4, 2.2, '#f3f8f7') + line('M21.4 19.4v2', DARK, .8) + '<g class="mrWheelA">');
art['Formula 2'] = art['Formula 1'].replace(/#e8473f/g, '#2f86d6').replace(/#8e1f1b/g, '#174a78');
art['Rugby League'] = art.Rugby.replace(/#2f86d6/g, '#e8473f').replace("'#f3f8f7', '#e8473f'", "'#c06a3a', '#f3f8f7'");
art['Touring Car Racing'] = art['Motor Racing'];
const rel = (x, y) => 'translate(' + x + 'px,' + y + 'px)';
Object.assign(motion, {
 Snooker: [
  ['snCue', '0 0', '0%,100%{transform:translate(-2px,.8px)}30%{transform:translate(-5px,2px)}40%{transform:translate(1px,-.4px)}56%{transform:translate(-2px,.8px)}'],
  ['snWhite', '20px 23.4px', '0%,39%{transform:none}54%{transform:translate(10.6px,-2.4px)}70%{transform:translate(12px,-1px)}88%,100%{transform:none}'],
  ['snRed', '33px 20.6px', '0%,53%{transform:none;opacity:1}72%{transform:translate(9.6px,-5.2px);opacity:1}78%{transform:translate(10.4px,-5.8px) scale(.2);opacity:0}92%{transform:none;opacity:0}100%{opacity:1}']],
 'Water Polo': [
  ['wpWaves', '0 0', 'to{transform:translateX(6px)}', '.9s', 'linear'],
  ['wpArm', '10.6px 22.4px', '0%,100%{transform:rotate(0)}30%{transform:rotate(-26deg)}42%{transform:rotate(30deg)}58%{transform:rotate(10deg)}'],
  ['wpBall', '14.8px 8.4px', '0%{transform:none;opacity:1}30%{transform:translate(-5px,1px)}42%{transform:translate(5px,2px)}62%{transform:translate(23px,8px) rotate(200deg);opacity:1}72%,90%{transform:translate(24px,9px);opacity:0}100%{transform:none;opacity:1}'],
  ['wpNet', '44px 18px', '0%,60%{transform:none}67%{transform:translateX(1.4px)}78%,100%{transform:none}']],
 'Cross-Country': [
  ['ccTrack', '0 0', 'to{transform:translateX(-7px)}', '.5s', 'linear'],
  ['ccFront', '18px 14px', '0%,100%{transform:rotate(-10deg)}50%{transform:rotate(12deg)}', '1s'],
  ['ccBack', '18px 14px', '0%,100%{transform:rotate(12deg)}50%{transform:rotate(-10deg)}', '1s']],
 Floorball: [
  ['flStick', '5px 1px', '0%,100%{transform:rotate(0)}26%{transform:rotate(24deg)}38%{transform:rotate(-12deg)}52%{transform:rotate(0)}'],
  ['flBall', '22.4px 28.6px', '0%,37%{transform:none;opacity:1}56%{transform:translate(15.6px,-2px) rotate(220deg);opacity:1}66%{transform:translate(17px,-2px);opacity:1}74%,92%{transform:translate(17px,-2px);opacity:0}100%{transform:none;opacity:1}'],
  ['flNet', '44px 26px', '0%,55%{transform:none}63%{transform:translateX(1.4px)}75%,100%{transform:none}']],
 Cycling: [
  ['cyRoad', '0 0', 'to{transform:translateX(-9px)}', '.4s', 'linear'],
  ['cyWheelA', '11px 24px', 'to{transform:rotate(360deg)}', '.5s', 'linear'],
  ['cyWheelB', '34px 24px', 'to{transform:rotate(360deg)}', '.5s', 'linear'],
  ['cyCrank', '20px 24px', 'to{transform:rotate(360deg)}', '.8s', 'linear'],
  ['cyLeg', '17.6px 12.8px', '0%,100%{transform:rotate(-8deg)}50%{transform:rotate(10deg)}', '.8s']],
 Lacrosse: [
  ['lxStick', '5px 31px', '0%,100%{transform:rotate(0)}30%{transform:rotate(-30deg)}44%{transform:rotate(28deg)}60%{transform:rotate(14deg)}'],
  ['lxBall', '16px 6.6px', '0%{transform:none;opacity:1}30%{transform:translate(-10px,3px)}43%{transform:translate(6px,1px)}62%{transform:translate(22px,16px);opacity:1}72%,90%{transform:translate(23px,17px);opacity:0}100%{transform:none;opacity:1}'],
  ['lxNet', '44px 22px', '0%,60%{transform:none}67%{transform:translateX(1.4px)}78%,100%{transform:none}']],
 'Alpine Skiing': [
  ['asGates', '0 0', 'from{transform:translate(12px,5.7px)}to{transform:translate(-16px,-7.6px)}', '1.2s', 'linear'],
  ['asSkier', '20px 22px', '0%,100%{transform:rotate(-6deg) translateY(-1px)}50%{transform:rotate(6deg) translateY(1px)}', '1.2s'],
  ['asSpray', '12px 19px', '0%,100%{opacity:0;transform:none}30%{opacity:1}60%{opacity:0;transform:translate(-3px,-2px)}', '.6s']],
 Biathlon: [
  ['btRifle', '8px 12px', '0%,9%,24%,39%,54%,69%,100%{transform:none}11%,26%,41%,56%,71%{transform:translateX(-.8px) rotate(-2deg)}'],
  ['btFlash', '23px 12px', '0%,9%{opacity:0}10%,11%{opacity:1}13%,24%{opacity:0}25%,26%{opacity:1}28%,39%{opacity:0}40%,41%{opacity:1}43%,54%{opacity:0}55%,56%{opacity:1}58%,69%{opacity:0}70%,71%{opacity:1}73%,100%{opacity:0}', '2.4s', 'linear'],
  ['btT1', '28px 12px', '0%,12%{opacity:0}14%,92%{opacity:1}96%,100%{opacity:0}', '2.4s', 'linear'],
  ['btT2', '32px 12px', '0%,27%{opacity:0}29%,92%{opacity:1}96%,100%{opacity:0}', '2.4s', 'linear'],
  ['btT3', '36px 12px', '0%,42%{opacity:0}44%,92%{opacity:1}96%,100%{opacity:0}', '2.4s', 'linear'],
  ['btT4', '40px 12px', '0%,57%{opacity:0}59%,92%{opacity:1}96%,100%{opacity:0}', '2.4s', 'linear'],
  ['btT5', '44px 12px', '0%,72%{opacity:0}74%,92%{opacity:1}96%,100%{opacity:0}', '2.4s', 'linear']],
 'Ski Jumping': [
  ['sjJumper', '26px 16px', '0%{transform:' + rel(-22, -10) + ' rotate(38deg);opacity:1}30%{transform:' + rel(-12, 3) + ' rotate(18deg)}55%{transform:none}78%{transform:' + rel(12, 10) + ' rotate(16deg);opacity:1}86%,94%{transform:' + rel(14, 11) + ' rotate(16deg);opacity:0}100%{transform:' + rel(-22, -10) + ' rotate(38deg);opacity:0}', '1.8s', 'linear']],
 Sumo: [
  ['smLeft', '14px 28px', '0%,100%{transform:none}30%{transform:translateX(-1px)}46%{transform:translateX(3px) rotate(6deg)}64%{transform:translateX(4px) rotate(4deg)}82%{transform:none}'],
  ['smRight', '31px 28px', '0%,100%{transform:none}30%{transform:translateX(1px)}46%{transform:translateX(1px) rotate(-4deg)}64%{transform:translateX(5px) rotate(8deg)}82%{transform:none}']],
 'Motorcycle Racing': [
  ['mcBike', '22px 25px', '0%{transform:translateX(-50px) rotate(-6deg)}26%{transform:translateX(2px) rotate(-10deg)}38%,60%{transform:translateX(0) rotate(-8deg)}78%,100%{transform:translateX(56px) rotate(-4deg)}', '1.8s', 'cubic-bezier(.6,0,.4,1)'],
  ['mcLines', '0 0', '0%,20%{opacity:0}30%,62%{opacity:1}76%,100%{opacity:0}', '1.8s'],
  ['mcWheelA', '10px 25px', 'to{transform:rotate(360deg)}', '.28s', 'linear'],
  ['mcWheelB', '33px 25px', 'to{transform:rotate(360deg)}', '.28s', 'linear']],
 Chess: [
  ['chKnight', '18px 30px', '0%,100%{transform:none}20%{transform:translateY(-3px)}42%{transform:translate(0,-12px)}62%{transform:translate(12px,-12px)}72%{transform:translate(12px,-12px)}88%{transform:translate(12px,-12px);opacity:1}94%{opacity:0}96%{transform:none;opacity:0}'],
  ['chPawn', '29px 15px', '0%,58%{transform:none;opacity:1}68%{transform:translate(5px,-6px) rotate(50deg);opacity:0}96%{transform:none;opacity:0}100%{opacity:1}']],
 'Padel Tennis': [
  ['pdRacket', '5px 31px', '0%,100%{transform:rotate(-30deg)}30%{transform:rotate(-34deg)}40%{transform:rotate(10deg)}52%{transform:rotate(26deg)}76%{transform:rotate(-30deg)}'],
  ['pdBall', '21px 16px', '0%{transform:translate(-2px,-6px)}38%{transform:none}56%{transform:translate(18px,-2px)}74%{transform:translate(4px,8px)}88%{transform:translate(-2px,6px);opacity:1}94%{opacity:0}98%{transform:translate(-2px,-6px);opacity:0}100%{opacity:1}']],
 Bowls: [
  ['blBowl', '7px 27px', '0%{transform:none;opacity:1}30%{transform:translate(10px,-2px) rotate(240deg)}60%{transform:translate(22px,-5px) rotate(520deg)}80%{transform:translate(28px,-4.6px) rotate(640deg)}88%{transform:translate(28.6px,-4.4px) rotate(660deg);opacity:1}96%{opacity:0}100%{transform:none;opacity:0}', '2s', 'ease-out'],
  ['blJack', '38px 23px', '0%,79%{transform:none}86%{transform:translate(2px,-.6px)}100%{transform:translate(2px,-.6px)}', '2s']],
 Sailing: [
  ['slWaves', '0 0', 'to{transform:translateX(6px)}', '1.1s', 'linear'],
  ['slBoat', '22px 26px', '0%,100%{transform:rotate(-4deg) translateY(0)}50%{transform:rotate(4deg) translateY(1px)}', '1.6s'],
  ['slSail', '22px 22px', '0%,100%{transform:skewY(0)}50%{transform:skewY(-4deg)}', '.8s']],
 Kabaddi: [
  ['kbRaider', '10px 28px', '0%,100%{transform:none}36%{transform:translateX(6px) rotate(8deg)}52%{transform:translateX(7px) rotate(10deg)}72%{transform:none}'],
  ['kbReach', '11px 12.6px', '0%,30%{transform:none}46%{transform:scaleX(1.5)}60%,100%{transform:none}'],
  ['kbDefender', '34px 28px', '0%,40%{transform:none}54%{transform:translateX(3px) rotate(-10deg)}76%,100%{transform:none}']],
 Greyhound: [
  ['ghRail', '0 0', 'to{transform:translateX(-8px)}', '.26s', 'linear'],
  ['ghLure', '44px 14.6px', '0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}', '.3s'],
  ['ghDog', '22px 18px', '0%,100%{transform:translateY(0) scaleX(1)}50%{transform:translateY(-1px) scaleX(1.05)}', '.4s'],
  ['ghLegF1', '27px 18px', '0%,100%{transform:rotate(-34deg)}50%{transform:rotate(30deg)}', '.4s'],
  ['ghLegF2', '25px 18.4px', '0%,100%{transform:rotate(26deg)}50%{transform:rotate(-30deg)}', '.4s'],
  ['ghLegH1', '12px 18px', '0%,100%{transform:rotate(34deg)}50%{transform:rotate(-30deg)}', '.4s'],
  ['ghLegH2', '14.4px 18.6px', '0%,100%{transform:rotate(-26deg)}50%{transform:rotate(30deg)}', '.4s']],
 Harness: [
  ['hsRail', '0 0', 'to{transform:translateX(-8px)}', '.4s', 'linear'],
  ['hsWheel', '8px 24px', 'to{transform:rotate(360deg)}', '.6s', 'linear'],
  ['hsHorse', '33px 18px', '0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}', '.4s'],
  ['hsLegF1', '39px 18.6px', '0%,100%{transform:rotate(-24deg)}50%{transform:rotate(22deg)}', '.8s'],
  ['hsLegH2', '29px 19.4px', '0%,100%{transform:rotate(-24deg)}50%{transform:rotate(22deg)}', '.8s'],
  ['hsLegF2', '37px 19px', '0%,100%{transform:rotate(22deg)}50%{transform:rotate(-24deg)}', '.8s'],
  ['hsLegH1', '27px 19px', '0%,100%{transform:rotate(22deg)}50%{transform:rotate(-24deg)}', '.8s']],
 'Esports Hub': [
  ['ehPulse', '23px 16px', '0%{transform:scale(.6);opacity:1}100%{transform:scale(2.4);opacity:0}', '1.2s', 'ease-out'],
  ['ehHead', '23px 20px', '0%,100%{transform:rotate(0)}25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}', '1.2s']],
 'World of Tanks': [
  ['wtTank', '22px 26px', '0%,40%,100%{transform:none}44%{transform:translateX(-1.4px)}56%{transform:none}'],
  ['wtGun', '27px 16.6px', '0%,40%,100%{transform:none}44%{transform:translateX(-2px)}60%{transform:none}'],
  ['wtFlash', '42px 15px', '0%,40%{opacity:0;transform:scale(.4)}44%{opacity:1;transform:scale(1.1)}54%,100%{opacity:0;transform:scale(1.3)}']],
 Crossfire: [
  ['cfScope', '23px 17px', '0%{transform:translate(-4px,2px) rotate(0)}40%{transform:translate(3px,-2px) rotate(40deg)}55%,75%{transform:none}100%{transform:translate(-4px,2px) rotate(90deg)}'],
  ['cfDot', '23px 17px', '0%,55%{transform:scale(1);opacity:.6}60%{transform:scale(2.2);opacity:1}75%,100%{transform:scale(1);opacity:.6}']],
 'Cricket 24': [
  ['c24Bat', '12px 4px', '0%,100%{transform:rotate(30deg)}40%{transform:rotate(36deg)}52%{transform:rotate(-30deg)}70%{transform:rotate(30deg)}'],
  ['c24Ball', '30px 18px', '0%{transform:translateX(10px);opacity:0}20%{opacity:1}50%{transform:translateX(-12px)}70%{transform:translate(6px,-18px);opacity:1}76%,100%{transform:translate(8px,-20px);opacity:0}']]
});
for (const [copy, source] of [['Nascar', 'Motor Racing'], ['Touring Car Racing', 'Motor Racing'], ['Formula 2', 'Formula 1'], ['Rugby League', 'Rugby']]) motion[copy] = [];
// e-versions of real sports: same scene plus a controller badge
const eBase = {'eSoccer': 'Football', 'eSoccer: Volta': 'Football', 'eSoccer: Penalty': 'Football', 'eBasketball': 'Basketball', 'eHorse Racing': 'Horse Racing',
  'eCricket': 'Cricket', 'eCricket: X-Battle Bats': 'Cricket', 'eFighting': 'Boxing', 'eVaquejada': 'Horse Racing', 'eHockey': 'Ice Hockey'};
const pad = fill('M33 25.4h10.6q2 0 2 2v3.2q0 2-2 2H33q-2 0-2-2v-3.2q0-2 2-2z', '#163a44', ' stroke="#8be3d6" stroke-width=".8"') + line('M34.4 29h2.6M35.7 27.7v2.6', '#8be3d6', .8) + dot(41, 28.2, .7, '#ff7a3d') + dot(42.6, 29.8, .7, '#ffd34d');
for (const [eName, base] of Object.entries(eBase)) art[eName] = art[base] + pad;

// ---- Depth layer shared by every scene: shaded spheres, light bevel, ground shadows, motion trails ----
// Projectiles that leave a trail; a number is the ground line its shadow sits on.
const flying = {fbBall: 30.4, tnBall: 31, ckBall: 30.6, bbBall: 30.6, afBall: 30.4, arBall: 30.4, rgBall: 30.4, bmShuttle: 30.6, bsBall: 30.6,
  hbBall: 30.6, vbBall: 30.6, ttBall: 23.4, lxBall: 30.6, pdBall: 30.6, ihPuck: null, flBall: null, dtDart: null, wpBall: null, c24Ball: null,
  snWhite: null, snRed: null, blBowl: null, sjJumper: null};
const originOf = {};
for (const parts of Object.values(motion)) for (const [cls, origin, frames, dur, ease] of parts) originOf[cls] = {origin, frames, dur, ease};
const shadowFrames = frames => frames.replace(/([^{}]+)\{([^}]*)\}/g, (all, sel, body) => {
  let x = 0, y = 0;
  const t = /translate\((-?[\d.]+)px(?:,\s*(-?[\d.]+)px)?\)/.exec(body), tx = /translateX\((-?[\d.]+)px\)/.exec(body), ty = /translateY\((-?[\d.]+)px\)/.exec(body);
  if (t) { x = +t[1]; y = +(t[2] || 0); }
  if (tx) x = +tx[1];
  if (ty) y = +ty[1];
  const lift = Math.max(0, -y), s = Math.max(.3, 1 - lift / 22);
  const op = /opacity:\s*([\d.]+)/.exec(body);
  return sel + '{transform:translateX(' + x + 'px) scale(' + s.toFixed(2) + ');opacity:' + ((op ? +op[1] : 1) * (0.35 + 0.65 * s)).toFixed(2) + '}';
});
const triggers = [':is(button,a):is(:hover,:focus-visible,:active,[aria-pressed=true])', '.active'];
const on = sel => triggers.map(t => 'html.iconMotionEnabled ' + t + ' ' + sel).join(',');
let css = '.motionIcon *{transform-box:view-box}.motionIcon{overflow:hidden;filter:drop-shadow(0 1px .7px rgba(0,0,0,.55))}';
for (const [sportName, parts] of Object.entries(motion)) for (const [cls, origin, frames, dur = '1.6s', ease = 'ease-in-out'] of parts) {
  css += '.motionIcon .' + cls + '{transform-origin:' + origin + '}@keyframes sm-' + cls + '{' + frames + '}' +
    on('.motionIcon .' + cls) + '{animation:sm-' + cls + ' ' + dur + ' ' + ease + ' infinite!important}';
}
for (const [cls, ground] of Object.entries(flying)) {
  const m = originOf[cls];
  if (!m || ground == null) continue;
  const [ox] = m.origin.split(' ');
  css += '.motionIcon .' + cls + 'Sh{transform-origin:' + ox + ' ' + ground + 'px}@keyframes sm-' + cls + 'Sh{' + shadowFrames(m.frames) + '}' +
    on('.motionIcon .' + cls + 'Sh') + '{animation:sm-' + cls + 'Sh ' + (m.dur || '1.6s') + ' ' + (m.ease || 'ease-in-out') + ' infinite!important}';
}
css += '.motionIcon .smGhost{visibility:hidden}' + on('.motionIcon .smGhost') + '{visibility:visible}' +
  on('.motionIcon .g1 *') + '{animation-delay:.035s!important}' + on('.motionIcon .g2 *') + '{animation-delay:.07s!important}' +
  '.motionIcon :is(.bsSpark,.bxHit,.ihSpray,.fbBurst){opacity:0}.motionIcon .f1Lines,.motionIcon .mrLines,.motionIcon .mcLines{opacity:0}' +
  'html:not(.iconMotionEnabled) .motionIcon *{animation:none!important}';  // the site's Motion switch (defaults to the OS reduce-motion setting) decides
const style = document.createElement('style');
style.id = 'sportMotion';
style.textContent = css;
document.head.appendChild(style);

// Shared SVG defs: sphere gradients (built per colour on demand), ground shadow, soft top-left light.
const defsHost = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
defsHost.setAttribute('width', '0'); defsHost.setAttribute('height', '0'); defsHost.setAttribute('aria-hidden', 'true');
defsHost.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
defsHost.innerHTML = '<defs><radialGradient id="smShadowG"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
  '<filter id="smBevel" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation=".55" result="b"/>' +
  '<feSpecularLighting in="b" surfaceScale="1.6" specularConstant=".42" specularExponent="18" lighting-color="#ffffff" result="s"><feDistantLight azimuth="235" elevation="48"/></feSpecularLighting>' +
  '<feComposite in="s" in2="SourceAlpha" operator="in" result="lit"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="lit"/></feMerge></filter></defs>';
document.body.appendChild(defsHost);
const made = new Set();
const mix = (hex, to, k) => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.substr(i, 2), 16) * (1 - k) + to * k).toString(16).padStart(2, '0')).join('');
function sphere(hex) {
  const id = 'smS' + hex.slice(1);
  if (!made.has(id)) {
    made.add(id);
    defsHost.firstChild.insertAdjacentHTML('beforeend', '<radialGradient id="' + id + '" cx=".36" cy=".32" r=".75"><stop offset="0" stop-color="' + mix(hex, 255, .55) + '"/>' +
      '<stop offset=".45" stop-color="' + hex + '"/><stop offset="1" stop-color="' + mix(hex, 0, .45) + '"/></radialGradient>');
  }
  return 'url(#' + id + ')';
}
function element(html, cls) {  // the complete <g class="cls">…</g> element, nested groups included
  const start = html.indexOf('<g class="' + cls + '">');
  if (start < 0) return null;
  let depth = 0, i = start;
  const re = /<g[\s>]|<\/g>/g;
  re.lastIndex = start;
  for (let m; (m = re.exec(html));) { depth += m[0] === '</g>' ? -1 : 1; if (!depth) { i = m.index + 4; break; } }
  return html.slice(start, i);
}
const built = {};
function depthScene(name) {
  if (built[name]) return built[name];
  let html = art[name]
    .replace(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)" fill="(#[0-9a-fA-F]{6})"/g, (m, x, y, r, c) => +r >= 1.3 ? '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + sphere(c) + '"' : m)
    .replace(/<ellipse cx="([\d.]+)" cy="([\d.]+)" rx="([\d.]+)" ry="([\d.]+)" fill="(#[0-9a-fA-F]{6})"/g, (m, x, y, rx, ry, c) => +rx >= 2 ? '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + sphere(c) + '"' : m);
  for (const [cls, ground] of Object.entries(flying)) {
    const el = element(html, cls);
    if (!el) continue;
    const m = originOf[cls];
    const [ox] = (m ? m.origin : '0px').split(' ');
    const shadow = ground == null ? '' : '<g class="' + cls + 'Sh"><ellipse cx="' + parseFloat(ox) + '" cy="' + ground + '" rx="3" ry=".75" fill="url(#smShadowG)"/></g>';
    html = html.replace(el, shadow + '<g class="smGhost g2" opacity=".14">' + el + '</g><g class="smGhost g1" opacity=".3">' + el + '</g>' + el);
  }
  return built[name] = '<g filter="url(#smBevel)">' + html + '</g>';
}

const previousIcon = icon;
icon = function(name) {
  if (!art[name]) return previousIcon(name);  // Golf, Novelties and the older esports marks keep their existing art
  return '<svg aria-hidden="true" class="sportIcon actionIcon motionIcon" data-sport-motion="' + name + '" viewBox="0 0 46 34">' + depthScene(name) + '</svg>';
};

window.sportMotionArt = art;
// Hooks for hubie-motion.js: swap scene art, rebuild e-versions, clear the built-scene cache.
window.sportMotion = {art, eBase, pad, rebuild: () => { for (const k of Object.keys(built)) delete built[k]; for (const [e, b] of Object.entries(eBase)) art[e] = art[b] + pad; }, element};
// Beta starts with Motion on, except for visitors whose device asks for reduced motion (they can still switch it on).
// Beta v2: on by default for everyone; the profile menu's Animations switch turns it off (remembered).
motionPreference = () => localStorage.getItem('beta.field-motion') !== 'off';
motionOn = motionPreference();
render();
}
