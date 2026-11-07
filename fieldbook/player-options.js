const optionsKey='beta.floodlight.preferences.v1';
let prefs={pins:[],density:'Cards',labels:true,type:false,auto:true,favourites:{},budget:0,reminder:0,alerts:false,alertSport:'All',alertTeam:'',quietStart:22,quietEnd:7};
try{Object.assign(prefs,JSON.parse(localStorage.getItem(optionsKey))||{})}catch{}
const sessionStart=Number(sessionStorage.getItem('beta.fl.start'))||Date.now();
sessionStorage.setItem('beta.fl.start',sessionStart);
let playerPanel=false,lastReminder=0;
let lastFixture=storageRead('beta.fl.lastFixture');
const notices=storageRead('beta.fl.notices')||[];
function option(key,value){prefs[key]=value;localStorage.setItem(optionsKey,JSON.stringify(prefs));render()}
function pinSport(name,direction=0){
 const pins=[...prefs.pins], pos=pins.indexOf(name);
 if(direction && pos>0)[pins[pos],pins[pos-1]]=[pins[pos-1],pins[pos]];
 else if(pos>=0)pins.splice(pos,1);
 else if(catalog.includes(name)&&pins.length<3)pins.push(name);
 option('pins',pins);
}
function choices(items,selected){return items.map(v=>'<option '+(v===selected?'selected':'')+'>'+E(v)+'</option>').join('')}
function playerSettings(){
 const remaining=remainingBudget(),minutes=Math.floor((Date.now()-sessionStart)/60000);
 return '<dialog id="playerOptions" aria-label="Player preferences"><button class="closeOptions" onclick="playerPanel=false;render()">Close</button><h2>Player preferences</h2>'+
 '<h3>Pinned sports</h3>'+prefs.pins.map(s=>'<div>'+E(s)+' '+btn('Move up','pinSport('+JSON.stringify(s)+',1)')+btn('Remove','pinSport('+JSON.stringify(s)+')')+'</div>').join('')+
 '<label>Add a sport <select '+(prefs.pins.length>=3?'disabled':'')+' onchange="pinSport(this.value)"><option>Choose sport</option>'+choices(catalog.filter(s=>!prefs.pins.includes(s)),'')+'</select></label>'+
 '<h3>Reading & browsing</h3><label>Fixture layout <select onchange="option(\'density\',this.value)">'+choices(['Cards','Compact list'],prefs.density)+'</select></label>'+
 [ ['labels','Icon labels'],['type','Large text'],['auto','Rotate banners'] ].map(([k,label])=>'<label><input type="checkbox" '+(prefs[k]?'checked':'')+' onchange="option(\''+k+'\',this.checked)"> '+label+'</label>').join('')+
 '<h3>Session controls</h3><p>'+minutes+' minutes this session · '+(Number.isFinite(remaining)?remaining.toFixed(2)+' USDT remaining':'No session budget set')+'</p>'+
 '<label>Session budget in demo USDT (0 = off)<input type="number" min="0" value="'+prefs.budget+'" onchange="option(\'budget\',Math.max(0,Number(this.value)))"></label>'+
 '<label>Pause reminder in minutes (0 = off)<input type="number" min="0" value="'+prefs.reminder+'" onchange="option(\'reminder\',Math.max(0,Number(this.value)))"></label>'+
 btn('Pause session','pauseSession()')+'<h3>Result alerts</h3><label><input type="checkbox" '+(prefs.alerts?'checked':'')+' onchange="option(\'alerts\',this.checked)"> In-app results only</label>'+
 '<label>Sport <select onchange="option(\'alertSport\',this.value)">'+choices(['All',...catalog],prefs.alertSport)+'</select></label><label>Team (optional)<input value="'+E(prefs.alertTeam)+'" onchange="option(\'alertTeam\',this.value.trim())"></label>'+
 '<label>Quiet hours (local, 0–23)<input type="number" min="0" max="23" value="'+prefs.quietStart+'" onchange="option(\'quietStart\',Math.min(23,Math.max(0,+this.value)))"> to <input type="number" min="0" max="23" value="'+prefs.quietEnd+'" onchange="option(\'quietEnd\',Math.min(23,Math.max(0,+this.value)))"></label>'+
 (notices.length?'<h3>Recent results</h3>'+notices.slice(-4).map(s=>'<p>'+E(s)+'</p>').join(''):'')+'</dialog>';
}
function remainingBudget(){
 if(!prefs.budget)return Infinity;
 const spent=bets.filter(b=>b.placedAt>=sessionStart).reduce((n,b)=>n+b.stake,0);
 return Math.max(0,prefs.budget-spent);
}
function pauseSession(){
 rememberDraft();playerPanel=false;render();
 const dlg=document.createElement('dialog');dlg.className='pauseDialog';
 dlg.innerHTML='<h2>Session paused</h2><p>Your draft is saved.</p><button>Resume session</button>';
 document.body.append(dlg);dlg.querySelector('button').onclick=()=>dlg.close();dlg.onclose=()=>dlg.remove();dlg.showModal();
}
setInterval(()=>{
 const minute=Math.floor((Date.now()-sessionStart)/60000);
 if(ed===6&&prefs.reminder&&minute>=lastReminder+prefs.reminder&&!document.hidden&&!document.querySelector('dialog[open]')){
 lastReminder=minute;pauseSession()}
},15000);
function resultAlert(b){
 if(!prefs.alerts)return;
 const hour=new Date().getHours(),{quietStart:a,quietEnd:z}=prefs;
 if(a<z?hour>=a&&hour<z:a>z&&(hour>=a||hour<z))return;
 const picks=b.legs||[b];
 if(!picks.some(l=>(prefs.alertSport==='All'||l.sport===prefs.alertSport)&&(!prefs.alertTeam||l.fixture.toLowerCase().includes(prefs.alertTeam.toLowerCase()))))return;
 const msg=b.name+' · '+b.result+' · '+b.return+' USDT';notices.push(msg);
 sessionStorage.setItem('beta.fl.notices',JSON.stringify(notices));announceUpdate(msg);const toast=document.createElement('output');toast.className='resultToast';toast.textContent=msg;document.body.append(toast);setTimeout(()=>toast.remove(),8000);
}
const usualChoice=sportChoice;
sportChoice=function(name){
 const pool=p==='live'?live:p==='upcoming'?soon:all;
 const count=pool.filter(i=>sportOf(events[i])===name&&(p!=='live'||league==='All'||leagues[events[i][2]]===league)).length;
 return usualChoice(name).replace('</button>',' <small>'+count+'</small></button>');
};
pinnedDirectorySports=()=>prefs.pins.filter(name=>catalog.includes(name));
function sampleStart(i){
 const provided=Date.parse(feedEvents.get(events[i])?.startsAt);
 if(Number.isFinite(provided))return new Date(provided);
 const t=new Date(sessionStart),[hours,minutes]=events[i][4].split(':').map(Number);
 t.setHours(hours,minutes,0,0);if(hours<6)t.setDate(t.getDate()+1);return t;
}

