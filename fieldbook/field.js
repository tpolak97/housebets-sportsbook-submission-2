
const books=[
 ['The Tide Table','Find the next whistle','First Whistle','Mooring tag'],
 ['Club Cabinet','Make a shelf of favorites','Club of the Week','Scorebook entry'],
 ['Night Frequency','Tune into a live station','The Night Shift','Cue channel'],
 ['Market Kitchen','Start with a question','Question of the Day','Order pad'],
 ['Switchyard','Compare a single market','The Derby Line','Quote review'],
 ['Pocket Turnstile','Carry the fixture with you','Weekend Programme','Single stub']
];
editions.splice(0,editions.length,...books.map(b=>[b[0],b[1],'#9de8d3','#164648']));
const catalog=Object.keys(glyphs);
catalog.filter(s=>!sports.includes(s)).forEach((s,i)=>{
 sports.push(s);leagues.push(s==='American Football'?'NFL':s+' Invitational');
 events.push(['Beacon '+(i+1),'Cove '+(i+2),leagues.length-1,i%3?0:12,i%3?'18:40':'1–0']);
});
all.splice(0,all.length,...events.keys());live.splice(0,live.length,...all.filter(i=>events[i][3]));soon.splice(0,soon.length,...all.filter(i=>!events[i][3]).sort((a,b)=>events[a][4].localeCompare(events[b][4])));
let period='In play',question=1,pass=0,step=1,esports=false,promo=false,lastBook=-1;
const current=()=>all.filter(i=>sport==='All'||sportOf(events[i])===sport);
const pad=i=>String(i+1).padStart(2,'0');
const titleOf=i=>events[i].slice(0,2).join(' v ');
function chips(values,chosen,action){return `<div class="chips">${values.map((v,i)=>btn(v,action(i),i===chosen?'active':'')).join('')}</div>`}
function sportsMenu(){
 const cut=catalog.indexOf('Arena of Valor'),choices=esports?catalog.slice(cut):catalog.slice(0,cut);
 return `<details class="menu"><summary>Sport directory · ${sport}</summary>${chips(['Sports','Esports'],+esports,i=>`esports=${!!i};render();document.querySelector('.menu').open=true`)}<div class="iconGrid">${choices.map(s=>btn(icon(s)+`<span>${s}</span>`,`selectSport('${s}')`,sport===s?'active':'')).join('')}</div></details>`;
}
function selectSport(s){sport=s;pass=0;render()}
function marketRow(i,g){return `<article class="card row"><a href="${href('match',i)}">${clock(events[i])}<strong>${titleOf(i)}</strong></a>${prices(i,g)}</article>`}
function timeline(){
 const stages=['In play','Next 15 min','Later today'];
 const a=current().filter(i=>period==='In play'?events[i][3]:!events[i][3]&&(period==='Next 15 min'?events[i][4]<='18:30':events[i][4]>'18:30'));
 return `<div class="tides">${chips(stages,stages.indexOf(period),i=>`period='${stages[i]}';render()`)}<small>Sample local time · 18:15</small>${a.slice(0,12).map(i=>`<div class="stop"><b>${events[i][3]?'NOW':events[i][4]}</b>${row(i)}</div>`).join('')||'<p>No fixtures in this window.</p>'}</div>`;
}
function cabinet(){
 const shelf=current().filter(i=>events[i].slice(0,2).some(x=>favs.includes(x))||favs.includes(leagues[events[i][2]]));
 return `<div class="shelves"><h2>Your badge shelf</h2><div class="badges">${['Arsenal','Brighton',...leagues.slice(0,5)].map((s,i)=>btn(`<span class="patch">${s.slice(0,2).toUpperCase()}</span><b>${s}</b><small>${favs.includes(s)?'★ Following':'＋ Follow'}</small>`,`follow('${s}')`)).join('')}</div></div>${heading('Your fixtures')}${rows(shelf)||'<p>Follow a badge above to stock your shelf.</p>'}`;
}
function radio(){
 let stations=['Football','Basketball','Dota 2','Counter-Strike 2','Tennis'];
 let channel=sport==='All'?'Football':sport;
 let feed=all.filter(i=>sportOf(events[i])===channel);
 return `<div class="radio"><div class="k">Housebets FM · Channel guide</div><div class="dial">${stations.map((s,i)=>btn(`<small>CH ${pad(i)}</small>${icon(s)}<b>${s}</b>`,`selectSport('${s}')`,channel===s?'active':'')).join('')}</div><div class="air">${feed.some(i=>events[i][3])?'ON AIR':'UP NEXT'} &nbsp; / &nbsp; ${channel}</div>${rows(feed.slice(0,3))}</div>`;
}
const questions=['Who will win?','How many goals?','Who will score?'],indices=[0,1,4];
function kitchen(){
 let g=indices[question],eligible=current().filter(i=>!g||events[i][2]<5);
 return `<section class="recipe"><small>THE MARKET MENU</small><h2>What would you like to know?</h2><div class="questions">${questions.map((s,i)=>btn(`<i>0${i+1}</i>${s}`,`question=${i};render()`,question===i?'active':'')).join('')}</div></section>${heading(markets[g])}${eligible.slice(0,6).map(i=>marketRow(i,g)).join('')||'<p>No matching fixtures for this question.</p>'}`;
}
function yard(){
 let g=indices[question],items=current().filter(i=>!g||events[i][2]<5);
 return `<section class="yard"><small>SWITCHBOARD / MARKET SELECTOR</small>${chips(indices.map(i=>markets[i]),question,i=>`question=${i};render()`)}${items.slice(0,8).map(i=>marketRow(i,g)).join('')}</section>`;
}
function turnstile(){
 let list=current(),i=list[pass%list.length];if(i===undefined)return 'No fixtures.';
 return `<article class="pocket"><div class="stubno">ADMIT ONE <b>${pad(pass%list.length)}</b> / ${list.length}</div><div class="passface">${icon(sportOf(events[i]))}<small>${leagues[events[i][2]]}</small><h2>${titleOf(i)}</h2>${clock(events[i])}${prices(i)}${link('match','Open all markets →',i)}</div></article>${chips(['← Previous','Next pass →'],-1,k=>`pass=(pass+${k?1:list.length-1})%${list.length};render()`)}<details><summary>Browse fixture index</summary>${list.map((i,k)=>btn(titleOf(i),`pass=${k};render()`)).join('')}</details>`;
}
function campaign(){
 let actions=[`period='Next 15 min';sport='All';render()`,`follow('Arsenal')`,`selectSport('Dota 2')`,`question=1;sport='Football';render()`,`question=0;sport='Football';render()`,`sport='Football';pass=1;render()`];
 let copy=['See fixtures kicking off by 18:30','Pin or unpin the Arsenal patch','Tune to the Dota 2 station','Explore total-goals markets','Compare football match results','Open the second weekend pass'];
 return `<details class="promotion"><summary>${books[ed][2]} &nbsp; ↗</summary>${btn(copy[ed],actions[ed])}</details>`;
}
home=()=>`<p class="k">Housebets Fieldbook / ${pad(ed)}</p><h1>${books[ed][0]}</h1><p>${books[ed][1]}</p>${search()}<div id="found">${q?results():sportsMenu()+(sport==='All'?'':btn('All sports ×',`selectSport('All')`))+[timeline,cabinet,radio,kitchen,yard,turnstile][ed]()+campaign()+section('Live now',current().filter(i=>events[i][3]).slice(0,3))+section('Starting soon',current().filter(i=>!events[i][3]).slice(0,3))+heading('Football competitions')+leagueNav()}</div>`;
sportNav=()=>`<label>Sport <select onchange="selectSport(this.value)">${['All',...catalog].map(s=>`<option ${s===sport?'selected':''}>${s}</option>`).join('')}</select></label>`;
const oldTicket=ticket,oldPick=pick;
pick=(...args)=>{step=1;oldPick(...args)};
ticket=()=>{
 let html=oldTicket().replace('Bet slip',books[ed][3]);
 if(!slip)return html;
 let intro=[`TIME TAG · ${events[slip.id][3]?'LIVE':events[slip.id][4]}`,'SCOREBOOK / DRAFT',mode==='paused'?'CHANNEL MUTED':'CHANNEL LOADED','ORDER '+step+' / 3','ACCEPTED QUOTE','DETACHABLE / DRAFT'];
 html=html.replace('<div class="ticket">',`<div class="ticket">${`<small class="slipstamp">${intro[ed]}</small>`}`);
 if(ed===4&&mode==='changed')html=html.replace('Accept new odds',`Accept ${slip.newPrice.toFixed(2)} · return ${(slip.newPrice*Number(stakes||0)).toFixed(2)} USDT`);
 if(ed===3 && step<3){
  return `<h3>Order pad</h3><div class="ticket"><small>STEP ${step} OF 3</small><h3>${step===1?'What did you pick?':'How much?'}</h3><b>${slip.name}</b><p>${slip.fixture} · ${slip.price.toFixed(2)}</p>${step===2?`<label>Stake in USDT<input type="number" value="${E(stakes)}" oninput="amount(this.value)"></label><span>Potential return <b class="return">${ret()}</b> USDT</span>`:''}<p>${btn(step===1?'Choose stake →':'Review single →',`step++;render()`,'cta')}${btn('Remove','removePick()')}</p></div>`;
 }
 return html;
};
const oldMatch=match;
match=()=>oldMatch().replace('<div class="hero">',`<div class="hero matchhead"><small>${['Tide marker','Club folio','On air','Market menu','Switchboard','Match pass','Live desk','Club journal','Price board'][ed]} / ${pad(id)}</small>${icon(sportOf(events[id]))}`).replace('<h2>Match markets</h2>',`<h2>${['Fixture markets','Facing page · Markets','Market channels','Question index','Market switches','Inside the pass','Live match markets','Matchday markets','Compare markets'][ed]}</h2>`);
gallery=()=>`<header><img src="housebets.png" width="134" alt="Housebets"><small>Playable fieldbook</small></header><main class="gallery"><p class="k">Housebets / Six playable directions</p><h1>Choose your matchday.</h1><div class="collection">${books.slice(0,6).map((b,i)=>`<a href="#${i}/home/0"><div class="preview v${i}">${['≈','★','▥','✳','⇄','▧'][i]}</div><div><small>BOOK ${pad(i)}</small><strong>${b[0]}</strong><p>${b[1]} →</p></div></a>`).join('')}</div></main>`;
const oldRender=render;
render=()=>{
 if(theme&&ed!==lastBook){lastBook=ed;pass=0;period='In play';question=ed===4?0:1;step=1}
 document.body.dataset.book=theme?ed:'gallery';oldRender();
};
Object.assign(window,{pick,render,selectSport});route();

