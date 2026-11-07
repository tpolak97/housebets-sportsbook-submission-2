// The optional builder uses illustrative prices. All player and event data is local.
let parlayMode = false;
let legs = [];
let parlayStake = '';
let parlayPlaced = false, acceptedParlay=null, reviewedQuote='';
function quoteKey(){return JSON.stringify([legs.map(l=>[l.key,l.price]),Number(parlayStake)])}
let builderNote = '';
let proposedLeg = null;
let offerNotation = 'decimal';
try {offerNotation=localStorage.getItem('beta.floodlight-offers')==='us'?'us':'decimal'} catch {}
function formatOffer(price){
  if(offerNotation!=='us')return price.toFixed(2);
  return price>=2?'+'+Math.round((price-1)*100):String(-Math.round(100/(price-1)));
}
function changeNotation(value){
  offerNotation=value;
  try{localStorage.setItem('beta.floodlight-offers',value)}catch{}
  render();
}
function oddsSetting(){
  return '<label class="offerSetting">Market odds <select onchange="changeNotation(this.value)"><option value="decimal" '+
    (offerNotation==='decimal'?'selected':'')+'>Decimal</option><option value="us" '+(offerNotation==='us'?'selected':'')+
    '>American</option></select><small>Example: 2.50 / +150 returns 25 USDT on a winning 10 USDT stake. Tickets use decimal odds.</small></label>';
}
function legConflict(){
  if(!proposedLeg)return '';
  const existing=legs.find(l=>l.family===proposedLeg.family);
  if(!existing)return '';
  return '<section class="conflictBox" role="status"><b>Only one outcome can win this line</b><p>'+
    E(existing.fixture)+' · '+E(existing.market)+'</p>'+btn('Keep '+E(existing.name),'resolveLeg(false)')+
    btn('Replace with '+E(proposedLeg.name),'resolveLeg(true)')+'</section>';
}
function resolveLeg(replace){
  invalidateCombo();
  if(replace && proposedLeg)legs=legs.map(l=>l.family===proposedLeg.family?proposedLeg:l);
  proposedLeg=null;render();
}
let drawerOpen = false;
const standardPick = pick;
const statLines = {
  Football:[['Anytime goal','yes'],['Shots on target',1.5]],
  Basketball:[['Points',22.5],['Rebounds',7.5],['Assists',5.5]],
  'American Football':[['Receiving yards',54.5],['Receptions',4.5]],
  Tennis:[['Aces',5.5],['Double faults',2.5]],
  'Ice Hockey':[['Shots on goal',2.5],['Points',0.5]],
  'Dota 2':[['Map kills',6.5],['Map assists',10.5]],
  Baseball:[['Hits',1.5],['Runs',0.5]],
  Volleyball:[['Aces',1.5],['Kills',10.5]],
  Rugby:[['Tries',0.5],['Tackles',7.5]],
  'Counter-Strike 2':[['Map kills',16.5],['Headshots',6.5]]
};
function playerLines(i){
  const e=events[i], sportName=sportOf(e), derby=i===international;
  const roster=derby?[scorerFor(e[0]),scorerFor(e[1])]:sportName==='Football'?[scorerFor(e[0]),scorerFor(e[1])]:sportName==='Basketball'?['Zia Arden','Joss Marin']:
    sportName==='Tennis'?e.slice(0,2):['Eli Fen','Remi Quill'];
  return roster.flatMap((player,side)=>(statLines[sportName]||[]).map(([stat,line])=>({
    player,team:e[side],stat, outcomes:line==='yes'?['To score','Not to score']:['Over '+line,'Under '+line],
    prices:line==='yes'?[2.45,1.54]:[1.88,1.92]
  })));
}
function playerMarkets(i,term){
  const content=playerLines(i).map((m,index)=>{
    if(term && ![m.player,m.team,m.stat,...m.outcomes].join(' ').toLowerCase().includes(term))return '';
    const market=m.player+' · '+m.stat;
    return '<section class="market propMarket"><small>'+E(m.team)+'</small><h3>'+E(market)+'</h3><p class="marketRule">'+(typeof statCondition==='function'?E(statCondition(m.stat,m.outcomes[0]==='To score'?'yes':m.outcomes[0].slice(5))):'')+'</p><div class="prices">'+
      m.outcomes.map((name,k)=>btn('<small>'+E(name)+'</small><b>'+formatOffer(moved[String([i,index+20,k])]??m.prices[k])+'</b>',
        'pickPlayer('+i+','+index+','+k+')',isChosen(i,index+20,k)?'chosen':'')).join('')+'</div></section>';
  }).join('');
  return content?'<h2>Player markets</h2>'+content:'';
}
function isParlayPick(i,g,k){return legs.some(l=>l.key===String([i,g,k]))}
function isChosen(i,g,k){return parlayMode?isParlayPick(i,g,k):slip?.key===String([i,g,k])}
function selection(i,g,k,name,market,price){
  return {key:String([i,g,k]),family:String([i,g]),id:i,g,name,market,price,
    sport:sportOf(events[i]),fixture:events[i].slice(0,2).join(' v '),fixtureId:feedEvents.get(events[i])?.id};
}
function toggleLeg(leg){
  invalidateCombo();
  proposedLeg=null;
  if(legs.some(l=>l.key===leg.key))legs=legs.filter(l=>l.key!==leg.key);
  else{
    // Alternative outcomes of a single line cannot both win.
    if(legs.some(l=>l.family===leg.family))proposedLeg=leg;
    else legs.push(leg);
  }
  parlayPlaced=false;builderNote='';
  render();
}
pick=function(i,g,k){
  if(ed!==6||!parlayMode)return standardPick(i,g,k);
  if((i===2 && g===0)||(mode==='paused'&&slip?.key===String([i,g,k])))return;
  toggleLeg(selection(i,g,k,names(events[i],g)[k],markets[g],odds(i,g,k)));
};
window.pick=pick;
function pickPlayer(i,index,k){
  const m=playerLines(i)[index];
  const leg=selection(i,index+20,k,m.player+' · '+m.outcomes[k],m.stat,m.prices[k]);
  leg.price=moved[leg.key]??leg.price;
  if(slip?.key===leg.key && mode==='paused')return;
  if(parlayMode){toggleLeg(leg);return}
  if(slip?.key!==leg.key){slip=leg;mode='normal';notice=''}
  tab='Slip';render();
}
function slipModes(onMatch=false){
  return '<div class="flightTabs">'+btn('Single','setParlay(false)',!parlayMode?'active':'')+
    btn((onMatch?'Build parlay':'Parlay')+(legs.length?' · '+legs.length:''),'setParlay(true)',parlayMode?'active':'')+'</div>';
}
function setParlay(value){
  invalidateCombo();
  if(value && !legs.length && slip && !['changed','paused'].includes(mode)){
    legs.push({...slip, family:[slip.id,slip.g].join(','),sport:sportOf(events[slip.id]),
      market:slip.market||markets[slip.g]});
    parlayPlaced=false;
  }
  parlayMode=value;tab='Slip';render();
}
function fixtureGroups(picks) {
  const groups = new Map();
  picks.forEach((leg,index)=>{
    const key=leg.fixtureId ?? leg.id;
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push({leg,index});
  });
  return [...groups.values()];
}
// Illustrative quote service. Related additions use half their incremental odds.
function demoComboPrice(picks) {
  const total=fixtureGroups(picks).reduce((combo,group)=>{
    const prices=group.map(({leg})=>leg.price).sort((a,b)=>b-a);
    return combo*prices.reduce((price,next,i)=>price*(i===0?next:1+(next-1)/2),1);
  },1);
  return Math.round(total*100)/100;
}
function combinedOdds(){return demoComboPrice(legs)}
function parlayReturn(){return validFlightStake(parlayStake)?(combinedOdds()*Number(parlayStake)).toFixed(2):'0.00'}
let quoteRequest=0;
let checkingCombo=false;
function invalidateCombo(){
  quoteRequest++;checkingCombo=false;reviewedQuote='';
}
function isPausedLeg(leg){
  return leg.paused || (leg.key===slip?.key && mode==='paused') || currentQuote(leg)===null;
}
function cannotReview(){
  return checkingCombo || proposedLeg || legs.length<2 || !validFlightStake(parlayStake) ||
    window.draftNeedsCheck?.('parlay') || legs.some(isPausedLeg);
}
function setParlayStake(value){
  parlayStake=value;invalidateCombo();
  document.querySelectorAll('.comboReview').forEach(el=>el.remove());
  document.querySelectorAll('.comboLabel').forEach(el=>el.textContent='Estimated combo price');
  document.querySelectorAll('.placeParlay').forEach(el=>{
    el.textContent='Check parlay price';el.disabled=Boolean(cannotReview());
  });
  document.querySelectorAll('.parlayReturn').forEach(el=>el.textContent=parlayReturn());
}
function fixtureTicket(picks,row){
  return fixtureGroups(picks).map(group=>'<section class="ticketFixture"><h4>'+E(group[0].leg.fixture)+'</h4>'+
    group.map(({leg,index})=>row(leg,index)).join('')+'</section>').join('');
}
function pauseComboLeg(index){
  const leg=legs[index];if(!leg)return;
  leg.paused=!leg.paused;invalidateCombo();render();
}
function waitForComboMarket(index){
  if(!legs[index])return;
  builderNote='Waiting for '+legs[index].name+'. Your draft and stake are saved.';render();
}
function draftRow(leg,index){
  const paused=isPausedLeg(leg);
  return '<div class="comboLine" id="comboLeg'+index+'"><div><b>'+E(leg.name)+'</b><small>'+E(leg.market)+'</small></div>'+
    '<strong>'+leg.price.toFixed(2)+'</strong>'+btn('×','dropLeg('+index+')','removeCombo').replace('<button ','<button aria-label="Remove '+E(leg.name)+'" ')+
    (paused?'<small class="comboAlert">Suspended · wait for this market to reopen or remove this leg. '+btn('Wait','waitForComboMarket('+index+')')+'</small>':'')+'</div>';
}
function parlayPanel(){
  if(parlayPlaced && acceptedParlay){
    const ticket=acceptedParlay;
    return '<section class="slipReceipt"><small>✓ DEMO PARLAY PLACED</small><h3>'+E(ticket.name)+'</h3><p>'+
      ticket.price.toFixed(2)+'× · Stake '+ticket.stake.toFixed(2)+' USDT<br>Potential return '+(ticket.price*ticket.stake).toFixed(2)+
      ' USDT</p><small>Ticket '+E(ticket.ticketId)+'</small>'+btn('View open bets','openHistory()','cta')+'</section>';
  }
  const count=legs.length, matches=fixtureGroups(legs).length;
  const reviewed=reviewedQuote===quoteKey();
  const paused=legs.map((leg,index)=>isPausedLeg(leg)?index:null).filter(i=>i!==null);
  const unresolved=paused.length+Number(Boolean(proposedLeg));
  const summary=count+' legs · '+matches+(matches===1?' match':' matches')+(unresolved?' · '+unresolved+' unresolved':'');
  const blocked=paused.map(i=>btn('Suspended · '+E(legs[i].name),
    "document.getElementById('comboLeg"+i+"').scrollIntoView({block:'center'})")).join('');
  const buttonLabel=checkingCombo?'Checking combo price…':reviewed?'Confirm demo parlay':'Check parlay price';
  return '<section class="flightTicket"><b>'+summary+'</b>'+legConflict()+blocked+
    (count<2?'<p>Pick at least two outcomes to build a parlay.</p>':'')+fixtureTicket(legs,draftRow)+
    (builderNote?'<p role="status">'+E(builderNote)+'</p>':'')+
    '<footer><p><span class="comboLabel">'+ (reviewed?'Checked demo price':'Estimated combo price')+'</span> <b>'+(count?combinedOdds().toFixed(2)+'×':'—')+'</b></p>'+
    '<label>Stake in USDT<input type="text" inputmode="decimal" value="'+E(parlayStake)+'" oninput="setParlayStake(this.value)"></label>'+
    '<p>Potential return <b><span class="parlayReturn">'+parlayReturn()+'</span> USDT</b></p>'+
    '<div class="stakeChips">'+[1,10,50,100].map(v=>btn(v+'',"setParlayStake('"+v+"');render()")).join('')+'</div>'+
    (reviewed?'<div class="reviewQuote comboReview" role="status"><b>Confirm this price</b><p>'+summary+' · '+combinedOdds().toFixed(2)+
      '× · Stake '+Number(parlayStake).toFixed(2)+' USDT · Potential return '+parlayReturn()+' USDT</p></div>':'')+
    '<button class="cta placeParlay" '+(cannotReview()?'disabled':'')+' onclick="placeParlay()">'+buttonLabel+'</button></footer>'+
    (count?'<details><summary>Sample market updates</summary>'+legs.map((leg,i)=>btn((leg.paused?'Reopen ':'Suspend ')+E(leg.name),'pauseComboLeg('+i+')')).join('')+'</details>':'')+'</section>';
}
function dropLeg(index){invalidateCombo();legs.splice(index,1);proposedLeg=null;render()}
function refreshLegPrices(){
  const before=Number(parlayReturn());
  let changed=false;
  for(const leg of legs){
    const price=currentQuote(leg);
    if(price!==null && price!==leg.price){leg.price=price;changed=true}
  }
  if(changed){invalidateCombo();builderNote='Odds changed. '+returnDifference(before,Number(parlayReturn()))}
  return changed;
}
async function placeParlay(){
  if(cannotReview())return;
  if(refreshLegPrices()){render();return}
  if(reviewedQuote!==quoteKey()){
    const sequence=++quoteRequest, requestKey=quoteKey();
    checkingCombo=true;builderNote='';render();
    await new Promise(resolve=>setTimeout(resolve,500));
    if(sequence!==quoteRequest)return;
    checkingCombo=false;
    if(requestKey===quoteKey() && !cannotReview() && !refreshLegPrices())reviewedQuote=requestKey;
    render();return;
  }
  const first=legs[0], at=Date.now(), price=combinedOdds(), stake=Number(parlayStake);
  const ticket={ticketId:'PB-'+at.toString(36).toUpperCase(),id:first.id,fixtureId:first.fixtureId,
    legs:legs.map(l=>({...l,outcome:'Pending',placementScore:events[l.id]?.[3]?events[l.id][4]:null})),placedAt:at,fixture:first.fixture,name:legs.length+'-leg parlay',
    sport:new Set(legs.map(l=>l.sport)).size===1?first.sport:'Mixed sports',price,stake,return:parlayReturn(),state:'Open',
    timeline:[{at,text:'Accepted combo price · '+price.toFixed(2)+'×'},{at,text:'Placed · '+stake.toFixed(2)+' USDT'}]};
  bets.unshift(ticket);acceptedParlay=ticket;cash=-1;legs=[];parlayStake='';parlayPlaced=true;invalidateCombo();persist();render();
}
const finalOutcomes=['Won','Lost','Void'];
function parlayReceipt(ticket,index){
  const won=ticket.legs.filter(l=>l.outcome==='Won').length;
  const rows=fixtureTicket(ticket.legs,(leg,k)=>{
    const state=leg.outcome||'Pending';
    const controls=ticket.state==='Open' && !finalOutcomes.includes(state)?
      '<details><summary>Demo leg update</summary>'+['Pending','Currently ahead',...finalOutcomes].filter(v=>v!==state)
      .map(v=>btn(v,'gradeLeg('+index+','+k+','+JSON.stringify(v)+')')).join('')+'</details>':'';
    return '<div class="trackedLeg"><strong>'+E(leg.name)+'</strong> · '+leg.price.toFixed(2)+'<small>'+E(leg.market)+'</small>'+
      (leg.placementScore?'<small>At placement · '+E(leg.placementScore)+(ticket.state==='Open'&&events[leg.id]?.[3]?' · Current score '+E(events[leg.id][4]):'')+'</small>':'')+
      '<b class="legStatus">'+({Pending:'◷','Currently ahead':'↗',Won:'✓',Lost:'×',Void:'—'}[state]||'')+' '+E(state)+'</b>'+controls+'</div>';
  });
  return '<div class="receiptLegs"><b>'+won+' of '+ticket.legs.length+' legs won</b>'+rows+
    '<details class="ticketTrail"><summary>Receipt timeline</summary>'+ticketEvents(ticket).map(entry=>
    '<div><time>'+E(new Date(entry.at).toLocaleTimeString())+'</time> '+E(entry.text)+'</div>').join('')+'</details></div>';
}
function ticketEvents(ticket){
  if(Array.isArray(ticket.timeline))return ticket.timeline;
  return ticket.placedAt?[{at:ticket.placedAt,text:'Placed at '+ticket.price.toFixed(2)+'×'},
    ...(ticket.settledAt?[{at:ticket.settledAt,text:'Settled · '+ticket.result+' · '+ticket.return+' USDT'}]:[])]:[];
}
function recordEvent(ticket,text,at=Date.now()){
  ticket.timeline=ticketEvents(ticket);ticket.timeline.push({at,text});
}
function gradeLeg(index,k,state){
  const ticket=bets[index],leg=ticket?.legs?.[k];
  if(!leg || ticket.state!=='Open' || finalOutcomes.includes(leg.outcome) || leg.outcome===state ||
    !['Pending','Currently ahead',...finalOutcomes].includes(state))return;
  leg.outcome=state;recordEvent(ticket,leg.fixture+' · '+leg.name+' · '+state);
  if(state==='Lost'||ticket.legs.every(l=>finalOutcomes.includes(l.outcome))){
    const remaining=ticket.legs.filter(l=>l.outcome!=='Void');
    ticket.state='Settled';ticket.settledAt=Date.now();
    ticket.result=state==='Lost'?'Lost':remaining.length?'Won':'Void';
    const voided=remaining.length!==ticket.legs.length;
    const payoutPrice=voided?demoComboPrice(remaining):ticket.price;
    ticket.return=(state==='Lost'?0:ticket.stake*payoutPrice).toFixed(2);
    recordEvent(ticket,'Settled · '+ticket.result+' · Returned '+ticket.return+' USDT',ticket.settledAt);
    status='Settled';cash=-1;
  }
  persist();render();
}
function openHistory(){
  sheet=false;desktopSlip=false;drawerOpen=true;cash=-1;receiptRange='All time';receiptSport='All sports';status='Open';render();
  document.querySelector('.historyClose')?.focus({preventScroll:true});
}
function closeHistory(){drawerOpen=false;cash=-1;render();document.querySelector('.betsBubble')?.focus({preventScroll:true})}
function historyWidget(){
  const count=bets.filter(b=>b.state==='Open').length;
  return (drawerOpen?'<section class="betsDrawer" role="dialog" aria-label="My bets"><header><strong>My bets</strong>'+
    '<button class="historyClose" aria-label="Close My bets" onclick="closeHistory()">×</button></header>'+flightHistory()+'</section>':'')+
    '<button class="betsBubble" aria-expanded="'+drawerOpen+'" onclick="'+(drawerOpen?'closeHistory()':'openHistory()')+'">▤ My bets <b>'+count+'</b></button>';
}
let desktopSlip = false;
let upcomingWindow = 0;
const sportsRail = ['Football','Tennis','Cricket','Basketball','American Football','Ice Hockey','Horse Racing','Formula 1','MMA'];
const esportRail = ['Counter-Strike 2','Dota 2','League of Legends'];
function sportsRoute(page, label) {
  return '<a class="'+(p===page?'active':'')+'" href="'+href(page)+'">'+label+'</a>';
}
function enterSport(name) {
  sport=name;league='All';q='';
  if(p==='home')render();else location.hash=href('home');
}
function pinnedDirectorySports(){return []}
function railSport(name) {
  const label=name==='All'?'All sports':name;
  const mark=name==='All'?toolbarMark('sports'):icon(name);
  return '<button data-sport="'+E(name)+'" aria-label="'+E(label)+'" title="'+E(label)+'" aria-pressed="'+(sport===name)+'" onclick="chooseDirectorySport(this)">'+mark+'<span>'+E(label)+'</span></button>';
}
function chooseDirectorySport(button){
  const name=button.dataset.sport;
  const nav=button.closest('nav');
  const offset=nav.scrollTop;
  const mobile=nav.classList.contains('directoryOpen');
  if(['live','favorites','upcoming'].includes(p)){
    league='All';q='';selectSport(name);
  }else enterSport(name);
  requestAnimationFrame(()=>{
    const directory=document.querySelector('#sideSports');
    if(!directory)return;
    directory.closest('nav').scrollTop=offset;
    const target=mobile?document.querySelector('.directoryTrigger'):directory.querySelector('[aria-pressed=true]');
    target?.focus({preventScroll:true});
  });
}
function toggleDirectory(button){
  const expanded=button.getAttribute('aria-expanded')==='true';
  button.setAttribute('aria-expanded',String(!expanded));
  button.closest('nav').classList.toggle('directoryOpen',!expanded);
}
function toolbarMark(key){
 const forms={
 home:'<path d="m2.5 11 8-7.4a2.2 2.2 0 0 1 3 0L21.5 11v9a1 1 0 0 1-1 1H15v-6H9v6H3.5a1 1 0 0 1-1-1z"/>',
 live:'<rect x="1" y="5" width="22" height="14" rx="3"/><path stroke-width="1.35" d="M4 9v6h3m2-6v6m2-6 1.7 6 1.8-6m5.5 0h-3v6h3m-3-3h2"/>',
 favorites:'<path d="m12 2 3.1 6.4 7.1 1-5.1 5 1.2 7.1-6.3-3.4-6.3 3.4 1.2-7.1-5.1-5 7.1-1z"/>',
 bets:'<rect x="3" y="2" width="13" height="16" rx="2"/><path d="M7 7h5m-5 4h4m7-5h2v15H8v-1"/>',
 popular:'<path d="m2 7 5 4 5-7 5 7 5-4-3 12H5z"/>',
 upcoming:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18"/>',
 support:'<path d="M3 4h18v13h-8l-5 5v-5H3z"/><path d="M7 9h10m-10 4h6"/>',
 profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-8 16-8 16 0"/>',
 casino:'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 7h1m8 9h1m-6-4h2"/>',
 sports:'<circle cx="12" cy="12" r="9"/><path d="m12 8 4 3-2 5h-4l-2-5z"/>',
 search:' <circle cx="10" cy="10" r="7"/><path d="m15.3 15.3 6 6"/>'
 };
 return '<svg class="utilityMark mark-'+key+'" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><g>'+forms[key]+'</g></svg>';
}
function siteRail(casino) {
  const segment=(page,label,selected)=>'<a aria-label="'+label+'" title="'+label+'" href="'+href(page)+'" '+(selected?'class="active" aria-current="true"':'')+'>'+toolbarMark(page==='home'?'sports':'casino')+'<span>'+label+'</span></a>';
  const products='<div class="productSwitch" role="group" aria-label="Choose product">'+segment('casino','Casino',casino)+segment('home','Sports',!casino)+'</div>';
  if(casino)return '<nav id="productSidebar" aria-label="Product navigation">'+products+'</nav>';
  const shortcut=(page,key,label)=>'<a href="'+href(page)+'" title="'+label+'" aria-label="'+label+'" class="'+(p===page?'active':'')+'">'+toolbarMark(key)+'<span>'+label+'</span></a>';
  const shortcuts='<div class="sideLinks"><button title="Rewards" aria-label="Rewards" onclick="openAccount(&quot;Rewards&quot;)">'+toolbarMark('popular')+'<span>Rewards</span><b>Rookie</b></button>'+
    shortcut('upcoming','upcoming','Upcoming Events')+shortcut('live','live','Bet Live')+shortcut('bets','bets','My Bets')+'</div>';
  const pinned=pinnedDirectorySports();
  const group=(label,names)=>{
    if(!names.length)return '';
    const heading=label==='Sports'
      ? '<div class="sportsHeading"><strong>Sports</strong>'+railSport('All')+'</div>'
      : '<small>'+label+'</small>';
    return heading+names.map(railSport).join('');
  };
  const split=catalog.indexOf('Arena of Valor');
  const unpinned=names=>names.filter(name=>!pinned.includes(name));
  return '<nav id="productSidebar" aria-label="Sports navigation">'+products+
    '<button class="directoryTrigger" aria-expanded="false" aria-controls="sideSports" onclick="toggleDirectory(this)">Choose sport ▴</button>'+
    '<section class="railDirectory" id="sideSports" aria-label="Sport directory">'+shortcuts+group('Pinned',pinned)+
    group('Sports',unpinned([...new Set([...sportsRail,...catalog.slice(0,split)])]))+
    group('Esports',unpinned([...new Set([...esportRail,...catalog.slice(split)])]))+'</section></nav>';
}
function discoveryNav(){
  const tabs=[['home','popular','Popular'],['live','live','Live'],['upcoming','upcoming','Upcoming'],['favorites','favorites','Favourites']];
  return '<div class="browseTabs">'+tabs.map(([page,key,label])=>sportsRoute(page,toolbarMark(key)+label)).join('')+'</div>';
}
function browseEvents(){
  const fav=p==='favorites';
  const ids=(fav?all:soon).filter(i=>sport==='All'||sportOf(events[i])===sport).filter(i=>{
    if(fav)return favs.includes(favoriteKey(i))||events[i].slice(0,2).some(n=>favs.includes(n))||favs.includes(leagues[events[i][2]]);
    if(!upcomingWindow)return true;
    const [h,m]=events[i][4].split(':').map(Number);
    const delta=h*60+m-(18*60+15);
    return delta>=0 && delta<=upcomingWindow;
  });
  return '<h1>'+(fav?'Favourites':'Upcoming events')+'</h1>'+actionRail()+discoveryNav()+
    (fav?'':'<div class="chips">'+['All upcoming','Next hour','Next 3 hours'].map((v,k)=>btn(v,'upcomingWindow='+[0,60,180][k]+';render()',upcomingWindow===[0,60,180][k]?'active':'')).join('')+'</div>')+
    (ids.length?fixtureGroup(fav?'Following':'Kickoff · sample local time',ids):
      '<div class="emptyBrowse"><h2>'+ (fav?'No saved fixtures here':'No matches in this window')+'</h2><p>'+
      (fav?'Use the star beside a fixture to save it.':'Try another sport or a wider time window.')+'</p>'+link('home','Browse sports →')+'</div>');
}
function openDeskSlip(){
  drawerOpen=false;desktopSlip=!desktopSlip;render();
  document.querySelector(desktopSlip?'.deskSlipClose':'.deskSlipBar')?.focus({preventScroll:true});
}
function desktopTicket(){
  const count=parlayMode?legs.length:Number(!!slip);
  const summary=parlayMode&&count?combinedOdds().toFixed(2)+'×':slip&&!parlayMode?slip.name+' @ '+slip.price.toFixed(2):'';
  return '<div class="deskTicket">'+(desktopSlip?'<section class="deskFlyout" role="dialog" aria-label="Bet slip"><header><strong>Bet slip</strong>'+
    '<button class="deskSlipClose" onclick="openDeskSlip()" aria-label="Collapse bet slip">×</button></header>'+flightPanel()+'</section>':'')+
    '<button class="deskSlipBar" aria-expanded="'+desktopSlip+'" onclick="openDeskSlip()">▤ Bet slip · '+count+
    (summary?' <small>'+E(summary)+'</small>':'')+' '+(desktopSlip?'⌄':'⌃')+'</button></div>';
}
function renderPlaybookShell(){
  const casino=p==='casino';
  document.body.style.setProperty('--a',theme[2]);document.body.style.setProperty('--ink',theme[3]);
  document.body.className='';document.body.dataset.book='6';
  let page;
  if(casino)page='<p class="k">Housebets / Casino</p><h1>Casino lobby</h1><p>Explore the sportsbook from the product switch.</p>'+link('home','Open Sports →');
  else if(p==='home')page=home();
  else if(p==='match')page=match();
  else if(p==='bets')page='<h1>My bets</h1>'+flightHistory();
  else if(['favorites','upcoming'].includes(p))page=browseEvents();
  else page=listing();
  app.innerHTML='<header><a class="bookBrand" href="'+href('home')+'"><img width="134" src="housebets.png" alt="Housebets"></a>'+
    '<span class="demoWallet">◈ &nbsp; USDT <small>Demo wallet</small></span></header>'+
    '<div class="layout bookLayout">'+siteRail(casino)+'<main>'+page+(casino?'':oddsSetting())+'</main></div>'+
    (casino?'':desktopTicket()+flightMobileSlip())+historyWidget();
}
document.addEventListener('keydown',e=>{if(e.key==='Escape' && drawerOpen)closeHistory();else if(e.key==='Escape' && desktopSlip)openDeskSlip()});
window.addEventListener('hashchange',()=>{if(drawerOpen){drawerOpen=false;render()}});
render();
