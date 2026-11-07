/* The fixture feed can ship a precomputed index or normalized roster rows. */
const fixturePortraits = feed.portraitIndex ?? window.floodlightPortraitSnapshot ?? buildPortraitIndex(feed.roster || []);
let portraitPage = '', portraitEpoch = performance.now();
function portraitSlot() {
  const route = p + '/' + id;
  if (route !== portraitPage) {
    portraitPage = route;
    portraitEpoch = performance.now();
  }
  return Math.floor((performance.now() - portraitEpoch) / 4500);
}
function rosterPlayers(i,side) {
  const event=events[i], fixture=feedEvents.get(event);
  const teamId=fixture?.[side?'away':'home'] ?? teamByName.get(event[side])?.id;
  const season=fixture?.season ?? feed.season;
  return fixturePortraits[JSON.stringify([sportOf(event),season,teamId])] || [];
}
function rosterVisual(i,side){
  const list=rosterPlayers(i,side);
  if(!list?.length)return '';
  const current=portraitSlot()%list.length;
  const layers=list.map((player,index)=>{
    // Keep the locally authored France and England captain portraits.
    const studio=({'fra-1':0,'eng-1':1})[player.id];
    const image=studio!==undefined && localStorage.getItem('beta.hb-motion-player-'+studio)
      ? cutout(studio,!!side) : '<img alt="" src="'+E(player.image)+'" onerror="this.parentElement.hidden=true;updatePortraits()">';
    return '<span class="portraitLayer'+(index===current?' shown':'')+'" title="'+E(player.name)+'">'+image+'<span class="portraitName">'+E(player.name)+'</span></span>';
  }).join('');
  return '<span class="rosterPortrait"><span class="portraitFallback">'+badgeFor(i,side)+'</span>'+layers+'</span>';
}
function updatePortraits(){
  const slot=portraitSlot();
  for(const frame of document.querySelectorAll('.rosterPortrait')){
    const layers=[...frame.querySelectorAll('.portraitLayer:not([hidden])')];
    if(!layers.length)continue;
    const active=layers[slot%layers.length];
    for(const layer of layers){
      layer.classList.toggle('shown',layer===active);
      const hidden=String(layer!==active);
      if(layer.getAttribute('aria-hidden')!==hidden)layer.setAttribute('aria-hidden',hidden);
    }
  }
}
setInterval(()=>{if(!document.hidden)updatePortraits()},350);
