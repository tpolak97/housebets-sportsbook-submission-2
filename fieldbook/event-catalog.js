const sampleUpdates=new Map();
let feedConnected=true;
const demoFeedStart=Date.now();
const races=[
 {meeting:'Willow Park',time:'18:35',runners:['Copper Comet','Vale Runner','Silver Fir','Dock Lantern'],prices:[2.8,3.4,4.6,6.2]},
 {meeting:'Northgate Downs',time:'19:10',runners:['Moor Finch','Amber Tide','Night Harbour','Fern Vale'],prices:[2.5,3.9,4.9,7.1]}
];
for(const race of races){
 race.id=events.length;
 const f={id:'race-'+race.time,sport:'Horse Racing'};
 const e=[race.meeting,'Race winner',leagues.indexOf('Horse Racing Invitational'),0,race.time];
 events.push(e);feedEvents.set(e,f);all.push(race.id);soon.push(race.id);
}
const raceFor=i=>races.find(r=>r.id===i);
function raceMeetings(){
 return '<section><h2>Race meetings</h2>'+races.filter(r=>league==='All'||leagues[events[r.id][2]]===league).map(r=>'<a class="raceLink" href="'+href('match',r.id)+'"><b>'+E(r.meeting)+'</b> · '+r.time+' · '+r.runners.length+' runners →</a>').join('')+'</section>';
}
function extraPick(i,g,k,name,market,price){
 const leg=selection(i,g,k,name,market,price);
 if(parlayMode)toggleLeg(leg);
 else{slip=leg;mode='normal';notice='';tab='Slip';render()}
}
function racePage(r){
 return '<a href="'+href('home')+'">← Sports home</a><h1>'+E(r.meeting)+'</h1><p>Horse Racing · '+r.time+' · Win only</p>'+slipModes(true)+
 '<section class="market"><h3>Race winner</h3><p>Pick the runner that finishes first.</p>'+r.runners.map((n,k)=>btn((k+1)+'. '+E(n)+'　'+formatOffer(r.prices[k]),
 'extraPick('+[r.id,200,k,JSON.stringify(n),JSON.stringify('Race winner'),r.prices[k]].join(',')+')',isChosen(r.id,200,k)?'chosen':'raceLink')).join('')+'</section>';
}
const basicMatch=match;
match=function(){const r=raceFor(id);return ed===6&&r?racePage(r):basicMatch()};
const normalHomeWithEvents=home;
home=function(){return ed===6&&sport==='Horse Racing'?referenceSearch()+discoveryNav()+fixtureSportRail()+raceMeetings():normalHomeWithEvents()};
function normalizeTerm(value){
 return value.toLowerCase().replace(/\bsoccer\b/g,'football').replace(/\bepl\b/g,'premier league').replace(/\bucl\b/g,'champions league').replace(/\bcs2\b/g,'counter-strike 2').trim();
}
const oldResults=results;
results=function(){
 if(ed!==6)return oldResults();
 const term=normalizeTerm(q), sections=new Map();
 function add(section,i,label,groupIndex){
   if(!sections.has(section))sections.set(section,new Map());
   const key=i+'/'+label;if(sections.get(section).has(key))return;
   const action=groupIndex===undefined?'':' onclick="group='+groupIndex+';marketTerm=\'\'"';
   sections.get(section).set(key,'<a class="searchHit" href="'+href('match',i)+'"'+action+'>'+E(label)+'<small>'+E(events[i].slice(0,2).join(' v '))+' →</small></a>');
 }
 for(const i of all){
   const e=events[i],test=s=>normalizeTerm(s).includes(term);
   e.slice(0,2).filter(test).forEach(n=>add('Teams & competitors',i,n));
   if(test(leagues[e[2]])||test(sportOf(e)))add('Competitions',i,leagues[e[2]]);
   for(const m of playerLines(i))if(test(m.player))add('Players',i,m.player+' · '+m.team+' · '+(e[2]<5||i===international?'Forward':'Player'),7);
   if(!raceFor(i))(isFootball(e)&&!feedEvents.has(e)?markets:markets.slice(0,1)).forEach((m,g)=>{if(test(m))add('Markets',i,m,[0,1,2,3,4,5,5][g])});
   if(raceFor(i))raceFor(i).runners.filter(test).forEach(n=>add('Runners',i,n));
 }
 return '<h2>Search results</h2>'+([...sections].map(([title,hits])=>'<section><h3>'+title+'</h3>'+[...hits.values()].slice(0,24).join('')+'</section>').join('')||'<p>No matching teams, competitions, players or markets.</p>');
};
function contextCard(i){
 const e=events[i],name=sportOf(e),score=e[4],feed=sampleUpdates.get(i);
 const descriptions={
 Tennis:'Sets won 1–0 · Current set games '+score+' · Current game points 30–15',
 Baseball:'Bottom of seventh · One out · Runs '+score,
 'Dota 2':'Series 1–0 · Map 2, River Gate · Map kills '+score,
 'Counter-Strike 2':'Series 1–0 · Map 2, Foundry · Rounds '+score
 };
 const info=descriptions[name]||((briefs.get(e)||'In play')+' · Score '+score);
 return '<details class="eventContext"><summary>'+E(name)+' · '+(feedConnected?'Score as of ':'Last known score · offline ')+new Date(feed?.at||demoFeedStart).toLocaleTimeString()+'</summary><p>'+E(info)+'</p>'+
 (feed?'<small class="scoreChange">'+E(feed.text)+'</small>':'')+btn('Advance sample score','advanceScore('+i+')')+btn(feedConnected?'Disconnect sample feed':'Reconnect sample feed','toggleFeed()')+'</details>';
}
function advanceScore(i){
 if(!feedConnected)return;
 const e=events[i],parts=e[4].split(/[–-]/).map(Number);
 if(parts.length!==2||!parts.every(Number.isFinite))return;
 const previous=e[4];parts[0]++;e[4]=parts.join('–');sampleUpdates.set(i,{at:Date.now(),text:e[0]+' scored · '+previous+' → '+e[4]});
 render();announceUpdate(sampleUpdates.get(i).text);
}
function toggleFeed(){feedConnected=!feedConnected;invalidateCombo();render();announceUpdate(feedConnected?'Sample feed reconnected':'Feed offline. Placement paused.')}
function aliasDefinitions(){
 return '<section class="marketRulebook" aria-labelledby="marketRulebookTitle">' +
   '<div class="marketRulebookHead"><div><span class="marketRulebookEyebrow">Demo rulebook · v1</span><h2 id="marketRulebookTitle">Market terms & settlement</h2></div><span class="marketRulebookSource">Source: local sample results</span></div>' +
   '<div class="marketRulebookBody"><div><h3>Market terms</h3><dl>' +
   '<div><dt>1X2</dt><dd>Choose home win, draw, or away win.</dd></div>' +
   '<div><dt>Moneyline</dt><dd>Choose the winner.</dd></div>' +
   '<div><dt>Handicap</dt><dd>Apply the stated head start before comparing scores.</dd></div>' +
   '<div><dt>Total</dt><dd>Compare the combined score with the stated line.</dd></div>' +
   '</dl></div><div><h3>Settlement</h3><ul>' +
   '<li>Football includes normal time and stoppage time.</li>' +
   '<li>Basketball full-game lines include overtime.</li>' +
   '<li>Period lines count only the period named on the market.</li>' +
   '<li>A tie on a whole-number handicap or total returns the stake.</li>' +
   '</ul></div></div></section>';
}
let propOrder='Player';
const oldPlayerMarkets=playerMarkets;
playerMarkets=function(i,term){
 const html=oldPlayerMarkets(i,term);if(!html)return '';
 const div=document.createElement('div');div.innerHTML=html;
 const cards=[...div.querySelectorAll('section')],groupsBy=new Map();
 for(const card of cards){const parts=card.querySelector('h3').textContent.split(' · ');const key=parts[propOrder==='Player'?0:1];
 if(!groupsBy.has(key))groupsBy.set(key,[]);groupsBy.get(key).push(card.outerHTML)}
 return '<h2>Player markets</h2><label>Group by <select onchange="propOrder=this.value;render()">'+choices(['Player','Statistic'],propOrder)+'</select></label>'+
 [...groupsBy].map(([label,cards])=>'<section><h3>'+E(label)+'</h3>'+cards.join('')+'</section>').join('');
};
const altLines=[1.5,3.5,4.5];
function altPrice(n,k){return Number((k?2.4-n*.35:1.45+n*.7).toFixed(2))}
function alternativeMarkets(i){
 const selected=[...legs,...(slip?[slip]:[])].filter(l=>l.id===i&&l.g>=300&&l.g<303).map(l=>l.name);
 return '<details class="market"><summary>Alternative goal totals'+(selected.length?' · '+E(selected.join(', ')):'')+'</summary>'+
 altLines.map((line,n)=>'<p>'+line+' goals</p><div class="prices">'+['Over','Under'].map((side,k)=>{
 const label=side+' '+line,price=altPrice(n,k);
 return btn(label+' · '+formatOffer(price),'extraPick('+[i,300+n,k,JSON.stringify(label),JSON.stringify('Alternative total goals'),price].join(',')+')',isChosen(i,300+n,k)?'chosen':'')
 }).join('')+'</div>').join('')+'</details>';
}
// Supply a starting-soon example for every sport that has only live samples.
for(const name of catalog){
 if(soon.some(i=>sportOf(events[i])===name))continue;
 const index=all.find(i=>sportOf(events[i])===name);if(index===undefined)continue;
 const e=[events[index][1],events[index][0],events[index][2],0,'00:20'];
 feedEvents.set(e,{id:'demo-next-'+catalog.indexOf(name),sport:name,resultOdds:name==='Football'?[2.15,3.4,2.8]:[1.86,2.05]});
 const i=events.push(e)-1;soon.push(i);all.push(i);
}
const nativeQuote=currentQuote;
currentQuote=function(l){
 const k=Number(l.key.split(',')[2]);
 if(events[l.id]?.slice(0,2).join(' v ')!==l.fixture)return null;
 if(l.g===200)return raceFor(l.id)?.prices[k]??null;
 if(l.g>=300&&l.g<303)return moved[l.key]??altPrice(l.g-300,k);
 return nativeQuote(l);
};

// Append new demo events to preserve existing fixture and receipt identifiers.
const collegeLeague = leagues.push('NCAA') - 1;
const collegeFixture = ['Lake State Falcons','Prairie Tech Foxes',collegeLeague,0,'18:30'];
feedEvents.set(collegeFixture,{id:'college-football-demo',sport:'American Football',resultOdds:[1.85,2.1]});
const collegeId = events.push(collegeFixture) - 1;
all.push(collegeId);
soon.push(collegeId);
