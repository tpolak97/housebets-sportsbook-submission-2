'use strict';
/* Phone navigation (≤750px), all submissions.
   - Bottom bar: Menu · Casino · Sports · Live · My bets. Menu slides the full sidebar in from the left (Top sports,
     All sports / esports / racing, league dropdowns); tapping outside or choosing something closes it.
   - Floating bubbles above the bar, bottom right: support (headset) and, left of it, the bet slip with its pick count.
   - Header: compact logo and wallet so search, chat and profile all fit (phone-nav.css). */
{
const phone = () => matchMedia('(max-width:750px)').matches;
const MENU = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
const SLIP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5V9a3 3 0 0 0 0 6v3.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5V15a3 3 0 0 0 0-6z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M9 9.5h6M9 12h6M9 14.5h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
const WALLET = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><rect x="3.5" y="7.5" width="17" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="16.5" cy="13.5" r="1.4" fill="currentColor"/></svg>';
let drawer = false;

const item = (page, key, label, count) => {
  const on = !drawer && (p === page || (page === 'home' && !['casino', 'live', 'bets'].includes(p)));
  return '<a href="' + href(page) + '" class="' + (on ? 'active' : '') + '"' + (on ? ' aria-current="page"' : '') + '>' +
    '<span class="pbIcon">' + toolbarMark(key) + (count ? '<b class="pbCount">' + count + '</b>' : '') + '</span><span class="pbLabel">' + label + '</span></a>';
};
window.phoneBar = function() {
  const open = (typeof bets !== 'undefined' ? bets : []).filter(b => b.state === 'Open').length;
  return '<nav class="phoneBar pnBar" aria-label="Main"><button class="pnMenu' + (drawer ? ' active' : '') + '" aria-expanded="' + drawer + '" aria-controls="productSidebar" onclick="pnDrawer()">' +
    '<span class="pbIcon">' + MENU + '</span><span class="pbLabel">Menu</span></button>' +
    item('casino', 'casino', 'Casino') + item('home', 'sports', 'Sports') + item('live', 'live', 'Live') + item('bets', 'bets', 'My bets', open) + '</nav>';
};
window.pnDrawer = force => {
  drawer = typeof force === 'boolean' ? force : !drawer;
  document.documentElement.classList.toggle('pnDrawerOpen', drawer);
  document.querySelector('.phoneBar')?.replaceWith(Object.assign(document.createElement('template'), {innerHTML: phoneBar()}).content.firstElementChild);
  if (drawer) document.getElementById('productSidebar')?.scrollTo({top: 0});
};
// Close the drawer when a choice navigates or the backdrop is tapped.
addEventListener('hashchange', () => { if (drawer) pnDrawer(false); });
document.addEventListener('click', e => {
  if (!drawer || !phone()) return;
  if (e.target.closest('.pnBackdrop')) return pnDrawer(false);
  const side = e.target.closest('#productSidebar');
  if (side && e.target.closest('.rbItem, .rbLeague, a[href], .rbAll, .openDirectory, .productSwitch a, .productSwitch button')) setTimeout(() => pnDrawer(false), 60);
});

const bubbles = () => {
  if (p === 'casino') return '';
  const n = window.betaSinglesCount?.() || (slip ? 1 : 0);
  const alert = slip && {paused: 'Suspended', changed: 'Odds changed', failed: 'Retry'}[mode];
  return '<div class="pnBubbles"><button class="pnSlip' + (n ? ' hasPick' : '') + (alert ? ' alert' : '') + '" aria-label="Bet slip, ' + (n ? n + (n > 1 ? ' selections' : ' selection') : 'empty') + '" onclick="tab=\'Slip\';sheet=true;render()">' +
    SLIP + (n ? '<b>' + n + '</b>' : '') + '</button>' +
    '<button class="pnHelp" aria-label="Help and support" onclick="pnSupport()">' + toolbarMark('support') + '</button></div>';
};
window.pnSupport = () => {
  const launcher = document.getElementById('supportLauncher');
  if (launcher) launcher.click(); else if (typeof openSupport === 'function') openSupport();
};
const decorate = () => {
  document.querySelector('.pnBubbles')?.remove();
  document.querySelector('.pnBackdrop')?.remove();
  app.insertAdjacentHTML('beforeend', bubbles() + '<div class="pnBackdrop" aria-hidden="true"></div>');
  const open = document.querySelector('.wOpen');
  if (open && !open.querySelector('svg')) open.insertAdjacentHTML('afterbegin', '<span class="pnWalletIcon">' + WALLET + '</span>');
  document.documentElement.classList.toggle('pnDrawerOpen', drawer && phone());
};
const renderBefore = render;
render = function() { renderBefore(); decorate(); };
window.render = render;
// The slip-only redraws (multi-singles.js) don't call render(): keep the bubble count in step.
setInterval(() => { const b = document.querySelector('.pnSlip'); if (!b) return; const n = window.betaSinglesCount?.() || (slip ? 1 : 0), has = b.querySelector('b');
  if ((has ? +has.textContent : 0) !== n) { const t = document.createElement('template'); t.innerHTML = bubbles(); b.parentElement.replaceWith(t.content.firstElementChild); } }, 700);
render();
}
