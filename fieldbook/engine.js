const feedEvents=new WeakMap();
function isFootball(e){if(feedEvents.has(e))return feedEvents.get(e).sport==="Football";return e[2]<5 || leagues[e[2]]==='International friendly'}

const editions=[
['Breakwater','A live match leads; the rest of the slate follows.','#9ef2dc','#16484e'],
['Touchline','Read the day as a kickoff timeline.','#f9cc81','#553b24'],
['The Sporting Post','A lead story and a two-column fixture edition.','#f4d9a9','#454037'],
['Signal Room','A compact board for scanning live scores.','#a5f487','#244833'],
['Clubhouse','Follow a club and make its fixtures your front page.','#ffa8bd','#593148'],
['Atlas','Enter through a competition directory.','#a9c7ff','#273e62'],
['Court Switch','Start with a sport, then browse its fixtures.','#d8b1ff','#432f60'],
['Double Header','Two headline fixtures share the front row.','#ffb798','#59382f'],
['Find the Match','Search by team, player, league or market first.','#8ce5f8','#174858'],
['Ticket Office','Start with a ticket and return to its match.','#ffe489','#51492c']];
const leagues=['Premier League','Champions League','LaLiga','Serie A','Bundesliga','Harbor Cup','City Series'];
const events=[['Arsenal','Brighton',0,52,'1–0'],['Sporting CP','Napoli',1,0,'18:30'],['Celta Vigo','Real Sociedad',2,38,'0–1'],['Lazio','AC Milan',3,0,'18:45'],['Bayer Leverkusen','Eintracht Frankfurt',4,0,'19:00'],['Mira Cove','Neri Vale',5,0,'18:15'],['Harbor Five','East Stars',6,8,'42–39']];
const sports=['Football','Tennis','Basketball'],groups=['Popular','Goals','Halves','Handicaps','Goalscorers','Corners & cards'];
const markets=['Match result','Total goals','First half result','Goal handicap','Anytime goalscorer','Total corners','Total cards'];
// Beta v2: goalscorer markets name each side's real top scorer (football-players.js, loaded later and read at call time).
const scorerFor=t=>{const nat={France:'Kylian Mbappé',England:'Harry Kane'};if(nat[t])return nat[t];const c=typeof footballPlayers!=='undefined'?footballPlayers[typeof footballClub==='function'?footballClub(t):t]:null;const p=c&&c.players&&c.players.slice().sort((a,b)=>(b.goals||0)-(a.goals||0))[0];return p?p.name:t+' forward'};
const names=(e,g)=>g===1?['Over 2.5','Under 2.5']:g===3?[e[0]+' −1',e[1]+' +1']:g===4?[scorerFor(e[0]),scorerFor(e[1])]:g>=5?g===5?['Over 8.5','Under 8.5']:['Over 3.5','Under 3.5']:isFootball(e)?[e[0],'Draw',e[1]]:[e[0],e[1]];
let ed,p,id,theme,league='All',sport='All',group=0,q='',sheet=false,tab='Slip',status='Open',notice='',slip=null,stakes='',bets=[],favs=[],cash=-1,started=Date.now(),moved={},mode='normal';
const E=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const href=(page,i=0)=>`#${ed}/${page}/${i}`,link=(page,t,i)=>`<a href="${href(page,i)}">${t}</a>`,btn=(t,fn,cl='')=>`<button class="${cl}" onclick="${E(fn)}">${t}</button>`;
function art(n){const forms=[`<g fill="none" stroke="currentColor" stroke-width="4">${Array.from({length:12},(_,i)=>`<path d="M-20 ${30+i*10} Q70 ${-55+i*10} 130 ${50+i*10} T275 ${35+i*10}"/>`).join('')}</g>`,`<g fill="none" stroke="currentColor" stroke-width="3">${Array.from({length:10},(_,i)=>`<circle cx="140" cy="95" r="${12+i*10}"/>`).join('')}</g>`,`<g fill="currentColor">${Array.from({length:9},(_,i)=>`<path d="M${i*27} 190l85-200h12l-85 200z"/>`).join('')}</g>`];return `<svg class="art" viewBox="0 0 240 180" aria-hidden="true">${forms[n%3]}</svg>`}
const sportOf=e=>feedEvents.get(e)?.sport??(isFootball(e)?'Football':sports[e[2]-4]),clock=e=>window.fixturePeriod?.(e) || (e[3]?`<span class="badge">● LIVE · <time data-min="${e[3]}">${e[3]}′</time></span>`:`<small>Kickoff · ${e[4]}</small>`);
const odds=(i,g,k)=>moved[[i,g,k]]??(g===0?feedEvents.get(events[i])?.resultOdds[k]:undefined)??(window.betaExtraFixtures?.has(i)?+([1.95,3.5,3.85][k]+g*.12).toFixed(2):undefined)??+(g===0?([1.72,3.40,4.80][k]+i*.04):1.75+g*.12+k*.39).toFixed(2);
function prices(i,g=0){
  return '<div class="prices">'+names(events[i],g).map((name,k)=>{
    const singleSelected=slip?.key===String([i,g,k]);
    const selected=ed===6 && typeof isParlayPick==='function' && parlayMode ? isParlayPick(i,g,k) : singleSelected;
    const suspended=(i===2 && g===0) || (singleSelected && mode==='paused');
    return '<button '+(suspended?'disabled':'')+' class="'+(selected?'chosen':'')+
      '" onclick="pick('+[i,g,k].join(',')+')"><small>'+E(name)+'</small><b>'+
      (suspended?'Suspended':(ed===6&&typeof formatOffer==='function'?formatOffer(odds(i,g,k)):odds(i,g,k).toFixed(2)))+'</b></button>';
  }).join('')+'</div>';
}
function row(i){let e=events[i];return `<article class="row card"><a href="${href('match',i)}">${clock(e)} · <small>${leagues[e[2]]}</small><strong>${e[0]} <small>v</small> ${e[1]} ${e[3]?`<em>${e[4]}</em>`:''}</strong></a>${prices(i)}</article>`}
const rows=a=>a.map(row).join(''),all=events.map((_,i)=>i),live=all.filter(i=>events[i][3]),soon=all.filter(i=>!events[i][3]).sort((a,b)=>events[a][4].localeCompare(events[b][4]));
const heading=t=>`<h2>${t}</h2>`,section=(t,a)=>heading(t)+rows(a), hero=(title,sub,dest='match',i=0)=>`<div class="hero">${art(ed)}<span class="k">${sub}</span><h1>${title}</h1>${link(dest,dest==='match'?'Open match →':'Explore →',i)}</div>`;
function leagueNav(){return `<div class="chips">${leagues.slice(0,5).map((l,i)=>btn(l,`filterL(${i})`)).join('')}</div>`}
function sportNav(){return `<div class="chips">${['All',...sports].map((s,i)=>btn(['◉ All','⚽ Football','◍ Tennis','◈ Basketball'][i],`setSport(${i})`,sport===s?'active':'')).join('')}</div>`}
function search(){return `<input aria-label="Search sportsbook" placeholder="⌕   Search teams, players, competitions, markets" value="${E(q)}" oninput="query(this.value)">`}
function results(){let needle=q.toLowerCase(),out=[];events.forEach((e,i)=>{if([...e.slice(0,2),leagues[e[2]]].join(' ').toLowerCase().includes(needle))out.push(row(i));(isFootball(e)&&!feedEvents.has(e)?markets:markets.slice(0,1)).forEach((m,g)=>{if((m+' '+names(e,g).join(' ')).toLowerCase().includes(needle)&&!e.slice(0,2).some(x=>x.toLowerCase().includes(needle)))out.push(`<p>${link('match',`${m} · ${e[0]} v ${e[1]} →`,i).replace('<a ',`<a onclick="group=${g}" `)}</p>`)})});return heading('Search results')+(out.join('')||'No matches. Try Arsenal, Eli Fen or Total goals.')}
function home(){let by=a=>a.filter(i=>sport==='All'||sportOf(events[i])===sport);let focus=[
()=>hero('Arsenal v Brighton','Premier League • Live feature'),
()=>heading('Kickoff timeline')+section('Next up',by(soon)),
()=>hero('The matchday edition','Front page / Premier League')+`<div class="pair">${rows([0,1])}</div>`,
()=>heading('On air / Live board')+rows(by(live)),
()=>heading('Your clubhouse')+`<div class="slab">${btn(favs.includes('Arsenal')?'★ Following Arsenal':'☆ Follow Arsenal',`follow('Arsenal')`)} ${favs.join(' · ')||'Build your fixture list.'}</div>`+rows(all.filter(i=>events[i].some(x=>favs.includes(x))||favs.includes(leagues[events[i][2]]))),
()=>heading('Competition atlas')+leagueNav(),
()=>heading('Choose your court')+sportNav()+rows(by(all)),
()=>heading('The double header')+`<div class="pair">${rows([0,2])}</div>`,
()=>heading('Match finder')+`<div class="chips">${['Arsenal','Erling Haaland','Total goals'].map(x=>btn(x,`query('${x}');render()`)).join('')}</div>`,
()=>heading('Ticket window')+`<div class="slab">${link('bets','Review your sample tickets →')}<p>${bets.filter(b=>b.state==='Open').length} open · Singles only</p></div>`];return `<p class="k">Sports desk / Edition ${String(ed+1).padStart(2,'0')}</p><h1>${theme[0]}</h1>${search()}<div id="found">${q?results():focus[ed]()+ (ed!==6?sportNav():'')+(ed!==3?section('Live now',by(live)):'')+(ed!==1?section('Starting soon',by(soon)):'')+(ed!==5?heading('Top competitions')+leagueNav():'')}</div>`}
function listing(){let foot=p==='football',list=(foot?all:live).filter(i=>(!foot||isFootball(events[i]))&&(league==='All'||leagues[events[i][2]]===league)&&(foot||sport==='All'||sportOf(events[i])===sport));return `<div class="k">Sports desk / Browse</div><h1>${foot?'Football':'Live now'}</h1>${foot?'':sportNav()}<select aria-label="Competition" onchange="league=this.value;render()">${['All',...leagues.filter(l=>!foot||events.some(e=>leagues[e[2]]===l&&isFootball(e)))].map(x=>`<option ${x===league?'selected':''}>${x}</option>`).join('')}</select>${list.length?leagues.map(l=>{let a=list.filter(i=>leagues[events[i][2]]===l);return a.length?heading(l)+btn(favs.includes(l)?'★ Following':'☆ Follow competition',`follow(${JSON.stringify(l)})`)+rows(a):''}).join(''):section('Nothing live · Starting soon',soon.filter(i=>(sport==='All'||sportOf(events[i])===sport)&&(league==='All'||leagues[events[i][2]]===league)))}`}
function match(){let e=events[id],gs=isFootball(e)&&!feedEvents.has(e)?groups:['Popular'];let which=gs.length>1&&group===5?[5,6]:[Math.min(group,gs.length-1)];return `${link(isFootball(e)?'football':'live','← Fixtures')}<div class="hero">${art(ed)}<span class="k">${leagues[e[2]]}</span><h1>${e[0]} <small>v</small> ${e[1]}</h1><span class="score">${e[3]?e[4]:'Upcoming'}</span> ${clock(e)}</div><div class="chips">${e.slice(0,2).map(x=>btn((favs.includes(x)?'★ ':'☆ ')+x,`follow(${JSON.stringify(x)})`)).join('')}</div><h2>Match markets</h2><div class="chips">${gs.map((x,g)=>btn(x,`group=${g};render()`,group===g?'active':'')).join('')}</div>${which.map(g=>`<div class="market"><h3>${markets[g]}</h3>${prices(id,g)}</div>`).join('')}`}
function ticket(){return `<h3>Bet slip</h3><small>SINGLE · DECIMAL · DEMO USDT</small>${slip?`<div class="ticket"><b>${slip.name}</b><p><small>${slip.fixture} · ${markets[slip.g]}</small></p><strong class="big">${slip.price.toFixed(2)}</strong> ${btn('Remove','removePick()')}<hr><label>Stake in USDT<input type="number" min=".01" step=".01" value="${E(stakes)}" oninput="amount(this.value)"></label>Potential return <b class="return">${ret()}</b> USDT<p class="notice">${mode==='changed'?`Price moved to ${slip.newPrice.toFixed(2)}. Accept to continue.`:mode==='paused'?'Selection suspended.':notice}</p>${mode==='changed'?btn('Accept new odds','acceptPrice()','cta'):`<button class="cta" ${mode==='paused'?'disabled':''} onclick="place()">Place demo bet</button>`}<details><summary>Sample scenarios</summary>${['Price change','Suspend / resume','Fail next placement'].map((x,i)=>btn(x,`scenario(${i})`)).join('')}</details></div>`:`<p>${notice||'Choose a price on any fixture to start a single.'}</p>`}${link('bets','My bets →').replace('<a ',"<a onclick=\"tab='My bets';render()\" ")}`}
function receiptMatch(b){const idx=b.fixtureId?events.findIndex(e=>feedEvents.get(e)?.id===b.fixtureId):b.id;return idx<0?E(b.fixture):link('match',E(b.fixture)+' →',idx)}
function historyView(){return `<div class="chips">${['Open','Settled'].map(s=>btn(s,`status='${s}';render()`,status===s?'active':'')).join('')}</div>${bets.map((b,i)=>b.state===status?`<article class="card">${receiptMatch(b)}<h3>${b.name} @ ${b.price.toFixed(2)}</h3><small>Stake ${b.stake} USDT · ${b.state==='Open'?'Potential return':'Returned'} ${b.return} USDT</small><p>${b.result||''}</p>${status==='Open'?btn((cash===i?'Confirm cash out ':'Cash out · ')+(b.stake*.88).toFixed(2)+' USDT',`cashOut(${i})`):''}</article>`:'').join('')||'No tickets.'}`}
function desk(){return `<h1>Ticket desk</h1><div class="chips">${['Slip','My bets'].map(s=>btn(s,`tab='${s}';render()`,tab===s?'active':'')).join('')}</div>${tab==='Slip'?ticket():historyView()}`}
const ret=()=>Number.isFinite(+stakes)&&+stakes>0?(+stakes*slip.price).toFixed(2):'0.00';
function amount(v){stakes=v;document.querySelectorAll('.return').forEach(x=>x.textContent=ret())}
function pick(i,g,k){if(slip?.key===String([i,g,k])){tab='Slip';render();return}slip={key:String([i,g,k]),id:i,fixtureId:feedEvents.get(events[i])?.id,g,name:names(events[i],g)[k],fixture:events[i].slice(0,2).join(' v '),price:odds(i,g,k)};mode='normal';notice='';tab='Slip';render()}
function removePick(){slip=null;stakes='';notice='';mode='normal';render()}
function scenario(i){
  if(!slip)return;
  if(i===0){
    slip.newPrice=+((slip.newPrice??slip.price)+.12).toFixed(2);
    moved[slip.key]=slip.newPrice;
    if(mode!=='paused')mode='changed';
    notice='';
  }else if(i===1){
    if(mode==='paused'){
      mode=slip.newPrice!==undefined?'changed':'normal';
      notice='Selection reopened. Review your stake and place the bet when ready.';
    }else{mode='paused';notice=''}
  }else if(!['changed','paused'].includes(mode)){
    mode='fail';
    notice='Demo: the next placement will fail.';
  }
  render();
}
function acceptPrice(){
  if(!slip||mode!=='changed')return;
  slip.price=slip.newPrice;
  delete slip.newPrice;
  mode='normal';
  notice='New odds accepted. Review your return before placing the bet.';
  render();
}
function place(){if(ed===6 && window.draftNeedsCheck?.('single'))return;if(!slip||['changed','paused'].includes(mode))return;if(!Number.isFinite(+stakes)||+stakes<=0||Math.round(stakes*100)/100!==+stakes)notice='Enter a positive stake with up to two decimals.';else if(mode==='fail'){mode='failed';notice='Bet failed. No ticket was created. Your selection and stake are saved in this slip.'}else{cash=-1;bets.unshift({...slip,placedAt:Date.now(),sport:sportOf(events[slip.id]),score:events[slip.id][3]?events[slip.id][4]:"",period:briefs.get(events[slip.id])||"",stake:+stakes,return:ret(),state:'Open'});notice='Bet placed. View it in My bets.';slip=null;stakes='';persist()}render()}
function cashOut(i){if(bets[i]?.state!=='Open')return;if(cash===i){if(bets[i].legs)recordEvent(bets[i],'Cashed out · Returned '+(bets[i].stake*.88).toFixed(2)+' USDT');Object.assign(bets[i],{state:'Settled',result:'Cashed out',settledAt:Date.now(),return:(bets[i].stake*.88).toFixed(2)});status='Settled';cash=-1;persist()}else {cash=i;if(bets[i].legs){recordEvent(bets[i],'Cash-out offer · '+(bets[i].stake*.88).toFixed(2)+' USDT');persist()}}render()}
function persist(){try{localStorage.setItem('beta.hb-field-'+ed,JSON.stringify({bets,favs}))}catch{}}
function follow(x){favs=favs.includes(x)?favs.filter(y=>y!==x):[...favs,x];persist();render()}
function filterL(i){league=leagues[i];sport='All';location.hash=href('football');render()}
function setSport(i){sport=['All',...sports][i];league='All';render()}
function query(v){q=v;let f=document.querySelector('#found');if(v&&f)f.innerHTML=results();else render()}
function gallery(){return `<header><img src="housebets.png" alt="Housebets" width="134" style="vertical-align:middle"><small>DESIGN STUDIO</small></header><main class="gallery"><p class="k">Field studies / Vol. 01</p><h1>Ten ways into the game.</h1><p>Choose an edition. Explore its five screens with sample fixtures and demo funds.</p><div class="grid">${editions.map(([n,d,a,b],i)=>`<a class="poster" style="--a:${a};--ink:${b}" href="#${i}/home/0">${art(i)}<span class="k">EDITION ${String(i+1).padStart(2,'0')} ↗</span><strong>${n}</strong><small>${d}</small></a>`).join('')}</div></main>`}
function render(){if(theme && ed===6 && typeof renderPlaybookShell==='function'){renderPlaybookShell();return}if(!theme){app.innerHTML=gallery();return}document.body.style.setProperty('--a',theme[2]);document.body.style.setProperty('--ink',theme[3]);document.body.className=['','strip','folio','terminal','','strip','','folio','terminal','strip'][ed];app.innerHTML=`<header><a href="#"><img src="housebets.png" alt="Housebets" width="134" style="vertical-align:middle"></a><span class="balance">Sports &nbsp; / &nbsp; Sample session</span>${ed===6?link('bets','Bet slip / My bets'):'<a href="#">Editions ↗</a>'}</header><div class="layout"><nav><small>SPORTSBOOK</small>${[['home','⌂ Home'],['live','◉ Live'],['football',ed===6?icon('Football')+'Football':'⚽ Football'],['bets',ed===6?'▤ My bets':'▤ Tickets']].map(([k,t])=>`<a href="${href(k)}" class="${p===k?'active':''}">${t}</a>`).join('')}</nav><main>${p==='match'?match():p==='bets'?desk():p==='home'?home():listing()}</main><aside>${p==='bets'?`<h3>Match desk</h3>${link('match','Arsenal v Brighton →')}`:ticket()}</aside></div>${ed===6&&typeof flightMobileSlip==='function'?flightMobileSlip():`${slip&&p!=='bets'?btn(`${slip.name} @ ${slip.price.toFixed(2)} · Open slip ↑`,'sheet=true;render()','dock cta'):''}${sheet&&p!=='bets'?`<div class="sheet">${btn('Close ↓','sheet=false;render()')}${ticket()}</div>`:''}`}`}
function route(){let [n,page,idx]=location.hash.slice(1).split('/');if(!n||!editions[n]){theme=null;render();return}if(ed!==+n||!theme){ed=+n;let saved;try{saved=JSON.parse(localStorage.getItem('beta.hb-field-'+ed))}catch{};bets=saved?.bets||[{id:0,fixture:'Arsenal v Brighton',name:'Draw',price:3.4,stake:5,return:'0.00',state:'Settled',result:'Previous sample fixture · Lost'}];favs=saved?.favs||[];slip=null;notice='';stakes='';sport=league='All';moved={}}theme=editions[ed];p=page||'home';id=events[idx]?+idx:0;sheet=false;q='';if(p!=='match')group=0;if(p==='bets'&&(ed===6||!slip))tab='My bets';render();window.scrollTo(0,0)}
Object.assign(window,{pick,removePick,amount,scenario,acceptPrice,place,cashOut,follow,setSport,filterL,query,render});window.addEventListener('hashchange',route);setInterval(()=>document.querySelectorAll('time').forEach(t=>{let s=Math.floor((Date.now()-started)/1000);t.textContent=(+t.dataset.min+Math.floor(s/60))+':'+String(s%60).padStart(2,'0')}),1000)





