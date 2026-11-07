let undoPicks=null;
const regularDrop=dropLeg;
dropLeg=function(index){undoPicks={legs:legs.map(l=>({...l})),stake:parlayStake};regularDrop(index)};
function clearCombo(){undoPicks={legs:legs.map(l=>({...l})),stake:parlayStake};legs=[];parlayStake='';proposedLeg=null;invalidateCombo();render()}
function recoverCombo(){
 if(!undoPicks)return;
 legs=undoPicks.legs;parlayStake=undoPicks.stake;undoPicks=null;
 needsQuote.parlay=true;reviewedQuote='';parlayPlaced=false;render();
}
const corePanel=parlayPanel;
parlayPanel=function(){
 let html=corePanel();
 if(parlayPlaced)return html;
 return html+'<div class="draftTools">'+(legs.length?btn('Clear draft','clearCombo()'):'')+
 (undoPicks?btn('Undo removal & recheck','recoverCombo()'):'')+
 '<details><summary>If a leg is void</summary><p>Example: on a 10 USDT demo combo, if only a winning 2.00 leg remains, the return is 20 USDT. We reprice remaining legs using the demo rule. If all legs are void, the stake returns.</p></details></div>';
};
const historyFilters=['All outcomes','Cash-out eligible','Live','Won','Lost','Void','Cashed out'];
let historyFilter='All outcomes', cashOffer=null, historyReturn=null;
function passesReceipt(b,label){return label==='All outcomes'||(label==='Cash-out eligible'?b.state==='Open':label==='Live'?b.state==='Open'&&events[b.id]?.[3]:b.result===label)}
function scopedTickets(){
 const from=new Date();from.setHours(0,0,0,0);from.setDate(from.getDate()-({'Last 7 days':6,'Last 30 days':29}[receiptRange]||0));
 return bets.filter(b=>(receiptSport==='All sports'||ticketSport(b)===receiptSport)&&(receiptRange==='All time'||b.placedAt>=+from));
}
function exportReceipt(index){
 const b=bets[index];
 const data={reference:b.ticketId,fixture:b.fixture,selection:b.name,odds:b.price,stake:b.stake,currency:'demo USDT',state:b.state,
 result:b.result,amount:b.return,placedAt:b.placedAt,settledAt:b.settledAt,legs:b.legs?.map(l=>({fixture:l.fixture,selection:l.name,odds:l.price,result:l.outcome})),timeline:b.timeline};
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
 const link=document.createElement('a');link.href=url;link.download=b.ticketId+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function ticketRef(b){if(!b.ticketId){b.ticketId='PB-'+crypto.randomUUID().slice(0,8).toUpperCase();persist()}return b.ticketId}
async function copyTicket(index){try{await navigator.clipboard.writeText(ticketRef(bets[index]));announceUpdate('Ticket reference copied')}catch{announceUpdate('Select the ticket reference to copy it')}}
function newOffer(i,previous=null){
 const b=bets[i],price=Number((b.stake*(previous?.price===Number((b.stake*.88).toFixed(2)) ? .84 : .88)).toFixed(2));
 cash=i;cashOffer={i,price,old:previous?.price,expires:Date.now()+30000};
 recordEvent(b,'Cash-out offer · '+price.toFixed(2)+' USDT');persist();render();
}
cashOut=function(i){
 const b=bets[i];if(b?.state!=='Open')return;
 if(cash!==i||cashOffer?.i!==i){newOffer(i);return}
 if(Date.now()>=cashOffer.expires){newOffer(i,cashOffer);return}
 b.result='Cashed out';b.state='Settled';b.settledAt=Date.now();b.return=cashOffer.price.toFixed(2);
 recordEvent(b,'Cashed out · Returned '+b.return+' USDT');status='Settled';historyFilter='All outcomes';cash=-1;cashOffer=null;
 persist();resultAlert(b);render();
};
const baseReceipt=receiptRow;
receiptRow=function(b,i){
 if(!passesReceipt(b,historyFilter))return '';
 ticketRef(b);
 const div=document.createElement('div');div.innerHTML=baseReceipt(b,i);
 const article=div.firstElementChild;
 if(cash===i&&cashOffer?.i===i && b.state==='Open'){
 const action=article.querySelector('.receiptAction');action.innerHTML='<span>'+E(b.ticketId)+' · '+(cashOffer.old!==undefined?'Previous '+cashOffer.old.toFixed(2)+' USDT → ':'')+
 'Offer '+cashOffer.price.toFixed(2)+' USDT · Expires '+new Date(cashOffer.expires).toLocaleTimeString()+'</span>'+
 btn('Confirm cash out · '+cashOffer.price.toFixed(2)+' USDT','cashOut('+i+')')+btn('Cancel','cash=-1;render()')+
 '<details><summary>Sample offer update</summary>'+btn('Change offer','newOffer('+i+',cashOffer)')+'</details>';
 }
 article.insertAdjacentHTML('beforeend','<div class="receiptAction">'+btn('Copy reference','copyTicket('+i+')')+btn('Save receipt','exportReceipt('+i+')')+'</div>');
 if(b.score&&events[b.id]?.[3])article.querySelector('.receiptCell:nth-child(2)').insertAdjacentHTML('beforeend','<small>Current score · '+E(events[b.id][4])+'</small>');
 return article.outerHTML;
};
const originalHistory=flightHistory;
flightHistory=function(){
 const tickets=scopedTickets(),total=tickets.reduce((n,b)=>n+b.stake,0),settled=tickets.filter(b=>b.state==='Settled'),
 paid=settled.reduce((n,b)=>n+Number(b.return),0),cost=settled.reduce((n,b)=>n+b.stake,0);
 return '<div class="historyTotals">Staked '+total.toFixed(2)+' · Returned '+paid.toFixed(2)+' · Settled net '+(paid-cost).toFixed(2)+' USDT</div>'+
 '<label>Outcome <select onchange="historyFilter=this.value;render()">'+historyFilters.map(s=>'<option value="'+s+'" '+(historyFilter===s?'selected':'')+'>'+s+' ('+tickets.filter(b=>b.state===status&&passesReceipt(b,s)).length+')</option>').join('')+'</select></label>'+originalHistory();
};
document.addEventListener('click',e=>{
 const link=e.target.closest('.historyReceipt a');
 if(!link)return;
 historyReturn={page:p,status,receiptRange,receiptSport,historyFilter,drawer:drawerOpen,y:scrollY,inner:document.querySelector('.betsDrawer')?.scrollTop||0};
},true);
window.addEventListener('hashchange',e=>{
 if(!historyReturn||p!==historyReturn.page||!new URL(e.oldURL).hash.startsWith('#6/match/'))return;
 const h=historyReturn;historyReturn=null;status=h.status;receiptRange=h.receiptRange;receiptSport=h.receiptSport;historyFilter=h.historyFilter;drawerOpen=h.drawer;render();window.scrollTo(0,h.y);
 if(drawerOpen)document.querySelector('.betsDrawer').scrollTop=h.inner;
});
const regularPlace=place;
place=function(){
 if(ed!==6)return regularPlace();
 if(!feedConnected||Number(stakes)>remainingBudget()){notice=!feedConnected?'Feed offline. Reconnect before placing.':'Stake exceeds your session budget.';render();return}
 const before=bets.length;regularPlace();
 if(bets.length>before){ticketRef(bets[0]);recordEvent(bets[0],'Placed · '+bets[0].price.toFixed(2)+'×');persist()}
};
window.place=place;
const regularComboPlace=placeParlay;
placeParlay=async function(){
 if(!feedConnected||Number(parlayStake)>remainingBudget()){builderNote=!feedConnected?'Feed offline. Reconnect before placing.':'Stake exceeds your session budget.';render();return}
 const before=bets.length;await regularComboPlace();if(bets.length>before)undoPicks=null;
};
const originalGrade=gradeLeg;
gradeLeg=function(i,k,state){const open=bets[i]?.state==='Open';originalGrade(i,k,state);if(open&&bets[i].state==='Settled')resultAlert(bets[i])};
