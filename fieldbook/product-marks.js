'use strict';
/* Casino and Sports marks (sidebar switch, collapsed sidebar, phone bottom bar): a red-and-white poker chip with a gold
   spade, and a classic black-and-white football. Full colour so they read at a glance; the chip spins and the ball
   rolls on hover, focus or when selected (with the Animations switch on). */
{
const CHIP = '<svg class="utilityMark pmMark pmChip" aria-hidden="true" viewBox="0 0 24 24">' +
  '<circle cx="12" cy="12" r="11" fill="#d42a2f"/>' +
  '<g class="pmSpin">' + [0, 45, 90, 135, 180, 225, 270, 315].map(a => '<rect x="10.6" y=".9" width="2.8" height="4" rx=".6" fill="#fff" transform="rotate(' + a + ' 12 12)"/>').join('') +
  '<circle cx="12" cy="12" r="7.2" fill="#a3141b"/><circle cx="12" cy="12" r="7.2" fill="none" stroke="#fff" stroke-width=".8" stroke-dasharray="1.6 1.4"/></g>' +
  '<path d="M12 7.6c1.9 2 3.6 3.2 3.6 5 0 1.2-.9 2-2 2-.6 0-1.1-.2-1.3-.6l.5 2.1h-1.6l.5-2.1c-.2.4-.7.6-1.3.6-1.1 0-2-.8-2-2 0-1.8 1.7-3 3.6-5z" fill="#ffd36b" stroke="#7a4b00" stroke-width=".35"/>' +
  '<circle cx="12" cy="12" r="11" fill="none" stroke="#ffffff55" stroke-width=".6"/></svg>';
const BALL = '<svg class="utilityMark pmMark pmBall" aria-hidden="true" viewBox="0 0 24 24">' +
  '<defs><clipPath id="pmBallClip"><circle cx="12" cy="12" r="10.6"/></clipPath></defs>' +
  '<g class="pmRoll"><circle cx="12" cy="12" r="10.6" fill="#f8fbfa"/>' +
  '<g clip-path="url(#pmBallClip)" fill="#14232a"><path d="M12.00 8.50 15.33 10.92 14.06 14.83 9.94 14.83 8.67 10.92ZM14.67 4.24 10.98 5.44 8.70 2.30 10.98 -0.84 14.67 0.36ZM20.21 12.14 17.93 9.00 20.21 5.86 23.90 7.06 23.90 10.94ZM14.40 19.85 16.68 16.71 20.37 17.91 20.37 21.79 16.68 22.99ZM5.28 16.71 8.97 17.91 8.97 21.79 5.28 22.99 3.00 19.85ZM5.44 7.06 5.44 10.94 1.75 12.14 -0.53 9.00 1.75 5.86Z"/></g>' +
  '<path d="M12.00 8.50L12.00 5.40M15.33 10.92L18.28 9.96M14.06 14.83L15.88 17.34M9.94 14.83L8.12 17.34M8.67 10.92L5.72 9.96" stroke="#14232a" stroke-width=".9"/></g>' +
  '<circle cx="12" cy="12" r="10.6" fill="none" stroke="#14232a" stroke-width="1.1"/>' +
  '<ellipse cx="8.6" cy="7.4" rx="3" ry="1.8" fill="#fff" opacity=".55" transform="rotate(-30 8.6 7.4)"/></svg>';
const before = toolbarMark;
toolbarMark = function(key) {
  if (key === 'casino') return CHIP;
  if (key === 'sports') return BALL;
  return before(key);
};
window.toolbarMark = toolbarMark;
const on = sel => 'html.iconMotionEnabled :is(a,button):is(:hover,:focus-visible,.active,[aria-current]) ' + sel;
const css = document.createElement('style');
css.textContent = '.pmMark{overflow:visible}.pmMark .pmSpin,.pmMark .pmRoll{transform-box:view-box;transform-origin:12px 12px}' +
  '.pmChip{filter:drop-shadow(0 1px 2px #0008) drop-shadow(0 0 4px #ff4d5544)}.pmBall{filter:drop-shadow(0 1px 2px #0008) drop-shadow(0 0 4px #9fe8d866)}' +
  on('.pmChip .pmSpin') + '{animation:pmSpin 2.4s linear infinite}' + on('.pmBall .pmRoll') + '{animation:pmSpin 3s linear infinite}' +
  '@keyframes pmSpin{to{transform:rotate(360deg)}}' +
  'html:not(.iconMotionEnabled) .pmMark *{animation:none!important}';
document.head.appendChild(css);
render();
}
