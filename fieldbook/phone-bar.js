'use strict';
/* Phone bottom bar (≤750px): Casino · Sports · Live · Bet slip · My bets, always one thumb-tap away.
   Replaces the phone's Casino/Sports/Choose sport strip and the floating My bets bubble. Desktop is unchanged. */
{
const slipMark = '<svg class="pbSlipMark" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5V9a3 3 0 0 0 0 6v3.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5V15a3 3 0 0 0 0-6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 9h6m-6 3h6m-6 3h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
const item = (page, key, label, count) => {
  const on = p === page || (page === 'home' && !['casino', 'live', 'bets'].includes(p));
  return '<a href="' + href(page) + '" class="' + (on ? 'active' : '') + '"' + (on ? ' aria-current="page"' : '') + '>' +
    '<span class="pbIcon">' + toolbarMark(key) + (count ? '<b class="pbCount">' + count + '</b>' : '') + '</span><span class="pbLabel">' + label + '</span></a>';
};
window.phoneBar = function() {
  const casino = p === 'casino';
  const open = (typeof bets !== 'undefined' ? bets : []).filter(b => b.state === 'Open').length;
  const picked = !casino && !!slip;
  const alert = picked && {paused: 'Suspended', changed: 'Odds changed', failed: 'Retry'}[mode];
  const slipBtn = casino ? '' :
    '<button class="pbSlip' + (picked ? ' hasPick' : '') + (alert ? ' alert' : '') + '" aria-expanded="' + !!sheet + '" aria-label="Bet slip, ' + (picked ? E(slip.name) + ' at ' + slip.price.toFixed(2) + (alert ? ', ' + alert : '') : 'empty') + '" ' +
    'onclick="tab=\'Slip\';sheet=true;render()"><span class="pbIcon">' + slipMark + '' + (picked ? '<b class="pbCount">' + (window.betaSinglesCount?.() || 1) + '</b>' : '') + '</span>' +
    '<span class="pbLabel">' + (alert || (picked ? ((window.betaSinglesCount?.() || 1) > 1 ? betaSinglesCount() + ' singles' : '@ ' + slip.price.toFixed(2)) : 'Bet slip')) + '</span></button>';
  return '<nav class="phoneBar" aria-label="Main">' + item('casino', 'casino', 'Casino') + item('home', 'sports', 'Sports') +
    item('live', 'live', 'Live') + slipBtn + item('bets', 'bets', 'My bets', open) + '</nav>';
};
const renderBeforeBar = render;
render = function() {
  renderBeforeBar();
  document.querySelector('.phoneBar')?.remove();
  app.insertAdjacentHTML('beforeend', phoneBar());
  document.body.classList.toggle('pbCasino', p === 'casino');
};
window.render = render;
render();
}
