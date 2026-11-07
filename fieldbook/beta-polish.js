'use strict';
/* Beta polish: self-rotating home banner and a clearer singles bet slip. */
{
// ---- Banner: pans to the next slide every 6 s (follows the site's Motion switch, pauses on hover/focus or with a panel open) ----
let bannerAuto = localStorage.getItem('beta.banner-auto') !== 'off';
prefs.auto = false;  // the earlier rotation also honoured the OS reduce-motion flag; Beta uses its own below
let promoDir = 0;
const promoBefore = promoArt;
promoArt = function() {
  let html = promoBefore();
  if (promoDir) { html = html.replace('class="promoArt', 'class="promoArt promoEnter' + (promoDir < 0 ? ' promoBack' : '')); promoDir = 0; }
  return html;
};
const stepBefore = promoStep;
promoStep = function(n) {
  promoDir = n === refPromoIndex - 1 || (refPromoIndex === 0 && n === promos.length - 1) ? -1 : 1;
  stepBefore(n);
};
addBannerControls = function() {
  const bar = document.querySelector('.promoControls');
  if (bar) bar.insertAdjacentHTML('beforeend', '<button class="promoPlay" aria-label="' + (bannerAuto ? 'Pause' : 'Play') + ' banners" onclick="toggleBannerAuto()">' + (bannerAuto ? 'Ⅱ' : '▶') + '</button>');
};
window.toggleBannerAuto = () => { bannerAuto = !bannerAuto; localStorage.setItem('beta.banner-auto', bannerAuto ? 'on' : 'off'); render(); };
setInterval(() => {
  const el = document.querySelector('.promoArt');
  if (!el || !bannerAuto || !motionOn || document.hidden || q || el.matches(':hover,:focus-within') || sheet || desktopSlip || drawerOpen || document.getElementById('sportDirectory')?.open) return;
  refPromoIndex = (refPromoIndex + 1) % promos.length;
  promoDir = 1;
  el.outerHTML = promoArt();
  addBannerControls();
}, 6000);

// ---- Bet slip ----
const ticketIcon = '<svg class="slipMark" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5V9a3 3 0 0 0 0 6v3.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5V15a3 3 0 0 0 0-6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 9.5h6M9 12h6M9 14.5h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
desktopTicket = function() {
  const count = Number(!!slip);
  return '<div class="deskTicket">' + (desktopSlip ? '<section class="deskFlyout" role="dialog" aria-label="Bet slip"><header>' + ticketIcon +
    '<strong>Bet slip</strong><span class="slipKind">Singles · Decimal · USDT</span>' +
    '<button class="deskSlipClose" onclick="openDeskSlip()" aria-label="Collapse bet slip"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></header>' + flightPanel() + '</section>' : '') +
    '<button class="deskSlipBar' + (count ? ' hasPick' : '') + '" aria-expanded="' + desktopSlip + '" onclick="openDeskSlip()">' + ticketIcon +
    '<span class="slipBarTitle">Bet slip</span><span class="slipCount" aria-label="' + count + ' selections">' + count + '</span>' +
    '<span class="slipChevron" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="' + (desktopSlip ? 'M5 7.5l5 5 5-5' : 'M5 12.5l5-5 5 5') + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button></div>';
};
const panelBefore = flightPanel;
flightPanel = function() {
  let html = panelBefore();
  html = html.replace('<p>Choose odds on a match to start your single.</p>',
    '<div class="slipEmpty">' + ticketIcon + '<h3>Your bet slip is empty</h3><p>Tap any odds on a match to add a single bet. Stakes and returns are in demo USDT.</p></div>');
  html = html.replace('<small>Singles · 1 selection</small>', '<small class="slipTag">Single · 1 selection</small>');
  html = html.replace('</label><footer>', '</label><div class="quickStakes" role="group" aria-label="Quick stake">' +
    [5, 10, 25, 50, 100].map(v => '<button type="button" onclick="amount(\'' + v + '\');render()"' + (Number(stakes) === v ? ' aria-pressed="true"' : '') + '>' + v + '</button>').join('') + '</div><footer>');
  html = html.replace('<details><summary>Sample scenarios</summary>', '<details class="demoTools"><summary>Demo tools · testing only</summary>');
  return html;
};
// Singles only: a new pick replaces the old one, and the slip says so.
let replacedPick = '';
const pickBefore = pick;
pick = function(...args) {
  const prev = slip && slip.name + ' @ ' + slip.price.toFixed(2);
  pickBefore(...args);
  const now = slip && slip.name + ' @ ' + slip.price.toFixed(2);
  replacedPick = prev && now && prev !== now ? prev : '';
  if (replacedPick) render();
};
window.pick = pick;
// Any single from elsewhere (player bets) goes through the same singles-only replacement.
window.betaSetSlip = function(selection) {
  const prev = slip && slip.name + ' @ ' + slip.price.toFixed(2);
  if (slip?.key === selection.key) { tab = 'Slip'; render(); return; }
  slip = selection; mode = 'normal'; notice = ''; tab = 'Slip';
  replacedPick = prev && prev !== selection.name + ' @ ' + selection.price.toFixed(2) ? prev : '';
  render();
};
const panelBeforeReplace = flightPanel;
flightPanel = function() {
  const html = panelBeforeReplace();
  return replacedPick && slip ? html.replace('<small class="slipTag">Single · 1 selection</small>', '<small class="slipTag">Single · 1 selection</small><small class="slipReplaced">Replaced ' + E(replacedPick) + ' · singles only</small>') : html;
};
// A slip restored after a reload must re-check prices; Beta has no slip tabs, so show that prompt at the top of the ticket.
const renderBeforeQuote = render;
render = function() {
  renderBeforeQuote();
  const brand = document.querySelector('.bookBrand');
  if (brand && !brand.querySelector('.brandHubie') && window.hubieBrandScene) brand.insertAdjacentHTML('beforeend', '<span class="brandHubie">' + hubieBrandScene() + '</span>');
  const panel = document.querySelector('.flightSheet,.deskFlyout');
  if (panel && slip && !parlayMode && window.draftNeedsCheck?.('single') && !panel.querySelector('.reviewQuote'))
    panel.querySelector('.flightTicket')?.insertAdjacentHTML('afterbegin', '<div class="reviewQuote">Restored from your last visit · check current prices before placing. ' + btn('Check prices', 'recheckDraft()') + '</div>');
};
window.render = render;
render();
}
