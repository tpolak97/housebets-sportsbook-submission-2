
const poses={
 captain:'M64 96 45 137 66 164 M137 93 163 126 122 143',
 sprint:'M63 95 35 128 17 107 M139 93 164 65 151 43',
 celebrate:'M65 94 40 67 27 32 M139 94 166 61 175 22',
 point:'M65 94 49 133 67 158 M138 91 163 81 191 67',
 guard:'M65 96 43 119 64 82 M136 96 156 118 140 76',
 shoot:'M65 96 50 65 78 30 M137 96 131 61 103 20',
 salute:'M65 95 45 138 54 168 M137 95 158 57 122 45'
};
const players=[
 ['Luc Varenne','10','captain','#336fe3','#dc976e'],['Ellis Rowan','9','point','#eee5cf','#86563d'],
 ['Zia Arden','23','shoot','#fb915a','#85503b'],['Joss Marin','4','guard','#79d8e7','#c18a64'],
 ['Nox Vale','8','salute','#ba8cf3','#b87b57'],['Iris Quill','5','celebrate','#64d8ba','#efbe8f'],
 ['Lio Neris','17','sprint','#31baa9','#915941'],['Cato Mere','11','captain','#d68c67','#dda278']
];
const international=events.length;
leagues.push('International friendly');
events.push(['France','England',leagues.length-1,64,'2–2']);all.push(international);live.unshift(international);
briefs.set(events[international],'International friendly · 64′');
const cards=[
 {id:international,left:0,right:1,title:'Channel derby',tag:'International friendly'},
 {id:featured.Basketball,left:2,right:3,title:'Above the rim',tag:'Basketball'},
 {id:featured['Dota 2'],left:4,right:5,title:'Battle for mid',tag:'Dota 2'},
 {id:featured.Football,left:6,right:7,title:'Harbor showdown',tag:'Football'}
];
function cutout(index,away){
 const [name,num,pose,kit,skin]=players[index],arm=poses[pose];
 const head=['M77 33Q79 7 107 15L122 24 124 38 110 32 95 29 83 42Z','M76 34 79 19 85 20 89 12 96 16 103 11 110 16 117 16 125 28 121 38 111 31 90 32 80 42Z'][index%2];
 const body=`<g stroke-linejoin="round" stroke-linecap="round"><path d="${arm}" fill="none" stroke="#10252b" stroke-width="25"/><path d="${arm}" fill="none" stroke="${skin}" stroke-width="19"/><path d="M85 81 92 71 109 70 115 80 137 85 150 103 137 116 131 110 138 176 68 179 73 113 65 120 51 106 61 91Z" fill="${kit}" stroke="#142731" stroke-width="2"/><path d="m64 92 17-6 51 62 4 21-11 2-54-71Z" fill="#152b42" opacity=".66"/><path d="m137 89 12 14-9 11-12-11Z" fill="#f2c568"/><path d="m76 114 5 49 24 11-36 4Z" fill="#102c3e" opacity=".36"/><path d="m90 71-2 10 13 10 13-12-5-12Z" fill="${skin}"/><path d="m88 79 13 10 13-11" fill="none" stroke="#f7ecd0" stroke-width="4"/><path d="M79 37Q78 20 99 20Q121 18 123 37L119 54 123 57 117 60 114 70 103 76 91 69 84 56 78 54Z" fill="${skin}"/><path d="m83 43 8 12 2 10 12 9-3 2-12-7-8-13Z" fill="#382a2b" opacity=".45"/><path d="${head}" fill="#222832"/><path d="m104 40 10 1m-4 4 3 0m-1 16 6-1" fill="none" stroke="#362931" stroke-width="2.3"/></g>`;
 return `<svg class="rCut" viewBox="0 0 200 184" role="img" aria-label="${name}, ${pose} pose"><g transform="${away?'translate(200 0) scale(-1 1)':''}">${body}</g><text x="100" y="145" fill="${kit==='#eee5cf'?'#162f44':'white'}" stroke="#102633" stroke-width="1" paint-order="stroke" text-anchor="middle" font-size="32" font-weight="900" font-family="Bahnschrift, sans-serif">${num}</text></svg>`;
}
let selected=0;
function duel(cardIndex){
 const card=cards[cardIndex], e=events[card.id];
 function side(index,away){
  const player=players[index];
  return `<div class="rSide ${away?'away':'local'}" style="--kit:${player[3]}"><div class="rHalo"></div><b class="rNumber">${player[1]}</b>${cutout(index,away)}<div class="rCaption"><small>${e[away?1:0]}</small><b>${player[0]}</b></div></div>`;
 }
 return `<article class="rCard" data-duel><div class="rHeader"><small>RIVALRY SERIES &nbsp; / &nbsp; 0${cardIndex+1}</small><small>Fictional showcase</small></div><div class="rStage">${side(card.left,false)}<div class="rVs">VS</div>${side(card.right,true)}</div><div class="rInfo"><div><small>${card.tag} · ${e[4]}</small><h2>${card.title}</h2></div>${link('match','Match markets →',card.id)}</div></article>`;
}
function shelf(){
 return `<section class="rShelf">${duel(selected)}<div class="rTabs" aria-label="Rivalry matchups">${cards.map((c,i)=>btn(c.title,`chooseRivalry(${i})`,i===selected?'active':'')).join('')}</div></section>`;
}
function chooseRivalry(i){selected=i;render();document.querySelectorAll('.rTabs button')[i]?.focus({preventScroll:true})}
const baseArena=arena;
arena=()=>{if(sport==='All')return shelf()+`<div class="lineup">${highlights.map(s=>btn(icon(s)+s,`selectSport('${s}')`)).join('')}</div>`;return baseArena()};
const originalMatch=match;
match=()=>{const which=cards.findIndex(c=>c.id===id);return which<0?originalMatch():duel(which)+originalMatch()};
document.addEventListener('pointermove',ev=>{
 if(ev.pointerType==='touch'||!motionOn)return;
 const card=ev.target.closest?.('[data-duel]');if(!card)return;
 const bounds=card.getBoundingClientRect();
 card.style.setProperty('--rx',((ev.clientX-bounds.left)/bounds.width-.5).toFixed(3));
 card.style.setProperty('--ry',((ev.clientY-bounds.top)/bounds.height-.5).toFixed(3));
});
document.addEventListener('pointerout',ev=>{const card=ev.target.closest?.('[data-duel]');if(card&&!card.contains(ev.relatedTarget)){card.style.removeProperty('--rx');card.style.removeProperty('--ry')}});
window.chooseRivalry=chooseRivalry;render();

const drawnPlayer = cutout;
cutout = function(index, away) {
  let custom;
  try { custom = JSON.parse(localStorage.getItem('beta.hb-motion-player-' + index)); } catch {}
  if (!custom && (index===0 || index===1)) {
    const pose=index===0?'captain':'winger';
    return '<img class="uploadedPlayer" alt="'+players[index][0]+'" src="players/'+pose+'.webp" style="--angle:6deg;--cycle:2.8s">';
  }
  if (!custom || !/^data:image\/(webp|png);base64,[a-z0-9+/=]+$/i.test(custom.image)) return drawnPlayer(index, away);
  const angle = Math.min(12, Math.max(0, Number(custom.angle) || 0));
  const cycle = Math.min(10, Math.max(1, Number(custom.cycle) || 4));
  return '<img class="uploadedPlayer" alt="' + players[index][0] + '" src="' + custom.image + '" style="--angle:' + angle + 'deg;--travel:' + angle/3 + '%;--cycle:' + cycle + 's;animation-play-state:' + (custom.paused ? 'paused' : 'running') + '">';
};
// Apply edits made in another open Studio tab immediately.
window.addEventListener('storage', event => {
  if(event.key === 'beta.field-motion') motionOn = motionPreference();
  if(event.key === 'beta.field-motion' || event.key?.startsWith('beta.hb-motion-player-')) render();
});
function playPortraits(cardIndex){
  const {left,right}=cards[cardIndex];
  for(const id of [left,right]){
    const key='beta.hb-motion-player-'+id;
    let saved;
    try{saved=JSON.parse(localStorage.getItem(key))}catch{}
    if(saved?.image){
      saved.paused=false;
      if(!Number(saved.angle))saved.angle=6;
      localStorage.setItem(key,JSON.stringify(saved));
    }
  }
  motionOn=true;
  localStorage.setItem('beta.field-motion','on');
  render();
}
const portraitDuel=duel;
duel=function(index){
  let html=portraitDuel(index);
  if(html.includes('class="uploadedPlayer"') && (!motionOn || html.includes('animation-play-state:paused') || html.includes('--angle:0deg')))
    html=html.replace('</article>',btn('▶ Play portraits','playPortraits('+index+')')+'</article>');
  return html;
};
render();
