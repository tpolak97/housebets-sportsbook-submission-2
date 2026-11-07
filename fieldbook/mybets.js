'use strict';
/* My Bets page, Stake-style. Left menu: All bets / Sports / Casino / Archive. Active / Settled toggle, outcome chips
   with counts (All, Live, Won, Lost, Cashed out, Void), date and sport filters, summary tiles (staked, returned,
   profit/loss, open), and one card per bet: status pill, selection, fixture, odds, stake, return, placed time and
   reference, plus Cash out (existing two-step offer), Copy reference, Receipt and Archive / Restore.
   Casino has no demo bets yet (empty state). Archived references are kept in localStorage (beta.archived).
   Uses the existing state and actions (bets, status, historyFilter, receiptRange, receiptSport, cashOut, copyTicket,
   exportReceipt), so the bet slip's My bets tab and receipts stay in step. */
{
let area = 'All', outcome = 'All';
const ARCH = 'beta.archived';
let archived; try { archived = new Set(JSON.parse(localStorage.getItem(ARCH)) || []); } catch { archived = new Set(); }
const saveArch = () => { try { localStorage.setItem(ARCH, JSON.stringify([...archived])); } catch {} };
const refOf = b => { if (typeof ticketRef === 'function') ticketRef(b); return b.ticketId || String(b.placedAt); };
const kind = b => {
  if (b.state === 'Open') return events[b.id]?.[3] ? 'Live' : 'Active';
  const r = String(b.result || '');
  return /cashed/i.test(r) ? 'Cashed out' : /void/i.test(r) ? 'Void' : /won/i.test(r) ? 'Won' : /lost/i.test(r) ? 'Lost' : 'Settled';
};
const OUTS = ['All', 'Live', 'Won', 'Lost', 'Cashed out', 'Void'];
const money = v => (+v || 0).toFixed(2);
const when = t => t ? new Date(t).toLocaleString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : '—';
const inRange = b => { if (receiptRange === 'All time') return true; const c = new Date(); c.setHours(0, 0, 0, 0); c.setDate(c.getDate() - ({'Last 7 days': 6, 'Last 30 days': 29}[receiptRange] || 0)); return b.placedAt >= c.getTime(); };
const sportName = b => typeof ticketSport === 'function' ? ticketSport(b) : (b.sport || 'Sports');
const ICON_BETS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h11l3 3v15H5z" fill="currentColor" opacity=".25"/><path d="M5 3h11l3 3v15H5zM8 9h8M8 13h8M8 17h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>';

window.mbArea = a => { area = a; outcome = 'All'; cash = -1; render(); };
window.mbStatus = s => { status = s; outcome = 'All'; cash = -1; render(); };
window.mbOutcome = o => { outcome = o; cash = -1; render(); };
window.mbArchive = i => { const b = bets[i]; if (!b) return; const r = refOf(b); archived.has(r) ? archived.delete(r) : archived.add(r); saveArch(); render(); };

const card = (b, i) => {
  const k = kind(b), open = b.state === 'Open', offer = cash === i && typeof cashOffer !== 'undefined' && cashOffer?.i === i;
  const toneCls = {Live: 'live', Active: 'open', Won: 'won', Lost: 'lost', 'Cashed out': 'cash', Void: 'void'}[k] || 'open';
  const ret = open ? money(b.stake * b.price) : money(b.return);
  const fixture = typeof receiptMatch === 'function' ? receiptMatch(b) : E(b.fixture || '');
  const legs = b.legs ? '<ul class="mbLegs">' + b.legs.map(l => '<li><b>' + E(l.name || l.label || '') + '</b><span>' + E(l.fixture || '') + '</span><em>' + (+l.price || 0).toFixed(2) + '</em></li>').join('') + '</ul>' : '';
  return '<article class="mbCard mb-' + toneCls + '">' +
    '<header><span class="mbSport">' + E(sportName(b)) + (b.legs ? ' · Multi (' + b.legs.length + ')' : ' · Single') + '</span><span class="mbPill mbPill-' + toneCls + '">' + (k === 'Live' ? '<i></i>' : '') + E(k === 'Active' ? 'Open' : k) + '</span></header>' +
    '<div class="mbMain"><div class="mbPick"><b>' + E(b.name) + '</b><span class="mbFixture">' + fixture + '</span>' +
      (open && events[b.id]?.[3] ? '<small class="mbScore">Now ' + E(events[b.id][4]) + '</small>' : '') + '</div>' +
      '<span class="mbOdds"><small>Odds</small>' + (+b.price).toFixed(2) + '</span></div>' + legs +
    '<div class="mbNums"><div><small>Stake</small><b>' + money(b.stake) + ' <em>USDT</em></b></div><div><small>' + (open ? 'Potential return' : 'Returned') + '</small><b class="' + (!open && +b.return > b.stake ? 'mbUp' : !open && +b.return < b.stake ? 'mbDown' : '') + '">' + ret + ' <em>USDT</em></b></div>' +
      '<div><small>Placed</small><b class="mbSmall">' + E(when(b.placedAt)) + '</b></div><div><small>Reference</small><b class="mbSmall mbRef">' + E(refOf(b)) + '</b></div></div>' +
    (offer ? '<div class="mbOffer">Cash-out offer <b>' + money(cashOffer.price) + ' USDT</b> · expires ' + new Date(cashOffer.expires).toLocaleTimeString() + '</div>' : '') +
    '<footer>' + (open ? '<button class="mbCash' + (offer ? ' mbConfirm' : '') + '" onclick="cashOut(' + i + ')">' + (offer ? 'Confirm cash out · ' + money(cashOffer.price) : 'Cash out · ' + money(b.stake * .88)) + ' USDT</button>' + (offer ? '<button class="mbGhost" onclick="cash=-1;render()">Cancel</button>' : '') : '') +
      '<span class="mbGap"></span><button class="mbGhost" onclick="copyTicket(' + i + ')">Copy reference</button><button class="mbGhost" onclick="exportReceipt(' + i + ')">Receipt</button>' +
      (!open ? '<button class="mbGhost" onclick="mbArchive(' + i + ')">' + (archived.has(refOf(b)) ? 'Restore' : 'Archive') + '</button>' : '') + '</footer></article>';
};
const empty = (title, text, action) => '<div class="mbEmpty"><span class="mbEmptyIcon">' + ICON_BETS + '</span><b>' + E(title) + '</b><p>' + E(text) + '</p>' + (action || '') + '</div>';

flightHistory = function() {
  const sportsBets = bets.map((b, i) => [b, i]).filter(([b]) => inRange(b) && (receiptSport === 'All sports' || sportName(b) === receiptSport));
  const pool = area === 'Archive' ? sportsBets.filter(([b]) => archived.has(refOf(b))) : sportsBets.filter(([b]) => !archived.has(refOf(b)));
  const scoped = area === 'Archive' ? pool : pool.filter(([b]) => b.state === status);
  const counts = Object.fromEntries(OUTS.map(o => [o, o === 'All' ? scoped.length : scoped.filter(([b]) => kind(b) === o).length]));
  const shown = scoped.filter(([b]) => outcome === 'All' || kind(b) === outcome);
  const settled = pool.filter(([b]) => b.state === 'Settled'), staked = pool.reduce((a, [b]) => a + b.stake, 0);
  const paid = settled.reduce((a, [b]) => a + +b.return, 0), cost = settled.reduce((a, [b]) => a + b.stake, 0), net = paid - cost;
  const openN = bets.filter(b => b.state === 'Open').length;
  const nav = [['All', 'All bets', bets.filter(b => !archived.has(refOf(b))).length], ['Sports', 'Sports', bets.filter(b => !archived.has(refOf(b))).length], ['Casino', 'Casino', 0], ['Archive', 'Archive', bets.filter(b => archived.has(refOf(b))).length]];
  let main;
  if (area === 'Casino') main = empty('No casino bets yet', 'Casino rounds you play will show here alongside your sports bets.', '<button class="mbBtn" onclick="location.hash=href(\'casino\')">Go to casino</button>');
  else {
    const filters = '<div class="mbBar">' + (area === 'Archive' ? '<span class="mbTitleSm">Archived bets</span>' : '<div class="mbSeg" role="tablist">' + ['Open', 'Settled'].map(s => '<button role="tab" aria-selected="' + (status === s) + '" onclick="mbStatus(\'' + s + '\')">' + (s === 'Open' ? 'Active' : 'Settled') + '<em>' + pool.filter(([b]) => b.state === s).length + '</em></button>').join('') + '</div>') +
      '<div class="mbSelects"><select aria-label="Placement date" onchange="receiptRange=this.value;cash=-1;render()">' + receiptRanges.map(v => '<option' + (v === receiptRange ? ' selected' : '') + '>' + v + '</option>').join('') + '</select>' +
      '<select aria-label="Sport" onchange="receiptSport=this.value;cash=-1;render()">' + ['All sports', ...new Set(bets.map(sportName))].map(v => '<option' + (v === receiptSport ? ' selected' : '') + '>' + E(v) + '</option>').join('') + '</select></div></div>' +
      '<div class="mbChips">' + OUTS.filter(o => area !== 'Archive' || o !== 'Live').map(o => '<button class="mbChip mbChip-' + o.replace(' ', '') + '" aria-pressed="' + (outcome === o) + '" onclick="mbOutcome(\'' + o + '\')">' + (o === 'All' ? 'All outcomes' : o) + '<em>' + counts[o] + '</em></button>').join('') + '</div>';
    const list = shown.length ? '<div class="mbList">' + shown.map(([b, i]) => card(b, i)).join('') + '</div>' :
      empty(area === 'Archive' ? 'Nothing archived' : status === 'Open' ? 'No active bets' : 'No settled bets', area === 'Archive' ? 'Archive settled bets to tidy your list. They stay here and can be restored.' : status === 'Open' ? 'Pick odds on any match to place a demo single.' : 'Settled and cashed-out bets show up here.',
        area === 'Archive' ? '' : '<button class="mbBtn" onclick="location.hash=href(\'live\')">Browse live games</button>');
    main = filters + list;
  }
  return '<div class="mbPage"><div class="mbHead"><span class="mbHeadIcon">' + ICON_BETS + '</span><div class="mbTitle"><h1>My Bets</h1><small>Your sports bets in demo USDT · results are simulated</small></div></div>' +
    '<div class="mbStats"><div><small>Total staked</small><b>' + money(staked) + ' USDT</b></div><div><small>Returned</small><b>' + money(paid) + ' USDT</b></div>' +
    '<div><small>Profit / loss</small><b class="' + (net > 0 ? 'mbUp' : net < 0 ? 'mbDown' : '') + '">' + (net > 0 ? '+' : '') + money(net) + ' USDT</b></div><div><small>Open bets</small><b>' + openN + '</b></div></div>' +
    '<div class="mbLayout"><div class="mbNav" role="navigation" aria-label="Bet history sections">' + nav.map(([k, label, n]) => '<button aria-current="' + (area === k) + '" onclick="mbArea(\'' + k + '\')">' + label + (n ? '<em>' + n + '</em>' : '') + '</button>').join('') + '</div>' +
    '<section class="mbMainCol">' + main + '</section></div><p class="mbFine">Demo bets in USDT · simulated results · 18+ · Bet responsibly</p></div>';
};
render();
}
