'use strict';
/* Demo crypto wallet (simulated; nothing here moves real money or talks to a chain or provider).
   Header: the balance becomes a currency picker showing the chosen coin's demo balance; "Wallet" opens the wallet.
   Wallet tabs: Overview (balances, total in USD), Deposit (coin + network, a demo address that is clearly not real),
   Withdraw (address, amount, network fee; updates the demo balance), Buy crypto (amount and payment method;
   placeholder for the operator's provider), Swap (demo rates between coins), Tip (placeholder; operators usually have
   their own). Balances and history are kept in localStorage (beta.wallet). Coin marks are simple lettered discs. */
{
const COINS = [
  ['BTC', 'Bitcoin', '#f7931a', 68250, ['Bitcoin', 'Lightning']], ['ETH', 'Ethereum', '#627eea', 3520, ['Ethereum', 'Arbitrum', 'Base']],
  ['USDT', 'Tether', '#26a17b', 1, ['Ethereum (ERC20)', 'Tron (TRC20)', 'BNB Chain (BEP20)', 'Solana']], ['USDC', 'USD Coin', '#2775ca', 1, ['Ethereum (ERC20)', 'Solana', 'Base']],
  ['SOL', 'Solana', '#14f195', 168, ['Solana']], ['LTC', 'Litecoin', '#345d9d', 84, ['Litecoin']], ['DOGE', 'Dogecoin', '#c2a633', .16, ['Dogecoin']],
  ['XRP', 'XRP', '#23292f', .58, ['XRP Ledger']], ['TRX', 'TRON', '#ff060a', .13, ['Tron']], ['BNB', 'BNB', '#f3ba2f', 590, ['BNB Chain (BEP20)']],
  ['ADA', 'Cardano', '#0033ad', .45, ['Cardano']], ['POL', 'Polygon', '#8247e5', .52, ['Polygon']]
];
const C = Object.fromEntries(COINS.map(c => [c[0], {sym: c[0], name: c[1], color: c[2], usd: c[3], nets: c[4]}]));
const KEY = 'beta.wallet';
const FIAT = {USD: ['$', 1], EUR: ['€', .92], GBP: ['£', .79], CAD: ['CA$', 1.37], AUD: ['A$', 1.52], JPY: ['¥', 152], BRL: ['R$', 5.4], INR: ['₹', 83.2], MXN: ['MX$', 18.1]};
const fresh = () => ({fiat: null, hideZero: false, cur: 'USDT', bal: {USDT: 1000, BTC: .0125, ETH: .42, SOL: 3.2, LTC: 1.5, DOGE: 850, USDC: 250}, log: []});
let w; try { w = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch { w = fresh(); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(w)); } catch {} };
const bal = s => +(w.bal[s] || 0);
const dec = s => (C[s].usd >= 1000 ? 8 : C[s].usd >= 10 ? 6 : C[s].usd >= .5 ? 2 : 2);
const fmt = (v, s) => (+v).toLocaleString(undefined, {minimumFractionDigits: s === 'USDT' || s === 'USDC' ? 2 : Math.min(dec(s), 8), maximumFractionDigits: Math.max(2, dec(s))});
const fiatCode = () => w.fiat && FIAT[w.fiat] ? w.fiat : 'USD';
// Money in the chosen display currency (USD when "Display in fiat" is off).
const usd = v => { const c = fiatCode(); return FIAT[c][0] + (+v * FIAT[c][1]).toLocaleString(undefined, {minimumFractionDigits: c === 'JPY' ? 0 : 2, maximumFractionDigits: c === 'JPY' ? 0 : 2}); };
const shown = s => !w.hideZero || bal(s) > 0 || s === w.cur;
const mark = s => '<span class="wCoin" style="--c:' + C[s].color + '">' + E(s === 'USDT' ? '₮' : s === 'BTC' ? '₿' : s === 'ETH' ? 'Ξ' : s.slice(0, 1)) + '</span>';
const opts = (sel, skip) => COINS.filter(c => c[0] !== skip).map(c => '<option value="' + c[0] + '"' + (c[0] === sel ? ' selected' : '') + '>' + c[0] + ' · ' + c[1] + '</option>').join('');
let tab = 'Overview', form = {coin: 'USDT', net: 0, from: 'USDT', to: 'BTC'}, note = '';
const log = (kind, text) => { w.log.unshift({t: Date.now(), kind, text}); w.log = w.log.slice(0, 20); save(); };
// A clearly fake, deterministic demo address (never a real address format).
const demoAddress = (s, n) => { let h = 0; const k = s + n + 'housebets'; for (const ch of k) h = (h * 31 + ch.charCodeAt(0)) >>> 0; let out = ''; for (let i = 0; i < 28; i++) { h = (h * 1103515245 + 12345) >>> 0; out += '23456789abcdefghjkmnpqrstuvwxyz'[h % 31]; } return 'DEMO-' + s + '-' + out; };
const qr = text => { let h = 7; for (const ch of text) h = (h * 33 + ch.charCodeAt(0)) >>> 0; let cells = ''; const n = 21;
  const finder = (x, y) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { let on;
    if (finder(x, y)) { const fx = x >= n - 7 ? x - (n - 7) : x, fy = y >= n - 7 ? y - (n - 7) : y; on = fx === 0 || fy === 0 || fx === 6 || fy === 6 || (fx > 1 && fx < 5 && fy > 1 && fy < 5); }
    else { h = (h * 1664525 + 1013904223) >>> 0; on = (h >>> 16) % 2 === 0; }
    if (on) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>'; }
  return '<svg class="wQr" viewBox="-1 -1 23 23" aria-label="Demo QR code (not a real address)">' + cells + '</svg>'; };

const TABS = ['Overview', 'Deposit', 'Withdraw', 'Buy crypto', 'Swap', 'Tip'];
const coinSelect = (id, sel, on, skip) => '<label class="wField"><span>Currency</span><span class="wSelect">' + mark(sel) + '<select id="' + id + '" onchange="' + on + '">' + opts(sel, skip) + '</select></span></label>';
const views = {
  Overview: () => {
    const total = COINS.reduce((a, [s]) => a + bal(s) * C[s].usd, 0);
    return '<div class="wTotal"><small>Total balance (demo) · ' + fiatCode() + '</small><strong>' + usd(total) + '</strong><div class="wQuick">' +
      ['Deposit', 'Withdraw', 'Buy crypto', 'Swap'].map(t => '<button onclick="walletTab(\'' + t + '\')">' + t + '</button>').join('') + '</div></div>' +
      '<div class="wList">' + COINS.filter(([s]) => shown(s)).map(([s]) => '<button class="wRow' + (w.cur === s ? ' on' : '') + '" onclick="walletUse(\'' + s + '\')">' + mark(s) +
        '<span class="wName"><b>' + s + '</b><small>' + E(C[s].name) + '</small></span><span class="wAmt"><b>' + fmt(bal(s), s) + '</b><small>' + usd(bal(s) * C[s].usd) + '</small></span></button>').join('') + '</div>' +
      (w.log.length ? '<div class="wLog"><h4>Recent activity</h4>' + w.log.slice(0, 5).map(x => '<p><em>' + E(x.kind) + '</em>' + E(x.text) + '<small>' + new Date(x.t).toLocaleString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}) + '</small></p>').join('') + '</div>' : '') +
      '<button class="wLink" onclick="walletReset()">Reset demo balances</button>';
  },
  Deposit: () => {
    const c = C[form.coin], net = c.nets[form.net] || c.nets[0], addr = demoAddress(form.coin, net);
    return coinSelect('wDepCoin', form.coin, "walletForm('coin',this.value)") +
      '<label class="wField"><span>Network</span><span class="wSelect"><select onchange="walletForm(\'net\',+this.value)">' + c.nets.map((n, i) => '<option value="' + i + '"' + (i === form.net ? ' selected' : '') + '>' + E(n) + '</option>').join('') + '</select></span></label>' +
      '<div class="wDeposit">' + qr(addr) + '<div><small>Your ' + E(form.coin) + ' deposit address (' + E(net) + ')</small><code>' + E(addr) + '</code>' +
      '<button class="wCopy" onclick="navigator.clipboard?.writeText(' + E(JSON.stringify(addr)) + ');this.textContent=\'Copied\'">Copy address</button></div></div>' +
      '<p class="wWarn">Demo only — this is not a real address. Do not send funds. The operator\'s payment system supplies real addresses.</p>' +
      '<p class="wHint">Only send ' + E(form.coin) + ' on ' + E(net) + '. Credited after network confirmations.</p>';
  },
  Withdraw: () => {
    const c = C[form.coin], fee = +(Math.max(.5, 2.5 / c.usd * (form.coin === 'BTC' ? 2 : 1))).toFixed(dec(form.coin));
    return coinSelect('wWdCoin', form.coin, "walletForm('coin',this.value)") +
      '<label class="wField"><span>Network</span><span class="wSelect"><select onchange="walletForm(\'net\',+this.value)">' + c.nets.map((n, i) => '<option value="' + i + '"' + (i === form.net ? ' selected' : '') + '>' + E(n) + '</option>').join('') + '</select></span></label>' +
      '<label class="wField"><span>Withdrawal address</span><input id="wWdAddr" placeholder="Paste your ' + E(form.coin) + ' address" autocomplete="off"></label>' +
      '<label class="wField"><span>Amount <em>Available ' + fmt(bal(form.coin), form.coin) + ' ' + form.coin + '</em></span><span class="wAmountIn"><input id="wWdAmt" inputmode="decimal" placeholder="0.00"><button onclick="document.getElementById(\'wWdAmt\').value=' + Math.max(0, bal(form.coin) - fee).toFixed(dec(form.coin)) + '">Max</button></span></label>' +
      '<p class="wHint">Network fee ' + fmt(fee, form.coin) + ' ' + form.coin + ' · demo</p>' +
      '<button class="wGo" onclick="walletWithdraw(' + fee + ')">Withdraw (demo)</button>';
  },
  'Buy crypto': () => '<label class="wField"><span>You pay</span><span class="wAmountIn"><input id="wBuyUsd" inputmode="decimal" value="100" oninput="walletBuyQuote()"><b class="wUnit">USD</b></span></label>' +
    coinSelect('wBuyCoin', form.coin, "walletForm('coin',this.value)") +
    '<p class="wQuote" id="wBuyQuote"></p>' +
    '<div class="wPay">' + ['Card', 'Apple Pay / Google Pay', 'Bank transfer'].map((m, i) => '<label><input type="radio" name="wPay"' + (i ? '' : ' checked') + '><span>' + m + '</span></label>').join('') + '</div>' +
    '<button class="wGo" onclick="walletNote(\'Buying crypto opens the operator\\\'s payment partner here. Demo only: no payment was taken.\')">Continue (demo)</button>' +
    '<p class="wHint">Placeholder: the casino connects its own licensed payment provider.</p>',
  Swap: () => {
    const rate = C[form.from].usd / C[form.to].usd;
    return '<div class="wSwap"><label class="wField"><span>From <em>Available ' + fmt(bal(form.from), form.from) + '</em></span><span class="wAmountIn"><input id="wSwAmt" inputmode="decimal" placeholder="0.00" oninput="walletSwapQuote()"><span class="wSelect">' + mark(form.from) + '<select onchange="walletForm(\'from\',this.value)">' + opts(form.from) + '</select></span></span></label>' +
      '<button class="wFlip" aria-label="Swap direction" onclick="walletFlip()">⇅</button>' +
      '<label class="wField"><span>To</span><span class="wAmountIn"><input id="wSwOut" readonly placeholder="0.00"><span class="wSelect">' + mark(form.to) + '<select onchange="walletForm(\'to\',this.value)">' + opts(form.to) + '</select></span></span></label></div>' +
      '<p class="wHint">1 ' + form.from + ' ≈ ' + fmt(rate, form.to) + ' ' + form.to + ' · demo rate, no fees</p>' +
      '<button class="wGo" onclick="walletSwap()">Swap (demo)</button>';
  },
  Tip: () => '<p class="wHint wTipNote">Placeholder — operators usually run their own tipping. Shown here so the flow can be reviewed.</p>' +
    '<label class="wField"><span>Username</span><input id="wTipUser" placeholder="Player username" autocomplete="off"></label>' +
    coinSelect('wTipCoin', form.coin, "walletForm('coin',this.value)") +
    '<label class="wField"><span>Amount <em>Available ' + fmt(bal(form.coin), form.coin) + '</em></span><input id="wTipAmt" inputmode="decimal" placeholder="0.00"></label>' +
    '<label class="wCheck"><input type="checkbox" checked> Show my name to the recipient</label>' +
    '<button class="wGo" onclick="walletTip()">Send tip (demo)</button>'
};
const body = () => '<header class="wHead"><h2>Wallet</h2><span class="wDemo">Demo</span><button class="wClose" aria-label="Close wallet" onclick="walletClose()">×</button></header>' +
  '<nav class="wTabs" role="tablist">' + TABS.map(t => '<button role="tab" aria-selected="' + (t === tab) + '" onclick="walletTab(\'' + t + '\')">' + t + '</button>').join('') + '</nav>' +
  (note ? '<p class="wNote">' + E(note) + '</p>' : '') + '<section class="wBody">' + views[tab]() + '</section>' +
  '<footer class="wFoot">Simulated wallet for the Housebets demo · balances are not real money</footer>';
const dlg = () => { let d = document.getElementById('walletDialog'); if (!d) { d = document.createElement('dialog'); d.id = 'walletDialog'; d.setAttribute('aria-label', 'Wallet'); d.addEventListener('click', e => { if (e.target === d) d.close(); }); document.body.append(d); } return d; };
const paint = () => { const d = dlg(); d.innerHTML = body(); if (tab === 'Buy crypto') walletBuyQuote(); header(); };
window.walletOpen = t => { tab = t || 'Overview'; note = ''; form.coin = w.cur; form.net = 0; paint(); const d = dlg(); if (!d.open) d.showModal(); };
window.walletClose = () => dlg().close();
window.walletTab = t => { tab = t; note = ''; form.net = 0; paint(); };
window.walletForm = (k, v) => { form[k] = v; if (k === 'coin') form.net = 0; if (k === 'from' && v === form.to) form.to = v === 'USDT' ? 'BTC' : 'USDT'; if (k === 'to' && v === form.from) form.from = v === 'USDT' ? 'BTC' : 'USDT'; note = ''; paint(); };
window.walletUse = s => { w.cur = s; form.coin = s; save(); paint(); };
window.walletNote = t => { note = t; paint(); };
window.walletReset = () => { w = fresh(); save(); note = 'Demo balances reset.'; paint(); };
const num = id => { const v = +String(document.getElementById(id)?.value || '').replace(',', '.'); return Number.isFinite(v) && v > 0 ? v : 0; };
window.walletWithdraw = fee => {
  const a = num('wWdAmt'), addr = (document.getElementById('wWdAddr')?.value || '').trim();
  if (!addr) return walletNote('Enter a withdrawal address.');
  if (!a) return walletNote('Enter an amount.');
  if (a + fee > bal(form.coin) + 1e-12) return walletNote('Not enough ' + form.coin + ' (amount plus network fee).');
  w.bal[form.coin] = bal(form.coin) - a - fee; log('Withdraw', fmt(a, form.coin) + ' ' + form.coin); walletNote('Withdrawal of ' + fmt(a, form.coin) + ' ' + form.coin + ' submitted (demo). Nothing was sent.');
};
window.walletBuyQuote = () => { const el = document.getElementById('wBuyQuote'); if (el) el.textContent = '≈ ' + fmt(num('wBuyUsd') / C[form.coin].usd, form.coin) + ' ' + form.coin + ' at the demo price'; };
window.walletSwapQuote = () => { const out = document.getElementById('wSwOut'); if (out) out.value = num('wSwAmt') ? fmt(num('wSwAmt') * C[form.from].usd / C[form.to].usd, form.to) : ''; };
window.walletFlip = () => { [form.from, form.to] = [form.to, form.from]; paint(); };
window.walletSwap = () => {
  const a = num('wSwAmt');
  if (!a) return walletNote('Enter an amount to swap.');
  if (a > bal(form.from) + 1e-12) return walletNote('Not enough ' + form.from + '.');
  const got = a * C[form.from].usd / C[form.to].usd;
  w.bal[form.from] = bal(form.from) - a; w.bal[form.to] = bal(form.to) + got;
  log('Swap', fmt(a, form.from) + ' ' + form.from + ' → ' + fmt(got, form.to) + ' ' + form.to); walletNote('Swapped ' + fmt(a, form.from) + ' ' + form.from + ' for ' + fmt(got, form.to) + ' ' + form.to + ' (demo).');
};
window.walletTip = () => {
  const user = (document.getElementById('wTipUser')?.value || '').trim(), a = num('wTipAmt');
  if (!user) return walletNote('Enter a username.');
  if (!a) return walletNote('Enter an amount.');
  if (a > bal(form.coin) + 1e-12) return walletNote('Not enough ' + form.coin + '.');
  w.bal[form.coin] = bal(form.coin) - a; log('Tip', fmt(a, form.coin) + ' ' + form.coin + ' to ' + user); walletNote('Tip of ' + fmt(a, form.coin) + ' ' + form.coin + ' to ' + user + ' sent (demo).');
};

// Header: balance picker + Wallet button.
let pickerOpen = false;
window.walletPicker = () => { pickerOpen = !pickerOpen; header(); };
window.walletSetting = (k, v) => { w[k] = v; save(); header(); if (dlg().open) paint(); };
window.walletPick = s => { w.cur = s; save(); pickerOpen = false; header(); };
function header() {
  const hc = document.querySelector('.headCenter');
  if (!hc) return;
  const s = w.cur;
  hc.classList.add('wHeader');
  const main = w.fiat ? usd(bal(s) * C[s].usd) : fmt(bal(s), s);
  hc.innerHTML = '<button class="wBalance" aria-haspopup="listbox" aria-expanded="' + pickerOpen + '" onclick="walletPicker()">' + (w.fiat ? '' : '') + '<b>' + main + '</b>' + mark(s) + (w.fiat ? '' : '<small>' + s + '</small>') + '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 8l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
    '<button class="wOpen" onclick="walletOpen(\'Deposit\')">Wallet</button>' +
    (pickerOpen ? '<div class="wPicker" role="listbox"><div class="wPickerList">' + COINS.filter(([c]) => shown(c)).map(([c]) => '<button role="option" aria-selected="' + (c === s) + '" onclick="walletPick(\'' + c + '\')">' + mark(c) + '<b>' + c + '</b><span>' +
        (w.fiat ? '<strong>' + usd(bal(c) * C[c].usd) + '</strong><small>' + fmt(bal(c), c) + ' ' + c + '</small>' : '<strong>' + fmt(bal(c), c) + '</strong><small>' + usd(bal(c) * C[c].usd) + '</small>') + '</span></button>').join('') + '</div>' +
      '<div class="wPickerOpts"><label class="wSwitch"><input type="checkbox"' + (w.hideZero ? ' checked' : '') + ' onchange="walletSetting(\'hideZero\',this.checked)"><i></i>Hide zero balances</label>' +
      '<label class="wSwitch"><input type="checkbox"' + (w.fiat ? ' checked' : '') + ' onchange="walletSetting(\'fiat\',this.checked?\'' + fiatCode() + '\':null)"><i></i>Display in fiat</label>' +
      (w.fiat ? '<div class="wFiats">' + Object.keys(FIAT).map(f => '<button class="' + (f === w.fiat ? 'on' : '') + '" onclick="walletSetting(\'fiat\',\'' + f + '\')">' + f + '</button>').join('') + '</div>' : '') +
      '<p>Your crypto stays crypto; fiat only changes how amounts are shown.</p></div>' +
      '<button class="wPickerAll" onclick="walletPicker();walletOpen(\'Overview\')">Wallet overview →</button></div>' : '');
}
document.addEventListener('click', e => { if (pickerOpen && e.target.isConnected && !e.target.closest('.wHeader')) { pickerOpen = false; header(); } });
const renderBefore = render;
render = function() { renderBefore(); header(); };
window.render = render;
header();
}
