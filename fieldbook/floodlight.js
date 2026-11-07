const priorHome = home;
const priorListing = listing;
const priorDesk = desk;
const priorPanel = ticket;
const priorMatch = match;

function favoriteKey(i){
  const fixture=events[i], feed=feedEvents.get(fixture);
  return feed?'feed:'+feed.id:'fixture:'+i;
}
function flightRow(i) {
  const event = events[i];
  const score = event[3] ? event[4].match(/^(\d+)[–-](\d+)$/) : null;
  const sides = [0, 1].map(side =>
    '<span class="fixtureSide">' + badgeFor(i, side) + E(event[side]) +
    (score ? '<b>' + score[side + 1] + '</b>' : '') + '</span>'
  ).join('');
  const saved=favs.includes(favoriteKey(i));
  const star='<button class="fixtureStar" aria-label="'+(saved?'Unsave':'Save')+
    ' fixture" aria-pressed="'+saved+'" onclick="'+E('follow('+JSON.stringify(favoriteKey(i))+')')+'">'+(saved?'★':'☆')+'</button>';
  return '<article class="fixtureRow"><a href="' + href('match', i) + '">' +
    clock(event) + sides + (event[3] && !score ? '<small>' + E(event[4]) + '</small>' : '') +
    '</a>' + prices(i) + star + '</article>';
}

function fixtureGroup(label, ids, competition = false) {
  if (!ids.length) return '';
  const followButton = competition ? btn(favs.includes(label) ? '★ Following' : '☆ Follow',
    'follow(' + JSON.stringify(label) + ')') : '';
  return '<section class="fixtureGroup"><header><h2>' + E(label) + '</h2>' + followButton +
    '<small>Match result</small></header>' + ids.map(flightRow).join('') + '</section>';
}

function flightHome() {
  const fixtures = current();
  const favorites = fixtures.filter(i => favs.includes(favoriteKey(i)) || events[i].slice(0, 2).some(name => favs.includes(name)) ||
    favs.includes(leagues[events[i][2]]));
  const feature = cards.findIndex(card => sport === 'All' || sportOf(events[card.id]) === sport);
  const spotlight = sport==='All'?selected:feature;
  return '<p class="k">Housebets / Floodlight</p><h1>Sports home</h1>'+search()+
    '<div id="found">'+(q?results():actionRail()+discoveryNav()+
      (spotlight>=0?'<section class="featureMarquee">'+duel(spotlight)+
        (sport==='All'?'<div class="rTabs">'+cards.map((c,k)=>btn(c.title,'chooseRivalry('+k+')',selected===k?'active':'')).join('')+'</div>':'')+'</section>':'')+
      '<div class="competitionStrip"><small>TOP COMPETITIONS</small>'+leagueNav()+'</div>'+
      fixtureGroup('Your matches',favorites.slice(0,4))+fixtureGroup('Live now',live.filter(i=>fixtures.includes(i)).slice(0,6))+
      '<div class="flightLink">'+link('live','All live matches →')+'</div>'+
      fixtureGroup('Starting soon',soon.filter(i=>fixtures.includes(i)).slice(0,6))+
      '<div class="parlayInvite">'+link('match','Build a France–England parlay →',international).replace('<a ', '<a onclick="setParlay(true)" ')+'</div>')+'</div>';
}

function flightList() {
  const football = p === 'football';
  const pool = all.filter(i => football ? isFootball(events[i]) :
    sport === 'All' || sportOf(events[i]) === sport);
  const competitions = [...new Set(pool.map(i => leagues[events[i][2]]))];
  const activeLeague = competitions.includes(league) ? league : 'All';
  const filtered = pool.filter(i => activeLeague === 'All' || leagues[events[i][2]] === activeLeague);
  const visible = filtered.filter(i => football || events[i][3]);
  const select = '<label>Competition <select onchange="league=this.value;render()">' +
    ['All', ...competitions].map(l => '<option ' + (l === activeLeague ? 'selected' : '') +
    '>' + E(l) + '</option>').join('') + '</select></label>';
  return '<h1>' + (football ? 'Football' : 'Live now') + '</h1>' + search() + '<div id="found">' +
    (q ? results() : (football ? '' : actionRail()+discoveryNav()) + select +
    (visible.length ? competitions.map(l => fixtureGroup(l,
      visible.filter(i => leagues[events[i][2]] === l), true)).join('') :
      '<p>No matches in play.</p>' + fixtureGroup('Starting soon', soon.filter(i => filtered.includes(i))))) + '</div>';
}

let receiptRange = 'All time';
let receiptSport = 'All sports';
const receiptRanges = ['All time', 'Today', 'Last 7 days', 'Last 30 days'];
function receiptDate(value) {
  return value ? E(new Date(value).toLocaleString(undefined, {
    month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'
  })) : '—';
}
function ticketSport(b) {
  return b.sport || (events[b.id] ? sportOf(events[b.id]) : 'Unknown');
}
function receiptRow(b, i) {
  const open = b.state === 'Open';
  const quote = (b.stake * .88).toFixed(2);
  const cell = (label, value) => '<div class="receiptCell"><small>' + label + '</small>' + value + '</div>';
  return '<article class="historyReceipt">' + cell('Placed',receiptDate(b.placedAt)+(b.ticketId?'<br>'+E(b.ticketId):'')) +
    cell('Bet','<strong>' + E(b.name) + '</strong><br>' + receiptMatch(b) +
      (b.period || b.score ? '<br><small>' + 'At placement · '+E([b.period,b.score].filter(Boolean).join(' · ')) + '</small>' : '')) +
    (b.legs ? parlayReceipt(b,i) : '') +
    cell('Odds',b.price.toFixed(2)) + cell('Stake',b.stake.toFixed(2)+' USDT') +
    cell(open?'Potential return':'Returned','<b>'+E(b.return)+' USDT</b>') +
    cell('Result','<strong>'+E(open?'Open':b.result||'Settled')+'</strong>') +
    (open ? '<div class="receiptAction">' +
      btn((cash===i?'Confirm cash out · ':'Cash out · ')+quote+' USDT','cashOut('+i+')',cash===i?'cta':'') +
      (cash===i?btn('Cancel','cash=-1;render()'):'') + '</div>' :
      (b.settledAt?'<small class="receiptAction">Settled '+receiptDate(b.settledAt)+' · Original potential return '+(b.stake*b.price).toFixed(2)+' USDT</small>':'')) + '</article>';
}
function flightHistory() {
  const choices = ['Open','Settled'].map(state => btn(state+' ('+bets.filter(b=>b.state===state).length+')',
    'status='+JSON.stringify(state)+';cash=-1;render()',state===status?'active':'')).join('');
  const cutoff = new Date();
  cutoff.setHours(0,0,0,0);
  cutoff.setDate(cutoff.getDate() - ({'Last 7 days':6,'Last 30 days':29}[receiptRange]||0));
  const rows = bets.map((b,i)=>b.state===status &&
    (receiptSport==='All sports'||ticketSport(b)===receiptSport) &&
    (receiptRange==='All time'||b.placedAt>=cutoff.getTime()) ? receiptRow(b,i) : '').join('');
  const filters = '<div class="receiptFilters"><select aria-label="Placement date" onchange="receiptRange=this.value;cash=-1;render()">' +
    receiptRanges.map(v=>'<option '+(v===receiptRange?'selected':'')+'>'+v+'</option>').join('') + '</select>' +
    '<select aria-label="Receipt sport" onchange="receiptSport=this.value;cash=-1;render()">' +
    ['All sports',...new Set(bets.map(ticketSport))].map(v=>'<option '+(v===receiptSport?'selected':'')+'>'+E(v)+'</option>').join('') +
    '</select></div>';
  return '<div class="chips">'+choices+'</div>'+filters+(rows||'<p>No '+status.toLowerCase()+' bets match these filters.</p>');
}
function flightPanel() {
  const tabs = typeof slipModes === 'function' ? slipModes() : '';
  if (typeof parlayMode !== 'undefined' && parlayMode) return tabs + parlayPanel();
  if (!slip) {
    const receipt = notice.startsWith('Bet placed.') && bets[0]?.state==='Open' && bets[0];
    if (receipt) {
      return tabs + '<section class="slipReceipt" role="status"><small>✓ DEMO BET PLACED</small><h3>' +
        E(receipt.name) + ' @ ' + receipt.price.toFixed(2) + '</h3><p>' + E(receipt.fixture) +
        '</p><p>Stake <b>' + receipt.stake.toFixed(2) + ' USDT</b><br>Potential return <b>' +
        receipt.return + ' USDT</b></p>' + btn('View open bets', "openHistory()", 'cta') + '</section>';
    }
    return tabs + '<p>Choose odds on a match to start your single.</p>';
  }
  const changed = mode === 'changed';
  const paused = mode === 'paused';
  const failed = mode === 'failed';
  const message = changed ? 'Odds changed from ' + slip.price.toFixed(2) + ' to ' +
    slip.newPrice.toFixed(2) + '. Review the new return, then accept the price.' :
    paused ? 'Selection suspended. Your stake is saved. Wait for the market to reopen or remove this selection.' : notice;
  const action = paused ? 'Waiting for market' : failed ? 'Retry demo bet' : 'Place demo bet';
  const newReturn = changed ? '<p>Return at new odds <b><span class="pendingReturn">' +
    pendingReturn(stakes) + '</span> USDT</b></p><p class="returnDifference">' + (typeof singleDifference==='function'?singleDifference():'')+'</p>' : '';
  return tabs + '<section class="flightTicket"><small>Singles · 1 selection</small><div class="slipSelection">' +
    '<strong>' + E(slip.name) + '</strong><b>' + slip.price.toFixed(2) + '</b>' +
    '<button aria-label="Remove selection" onclick="removeFlightPick()">×</button></div>' +
    '<p><small>' + E(slip.market || markets[slip.g]) + ' · ' + E(slip.fixture) + '</small><br>' +
    clock(events[slip.id]) + (events[slip.id][3] ? ' · ' + E(events[slip.id][4]) : '') + '</p><label>Stake in USDT<input type="text" inputmode="decimal" min="0.01" step="0.01" ' +
    'placeholder="0.00" value="' + E(stakes) + '" oninput="amount(this.value)"></label>' +
    '<footer><p>Total stake <b><span class="flightStake">' + (Number(stakes)||0).toFixed(2) + '</span> USDT</b></p>' +
    '<p>' + (changed?'Return at accepted odds':'Potential return') + ' <b><span class="return">' + ret() + '</span> USDT</b></p>' +
    newReturn + '<div class="notice slipState">' + E(message) + '</div>' +
    (changed ? btn('Accept new odds','acceptPrice()','cta') :
      '<button class="cta placeFlight" ' + (paused || !validFlightStake(stakes) ? 'disabled' : '') +
      ' onclick="place()">'+action+'</button>') + '</footer>' +
    '<details><summary>Sample scenarios</summary>' + ['Change odds',paused?'Reopen market':'Suspend selection','Fail next placement'].map(
      (label,i) => btn(label,'scenario('+i+')')).join('') + btn('Lower odds in 5 seconds','scheduleLowerPrice()') + '</details></section>';
}
function pendingReturn(value) {
  return validFlightStake(value) ? (Number(value)*slip.newPrice).toFixed(2) : '0.00';
}
function validFlightStake(value) {
  const n = Number(value);
  return /^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(String(value).trim()) && Number.isFinite(n) && n > 0;
}
function flightMobileSlip() {
  if (p === 'bets') return '';
  if (sheet) return '<dialog class="sheet flightSheet" aria-label="Bet slip and My bets" oncancel="event.preventDefault();closeFlightSheet()" onclick="if(event.target===this)closeFlightSheet()">' +
    '<div class="sheetContent"><button class="sheetClose" aria-label="Close bet slip" onclick="closeFlightSheet()">×</button>' + flightPanel() + '</div></dialog>';
  if (typeof parlayMode !== 'undefined' && parlayMode) {
    if (!legs.length) return typeof undoPicks!=='undefined' && undoPicks?btn('Undo draft removal ↑','sheet=true;render()','dock cta'):'';
    return btn(legs.length+' · Parlay @ '+combinedOdds().toFixed(2)+' · Open slip ↑','sheet=true;render()','dock cta');
  }
  if (!slip) return '';
  const summary = {paused:'Suspended',changed:'Odds changed',failed:'Retry available'}[mode];
  return `<button class="dock cta" aria-label="Open bet slip" onclick="tab='Slip';sheet=true;render()"><b>1</b><span>` +
    E(slip.name) + (summary?' · '+summary:' @ '+slip.price.toFixed(2)) + '</span><span aria-hidden="true">⌃</span></button>';
}
function closeFlightSheet() {
  sheet = false;
  render();
  (document.querySelector('.dock') || document.querySelector('nav a.active'))?.focus({preventScroll:true});
}
function removeFlightPick() {
  sheet = false;
  removePick();
}
const originalAmount = amount;
amount = value => {
  originalAmount(value);
  document.querySelectorAll('.pendingReturn').forEach(el => el.textContent = pendingReturn(value));
  document.querySelectorAll('.placeFlight').forEach(el => el.disabled = mode === 'paused' || window.draftNeedsCheck?.('single') || !validFlightStake(value));
  document.querySelectorAll('.flightStake').forEach(el => el.textContent = (Number(value) || 0).toFixed(2));
};
window.amount = amount;
const segmentMarkets = {
  Tennis:['Sets','Set','Total games',9.5,3],
  Basketball:['Quarters','Quarter','Total points',44.5,4],
  Baseball:['Innings','Inning','Total runs',0.5,9],
  'Dota 2':['Maps','Map','Total kills',39.5,3],
  'Counter-Strike 2':['Maps','Map','Total rounds',20.5,3]
};
let segment=0, lastMatchId=-1, marketTerm='';
function firstOpenSegment(i){
  if(!events[i][3])return 0;
  const period=briefs.get(events[i])||'';
  const match=period.match(/(?:Q|Set |Map )(\d+)/i)||period.match(/(?:Top|Bottom) (\d+)/i);
  return match?Number(match[1])-1:0;
}
function segmentMarket(i,n){
  const spec=segmentMarkets[sportOf(events[i])];
  const market=spec[1]+' '+(n+1)+' · '+spec[2];
  const selections=['Over '+spec[3],'Under '+spec[3]];
  const completed = n<firstOpenSegment(i);
  const buttons=selections.map((name,k)=>{
    const key=String([i,100+n,k]), paused=slip?.key===key && mode==='paused';
    return '<button '+(paused||completed?'disabled':'')+' class="'+(isChosen(i,100+n,k)?'chosen':'')+'" onclick="pickSegment('+i+','+n+','+k+')"><small>'+
      E(name)+'</small><b>'+(completed?'Closed':paused?'Suspended':formatOffer(moved[key]??[1.91,1.85][k]))+'</b></button>';
  });
  return '<section class="market"><h3>'+market+'</h3><p class="marketRule">'+(typeof statCondition==='function'?E(statCondition(spec[2],spec[3])):'')+'</p><div class="prices">'+buttons.join('')+'</div></section>';
}
function pickSegment(i,n,k){
  if(n<firstOpenSegment(i))return;
  const spec=segmentMarkets[sportOf(events[i])], g=100+n, key=String([i,g,k]);
  const leg=selection(i,g,k,(k?'Under ':'Over ')+spec[3],spec[1]+' '+(n+1)+' · '+spec[2],moved[key]??[1.91,1.85][k]);
  if(slip?.key===key && mode==='paused')return;
  if(parlayMode){toggleLeg(leg);return}
  if(slip?.key!==key){slip=leg;mode='normal';notice=''}
  tab='Slip';render();
}
function flightMarkets(term = marketTerm) {
  marketTerm=term;
  const event=events[id], query=term.trim().toLowerCase();
  const football=isFootball(event)&&!feedEvents.has(event), spec=segmentMarkets[sportOf(event)];
  let cardsHtml='';
  if(query || group<7){
    const choices=query&&football?markets.map((_,i)=>i):football?([[0,1],[1],[2],[3],[4],[5,6]][group]||[0]):[0];
    cardsHtml=choices.filter(i=>[markets[i],...names(event,i)].join(' ').toLowerCase().includes(query)).map(i=>
      '<section class="market"><h3>'+markets[i]+'</h3><p class="marketRule">'+(typeof marketCondition==='function'?E(marketCondition(id,i)):'')+'</p>'+prices(id,i)+'</section>').join('');
  }
  if((query || group===8) && spec && !feedEvents.has(event)){
    const parts=query?Array.from({length:spec[4]},(_,n)=>n):[segment];
    cardsHtml+=parts.filter(n=>(spec[1]+' '+(n+1)+' '+spec[2]+' Over Under '+spec[3]).toLowerCase().includes(query)).map(n=>segmentMarket(id,n)).join('');
  }
  if(query || group===7)cardsHtml+=playerMarkets(id,query);
  return cardsHtml||'<p>No matching markets.</p>';
}
function marketTabs(event){
  const football=isFootball(event)&&!feedEvents.has(event);
  const tabs=football?groups.map((label,i)=>[label,i]):[['Main',0]];
  const spec=segmentMarkets[sportOf(event)];
  if(spec && !feedEvents.has(event))tabs.push([spec[0],8]);
  if(playerLines(id).length)tabs.push(['Player props',7]);
  if(!tabs.some(t=>t[1]===group))group=0;
  return '<div class="chips marketTabs">'+tabs.map(([name,i])=>btn(name,"marketTerm='';group="+i+';render()',group===i?'active':'')).join('')+'</div>'+
    (group===8?'<div class="chips">'+Array.from({length:spec[4]},(_,n)=>btn(spec[1]+' '+(n+1),"marketTerm='';segment="+n+';render()',segment===n?'active':'')).join('')+'</div>':'');
}
let fixtureOrigin = 'live';
window.addEventListener('hashchange', event => {
  if (ed !== 6 || p !== 'match') return;
  const [book, page] = new URL(event.oldURL).hash.slice(1).split('/');
  if (book === '6' && ['home','live','football','favorites','upcoming'].includes(page)) {
    fixtureOrigin = page;
    const back = document.querySelector('.flightBack');
    if (back) {back.href = href(page); back.textContent = backLabel();}
  }
});
function backLabel() {
  return '← ' + ({home:'Sports home',live:'Live now',football:'Football',favorites:'Favourites',upcoming:'Upcoming events'})[fixtureOrigin];
}
function flightMatch() {
  const event = events[id];
  if(lastMatchId!==id){marketTerm='';segment=Math.min(firstOpenSegment(id),(segmentMarkets[sportOf(event)]?.[4]||1)-1);lastMatchId=id}
  const side = k => '<div class="scoreSide">' + (typeof teamVisual==='function'?teamVisual(id,k):badgeFor(id,k)) + '<b>' + E(event[k]) +
    '</b>' + btn(favs.includes(event[k]) ? '★ Following' : '☆ Follow',
      'follow(' + JSON.stringify(event[k]) + ')') + '</div>';
  const nearby=events.map((e,i)=>i).filter(i=>sportOf(events[i])===sportOf(event));
  const strip='<div class="fixtureStrip" aria-label="Other fixtures">'+nearby.map(i=>
    '<a class="'+(id===i?'active':'')+'" href="'+href('match',i)+'"><small>'+
    E(leagues[events[i][2]])+'</small>'+E(events[i][0])+' v '+E(events[i][1])+'</a>').join('')+'</div>';
  return '<a class="flightBack" href="' + href(fixtureOrigin) + '">' + backLabel() + '</a>' + strip +
    '<section class="flightScore"><small>' + E(leagues[event[2]]) + '</small><h1>' +
    E(event[0]) + ' v ' + E(event[1]) + '</h1><div>' + side(0) +
    '<div><strong>' + E(event[4]) + '</strong>' + clock(event) + '</div>' + side(1) +
    '</div></section><input aria-label="Search markets or players" placeholder="Search markets or players" value="'+E(marketTerm)+'" ' +
    'oninput="document.getElementById(\'flightMarkets\').innerHTML=flightMarkets(this.value)">' +
    (typeof slipModes==='function'?slipModes(true):'') + marketTabs(event) +
    (typeof legConflict==='function' && parlayMode?legConflict():'') + '<div id="flightMarkets">' + flightMarkets() + '</div>';
}
match = () => ed === 6 ? flightMatch() : priorMatch();
home = () => ed === 6 ? flightHome() : priorHome();
listing = () => ed === 6 ? flightList() : priorListing();
ticket = () => ed === 6 ? flightPanel() : priorPanel();
desk = () => ed === 6 ? '<h1>Bet slip &amp; My bets</h1>' + flightPanel() : priorDesk();
const beforeFlightRender = render;
render = () => {
  beforeFlightRender();
  const dialog = document.querySelector('.flightSheet');
  if (dialog && !dialog.open) dialog.showModal();
};
window.render = render;
matchMedia('(max-width:750px), (pointer:coarse) and (orientation:landscape) and (max-width:960px)').addEventListener('change', event => {
  if (!event.matches && ed === 6 && sheet) closeFlightSheet();
});
