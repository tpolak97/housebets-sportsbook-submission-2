/* Interactions shared by Floodlight's desktop ticket and phone sheet. */
const draftKey = 'beta.floodlight.draft.v1';
const browsePages = ['home','live','football','upcoming','favorites'];
let returnView = null;
const needsQuote = {single:false, parlay:false};

function storageRead(key) {
  try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; }
}
function rememberDraft() {
  if(ed !== 6) return;
  try {
    if(!slip && !legs.length) { sessionStorage.removeItem(draftKey); return; }
    sessionStorage.setItem(draftKey, JSON.stringify({slip, legs, stakes, parlayStake, parlayMode,
      suspended:mode==='paused' ? slip?.key : null, moved}));
  } catch { /* Private browsing can disable storage. */ }
}
function currentQuote(leg) {
  const [i,g,k] = leg.key.split(',').map(Number);
  const fixture = events[i];
  if(!fixture || fixture.slice(0,2).join(' v ') !== leg.fixture ||
     feedEvents.get(fixture)?.id !== leg.fixtureId || !Number.isInteger(k) || k<0) return null;
  let price;
  if(g>=100) {
    const spec=segmentMarkets[sportOf(fixture)], n=g-100;
    if(!spec || n>=spec[4] || n<firstOpenSegment(i) || k>1)return null;
    price=[1.91,1.85][k];
  } else if(g>=20) {
    price=playerLines(i)[g-20]?.prices[k];
  } else {
    if(!markets[g] || !names(fixture,g)[k] || (i===2 && g===0))return null;
    price=odds(i,g,k);
  }
  if(!Number.isFinite(price))return null;
  return moved[leg.key] ?? price;
}
function restoreDraft() {
  const d=storageRead(draftKey);
  if(!d || ed!==6)return;
  const valid=l=>l && typeof l.key==='string' && /^\d+,\d+,\d+$/.test(l.key) &&
    Number.isFinite(l.price) && l.price>1 && currentQuote(l)!==null;
  slip=valid(d.slip)?d.slip:null;
  legs=Array.isArray(d.legs)?d.legs.filter(valid):[];
  // Never silently turn a partly unavailable parlay into a smaller bet.
  if(legs.length!==d.legs?.length){legs=[];builderNote='Draft unavailable. One or more original legs could not be restored.'}
  if(!slip && !legs.length){rememberDraft();return}
  moved=Object.fromEntries(Object.entries(d.moved||{}).filter(([key,price])=>
    /^\d+,\d+,\d+$/.test(key) && Number.isFinite(price) && price>1));
  stakes=String(d.stakes??'');parlayStake=String(d.parlayStake??'');
  parlayMode=Boolean(d.parlayMode);needsQuote.single=Boolean(slip);needsQuote.parlay=Boolean(legs.length);
  mode=d.suspended && d.suspended===slip?.key?'paused':'normal';
  reviewedQuote='';
}
function recheckDraft() {
  const picks=parlayMode?legs:[slip];
  if(!picks.length || picks.some(l=>!l || l.paused || currentQuote(l)===null || (mode==='paused' && slip?.key===l.key))){
    announceUpdate('Market unavailable. Reopen or remove the suspended selection.');return;
  }
  const before=parlayMode?Number(parlayReturn()):Number(ret());
  if(parlayMode){
    legs.forEach(l=>l.price=currentQuote(l));reviewedQuote='';needsQuote.parlay=false;
    builderNote='Draft prices checked. '+returnDifference(before,Number(parlayReturn()));
  }else{
    const price=currentQuote(slip);needsQuote.single=false;
    if(price!==slip.price){slip.newPrice=price;mode='changed'}
    else {delete slip.newPrice;mode='normal';notice='Draft price checked. Review your stake before placing.'}
  }
  render();
}
function returnDifference(before,after) {
  const cents=Math.round(after*100)-Math.round(before*100);
  if(!cents)return 'Potential return is unchanged.';
  return 'Potential return '+(cents>0?'increases':'decreases')+' by '+(Math.abs(cents)/100).toFixed(2)+' USDT.';
}
function singleDifference() {
  return validFlightStake(stakes)?returnDifference(Number(ret()),Number(pendingReturn(stakes))):'Enter a stake to see the difference in USDT.';
}
function marketCondition(i,g) {
  const [homeTeam,awayTeam]=events[i];
  const rules=[
    isFootball(events[i])?'Pick the result at the end of normal time, including stoppage time.':'Pick the winner of the match.',
    'Over 2.5 wins at three or more total goals. Under wins at two or fewer.',
    'Only the score at half-time counts.',
    homeTeam+' −1 wins if they win by two or more. '+awayTeam+' +1 wins if they draw or win. A one-goal '+homeTeam+' win returns the stake on either side.',
    'Your selected player must score at least once during normal time.',
    'Over 8.5 wins at nine or more total corners. Under wins at eight or fewer.',
    'Over 3.5 wins at four or more total cards. Under wins at three or fewer.'
  ];
  return rules[g]||'';
}
function statCondition(label,line) {
  return line==='yes'?'“To score” wins if the player scores at least once. “Not to score” wins if they do not score.':
    'Over '+line+' needs at least '+(Math.floor(Number(line))+1)+' '+label.toLowerCase()+'. Under wins at '+Math.floor(Number(line))+' or fewer.';
}

// Capture before a normal fixture link changes the hash, including nested badges and names.
document.addEventListener('click',event=>{
  const anchor=event.target.closest('a');
  if(ed!==6 || !browsePages.includes(p) || !anchor?.hash.startsWith('#6/match/'))return;
  returnView={page:p, sport,league,q,window:upcomingWindow,y:scrollY,hash:anchor.hash,
    rails:[...document.querySelectorAll('.sportTrack,.snapRail')].map(el=>el.scrollLeft)};
},true);
window.addEventListener('hashchange',event=>{
  if(ed!==6 || !returnView || p!==returnView.page || !new URL(event.oldURL).hash.startsWith('#6/match/'))return;
  const v=returnView;
  sport=v.sport;league=v.league;q=v.q;upcomingWindow=v.window;render();
  const target=[...document.querySelectorAll('main a')].find(a=>a.hash===v.hash);
  target?.focus({preventScroll:true});
  document.querySelectorAll('.sportTrack,.snapRail').forEach((el,i)=>el.scrollLeft=v.rails[i]||0);
  window.scrollTo(0,v.y);
});

// Queue sample arrivals without touching mounted match rows or their hit targets.
const arrivals=[
 ['Crystal Palace','Brentford',0,8,'0–0'],
 ['Sunderland','Newcastle United',0,12,'1–0']
];
const waiting=new Set();
const sampleIds=arrivals.map(e=>events.push(e)-1);
function publishFixture(i) {
  if(!live.includes(i)){all.push(i);live.push(i)}
}
for(const index of storageRead('beta.floodlight.arrivals')||[])if(sampleIds[index]!==undefined)publishFixture(sampleIds[index]);
function queueFixture(i) {
  if(!events[i]?.[3] || live.includes(i))return;
  waiting.add(i);syncArrivalButton();
}
function visibleArrivals() {
  return [...waiting].filter(i=>(sport==='All'||sportOf(events[i])===sport) &&
    (league==='All'||leagues[events[i][2]]===league));
}
function syncArrivalButton() {
  const el=document.querySelector('#arrivalButton');if(!el)return;
  const count=visibleArrivals().length;
  el.disabled=!count;el.textContent=count?'Show '+count+' new '+(count===1?'fixture':'fixtures'):'Live list is up to date';
  if(count)announceUpdate(el.textContent);
}
function revealArrivals() {
  for(const i of visibleArrivals()){publishFixture(i);waiting.delete(i)}
  try{sessionStorage.setItem('beta.floodlight.arrivals',JSON.stringify(sampleIds.flatMap((i,k)=>live.includes(i)?[k]:[])))}catch{}
  render();
}
function simulateArrival(){
  const i=sampleIds.find(i=>!live.includes(i)&&!waiting.has(i));
  if(i!==undefined)queueFixture(i);
}
const liveAnnouncement=document.createElement('div');
liveAnnouncement.setAttribute('role','status');liveAnnouncement.className='visuallyHidden';
document.body.append(liveAnnouncement);
function announceUpdate(message) {
  if(message && liveAnnouncement.textContent!==message)liveAnnouncement.textContent=message;
}
function focusedControl(){
  const el=document.activeElement;
  if(!app.contains(el))return null;
  if(el.matches('input,select,button,a,summary')){
    const attrs=['oninput','onclick','aria-label','href','onchange'];
    const attr=attrs.find(a=>el.hasAttribute(a));
    if(!attr)return null;
    return {tag:el.tagName,attr,value:el.getAttribute(attr),text:el.tagName==='BUTTON'?el.textContent:'',el,
      start:el.selectionStart??null,end:el.selectionEnd??null};
  }
  return null;
}
const renderBeforeBettorFlow=render;
render=function(){
  if(ed!==6){renderBeforeBettorFlow();return}
  const focus=focusedControl();
  const expanded=[...app.querySelectorAll('details[open]')].map(el=>el.querySelector('summary')?.textContent);
  renderBeforeBettorFlow();
  for(const el of app.querySelectorAll('details'))if(expanded.includes(el.querySelector('summary')?.textContent))el.open=true;
  if(p==='live'&&!q){
    const region=document.querySelector('#found');
    region?.insertAdjacentHTML('beforeend','<div class="arrivalDemo"><small>Sample live feed · Football</small> '+btn('Simulate fixture arrival','simulateArrival()')+'</div>');
    const first=region?.querySelector('.fixtureGroup');
    const control='<div class="arrivalSlot"><button id="arrivalButton" onclick="revealArrivals()"></button></div>';
    if(first)first.insertAdjacentHTML('beforebegin',control);else region?.insertAdjacentHTML('afterbegin',control);
    syncArrivalButton();
  }
  const panel=app.querySelector('.flightSheet,.deskFlyout');
  if(panel && needsQuote[parlayMode?'parlay':'single'] && (parlayMode?legs.length:slip)){
    panel.querySelectorAll('.placeParlay,.placeFlight').forEach(b=>b.disabled=true);
    panel.querySelector('.flightTabs')?.insertAdjacentHTML('afterend','<div class="reviewQuote">Restored draft · check current prices before placing. '+btn('Check restored prices','recheckDraft()')+'</div>');
  }
  if(focus){
    const matches=[...app.querySelectorAll(focus.tag)].filter(el=>el.getAttribute(focus.attr)===focus.value && el.getClientRects().length);
    const el=matches.find(e=>e.textContent===focus.text)||matches[0];
    if(el){
      el.focus({preventScroll:true});
      if(focus.start!==null && el.setSelectionRange)el.setSelectionRange(focus.start,focus.end);
    }
  }
  const state=panel?.querySelector('.slipState,.conflictBox')?.textContent || (panel&&parlayMode?builderNote:'');
  if(state)announceUpdate(state);
  if(!slip)needsQuote.single=false;
  if(!legs.length)needsQuote.parlay=false;
  rememberDraft();
};
window.render=render;
document.addEventListener('input',event=>{
  if(ed!==6 || !event.target.closest('.flightTicket'))return;
  rememberDraft();
  const difference=document.querySelector('.returnDifference');
  if(difference)difference.textContent=singleDifference();
});
window.draftNeedsCheck=type=>needsQuote[type];

let scheduledDrop;
function scheduleLowerPrice() {
  clearTimeout(scheduledDrop);
  const chosen=slip;
  announceUpdate('Sample price update scheduled in five seconds.');
  scheduledDrop=setTimeout(()=>{
    if(!chosen || chosen!==slip || ed!==6)return;
    const next=Math.max(1.01,Number(((chosen.newPrice??chosen.price)-0.12).toFixed(2)));
    if(next===chosen.price)return;
    moved[chosen.key]=chosen.newPrice=next;
    if(mode!=='paused')mode='changed';
    render();
  },5000);
}
