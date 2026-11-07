'use strict';
/* Beta v2: several single bets in one slip.
   The engine holds one selection (`slip`) and one stake (`stakes`); about 117 places rely on that, so instead of
   changing it this keeps a list of singles next to it. Every pick (match odds, player bets, segment markets) joins
   the list; `slip` stays the most recent one, so the demo tools (price change, suspend, fail) still act on it.
   The slip panel lists every single in its own box with its own stake and its own "Place single bet" button.
   Quick-stake buttons ADD to that single's stake (5 four times makes 20). With more than one single, "Place all"
   places every staked one. Each goes through the engine's own place(), so My bets, receipts and cash-out are
   unchanged. Singles are never combined into a parlay. The list is kept in localStorage (beta2.singles). Parlay mode is left alone. */
{
const KEY = 'beta2.singles';
let list = [];
try { list = (JSON.parse(localStorage.getItem(KEY)) || []).filter(x => x && x.sel && x.sel.key && events[x.sel.id]); } catch { list = []; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {} };
const money = v => (Math.round(v * 100) / 100).toFixed(2);
const stakeOf = x => { const v = +x.stake; return Number.isFinite(v) && v > 0 ? v : 0; };
const valid = s => /^\d*(\.\d{0,2})?$/.test(s);
let placedNote = '';

// Keep the list in step with the engine's selection: a new `slip` joins the list (its price refreshed if present).
const sync = () => {
  if (parlayMode || !slip) return;
  const i = list.findIndex(x => x.sel.key === slip.key);
  if (i < 0) { list.push({sel: {...slip}, stake: stakes || ''}); placedNote = ''; save(); }
  else if (list[i].sel.price !== slip.price) { list[i].sel = {...slip}; save(); }
};
const market = s => { const g = (typeof groups !== 'undefined' && groups[s.g]) || ''; return g && g !== 'Popular' ? g : 'Match result'; };
const liveTag = s => { const e = events[s.id]; if (!e) return ''; return e[3] ? '<span class="msLive">● LIVE' + (briefs.get?.(e) ? ' · ' + E(briefs.get(e)) : '') + ' · ' + E(e[4]) + '</span>' : '<span class="msTime">' + E(e[4]) + '</span>'; };

window.msStake = (i, v) => { if (!list[i] || !valid(v)) return; list[i].stake = v; save(); refresh(); };
window.msAdd = (i, v) => { if (!list[i]) return; list[i].stake = money(stakeOf(list[i]) + v).replace(/\.00$/, ''); save(); slipOnly(); };
window.msClear = i => { if (!list[i]) return; list[i].stake = ''; save(); slipOnly(); };
window.msRemove = i => {
  const gone = list.splice(i, 1)[0]; save();
  if (gone && slip?.key === gone.sel.key) { const next = list[list.length - 1]; if (next) { slip = {...next.sel}; mode = 'normal'; notice = ''; } else { slip = null; stakes = ''; mode = 'normal'; notice = ''; } }
  slipOnly();
};
window.msClearAll = () => { list = []; save(); slip = null; stakes = ''; mode = 'normal'; notice = ''; slipOnly(); };
// Place one single on its own (the others stay in the slip).
window.msPlaceOne = i => {
  const x = list[i];
  if (!x) return;
  if (!(stakeOf(x) > 0)) { placedNote = 'Add a stake to place this single.'; slipOnly(); return; }
  slip = {...x.sel}; stakes = String(stakeOf(x)); mode = 'normal';
  quietly(place);
  const ok = !slip;
  if (ok) list.splice(i, 1);
  save();
  const last = list[list.length - 1];
  slip = last ? {...last.sel} : null; stakes = ''; mode = 'normal'; notice = '';
  placedNote = ok ? 'Single placed: ' + x.sel.name + ' @ ' + x.sel.price.toFixed(2) + '.' : 'That single could not be placed.';
  slipOnly();
};
window.msPlace = () => {
  const ready = list.filter(x => stakeOf(x) > 0);
  if (!ready.length) { placedNote = 'Add a stake to at least one single.'; slipOnly(); return; }
  let placed = 0;
  const keep = [];
  for (const x of list) {
    if (!(stakeOf(x) > 0)) { keep.push(x); continue; }
    slip = {...x.sel}; stakes = String(stakeOf(x)); mode = 'normal';
    quietly(place);
    if (!slip) placed++; else keep.push(x);
  }
  list = keep; save();
  const last = list[list.length - 1];
  slip = last ? {...last.sel} : null; stakes = ''; mode = 'normal';
  notice = '';
  placedNote = placed ? (placed === 1 ? '1 bet placed.' : placed + ' bets placed.') + ' View them in My bets.' : 'No bets were placed.';
  slipOnly();
};
// Typing a stake updates the totals without a full re-render (keeps focus in the box).
const refresh = () => {
  const panel = document.querySelector('.msPanel');
  if (!panel) return;
  list.forEach((x, i) => { const r = panel.querySelector('[data-ret="' + i + '"]'); if (r) r.textContent = money(stakeOf(x) * x.sel.price); });
  const tot = list.reduce((a, x) => a + stakeOf(x), 0), ret = list.reduce((a, x) => a + stakeOf(x) * x.sel.price, 0), n = list.filter(x => stakeOf(x) > 0).length;
  panel.querySelector('.msTotal').textContent = money(tot) + ' USDT';
  panel.querySelector('.msReturn').textContent = money(ret) + ' USDT';
  list.forEach((x, i) => { const one = panel.querySelector('[data-one="' + i + '"]'); if (one) one.disabled = !(stakeOf(x) > 0) || one.closest('.msOff') !== null; });
  const b = panel.querySelector('.msPlace'); if (b) { b.disabled = !n; b.textContent = n > 1 ? 'Place all ' + n + ' singles' : 'Place all singles'; }
};

const closeIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 5.5l9 9m0-9-9 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const panelBefore = flightPanel;
flightPanel = function() {
  sync();
  if (parlayMode || !list.length) {
    const html = panelBefore();
    return placedNote && !list.length ? html.replace('<div class="slipEmpty">', '<div class="msPlaced">' + E(placedNote) + ' <a href="#6/bets/0">My bets →</a></div><div class="slipEmpty">') : html;
  }
  const original = panelBefore();
  const demo = (original.match(/<details class="demoTools">[\s\S]*?<\/details>/) || [''])[0];
  const tot = list.reduce((a, x) => a + stakeOf(x), 0), ret = list.reduce((a, x) => a + stakeOf(x) * x.sel.price, 0), n = list.filter(x => stakeOf(x) > 0).length;
  const rows = list.map((x, i) => {
    const s = x.sel, focus = slip?.key === s.key, off = focus && ['changed', 'paused'].includes(mode), e = events[s.id] || [];
    const crest = k => { try { return '<span class="msCrest">' + badgeFor(s.id, k) + '</span>'; } catch { return ''; } };
    return '<article class="msBet' + (off ? ' msOff' : '') + '">' +
      '<div class="msMatch">' + crest(0) + '<span class="msTeams"><span>' + E(e[0] || '') + '</span><i>v</i><span>' + E(e[1] || '') + '</span></span>' + crest(1) +
      '<button class="msRemove" aria-label="Remove ' + E(s.name) + '" onclick="msRemove(' + i + ')">' + closeIcon + '</button></div>' +
      '<div class="msPick"><div><b>' + E(s.name) + '</b><small>' + E(market(s)) + '</small>' + liveTag(s) + '</div>' +
      '<span class="msOdds"><small>Odds</small>' + s.price.toFixed(2) + '</span></div>' +
      (off ? '<p class="msWarn">' + (mode === 'paused' ? 'Market suspended. This single will wait.' : 'Price changed. Check it before placing.') + '</p>' : '') +
      '<div class="msStakeRow"><label class="msTile"><span>Stake</span><span class="msNum"><input inputmode="decimal" placeholder="0.00" value="' + E(x.stake) + '" oninput="msStake(' + i + ',this.value)" aria-label="Stake for ' + E(s.name) + '"><em>USDT</em></span></label>' +
      '<div class="msTile msRet"><span>Returns</span><span class="msNum"><b data-ret="' + i + '">' + money(stakeOf(x) * s.price) + '</b><em>USDT</em></span></div></div>' +
      '<div class="msQuick" role="group" aria-label="Add to stake">' + [5, 10, 25, 50, 100].map(v => '<button type="button" onclick="msAdd(' + i + ',' + v + ')">+' + v + '</button>').join('') +
      '<button type="button" class="msClearStake" onclick="msClear(' + i + ')"' + (stakeOf(x) ? '' : ' disabled') + ' aria-label="Clear stake">Clear</button></div>' +
      '<button class="msPlaceOne" data-one="' + i + '" onclick="msPlaceOne(' + i + ')"' + (stakeOf(x) && !off ? '' : ' disabled') + '>Place single bet</button></article>';
  }).join('');
  return '<div class="msPanel"><div class="msHead"><small class="slipTag">' + (list.length === 1 ? 'Single · 1 selection' : 'Singles · ' + list.length + ' selections') + '</small>' +
    (list.length > 1 ? '<button class="msClearAll" onclick="msClearAll()">' + closeIcon + '<span>Remove all</span></button>' : '') + '</div>' +
    (placedNote ? '<div class="msPlaced">' + E(placedNote) + '</div>' : '') +
    '<div class="msList">' + rows + '</div>' +
    '<footer class="msFoot"><div><span>Total stake</span><b class="msTotal">' + money(tot) + ' USDT</b></div>' +
    '<div><span>Potential return</span><b class="msReturn">' + money(ret) + ' USDT</b></div>' +
    (list.length > 1 ? '<button class="msPlace" onclick="msPlace()"' + (n ? '' : ' disabled') + '>' + (n > 1 ? 'Place all ' + n + ' singles' : 'Place all singles') + '</button>' : '') + '</footer>' + demo + '</div>';
};
// The collapsed slip bar counts every single.
const ticketBefore = desktopTicket;
desktopTicket = function() {
  sync();
  let html = ticketBefore();
  if (!parlayMode && list.length > 1) {
    html = html.replace(/<span class="slipCount" aria-label="\d+ selections">\d+<\/span>/, '<span class="slipCount" aria-label="' + list.length + ' selections">' + list.length + '</span>')
      .replace(/<span class="slipBarPick">[\s\S]*?<\/b>/, '<span class="slipBarPick">' + list.length + ' singles</span><b class="slipBarOdds">' + money(list.reduce((a, x) => a + stakeOf(x), 0)) + '</b>');
  }
  return html;
};
/* Slip-only updates. Picking odds, opening the slip and every slip action used to redraw the whole page, which restarted
   every animation (duels, icons, banner). These redraw only the bet slip (desktop ticket or phone sheet), the phone
   bar and the picked prices. */
const fromHtml = (html, sel) => { const t = document.createElement('template'); t.innerHTML = html; return t.content.querySelector(sel); };
function slipOnly() {
  sync();
  const oldT = document.querySelector('.deskTicket');
  if (oldT) {
    const newT = fromHtml(desktopTicket(), '.deskTicket');
    const oF = oldT.querySelector('.deskFlyout'), nF = newT && newT.querySelector('.deskFlyout');
    if (oF && nF) {
      const oP = oF.querySelector('.msPanel'), nP = nF.querySelector('.msPanel');
      if (oP && nP) { const top = oF.scrollTop; oP.replaceWith(nP); const oH = oF.querySelector(':scope>header'), nH = nF.querySelector(':scope>header'); if (oH && nH) oH.replaceWith(nH); oF.scrollTop = top; } else { nF.style.animation = 'none'; oF.replaceWith(nF); }
      const oB = oldT.querySelector('.deskSlipBar'), nB = newT.querySelector('.deskSlipBar'); if (oB && nB) oB.replaceWith(nB);
    } else if (newT) oldT.replaceWith(newT);
  }
  const sheetPanel = document.querySelector('.flightSheet .msPanel');
  if (sheetPanel) {
    const n = list.length && !parlayMode ? fromHtml(flightPanel(), '.msPanel') : null;
    if (n) sheetPanel.replaceWith(n); else { render(); return; }
  }
  const bar = document.querySelector('.phoneBar');
  if (bar && window.phoneBar) { const n = fromHtml(phoneBar(), '.phoneBar'); if (n) bar.replaceWith(n); }
  const keys = new Set(list.map(x => x.sel.key)); if (slip) keys.add(slip.key);
  document.querySelectorAll('button[onclick^="pick("]').forEach(b => {
    const m = b.getAttribute('onclick').match(/^pick\((\d+),(\d+),(\d+)\)/);
    if (m) b.classList.toggle('chosen', keys.has(m[1] + ',' + m[2] + ',' + m[3]));
  });
  document.querySelectorAll('.slipReplaced').forEach(e => e.remove());
}
// Run an engine function that ends in render() (pick, place, openDeskSlip) but redraw only the slip.
function quietly(fn, ...args) {
  if (parlayMode) return fn(...args);
  const full = render;
  let asked = false;
  render = window.render = () => { asked = true; };
  try { return fn(...args); } finally { render = window.render = full; if (asked && fn !== place) slipOnly(); }
}
const isChosenBefore = isChosen;
isChosen = function(i, g, k) { return (!parlayMode && list.some(x => x.sel.key === String([i, g, k]))) || isChosenBefore(i, g, k); };
{
  const p0 = pick; pick = window.pick = (...a) => quietly(p0, ...a);
  const o0 = openDeskSlip; openDeskSlip = window.openDeskSlip = (...a) => quietly(o0, ...a);
  if (window.betaSetSlip) { const b0 = window.betaSetSlip; window.betaSetSlip = (...a) => quietly(b0, ...a); }
}
// Singles no longer replace each other, so drop the "Replaced … · singles only" note.
const renderBefore = render;
// Every single in the slip shows as picked on the match cards, not only the newest one.
const markPicked = () => {
  if (parlayMode || !list.length) return;
  const keys = new Set(list.map(x => x.sel.key));
  document.querySelectorAll('button[onclick^="pick("]').forEach(b => {
    const m = b.getAttribute('onclick').match(/^pick\((\d+),(\d+),(\d+)\)/);
    if (m && keys.has(m[1] + ',' + m[2] + ',' + m[3])) b.classList.add('chosen');
  });
};
render = function() { sync(); renderBefore(); document.querySelectorAll('.slipReplaced').forEach(e => e.remove()); markPicked(); };
window.render = render;
window.betaSinglesCount = () => list.length;
window.betaSinglesList = () => list;  // read-only use by extras.js (multis, free bet)
render();
}
