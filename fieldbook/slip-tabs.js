'use strict';
/* Beta v2: "Bet slip" and "My bets" tabs inside the desktop slip flyout.
   The Bet slip tab is the existing singles panel (multi-singles.js). The My bets tab lists the player's Open and
   Settled demo bets in compact cards with cash-out, so a bet can be checked right after placing it without leaving
   the page. The full My bets page (sidebar) is unchanged. Tab switches and cash-outs redraw only the flyout. */
{
let tab = 'slip', view = 'Open';
const fromHtml = (html, sel) => { const t = document.createElement('template'); t.innerHTML = html; return t.content.querySelector(sel); };
const money = v => (+v || 0).toFixed(2);
const slipCount = () => (window.betaSinglesCount ? window.betaSinglesCount() : Number(!!slip));
const openCount = () => bets.filter(b => b.state === 'Open').length;
const when = t => t ? new Date(t).toLocaleString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : '';

// Redraw the flyout only (keeps the page and its animations running).
const redraw = focusTab => {
  const old = document.querySelector('.deskFlyout');
  const next = old && fromHtml(desktopTicket(), '.deskFlyout');
  if (!old || !next) return render();
  next.style.animation = 'none';
  old.replaceWith(next);
  const bar = document.querySelector('.deskSlipBar'), nb = fromHtml(desktopTicket(), '.deskSlipBar');
  if (bar && nb) bar.replaceWith(nb);
  if (focusTab) next.querySelector('.stTab[aria-selected="true"]')?.focus({preventScroll: true});
};
window.stShow = t => { tab = t === 'bets' ? 'bets' : 'slip'; cash = -1; redraw(true); };
window.stView = v => { view = v; cash = -1; redraw(); };
window.stCash = i => {
  const full = render;
  render = window.render = () => {};
  try { cashOut(i); } finally { render = window.render = full; }
  if (bets[i]?.state === 'Settled') view = 'Settled';
  if (p === 'bets') render(); else redraw();
};
window.stCancel = () => { cash = -1; redraw(); };

const card = (b, i) => {
  const open = b.state === 'Open', confirm = cash === i;
  const result = b.result || (open ? 'Open' : 'Settled');
  const tone = /won|cashed/i.test(result) ? ' stWin' : /lost/i.test(result) ? ' stLoss' : '';
  return '<article class="stBet">' +
    '<div class="stBetTop"><div><b>' + E(b.name) + '</b><span class="stFixture">' + receiptMatch(b) + '</span></div>' +
    '<span class="stOdds"><small>Odds</small>' + b.price.toFixed(2) + '</span></div>' +
    '<div class="stNums"><div><small>Stake</small><b>' + money(b.stake) + '<em>USDT</em></b></div>' +
    '<div><small>' + (open ? 'To return' : 'Returned') + '</small><b class="stRet">' + money(b.return) + '<em>USDT</em></b></div></div>' +
    '<div class="stMeta"><span>' + E(when(b.placedAt)) + (b.ticketId ? ' · ' + E(b.ticketId) : '') + '</span>' +
    (open ? '' : '<span class="stResult' + tone + '">' + E(result) + '</span>') + '</div>' +
    (open ? '<div class="stActions"><button class="stCash' + (confirm ? ' stConfirm' : '') + '" onclick="stCash(' + i + ')">' +
      (confirm ? 'Confirm cash out · ' : 'Cash out · ') + money(b.stake * .88) + ' USDT</button>' +
      (confirm ? '<button class="stCancel" onclick="stCancel()">Cancel</button>' : '') + '</div>' : '') +
    '</article>';
};
const betsPanel = () => {
  const counts = {Open: openCount(), Settled: bets.filter(b => b.state === 'Settled').length};
  const rows = bets.map((b, i) => b.state === view ? card(b, i) : '').join('');
  const staked = bets.filter(b => b.state === 'Open').reduce((a, b) => a + (+b.stake || 0), 0);
  const toReturn = bets.filter(b => b.state === 'Open').reduce((a, b) => a + (+b.return || 0), 0);
  return '<div class="stPanel">' +
    '<div class="stSeg" role="group" aria-label="Bet status">' + ['Open', 'Settled'].map(v =>
      '<button class="' + (v === view ? 'on' : '') + '" aria-pressed="' + (v === view) + '" onclick="stView(\'' + v + '\')">' + v + '<span>' + counts[v] + '</span></button>').join('') + '</div>' +
    (view === 'Open' && counts.Open ? '<div class="stSummary"><div><small>In play</small><b>' + money(staked) + ' USDT</b></div><div><small>Potential return</small><b class="stRet">' + money(toReturn) + ' USDT</b></div></div>' : '') +
    (rows ? '<div class="stList">' + rows + '</div>' :
      '<div class="stEmpty"><b>No ' + view.toLowerCase() + ' bets yet</b><p>' + (view === 'Open' ? 'Bets you place from the slip show up here straight away.' : 'Cashed-out and finished bets show up here.') + '</p>' +
      (slipCount() ? '<button class="stGo" onclick="stShow(\'slip\')">Back to bet slip</button>' : '') + '</div>') +
    '<a class="stAll" href="#6/bets/0" onclick="desktopSlip=false">Open full My bets page →</a></div>';
};

const tabs = () => '<div class="stTabs" role="tablist" aria-label="Bet slip and My bets">' +
  '<button class="stTab" role="tab" aria-selected="' + (tab === 'slip') + '" onclick="stShow(\'slip\')">Bet slip' + (slipCount() ? '<span class="stBadge">' + slipCount() + '</span>' : '') + '</button>' +
  '<button class="stTab" role="tab" aria-selected="' + (tab === 'bets') + '" onclick="stShow(\'bets\')">My bets' + (openCount() ? '<span class="stBadge">' + openCount() + '</span>' : '') + '</button></div>';

const ticketBefore = desktopTicket;
desktopTicket = function() {
  let html;
  if (tab === 'bets') {
    const fp = flightPanel;
    flightPanel = betsPanel;
    try { html = ticketBefore(); } finally { flightPanel = fp; }
  } else html = ticketBefore();
  html = html.replace(/<strong>Bet slip<\/strong><span class="slipKind">[^<]*<\/span>/, tabs());
  // After placing, the confirmation links to the My bets tab instead of leaving the page.
  html = html.replace(/(<div class="msPlaced">(?!No )[^<]*?(?:placed\.|placed:)[^<]*?)(?:View them in My bets\.)?\s*(?:<a href="#6\/bets\/0">My bets →<\/a>)?<\/div>/,
    '$1<button class="stGo" onclick="stShow(\'bets\')">View in My bets</button></div>');
  return html;
};
window.desktopTicket = desktopTicket;
// Picking odds always brings the Bet slip tab forward.
{
  const p0 = window.pick;
  pick = window.pick = (...a) => { tab = 'slip'; return p0(...a); };
}
render();
}
