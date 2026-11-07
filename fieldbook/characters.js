
const cast=[
 ['Riptide','The surf captain','#3ce5cb'],['Copperfox','The badge collector','#ff9d68'],
 ['Nighthawk','The midnight caller','#aba9ff'],['Limewire','The playmaker','#d2ed66'],
 ['Ironhorn','The line judge','#ff9ab7'],['Starling','The ticket keeper','#7cd9ff']
];
// Home, away, score and period for each fictional in-play fixture.
const matchcards={
 Football:['Chelsea','Liverpool','2–1','Second half · 64′'],
 Tennis:['Sora Mallow','Jules Venn','4–3','Set 2 · 30–15'],
 Basketball:['Cinder Comets','Port Arrows','82–78','Q4 · 06:42'],
 'American Football':['Bay Bison','Summit Owls','21–17','Q3 · 04:18'],
 'Aussie Rules':['Southport Kites','River Roos','64–51','Q3 · 12:04'],
 Badminton:['Ira Fern','Lux Pavo','18–16','Game 2'],
 Baseball:['North Bay Stars','Copper Sox','4–3','Bottom 7th · 1 out'],
 Boxing:['Rin Gale','Oren Firth','In progress','Round 5 of 8'],
 Cricket:['Ember XI','Coast Royals','142/4','First innings · 16.2 overs'],
 Darts:['Milo Glass','Jett Elm','4–3','Leg 8 · first to 6'],
 'Formula 1':['Vale Racing','Northstar GP','P2 / P4','Lap 31 of 54 · head to head'],
 Golf:['Ari Flint','Koa Lark','−4 / −2','Hole 14 · head to head'],
 Handball:['Oriel Seven','Wick City','19–17','Second half · 39′'],
 'Horse Racing':['Copper Comet','Vale Runner','On course','Final furlong · head to head'],
 'Ice Hockey':['Glacier Lynx','Forge Wolves','3–2','P3 · 08:14'],
 MMA:['Tavi Wren','Rook Silva','In progress','Round 2 · 02:11'],
 Rugby:['Anchor XV','Iron Valley','17–12','Second half · 54′'],
 'Table Tennis':['Mira Thorn','Lio Pike','8–6','Game 4'],
 Volleyball:['Sunset Six','Atlas Wings','21–18','Set 3'],
 'Motor Racing':['Arrow Works','Cobalt Racing','P3 / P5','Lap 19 · head to head'],
 Novelties:['Lantern Squad','Mirror Club','2–1','Exhibition · round 4'],
 'Arena of Valor':['Cobalt Crest','Jade Mirage','1–0','Map 2 · towers 4–2'],
 'Call of Duty':['Ash Division','Night Circuit','174–158','Map 3 · Hardpoint'],
 'Counter-Strike 2':['Volt Syndicate','Static Harbor','9–7','Map 2 · round 17'],
 'CS2 Duels':['Hex Ember','Vex Tide','6–4','Duel · round 11'],
 'Dota 2':['Violet Tide','Quartz Legion','18–14','Map 2 · 26:12 · kills'],
 eCricket:['Pixel XI','Circuit Kings','96/3','Over 12.4'],
 eHockey:['Byte Blades','Neon Ice','2–1','P2 · 07:31'],
 FIFA:['Nova City','Pixel Rovers','1–1','Second half · 72′'],
 'King of Glory':['Orchid Crown','Red Lantern','1–1','Map 3 · best of 3'],
 'League of Legends':['Moonlit Five','Ember Ward','13–9','Game 2 · 22:48 · kills'],
 'Mobile Legends':['Delta Dawn','Neon Talon','1–0','Game 2 · best of 3'],
 NBA2K:['Grid Ballers','Pixel Suns','56–52','Q3 · 03:20'],
 Overwatch:['Aurora Unit','Vector Nine','2–1','Map 4 · Escort'],
 'Rainbow Six':['Echo Vault','Prism Gate','4–3','Map 1 · round 8'],
 'Warcraft 3':['Rune Alder','Ash Sylvan','1–1','Game 3 · best of 3'],
 Madden:['Bit Hawks','Grid Giants','14–10','Q3 · 02:35']
};
const briefs=new Map();
const featured={};
for(const [i,event] of [...events].entries()){
 const s=sportOf(event),sample=matchcards[s];
 if(!sample||s==='Football'&&i!==0)continue;
 if(s==='Football' && i===0){
  // Preserve the example fixture and existing saved receipts.
  briefs.set(event,'Second half · 52′');const derby=['Chelsea','Liverpool',0,64,'2–1'];events.push(derby);featured[s]=events.length-1;briefs.set(derby,'Second half · 64′');continue;
 }
 // Keep the original upcoming fixtures and add a separate in-play match.
 const fixture=[sample[0],sample[1],event[2],1,sample[2]];
 events.push(fixture);featured[s]=events.length-1;briefs.set(fixture,sample[3]);event[3]=0;
 if(!event[4].includes(':'))event[4]='19:30';
 if(i>=7){event[0]=sample[0]+' B';event[1]=sample[1]+' B'}
 if(Object.keys(featured).length===new Set(events.map(sportOf)).size)break;
}
all.splice(0,all.length,...events.keys());live.splice(0,live.length,...all.filter(i=>events[i][3]));soon.splice(0,soon.length,...all.filter(i=>!events[i][3]).sort((a,b)=>events[a][4].localeCompare(events[b][4])));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// Beta v2: animations start on for everyone (they are the product's look); the profile menu's Animations switch turns them off and is remembered.
function motionPreference(){const value=localStorage.getItem('beta.field-motion');return value===null?true:value==='on'}
let motionOn=motionPreference();
function toggleMotion(){motionOn=!motionOn;localStorage.setItem('beta.field-motion',motionOn?'on':'off');render()}
function portrait(k,small=false){
 k=k%cast.length; const [name,role]=cast[k];
 return `<figure class="player ${small?'mini':''}" style="--club:${cast[k][2]}"><img width="224" height="232" src="kits/${name}.${motionOn?'gif':'png'}" alt="${name} mascot in a numbered jersey"><figcaption><b>${name}</b><span>${role}</span></figcaption></figure>`;
}
const highlights=['Football','Basketball','Dota 2','Tennis','Ice Hockey','Counter-Strike 2'];
function arena(){
 const i=featured[sport==='All'?highlights[ed]:sport]??current()[0]??0;
 const e=events[i],s=sportOf(e);
 return `<section class="matchart" style="--club:${cast[ed%cast.length][2]}"><div class="copy"><small>FIELD CREW &nbsp; / &nbsp; ${s} · SAMPLE LIVE</small><h2>${titleOf(i)}</h2><div class="stat"><b>${e[4]}</b><span>${briefs.get(e)||leagues[e[2]]}</span></div>${link('match','Explore match →',i)}</div>${portrait(ed)}</section><div class="lineup">${[...new Set([...highlights,...(sport==='All'?[]:[sport])])].map(s=>btn(icon(s)+s,`selectSport('${s}')`,sport===s?'active':'')).join('')}</div>`;
}
const baseHome=home;
home=()=>{const html=baseHome();return q?html:html.replace(search(),arena()+search())};
const baseMatch=match;
match=()=>baseMatch().replace('<div class="hero matchhead">',`<div class="hero matchhead">${portrait(ed,true)}`);
const baseGallery=gallery;
gallery=()=>baseGallery().replace(/<div class="preview v(\d)">[^<]*<\/div>/g,(_,i)=>portrait(+i));
const baseView=render;
render=()=>{document.documentElement.classList.toggle('still',!motionOn);document.documentElement.classList.toggle('iconMotionEnabled',motionOn);baseView();
 const header=document.querySelector('header');
 if(header)header.insertAdjacentHTML('beforeend',btn(motionOn?'Motion on':'Motion off','toggleMotion()','motionSwitch'));
};
reduced.addEventListener('change',()=>{motionOn=motionPreference();render()});
Object.assign(window,{render,toggleMotion});render();

window.fixturePeriod = e => briefs.has(e) ? '<span class="badge">● LIVE · '+briefs.get(e)+'</span>' : '';
render();
function matchKit(team){
 const seed=Array.from(team).reduce((v,ch)=>(v*31+ch.codePointAt(0))>>>0,7);
 const color=cast[seed%cast.length][2], numeral=seed%29+1;
 return '<svg class="uniform" viewBox="0 0 70 74" aria-hidden="true"><g><path fill="'+color+'" stroke="#e1eee4" stroke-width="1.4" d="M20 9 28 6Q35 13 42 6L50 9 65 19 57 32 49 28 50 64Q35 70 20 64L21 28 13 32 5 19Z"/><path fill="#153943" opacity=".7" d="M20 11 26 8 50 47 50 57Z"/><text x="35" y="51" font-family="Bahnschrift,sans-serif" font-size="22" font-weight="bold" text-anchor="middle" fill="#091f29">'+numeral+'</text></g></svg>';
}
function kitPair(i){
 const e=events[i];return '<div class="kitPair">'+e.slice(0,2).map(team=>'<div>'+matchKit(team)+'<b>'+E(team)+'</b></div>').join('<small>v</small>')+'</div>';
}
const fieldMatchWithCast=match;
match=()=>fieldMatchWithCast().replace('<div class="hero matchhead">','<div class="hero matchhead">'+kitPair(id));
render();

