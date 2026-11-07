let communityVisible=false, supportVisible=false, supportView='Home';
let helpQuery='',messageDraft='';
const helpArticles=[
 ['Where is my receipt?','Open My Bets and choose Open or Settled. Select your ticket to see the stake, price and result of each leg.'],
 ['How do I check a price change?','Open Bet slip. Review the updated price and potential return, then accept the change before placing your demo bet.'],
 ['When do I get my rewards?','Choose Rewards in the sidebar or profile menu to see your demo tier and points.'],
 ['Can I withdraw my balance?','This sportsbook uses demo USDT. Deposits and withdrawals are unavailable in the prototype.']
];
const radioPreview=new Audio('assets/radio-preview.wav');
radioPreview.preload='none';
radioPreview.loop=true;
radioPreview.volume=.32;
function radioState(){
 const button=document.querySelector('#radioButton');
 if(!button)return;
 button.textContent=radioPreview.paused?'▶':'Ⅱ';
 button.setAttribute('aria-label',radioPreview.paused?'Play radio preview':'Pause radio preview');
 button.setAttribute('aria-pressed',String(!radioPreview.paused));
}
radioPreview.onplay=radioState;
radioPreview.onpause=radioState;
async function toggleRadio(){
 if(!radioPreview.paused){radioPreview.pause();return}
 try{await radioPreview.play()}catch{document.querySelector('#radioStatus').textContent='Preview unavailable'}
}
function toggleCommunity(){
 if(communityVisible){closeCommunity();return}
 if(supportVisible)closeSupport(false);
 communityVisible=true;
 mountCommunity();
 syncSidebar(document.querySelector('.sidebarToggle'));
 document.querySelector('#communityChat header button').focus();
}
function closeCommunity(focus=true){
 communityVisible=false;radioPreview.pause();
 document.querySelector('#communityChat')?.remove();
 document.documentElement.classList.remove('communityOpen');
 const button=document.querySelector('.headTools [aria-label="Community chat"]');
 button?.setAttribute('aria-expanded','false');
 syncSidebar(document.querySelector('.sidebarToggle'));
 if(focus)button?.focus();
}
function mountCommunity(){
 document.documentElement.classList.add('communityOpen');
 document.querySelector('.headTools [aria-label="Community chat"]').setAttribute('aria-expanded','true');
 app.insertAdjacentHTML('beforeend','<aside id="communityChat" aria-label="Community chat"><header><h2>Chat</h2><button aria-label="Close community chat" onclick="closeCommunity()">×</button></header>'+
 '<div class="radioRow"><b>H</b><div>Housebets Radio<small id="radioStatus">Demo station · music preview</small></div><button id="radioButton" onclick="toggleRadio()"></button></div>'+
 '<div class="roomFeed"><small>Match room · Sample conversation</small><p><b>PitchSide</b> France or England tonight?</p><p><b>NorthStand</b> Watching the second half. That last save!</p><p><b>EchoNine</b> Tennis is up next for me.</p></div>'+
 '<details class="roomLock"><summary>Chat locked · View requirements</summary><p>Sample account progress</p>'+[['XP','0 / 5,000 XP'],['Wager','0 / 50 USDT'],['Deposit','0 / 0.99 USDT']].map(([label,value])=>'<label>'+label+' <small>'+value+'</small><progress value="0" max="100"></progress></label>').join('')+'</details></aside>');
 radioState();
}
function mountContactTools(){
 app.insertAdjacentHTML('beforeend','<button id="supportLauncher" aria-label="Housebets support" aria-expanded="'+supportVisible+'" onclick="supportVisible?closeSupport():openSupport()"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2"/><rect x="3" y="13" width="4.2" height="6.5" rx="2"/><rect x="16.8" y="13" width="4.2" height="6.5" rx="2"/><path d="M19 19.5c0 1.5-1.6 2.3-4 2.3h-1.5"/></svg></button>');
 if(communityVisible)mountCommunity();
 if(supportVisible)mountSupport();
}
function openSupport(){
 if(communityVisible)closeCommunity(false);
 supportVisible=true;supportView='Home';
 mountSupport();
 document.querySelector('#supportChat .closeHelp').focus();
}
function closeSupport(focus=true){
 supportVisible=false;document.querySelector('#supportChat')?.remove();
 const launcher=document.querySelector('#supportLauncher');
 launcher?.setAttribute('aria-expanded','false');
 if(focus)launcher?.focus();
}
function helpResults(){
 const query=helpQuery.trim().toLowerCase();
 return helpArticles.filter(pair=>pair.join(' ').toLowerCase().includes(query)).map(([title,answer])=>'<details><summary>'+E(title)+'</summary><p>'+E(answer)+'</p></details>').join('')||'<p>No matching articles.</p>';
}
function setSupportView(view){
 supportView=view;mountSupport();
 document.querySelector(view==='Help'?'#helpSearch':view==='Messages'?'#messageInput':'#supportChat .closeHelp')?.focus();
}
function mountSupport(){
 document.querySelector('#supportChat')?.remove();
 document.querySelector('#supportLauncher').setAttribute('aria-expanded','true');
 let content;
 if(supportView==='Home'){
  content='<button onclick="setSupportView(&quot;Help&quot;)">Search for help　⌕</button><button onclick="setSupportView(&quot;Messages&quot;)">Chat with us　→</button>'+
   helpArticles.slice(0,3).map(([title,answer])=>'<details><summary>'+title+'</summary><p>'+answer+'</p></details>').join('');
 }else if(supportView==='Help'){
  content='<input id="helpSearch" aria-label="Search help articles" placeholder="Search help articles" value="'+E(helpQuery)+'"><div id="helpResults">'+helpResults()+'</div>';
 }else{
  content='<small>Private demo conversation</small><div role="log">'+(supportMessages.length?supportMessages.map(text=>'<p>'+E(text)+'</p>').join(''):'<p>Ask the demo support team about your slip or a receipt.</p>')+'</div><form><input id="messageInput" aria-label="Support message" maxlength="500" required placeholder="Write a message" value="'+E(messageDraft)+'"><button>Send</button></form>';
 }
 app.insertAdjacentHTML('beforeend','<aside id="supportChat" aria-label="Housebets support"><div class="helpHero"><strong>Housebets</strong><button class="closeHelp" aria-label="Close support" onclick="closeSupport()">×</button><h2>'+(supportView==='Home'?'Hi FloodlightFan 👋<br>How can we help?':supportView)+'</h2></div><section class="helpBody">'+content+'</section><footer>'+['Home','Messages','Help'].map((name,i)=>'<button aria-pressed="'+(name===supportView)+'" onclick="setSupportView(&quot;'+name+'&quot;)">'+['⌂','▤','?'][i]+'<span>'+name+'</span></button>').join('')+'</footer></aside>');
 const chat=document.querySelector('#supportChat');
 if(supportView==='Help')chat.querySelector('input').oninput=e=>{helpQuery=e.target.value;chat.querySelector('#helpResults').innerHTML=helpResults()};
 if(supportView==='Messages'){
  const input=chat.querySelector('input'),log=chat.querySelector('[role=log]');
  log.scrollTop=log.scrollHeight;
  input.oninput=()=>{messageDraft=input.value};
  chat.querySelector('form').onsubmit=e=>{
   e.preventDefault();const text=input.value.trim();if(!text)return;
   const reply=/slip|odds|price/i.test(text)?helpArticles[1][1]:helpArticles[0][1];
   supportMessages.push('You: '+text,'Demo support: '+reply);messageDraft='';setSupportView('Messages');
  };
 }
}
document.addEventListener('keydown',event=>{
 if(event.key!=='Escape')return;
 if(supportVisible)closeSupport();else if(communityVisible)closeCommunity();
});
