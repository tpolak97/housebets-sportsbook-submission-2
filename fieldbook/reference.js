/* Local visual reference pass. All fixtures, selections and receipts remain simulated. */
const promos=[
 ['football','Football','Football'],['worlds','League of Legends','League of Legends'],
 ['arena','Counter-Strike 2','Counter-Strike 2'],['basketball','Basketball','Basketball']
];
let refPromoIndex=0;
function promoStep(n){refPromoIndex=(n+promos.length)%promos.length;render()}
function promoArt(){
 const [file,title,category]=promos[refPromoIndex];
 return '<section class="promoArt" aria-label="Sports banners"><button class="promoLink" aria-label="Browse '+category+' sample fixtures" onclick="enterSport(\''+category+'\')"><img alt="" src="assets/banner-'+file+'-generic-v2.webp"><span class="promoSportLabel"><small>HOUSEBETS SPORTS</small><strong>'+E(title)+'</strong><em>Explore matches →</em></span></button><div class="promoControls">'+promos.map((item,k)=>'<button aria-label="Show '+item[1]+' banner" aria-pressed="'+(refPromoIndex===k)+'" onclick="promoStep('+k+')"></button>').join('')+'</div></section>';
}
function teamVisual(i,side){
 if(sportOf(events[i])!=='Football')return '<span class="sportTeamBadge">'+badgeFor(i,side)+'</span>';
 const roster=rosterVisual(i,side);
 if(roster)return roster;
 const matchup=cards.find(c=>c.id===i);
 if(!matchup)return badgeFor(i,side);
 const player=side?matchup.right:matchup.left;
 return '<span class="teamPortrait '+(side?'away':'local')+'">'+cutout(player,Boolean(side))+'</span>';
}
function snapCard(i){
 const e=events[i],score=e[3]?e[4].split(/[–-]/):[],favorite=favs.includes(favoriteKey(i));
 return '<article class="snapCard"><div class="snapMeta"><small>'+E(leagues[e[2]])+'</small>'+clock(e)+'</div><a class="snapTeams" href="'+href('match',i)+'">'+[0,1].map(k=>'<span>'+teamVisual(i,k)+'<b>'+(cards.some(c=>c.id===i)?badgeFor(i,k)+' ':'')+E(e[k])+'</b></span>').join('<em>'+E(score.length===2?score.join(' : '):'v')+'</em>')+'</a><small class="snapMarket">'+(names(e,0).length===3?'1x2':'Winner')+'</small>'+prices(i)+'<button class="saveSnap" aria-label="'+(favorite?'Unsave':'Save')+' fixture" aria-pressed="'+favorite+'" onclick="'+E('follow('+JSON.stringify(favoriteKey(i))+')')+'">'+(favorite?'★':'☆')+'</button></article>';
}
function snapRail(ids){return '<section class="snapRail" aria-label="Featured fixtures" tabindex="0">'+ids.map(snapCard).join('')+'</section>'}
const oldEnter=enterSport;enterSport=name=>{const k=promos.findIndex(x=>x[2]===name);if(k>=0)refPromoIndex=k;oldEnter(name)};
function competitionBubbles(){
 if(sport==='All')return '';
 const counts=new Map();
 for(const i of current()){
   const name=leagues[events[i][2]];
   if(name)counts.set(name,(counts.get(name)||0)+1);
 }
 const options=[['All leagues',current().length],...counts];
 return '<div class="competitionBubbles" role="group" aria-label="Filter by league">'+options.map(([label,count],index)=>{
   const value=index===0?'All':label;
   return '<button data-league="'+E(value)+'" aria-pressed="'+(league===value)+'" onclick="league=this.dataset.league;render()">'+E(label)+' <small>'+count+'</small></button>';
 }).join('')+'</div>';
}
function fixtureSportRail(){
 const names=[...new Set([...pinnedDirectorySports(),...railSports])];
 const reset='<button class="allSports" data-sport="All" aria-pressed="'+(sport==='All')+'" onclick="chooseRailSport(this)">All</button>';
 return '<div class="sportBar">'+reset+
   '<button aria-label="Previous sports" onclick="panSports(this,-1)">‹</button>'+
   '<div class="sportRail sportTrack" role="group" aria-label="Filter fixtures by sport">'+names.map(sportChoice).join('')+'</div>'+
   '<button aria-label="Next sports" onclick="panSports(this,1)">›</button></div>'+competitionBubbles();
}
const refBaseHome=home;
home=function(){
 if(ed!==6)return refBaseHome();
 const pool=current().filter(i=>sport==='All'||league==='All'||leagues[events[i][2]]===league), showcase=[...new Set([international,all.find(i=>feedEvents.get(events[i])?.id==='demo-hoops-01'),featured['Dota 2'],featured.Basketball,...pool])].filter(i=>pool.includes(i)).slice(0,9);
 const poolLive=pool.filter(i=>events[i][3]), poolSoon=pool.filter(i=>!events[i][3]);

 return '<h1 class="visuallyHidden">Sports home</h1>'+referenceSearch()+
 '<div id="found">'+(q?results():promoArt()+discoveryNav()+fixtureSportRail()+snapRail(showcase)+
 '<div class="slateHeading"><h2>'+(sport==='All'?'Football &amp; more':E(sport))+'</h2>'+link('live','Bet live →')+'</div>'+
 fixtureGroup('Live now',poolLive)+fixtureGroup('Upcoming events',poolSoon)+
 '<div class="lowerDeck"><section><h2>Hot Combos</h2><small>Build your own · demo parlay</small><h3>France v England</h3><p>Combine a match outcome with a player selection.</p>'+link('match','Build combo →',international).replace('<a ','<a onclick="setParlay(true)" ')+'</section><section><h2>Top Events</h2>'+showcase.slice(0,3).map(i=>link('match',E(events[i][0])+' v '+E(events[i][1]),i)).join('')+'</section><section><h2>Top competitions</h2>'+leagueNav()+'</section></div>')+'</div>';
};
function referenceSearch(){
 return '<div class="refSearch" '+(q?'':'hidden')+'>'+search()+'</div>';
}
function showRefSearch(){
 if(p!=='home'){location.hash=href('home');setTimeout(showRefSearch,50);return}
 const box=document.querySelector('.refSearch');box.hidden=false;box.querySelector('input').focus();
}
const accountSections={
 'Notifications':'You’re all caught up.',
 'My profile':'FloodlightFan · Rookie member',
 'Wallet':'Demo wallet · 0.00 USDT',
 'Rewards':'Rookie tier · 0 reward points',
 'Redeem code':'No reward codes available in this demo.',
 'Affiliate':'Your demo account has no referrals.',
 'Transactions':'No wallet transactions.'
};
const supportMessages=[];
function profileMenu(){
 const entries=[...Object.keys(accountSections),'Settings','Live support'];
 return '<div id="profileMenu" popover aria-label="Profile menu"><strong>FloodlightFan</strong><small>Demo account · Rookie</small>'+
 entries.map(label=>'<button onclick="openAccount('+E(JSON.stringify(label))+')">'+E(label)+'</button>').join('')+'</div>';
}
function openAccount(label){
 document.querySelector('#profileMenu')?.hidePopover();
 document.querySelector('#accountCard')?.remove();
 if(label==='Live support'){openSupport();return}
 if(label==='Settings'){playerPanel=true;render();return}
 const dialog=document.createElement('dialog');
 dialog.id='accountCard';
 dialog.setAttribute('aria-label',label);
 dialog.innerHTML='<h2>'+E(label)+'</h2><p>'+E(accountSections[label])+'</p><form method="dialog"><button>Close</button></form>';
 dialog.addEventListener('close',()=>dialog.remove());
 app.append(dialog);
 dialog.showModal();
}
let sidebarHidden=localStorage.getItem('beta.fl.sidebarHidden')==='true';
function syncSidebar(button){
 const compact=sidebarHidden || communityVisible;
 document.documentElement.classList.toggle('sidebarHidden',compact);
 button.setAttribute('aria-expanded',String(!compact));
 const label=compact?'Expand sidebar':'Collapse sidebar';
 button.title=label;
 button.setAttribute('aria-label',label);
}
function toggleProductSidebar(button){
 if(communityVisible){closeCommunity();sidebarHidden=false}else sidebarHidden=!sidebarHidden;
 localStorage.setItem('beta.fl.sidebarHidden',String(sidebarHidden));
 syncSidebar(button);
}
const beforeShell=renderPlaybookShell;
renderPlaybookShell=function(){
 beforeShell();
 const head=app.querySelector(':scope > header');
 head.classList.add('refHead');
 head.insertAdjacentHTML('afterbegin','<button type="button" class="sidebarToggle" aria-controls="productSidebar" onclick="toggleProductSidebar(this)"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16m7-11-3 3 3 3"/></svg></button>');
 syncSidebar(head.querySelector('.sidebarToggle'));
 head.insertAdjacentHTML('beforeend','<div class="headCenter"><span>₮ 0.00000000</span><b>Wallet</b><small>DEMO USDT</small></div><div class="headTools"><button aria-label="Search sportsbook" onclick="showRefSearch()">'+toolbarMark('search')+'</button><button aria-label="Community chat" aria-expanded="'+communityVisible+'" onclick="toggleCommunity()">'+toolbarMark('support')+'</button><button aria-label="Profile menu" popovertarget="profileMenu">'+toolbarMark('profile')+'</button></div>');
 head.insertAdjacentHTML('beforeend',profileMenu());
 mountContactTools();
 if(p!=='casino' && p!=='home' && !app.querySelector('.browseTabs'))app.querySelector('main').insertAdjacentHTML('afterbegin',discoveryNav());
};
render();


/* Replace only the banner on rotation: editing a stake or browsing a fixture never loses focus. */
setInterval(()=>{
 const el=document.querySelector('.promoArt');
 if(!el||!prefs.auto||!motionOn||sport!=='All'||document.hidden||el.matches(':hover,:focus-within')||sheet||desktopSlip||drawerOpen)return;
 refPromoIndex=(refPromoIndex+1)%promos.length;el.outerHTML=promoArt();addBannerControls();
},8000);
