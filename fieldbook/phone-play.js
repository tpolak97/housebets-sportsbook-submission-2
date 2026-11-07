'use strict';
/* Beta v2 on touch screens (no hover): card duels play one at a time.
   On desktop a fixture card's duel plays while the mouse is over it (hubie-kits.js, hubie-sports.js). Phones have no
   hover, so here the card most fully in view, nearest the middle of the screen, plays once scrolling settles; every
   other card stands at rest. Touching a card makes it the playing one straight away. The duels are driven by the
   same mouseenter/mouseleave events the desktop uses, so nothing else changes. Match page headers always play. */
{
const touch = matchMedia('(hover: none), (pointer: coarse)');
const CARDS = '.snapCard, .footballMatchCard';
let current = null, timer = 0, touched = false;  // touched: a card the user touched keeps playing until they scroll
const hasDuel = c => c.querySelector('.hkDuelBox, .hsBox, svg.hkDuel, svg.hsDuel');
const play = c => {
  if (c === current) return;
  if (current && current.isConnected) current.dispatchEvent(new MouseEvent('mouseleave'));
  current = c;
  if (c) c.dispatchEvent(new MouseEvent('mouseenter'));
};
// How much of the card is on screen (0..1) and how far its centre is from the screen's centre.
const score = c => {
  const r = c.getBoundingClientRect(), W = innerWidth, H = innerHeight;
  if (!r.width || !r.height) return -1;
  const vis = Math.max(0, Math.min(r.right, W) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0)) / (r.width * r.height);
  if (vis < .6) return -1;
  const dx = (r.left + r.width / 2 - W / 2) / W, dy = (r.top + r.height / 2 - H * .45) / H;
  return vis - Math.hypot(dx, dy);
};
const pickBest = () => {
  timer = 0;
  if (!touch.matches || (touched && current && current.isConnected)) return;
  touched = false;
  let best = null, top = -1;
  for (const c of document.querySelectorAll(CARDS)) { if (!hasDuel(c)) continue; const s = score(c); if (s > top) { top = s; best = c; } }
  play(best);
};
// Scrolling restarts the wait (play once it settles); page updates only make sure a check is queued, so live
// updates that redraw parts of the page every second can't keep postponing it.
const soon = (ms = 220) => { if (!touch.matches) return; clearTimeout(timer); timer = setTimeout(pickBest, ms); };
const queue = (ms = 400) => { if (!touch.matches || timer) return; timer = setTimeout(pickBest, ms); };
// Scrolling (the page and the sideways card rows) settles, then the best card plays.
addEventListener('scroll', () => { touched = false; soon(); }, {capture: true, passive: true});
addEventListener('resize', () => soon());
// A touch plays that card at once.
addEventListener('touchstart', e => { if (!touch.matches) return; const c = e.target.closest?.(CARDS); if (c && hasDuel(c)) { clearTimeout(timer); timer = 0; touched = true; play(c); } }, {passive: true});
// Re-rendered pages (new cards) pick again.
new MutationObserver(() => { if (current && !current.isConnected) current = null; queue(); }).observe(document.getElementById('app') || document.body, {childList: true, subtree: true});
touch.addEventListener?.('change', () => { if (!touch.matches) play(null); else soon(); });
queue(600);
// Safety net: every 1.5 s (page visible, not mid-scroll) make sure the right card is the one playing, in case a scroll
// event was missed (momentum scrolling, snap settling).
let lastScroll = 0;
addEventListener('scroll', () => { lastScroll = Date.now(); }, {capture: true, passive: true});
setInterval(() => { if (touch.matches && !document.hidden && !timer && Date.now() - lastScroll > 300) pickBest(); }, 1500);
window.phonePlayNow = () => { pickBest(); return current; };
}
