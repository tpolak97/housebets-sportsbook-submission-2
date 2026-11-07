const feed=window.fieldFeed||{}, teamById=new Map(), teamByName=new Map(), liveIds=new Set();
// Old sample fixtures use names. Imported fixtures resolve sides by provider ID.
const safeLabel=x=>typeof x==='string'&&x.length<=100&&x.trim()&&!/[<>"\\\x00-\x1f]/.test(x);
const safeBadge=x=>typeof x==='string'&&(/^(?:https:\/\/|assets\/[\w./-]+$)/.test(x));
for(const t of feed.teams||[])if(typeof t.id==="string"&&safeLabel(t.id)&&safeLabel(t.name)){teamById.set(t.id,t);teamByName.set(t.name,t)}
for(const f of [...feed.fixtures||[]].sort((a,b)=>String(a.id).localeCompare(String(b.id)))){
 const a=teamById.get(f.home),b=teamById.get(f.away),n=f.sport==='Football'?3:2;
 if(!a||!b||typeof f.id!=="string"||!safeLabel(f.id)||liveIds.has(f.id)||!catalog.includes(f.sport)||!safeLabel(f.competition)||typeof f.live!=='boolean'||!(f.live?safeLabel(f.score)&&safeLabel(f.period):/^([01]\d|2[0-3]):[0-5]\d$/.test(f.start))||!Array.isArray(f.resultOdds)||f.resultOdds.length!==n||!f.resultOdds.every(x=>Number.isFinite(x)&&x>1)){console.warn('Skipped invalid field fixture:',f.id);continue}
 liveIds.add(f.id);if(!leagues.includes(f.competition))leagues.push(f.competition);
 const e=[a.name,b.name,leagues.indexOf(f.competition),+f.live,f.live?f.score:f.start];
 feedEvents.set(e,f);if(f.live)briefs.set(e,f.period);let idx=events.push(e)-1;all.push(idx);(f.live?live:soon).push(idx);
}
soon.sort((a,b)=>events[a][4].localeCompare(events[b][4]));
function flag(team){
 const name=team?.name||'Team',hash=[...String(team?.id||name)].reduce((h,c)=>(h*31+c.codePointAt(0))>>>0,9);
 const mark='<i class="pennant" aria-hidden="true" style="--flag:hsl('+hash%360+' 49% 35%)">'+E(name.split(/\s+/).slice(0,2).map(s=>s[0]).join('').toUpperCase())+'</i>';
 return safeBadge(team?.flag)?'<span class="flagBox">'+mark+'<img src="'+E(team.flag)+'" alt="" onerror="this.remove()"></span>':mark;
}
function badgeFor(i,k){const e=events[i],f=feedEvents.get(e);return flag(f?teamById.get(k?f.away:f.home):teamByName.get(e[k])||{name:e[k]})}
function opponents(i){return [0,1].map(k=>'<span class="teamName">'+badgeFor(i,k)+E(events[i][k])+'</span>').join('<small> v </small>')}
row=function(i){const e=events[i];return '<article class="row card"><a href="'+href('match',i)+'">'+clock(e)+' · <small>'+E(leagues[e[2]])+'</small><strong>'+opponents(i)+(e[3]?' <em>'+E(e[4])+'</em>':'')+'</strong></a>'+prices(i)+'</article>'};
marketRow=function(i,g){return '<article class="card row"><a href="'+href('match',i)+'">'+clock(events[i])+'<strong>'+opponents(i)+'</strong></a>'+prices(i,g)+'</article>'};
const oldPair=kitPair;
kitPair=i=>oldPair(i).replace(/<div><svg/g,(()=>{let k=0;return ()=>'<div>'+badgeFor(i,k++)+'<svg'})());
const oldDuel=duel;
duel=i=>{let k=0;return oldDuel(i).replace(/(<div class="rCaption"><small>)/g,m=>m+badgeFor(cards[i].id,k++))};
const previousTurn=turnstile;
turnstile=()=>{const i=current()[pass%current().length];return i===undefined?previousTurn():previousTurn().replace(titleOf(i),opponents(i))};
const previousArena=arena;
arena=()=>{let h=previousArena();if(sport!=='All'){const i=featured[sport]??current()[0];if(i!==undefined)h=h.replace('<h2>'+titleOf(i)+'</h2>','<h2>'+opponents(i)+'</h2>')}return h};
const newBooks=[
 ['Floodlight','What’s on right now?','Live desk','Live ticket','#a7f2d6','#123e3d'],
 ['Colours Club','Who are you following?','Club journal','Matchday receipt','#f6bc9e','#49313b'],
 ['Price Lane','Which result are you backing?','Price board','Price check','#a7cbff','#223758']
];
newBooks.forEach(b=>{books.push(b.slice(0,4));editions.push([b[0],b[1],b[4],b[5]])});
const primary=['Football','Tennis','American Football','Baseball','Basketball','Ice Hockey','Cricket'];
const railSports = [...new Set([...primary, ...catalog])];
function sportChoice(name) {
  return '<button title="' + E(name) + '" aria-label="' + E(name) + '" data-sport="' + E(name) + '" aria-pressed="' + (sport === name) +
    '" class="' + (sport === name ? 'active' : '') + '" onclick="chooseRailSport(this)">' +
    icon(name) + '<span>' + E(name) + '</span></button>';
}
function chooseRailSport(button) {
  const name = button.dataset.sport;
  league = 'All';
  if(ed===6)enterSport(name);else selectSport(name);
  const rail = document.querySelector('.sportTrack');
  const target = [...rail.children].find(item => item.dataset.sport === name);
  if (target) {
    rail.scrollLeft = target.offsetLeft - (rail.clientWidth - target.offsetWidth) / 2;
    target.focus({preventScroll:true});
  } else {
    document.querySelector('.allSports').focus({preventScroll:true});
  }
}
function panSports(button, direction) {
  const track = button.parentElement.querySelector('.sportTrack');
  track.scrollBy({left: direction * track.clientWidth * .8, behavior: motionOn ? 'smooth' : 'instant'});
}
function actionRail() {
  if(ed===6)return "";
  const split = catalog.indexOf('Arena of Valor');
  const group = (title, names) => '<h3>' + title + '</h3><div class="pickerChoices">' +
    names.map(sportChoice).join('') + '</div>';
  return '<div class="sportBar"><button class="allSports" aria-pressed="' + (sport === 'All') + '" popovertarget="sportsPicker">All ▾</button>' +
    '<button aria-label="Previous sports" onclick="panSports(this,-1)">‹</button>' +
    '<div class="sportRail sportTrack" aria-label="Sports">' + railSports.map(sportChoice).join('') +
    '</div><button aria-label="Next sports" onclick="panSports(this,1)">›</button></div>' +
    '<div popover id="sportsPicker" aria-label="Choose a sport"><div class="pickerHead"><b>Choose a sport</b>' +
    '<button popovertarget="sportsPicker" popovertargetaction="hide" aria-label="Close sport picker">×</button></div>' +
    '<button data-sport="All" onclick="chooseRailSport(this)">Show all sports</button>' +
    group('Sports', catalog.slice(0, split)) + group('Esports', catalog.slice(split)) + '</div>';
}
function bulletin(){
 const l=current().filter(i=>events[i][3]),a=current().filter(i=>!events[i][3]).sort((a,b)=>events[a][4].localeCompare(events[b][4]));
 let c=cards.findIndex(c=>(sport==='All'||sportOf(events[c.id])===sport));
 return '<section class="leadDesk"><small>ON AIR / FEATURED MATCH</small>'+(c>=0?duel(c):l.length?row(l[0]):'No matches in play.')+'</section>'+section('On the live desk',l.slice(0,6))+section('Up next',a.slice(0,4));
}
function club(){
 const opts=[...new Set(current().flatMap(i=>events[i].slice(0,2)))],picks=[...new Set(['France','England','Violet Tide','Cinder Comets',...favs,...opts])].filter(n=>opts.includes(n)).slice(0,12);
 const followed=current().filter(i=>events[i].slice(0,2).some(n=>favs.includes(n))||favs.includes(leagues[events[i][2]]));
 return '<section class="clubPanel"><small>MEMBERS’ SHELF</small><h2>Choose your colours.</h2><div class="clubGrid">'+picks.map(n=>btn(flag(teamByName.get(n)||{name:n})+E(n)+'<small>'+(favs.includes(n)?'★ Following':'+ Follow')+'</small>','follow('+JSON.stringify(n)+')')).join('')+'</div></section>'+heading('Your fixture journal')+(rows(followed)||'<p>Follow a team above to add its fixtures here.</p>')+section('Around the grounds',current().slice(0,4))+'<details><summary>Rivalry spotlight</summary>'+shelf()+'</details>';
}
let outcome=0;
function board(){
 const list=current().filter(i=>i!==2&&(outcome!==1||names(events[i],0).length===3)),k=i=>outcome===2?names(events[i],0).length-1:outcome===1?1:0;
 list.sort((a,b)=>odds(b,0,k(b))-odds(a,0,k(a)));
 return '<section class="priceBoard"><small>FULL TIME / DECIMAL</small><h2>Compare match results</h2>'+chips(['Home','Draw','Away'],outcome,i=>'outcome='+i+';render()')+'<p>Available prices · highest first · '+list.length+' fixtures</p>'+list.map(i=>{const x=k(i);return '<article><a href="'+href('match',i)+'">'+clock(events[i])+'<strong>'+opponents(i)+'</strong></a>'+prices(i).replace(/<button[^>]*>[\s\S]*?<\/button>/g,((n)=>m=>n++===x?m:'')(0))+'</article>'}).join('')+'</section><details><summary>Rivalry spotlight</summary>'+shelf()+'</details>';
}
const sixHome=home;
home=()=>ed<6?sixHome():'<p class="k">'+books[ed][2]+' / Matchday edition</p><h1>'+books[ed][0]+'</h1><p>'+books[ed][1]+'</p>'+search()+'<div id="found">'+(q?results():actionRail()+[bulletin,club,board][ed-6]()+heading('Top competitions')+leagueNav())+'</div>';
const sixTicket=ticket;
ticket=()=>{if(ed<6)return sixTicket();let html=oldTicket().replace('Bet slip',books[ed][3]);if(!slip)return html;
 const e=events[slip.id],extra=ed===6?clock(e)+' · '+E(e[4]):ed===7?opponents(slip.id):'Decimal price × stake = potential return';
 html=html.replace('<div class="ticket">','<div class="ticket"><div class="ticketLead">'+extra+'</div>');
 if(ed===6)html=html.replace('Potential return',[5,10,25].map(v=>btn(v+' USDT',"amount('"+v+"');render()")).join(' ')+'<br>Potential return');
 if(ed===7){const team=e[0];html+=btn((favs.includes(team)?'★ Following ':'☆ Follow ')+E(team),'follow('+JSON.stringify(team)+')')}
 if(ed===8&&mode==='changed')html=html.replace('Accept new odds','Accept '+slip.price.toFixed(2)+' → '+slip.newPrice.toFixed(2)+' · '+(slip.newPrice*Number(stakes||0)).toFixed(2)+' USDT');
 return html};
const sixGallery=gallery;
gallery=()=>'<header><img width="134" alt="Housebets" src="housebets.png"><small>Sports fieldbook</small></header><main class="gallery"><p class="k">Matchday / Playbooks</p><h1>Pick your way to play.</h1><div class="newGallery">'+newBooks.map((b,i)=>'<a style="--theme:'+b[4]+'" href="#'+(i+6)+'/home/0"><small>PLAYBOOK 0'+(i+1)+'</small>'+icon(primary[i])+'<strong>'+b[0]+'</strong><p>'+b[1]+' →</p></a>').join('')+'</div><details><summary>Compare the six original books</summary>'+sixGallery().split('<div class="collection">')[1].split('</main>')[0].replace(/^/,'<div class="collection">').replace(/<a href="#[678]\/home\/0">[\s\S]*?<\/a>/g,'')+'</details></main>';

// Floodlight is the player entry point. Existing edition links still resolve.
if (!location.hash) history.replaceState(null, '', '#6/home/0');
route();
