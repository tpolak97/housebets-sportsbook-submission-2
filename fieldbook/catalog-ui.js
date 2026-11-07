const periodClock=window.fixturePeriod;
window.fixturePeriod=e=>{
 if(ed!==6||e[3])return periodClock?.(e)||'';
 const i=events.indexOf(e);if(i<0)return '';
 const t=sampleStart(i);
 return '<small>Kickoff · '+E(t.toLocaleString(undefined,{weekday:'short',hour:'2-digit',minute:'2-digit'}))+'</small>';
};
const defaultPrices=prices;
prices=function(i,g=0){return raceFor(i)?link('match','View runners →',i):defaultPrices(i,g)};
const regularBrowse=browseEvents;
browseEvents=function(){
 let html=regularBrowse();
 if(p==='favorites'){
 for(const i of all){const key=favoriteKey(i),e=events[i];
 const why=favs.includes(key)?'Saved match':favs.includes(leagues[e[2]])?'Following '+leagues[e[2]]:e.slice(0,2).filter(n=>favs.includes(n)).map(n=>'Following '+n).join(', ');
 if(why)html=html.replace('href="'+href('match',i)+'">','href="'+href('match',i)+'"><small>'+E(why)+'</small>');
 }}
 if(p==='upcoming'&&html.includes('No matches in this window')){
 const t=new Date(sessionStart);t.setHours(18,15,0,0);
 const next=soon.filter(i=>sport==='All'||sportOf(events[i])===sport).filter(i=>sampleStart(i)>=t).sort((a,b)=>sampleStart(a)-sampleStart(b))[0];
 if(next!==undefined)html+='<p>Next kickoff · '+link('match',E(events[next].slice(0,2).join(' v ')),next)+' · '+clock(events[next])+'</p>'+btn('Show all upcoming','upcomingWindow=0;render()');
 }
 return html;
};
const standardMarkets=flightMarkets;
flightMarkets=function(term=marketTerm){
 let html=standardMarkets(term);
 if(isFootball(events[id])&&!feedEvents.has(events[id])&&(!term||/goal|total|over|under/i.test(term))&&[0,1].includes(group))html+=alternativeMarkets(id);
 return html;
};
const regularMarketTabs=marketTabs;
marketTabs=function(e){return regularMarketTabs(e)+btn(prefs.favourites[sportOf(e)]===group?'★ Pinned group':'☆ Pin this group',
 'option("favourites",{...prefs.favourites,['+JSON.stringify(sportOf(e))+']:group})')};
const originalExtrasRender=render;
let lastDetail=-1;
render=function(){
 if(ed!==6){originalExtrasRender();return}
 if(p==='match'&&lastDetail!==id){
   const saved=prefs.favourites[sportOf(events[id])];if(saved!==undefined)group=saved;
   lastDetail=id;lastFixture={id,group};sessionStorage.setItem('beta.fl.lastFixture',JSON.stringify(lastFixture));
 }else if(p==='match'){lastFixture={id,group};sessionStorage.setItem('beta.fl.lastFixture',JSON.stringify(lastFixture))}
 else lastDetail=-1;
 originalExtrasRender();
 document.body.classList.toggle('compactMode',prefs.density==='Compact list');
 document.body.classList.toggle('largeType',prefs.type);
 if(lastFixture&&p!=='match')document.querySelector('main')?.insertAdjacentHTML('beforeend',link('match','Resume '+E(events[lastFixture.id]?.slice(0,2).join(' v ')||'match')+' →',lastFixture.id).replace('<a ','<a class="resumeMatch" onclick="group='+Number(lastFixture.group)+'" '));
 if(p==='match'){
 document.querySelectorAll('#flightMarkets .market').forEach(card=>{
 const title=card.querySelector('h3')?.textContent||'',period=title.match(/^(Quarter|Set|Inning|Map) (\d+)/);
 if(period)card.querySelectorAll('.prices button').forEach(b=>b.insertAdjacentHTML('afterbegin','<small class="periodChip">'+E(period[0])+'</small>'));
 });
 }
 if(!feedConnected)document.querySelector('main')?.insertAdjacentHTML('afterbegin','<div class="conflictBox">Feed offline · last known scores. Placement paused. '+btn('Reconnect','toggleFeed()')+'</div>');
 if(!feedConnected)document.querySelectorAll('.prices button,.placeFlight,.placeParlay').forEach(b=>b.disabled=true);
 if(drawerOpen||sheet||desktopSlip){
 const ticket=document.querySelector('.flightTicket');if(ticket&&prefs.budget)ticket.insertAdjacentHTML('afterbegin','<p>Session budget remaining · '+remainingBudget().toFixed(2)+' USDT</p>');
 }
 addBannerControls();
 document.querySelector('.railDirectory')?.classList.toggle('iconsOnly',!prefs.labels);
 if(playerPanel){app.insertAdjacentHTML('beforeend',playerSettings());const d=document.querySelector('#playerOptions');d.oncancel=()=>{playerPanel=false};d.showModal()}
};
function addBannerControls(){
 const banner=document.querySelector('.promoControls');
 if(banner)banner.insertAdjacentHTML('beforeend',btn('‹','promoStep(refPromoIndex-1)').replace('<button ','<button aria-label="Previous banner" ')+btn(prefs.auto?'Ⅱ':'▶','option("auto",!prefs.auto)').replace('<button ','<button aria-label="'+(prefs.auto?'Pause':'Play')+' banners" ')+btn('›','promoStep(refPromoIndex+1)').replace('<button ','<button aria-label="Next banner" '));
}
window.render=render;
document.addEventListener('keydown',e=>{
 if(ed!==6||!e.altKey||!['1','2','3'].includes(e.key))return;
 e.preventDefault();
 if(e.key==='1'){const trigger=document.querySelector('.directoryTrigger');(trigger?.offsetWidth?trigger:document.querySelector('.railDirectory button'))?.focus()}
 if(e.key==='2'){const input=document.querySelector('[aria-label="Search markets or players"]');if(input)input.focus();else showRefSearch()}
 if(e.key==='3'){if(matchMedia('(max-width:750px), (pointer:coarse) and (orientation:landscape) and (max-width:960px)').matches){sheet=true;render()}else if(!desktopSlip)openDeskSlip()}
});
let previousPrices=new Map();
const refreshVisiblePrices=()=>{
 const next=new Map();
 for(const button of document.querySelectorAll('.prices button[onclick]')){
 const key=button.getAttribute('onclick'),digit=button.querySelector('b');if(!digit)continue;
 const value=digit.textContent;next.set(key,value);
 if(previousPrices.has(key)&&previousPrices.get(key)!==value)digit.classList.add('changedPrice');
 }
 previousPrices=next;
};
const withPriceUpdates=render;
render=function(){withPriceUpdates();if(ed===6)refreshVisiblePrices()};
window.render=render;
function fitSheet(){document.documentElement.style.setProperty('--availableHeight',(visualViewport?.height||innerHeight)+'px')}
window.visualViewport?.addEventListener('resize',fitSheet);fitSheet();
restoreDraft();render();
