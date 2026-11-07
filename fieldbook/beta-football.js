// Beta retains the frozen Alpha shell, sport catalogue and home/live layouts.
const betaCompetitions = leagues.slice(0, 5);
const betaExtraFixtures = window.betaExtraFixtures = new Set();
for (const [competition, teams] of Object.entries(clubs)) {
  const index = competition === 'La Liga' ? 2 : betaCompetitions.indexOf(competition);
  if (index < 0) continue;
  for (let n = 0; n < teams.length; n += 2) {
    if (!teams[n + 1]) continue;
    const homeTeam = teams[n], awayTeam = teams[n + 1];
    if (events.some(e => e[0] === homeTeam && e[1] === awayTeam && e[2] === index)) continue;
    const eventIndex = events.push([homeTeam, awayTeam, index, 0, n % 4 ? '20:00' : '18:30']) - 1;
    betaExtraFixtures.add(eventIndex);
    all.push(eventIndex);
    soon.push(eventIndex);
  }
}
// Render football's required six market groups without the optional builder sections.
const alphaMarketTabs = marketTabs;
marketTabs = function(event) {
  if (sportOf(event) !== 'Football') return alphaMarketTabs(event);
  if (group > 5) group = 0;
  return '<div class="chips marketTabs">' + groups.map((label,index) =>
    btn(label, "marketTerm='';group=" + index + ";render()", group === index ? 'active' : '')
  ).join('') + '</div>';
};
const alphaMarkets = flightMarkets;
flightMarkets = function(term = marketTerm) {
  if (sportOf(events[id]) !== 'Football') return alphaMarkets(term);
  marketTerm = term;
  const query = term.trim().toLowerCase();
  const indexes = query ? [0,1,2,3,4,5,6] : [[0,1],[1],[2],[3],[4],[5,6]][group] || [0];
  return indexes.filter(index => [markets[index],...names(events[id],index)].join(' ').toLowerCase().includes(query))
    .map(index => '<section class="market"><h3>' + E(markets[index]) + '</h3>' + prices(id,index) + '</section>')
    .join('') || '<p>No matching markets.</p>';
};
const footballView = {time:'All matches', team:'All teams', following:false};
const footballAliases = {'Brighton':'Brighton & Hove Albion'};
function footballClub(name) { return footballAliases[name] || name; }
function footballTeams(competition) {
  if(competition==='International friendly')return ['France','England'];
  if(competition==='All')return [...new Set(Object.values(clubs).flat())].sort();
  return clubs[competition==='LaLiga'?'La Liga':competition] || [];
}
function footballPool() {
  return all.filter(i=>{
    const e=events[i], competition=leagues[e[2]];
    if(sportOf(e)!=='Football')return false;
    if(competition==='International friendly')return false;
    const roster=footballTeams(competition);
    return roster.includes(footballClub(e[0])) && roster.includes(footballClub(e[1]));
  });
}
function footballFilter(key,value) {
  if(key==='league'){league=value;footballView.team='All teams'}
  else footballView[key]=value;
  render();
}
function footballFollowed(i) {
  const e=events[i];
  return favs.includes(leagues[e[2]]) || e.slice(0,2).some(t=>favs.includes(t)||favs.includes(footballClub(t)));
}
function footballBrowserResults(){
 const pool=footballPool().filter(i=>{
   const e=events[i],text=[...e.slice(0,2),leagues[e[2]]].join(' ').toLowerCase();
   return (q.trim()||league==='All'||leagues[e[2]]===league) &&
     (footballView.team==='All teams'||e.slice(0,2).some(t=>footballClub(t)===footballView.team)) &&
     (!footballView.following||footballFollowed(i)) && text.includes(q.toLowerCase().trim());
 });
 const visible=pool.filter(i=>footballView.time==='All matches'||(footballView.time==='Live now'?!!events[i][3]:!events[i][3]));
 const categories=[...betaCompetitions];
 const grouped=categories.map(label=>fixtureGroup(label,visible.filter(i=>leagues[events[i][2]]===label),true)).join('');
 return '<p class="footballSummary">'+visible.length+' matches · Match result · Decimal odds</p>'+
  (grouped||'<div class="footballEmpty"><h2>No matches for these filters</h2><p>Choose another team or competition.</p></div>'+
    (footballView.time==='Live now'?fixtureGroup('Starting soon',pool.filter(i=>!events[i][3])):''));
}
function footballSearch(value){q=value;footballView.team='All teams';document.querySelector('[aria-label="Football team"]').value='All teams';document.getElementById('footballResults').innerHTML=footballBrowserResults()}
const alphaList = flightList;
flightList = function() {
 if(p!=='football')return alphaList();
 const pool=footballPool(),categories=['All',...betaCompetitions];
 const teams=footballTeams(league);
 const bubbles=categories.map(label=>{
   const count=label==='All'?pool.length:pool.filter(i=>leagues[events[i][2]]===label).length;
   const display=label==='All'?'All competitions':label==='LaLiga'?'La Liga':label==='International friendly'?'International friendlies':label;
   return btn(E(display)+' <small>'+count+'</small>','footballFilter("league",'+JSON.stringify(label)+')',league===label?'active':'');
 }).join('');
 return '<section class="footballHeading"><div><small>FOOTBALL / MATCHDAY</small><h1>Football</h1><p>Choose a competition or find your team.</p></div>'+
 '<a href="#6/home/0">Sports home →</a></section>'+
 '<div class="competitionBubbles footballLeagues" role="group" aria-label="Football competitions">'+bubbles+'</div>'+
 '<div class="footballControls"><input aria-label="Search football" placeholder="Search teams across all competitions" value="'+E(q)+'" oninput="footballSearch(this.value)">'+
 '<label>Team <select aria-label="Football team" onchange="footballFilter(&quot;team&quot;,this.value)">'+['All teams',...teams].map(t=>'<option '+(t===footballView.team?'selected':'')+'>'+E(t)+'</option>').join('')+'</select></label></div>'+
 '<div class="footballTools">'+['All matches','Live now','Starting soon'].map(t=>btn(t,'footballFilter("time",'+JSON.stringify(t)+')',footballView.time===t?'active':'')).join('')+
 btn((footballView.following?'★':'☆')+' Following','footballFilter("following",'+!footballView.following+')',footballView.following?'active':'')+'</div>'+
 (league==='International friendly'?'<p class="footballSummary">National-team exhibition matches · teams depend on the scheduled fixtures.</p>':'')+
 '<div id="footballResults">'+footballBrowserResults()+'</div>';
};

// One shared Slip / My bets panel, singles only, decimal USDT.
parlayMode = false;
legs = [];
offerNotation = 'decimal';
slipModes = () => '';
setParlay = function() { parlayMode=false; legs=[]; tab='Slip'; render(); };
formatOffer = value => Number(value).toFixed(2);
oddsSetting = () => '<small>Decimal odds · Stakes in USDT</small>';
changeNotation = () => { offerNotation='decimal';render(); };
const alphaHome = home;
home = function() {
  const html = alphaHome();
  const template = document.createElement('template');
  template.innerHTML = html;
  for (const section of template.content.querySelectorAll('.lowerDeck section')) {
    if (section.querySelector('h2')?.textContent === 'Hot Combos') {
      section.innerHTML = '<h2>Featured football</h2><small>Premier League · Live</small><h3>Arsenal v Brighton</h3>' +
        '<p>Explore match result, goals and goalscorers.</p>' + link('match','View markets →',0);
    }
  }
  return template.innerHTML;
};

const footballOriginalRow = flightRow;
flightRow = function(i) {
 if(p!=='football' || sportOf(events[i])!=='Football')return footballOriginalRow(i);
 const e=events[i];
 const sides=[0,1].map(k=>'<span class="footballCardSide">'+teamVisual(i,k)+'<b>'+E(e[k])+'</b>'+btn(favs.includes(e[k])?'★ Following':'☆ Follow','follow('+JSON.stringify(e[k])+')')+'</span>');
 return '<article class="footballMatchCard"><div class="footballCardMeta">'+clock(e)+link('match','All markets →',i)+'</div>'+
 '<div class="footballPitch">'+sides[0]+'<a class="footballScore" href="'+href('match',i)+'"><strong>'+E(e[3]?e[4]:'v')+'</strong><small>'+(e[3]?'Live score':'Today · '+E(e[4]))+'</small></a>'+sides[1]+'</div>'+
 '<div class="footballCardOdds"><small>Match result</small>'+prices(i)+'</div></article>';
};
// Featured players render as kit cards: club colour, shirt number, name and season output.
// An approved local portrait (player.image) sits on top of the kit and falls back to it on error.
const footballPreviousVisual = teamVisual;
const FOOTBALL_TURN = 4500, footballTurns = new Map();
function footballTrim(hex) {
  const n = parseInt((hex || '#2b5960').slice(1), 16);
  const [r, g, b] = [n >> 16, n >> 8 & 255, n & 255].map(v => { v /= 255; return v <= .04 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
  return .2126 * r + .7152 * g + .0722 * b > .4 ? '#0d1e27' : '#ffffff';
}
function footballKit(player, club) {
  const shirt = club.color || '#2b5960', trim = footballTrim(shirt), number = E(player.jersey || '');
  return '<svg class="footballKit" viewBox="0 0 100 95" aria-hidden="true">' +
    '<path d="M30 12 10 22 3 45 22 53 28 39 25 88H75L72 39 78 53 97 45 90 22 70 12 58 8Q50 23 42 8Z" fill="' + shirt + '" stroke="' + trim + '" stroke-opacity=".55" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M30 12 10 22 3 45 22 53 28 39 25 88H50V16Q46 14 42 8Z" fill="#fff" opacity=".08"/>' +
    '<path d="M42 8Q50 23 58 8" fill="none" stroke="' + trim + '" stroke-width="3.2" stroke-linecap="round"/>' +
    '<path d="M3.6 43 22.4 51M77.6 51 96.4 43" stroke="' + trim + '" stroke-width="3.4" stroke-linecap="round"/>' +
    (number ? '<text x="50" y="66" text-anchor="middle" fill="' + trim + '" font-family="Bahnschrift,Segoe UI,sans-serif" font-weight="800" font-size="' + (number.length > 1 ? 30 : 34) + '">' + number + '</text>' : '') +
    '</svg>';
}
function footballLine(player) {
  const g = Math.round(player.goals || 0), a = Math.round(player.assists || 0);
  return [player.position, g ? g + 'G' : '', a ? a + 'A' : ''].filter(Boolean).join(' · ');
}
function footballSlot(key, count) { return Math.floor((footballTurns.get(key) || 0) / FOOTBALL_TURN) % count; }
teamVisual = function(i,side) {
 if(sportOf(events[i])!=='Football')return footballPreviousVisual(i,side);
 const team=footballClub(events[i][side]);
 const club=footballPlayers[team], players=club?.players;
 if(!players?.length)return footballPreviousVisual(i,side);
 const key=i+'-'+side;
 if(!footballTurns.has(key))footballTurns.set(key,(footballTurns.size*0.618%1)*FOOTBALL_TURN);
 const current=footballSlot(key,players.length);
 const layers=players.map((player,index)=>{
   const kit=footballKit(player,club);
   const art=player.image?'<img src="'+E(player.image)+'" alt="" loading="lazy" decoding="async" onerror="this.remove()">'+kit:kit;
   return '<span class="portraitLayer '+(index===current?'shown':'')+'" aria-hidden="'+(index!==current)+'" title="'+E(player.name+(player.jersey?' #'+player.jersey:''))+'">'+art+
     '<span class="portraitName"><b>'+E(player.name)+'</b><small>'+E(footballLine(player))+'</small></span></span>';
 }).join('');
 const dots='<span class="footballDots" aria-hidden="true">'+players.map((_,index)=>'<i'+(index===current?' class="on"':'')+'></i>').join('')+'</span>';
 return '<span class="rosterPortrait footballRoster" style="--club:'+(club.color||'#4a7a80')+'" data-turn="'+key+'" aria-label="'+E(team)+' featured players">'+layers+dots+'</span>';
};
// Each card keeps its own clock: staggered start, paused off screen, paused while hovered.
let footballTick = performance.now();
updatePortraits = function() {
 const now = performance.now(), step = Math.min(now - footballTick, 1000);
 footballTick = now;
 for (const frame of document.querySelectorAll('.footballRoster[data-turn]')) {
   const key = frame.dataset.turn, box = frame.getBoundingClientRect();
   const visible = box.bottom > 0 && box.top < innerHeight && box.width > 0;
   if (!visible || frame.closest('.footballMatchCard, .scoreSide')?.matches(':hover')) continue;
   footballTurns.set(key, (footballTurns.get(key) || 0) + step);
   const layers = [...frame.querySelectorAll('.portraitLayer')], slot = footballSlot(key, layers.length);
   layers.forEach((layer, index) => { layer.classList.toggle('shown', index === slot); layer.setAttribute('aria-hidden', String(index !== slot)); });
   frame.querySelectorAll('.footballDots i').forEach((dot, index) => dot.classList.toggle('on', index === slot));
 }
 // Non-football frames (e.g. the France–England friendly) keep the shared page clock.
 const shared = portraitSlot();
 for (const frame of document.querySelectorAll('.rosterPortrait:not(.footballRoster)')) {
   const layers = [...frame.querySelectorAll('.portraitLayer:not([hidden])')];
   if (!layers.length) continue;
   const active = layers[shared % layers.length];
   for (const layer of layers) { layer.classList.toggle('shown', layer === active); layer.setAttribute('aria-hidden', String(layer !== active)); }
 }
};
render();

// Home banner: Hubie promo replaces the Champions League slide; side arrows replace the tiny ‹ › buttons.
promos[0] = ['hubie', 'Win big on sports', 'Football'];
promos.splice(1, 0, ['football', 'Football', 'Football']);
const alphaPromoArt = promoArt;
promoArt = function() {
 const [file, title, category] = promos[refPromoIndex];
 const dots = '<div class="promoControls">' + promos.map((item, k) => '<button aria-label="Show ' + item[1] + ' banner" aria-pressed="' + (refPromoIndex === k) + '" onclick="promoStep(' + k + ')"></button>').join('') + '</div>';
 const arrows = '<button class="promoArrow prev" aria-label="Previous banner" onclick="promoStep(refPromoIndex-1)">‹</button><button class="promoArrow next" aria-label="Next banner" onclick="promoStep(refPromoIndex+1)">›</button>';
 if (file !== 'hubie') return alphaPromoArt().replace('<div class="promoControls">', arrows + '<div class="promoControls">').replace(/<div class="promoControls">[\s\S]*<\/div><\/section>$/, dots + '</section>');
 return '<section class="promoArt hubiePromo" aria-label="Sports banners">' +
  '<button class="promoLink hubieSlide" aria-label="Win big on sports betting. Browse football" onclick="enterSport(\'Football\')">' +
  '<span class="hubieCopy"><small>HOUSEBETS SPORTS</small><strong>Win big on<br>every match</strong>' +
  '<span class="hubieSub">Football, basketball, esports and more. Back your picks before kick-off or live.</span>' +
  '<span class="hubieCta">Bet now →</span><em>18+ · Demo play · Bet responsibly</em></span>' +
  '<img class="hubieArt" alt="" src="assets/generated/hubie-banner.webp"></button>' + arrows + dots + '</section>';
};
addBannerControls = function() {
 const bar = document.querySelector('.promoControls');
 if (bar) bar.insertAdjacentHTML('beforeend', btn(prefs.auto ? 'Ⅱ' : '▶', 'option("auto",!prefs.auto)').replace('<button ', '<button class="promoPlay" aria-label="' + (prefs.auto ? 'Pause' : 'Play') + ' banners" '));
};
render();

// No international friendly in Beta: Premier League, Champions League, La Liga, Serie A and Bundesliga only.
for (const list of [all, live, soon]) { const k = list.indexOf(international); if (k >= 0) list.splice(k, 1); }
if (league === 'International friendly') league = 'All';
// Football lists only real clubs from the five competitions: drop the original prototype's made-up teams.
{
 const realFootball = new Set(footballPool());
 for (const list of [all, live, soon])
  for (let k = list.length - 1; k >= 0; k--) if (sportOf(events[list[k]]) === 'Football' && !realFootball.has(list[k])) list.splice(k, 1);
}
// Home featured cards: league football only, live first, then fixtures whose top players have real photos.
const alphaSnapRail = snapRail;
function footballPhotoScore(i) {
 return [0, 1].reduce((n, side) => n + (footballPlayers[footballClub(events[i][side])]?.players || []).filter(pl => pl.image).length, 0);
}
snapRail = function(ids) {
 if (p !== 'home') return alphaSnapRail(ids);
 const pool = footballPool().filter(i => sport === 'All' || sportOf(events[i]) === sport);
 if (!pool.length) return alphaSnapRail(ids);
 const ranked = [...pool].sort((a, b) => (!!events[b][3] - !!events[a][3]) || footballPhotoScore(b) - footballPhotoScore(a) || a - b);
 // Football chosen: a league shows only that league's cards; "All leagues" shows every football card.
 // Sports home (no sport chosen) keeps a short curated mix of nine.
 const chosenLeague = sport === 'Football' && league !== 'All';
 const scoped = chosenLeague ? ranked.filter(i => leagues[events[i][2]] === league) : ranked;
 const limit = sport === 'Football' ? scoped.length : 9;
 const byLeague = betaCompetitions.map(name => scoped.filter(i => leagues[events[i][2]] === name));
 const picks = scoped.filter(i => events[i][3]).slice(0, chosenLeague ? limit : 3);
 for (let round = 0; picks.length < limit && round < limit; round++)
  for (const list of byLeague) { const next = list.find(i => !picks.includes(i)); if (next !== undefined && picks.length < limit) picks.push(next); }
 return alphaSnapRail(picks.length ? picks : ids);
};
render();
