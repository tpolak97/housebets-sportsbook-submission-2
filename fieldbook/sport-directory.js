'use strict';
/* Beta sport directory: Sports / Esports / Racing tabs, proper display names, animated icons and live counts.
   Internal sport names stay as the engine knows them; [internal, display] pairs only change what people read. */
{
const SPORTS = [['Football'], ['Tennis'], ['American Football'], ['Baseball'], ['eSoccer'], ['Basketball'], ['Golf'], ['MMA', 'Mixed Martial Arts'],
  ['Ice Hockey'], ['Boxing'], ['eBasketball'], ['Handball'], ['Table Tennis'], ['Cricket'], ['Volleyball'], ['eSoccer: Volta'],
  ['eHorse Racing'], ['eSoccer: Penalty'], ['eCricket'], ['Darts'], ['eFighting'], ['Aussie Rules', 'Australian Football'], ['Rugby', 'Rugby Union'],
  ['Formula 1'], ['Badminton'], ['Snooker'], ['Water Polo'], ['Cross-Country'], ['Floorball'], ['Cycling'], ['Lacrosse'], ['Alpine Skiing'],
  ['Biathlon'], ['Ski Jumping'], ['Sumo'], ['Motorcycle Racing'], ['Chess'], ['Padel Tennis'], ['Bowls'], ['Rugby League'], ['Nascar'],
  ['Sailing'], ['Kabaddi'], ['Motor Racing', 'Touring Car Racing'], ['Formula 2'], ['eCricket: X-Battle Bats'], ['eVaquejada'], ['eHockey']];
const ESPORTS = [['Esports Hub'], ['Counter-Strike 2', 'Counter-Strike'], ['Call of Duty'], ['League of Legends'], ['Dota 2'], ['Rainbow Six'],
  ['Arena of Valor'], ['King of Glory'], ['Mobile Legends'], ['World of Tanks'], ['Overwatch', 'Overwatch 2'], ['Warcraft 3', 'WarCraft III'],
  ['Crossfire'], ['FIFA', 'FC 27'], ['NBA2K', 'NBA 2K27'], ['Cricket 24'], ['CS2 Duels'], ['Madden', 'Madden NFL']];
const RACING = [['Horse Racing', 'Horse racing'], ['Greyhound'], ['Harness']];
const HOT = new Set(['Football', 'Tennis', 'Counter-Strike 2']);
// Motorsports are racing (sidebar All racing and the directory's Racing tab).
for (const k of ['Formula 1', 'Formula 2', 'Nascar', 'Motor Racing', 'Motorcycle Racing']) { const i = SPORTS.findIndex(r => r[0] === k); if (i >= 0) RACING.push(...SPORTS.splice(i, 1)); }
const TABS = {Sports: SPORTS, Esports: ESPORTS, Racing: RACING};
window.sportDirectoryTabs = TABS;  // rail-boxes.js builds the sidebar's All sports / esports / racing from these
const display = Object.fromEntries([...SPORTS, ...ESPORTS, ...RACING].filter(r => r[1]).map(([k, v]) => [k, v]));
window.sportLabel = name => display[name] || name;
let directoryTab = 'Sports';

window.sportCountsAll = () => sportCounts();
function sportCounts() {
  const counts = {};
  for (const i of all) { const s = sportOf(events[i]); counts[s] = (counts[s] || 0) + 1; }
  counts['Esports Hub'] = ESPORTS.slice(1).reduce((n, [k]) => n + (counts[k] || 0), 0);
  return counts;
}
function directoryGrid() {
  const counts = sportCounts();
  return TABS[directoryTab].map(([name, label = name]) =>
    '<button class="dirSport" data-sport="' + E(name) + '" aria-pressed="' + (sport === name) + '" onclick="pickDirectorySport(this.dataset.sport)">' +
    '<span class="dirIcon">' + icon(name) + (HOT.has(name) ? '<i class="dirHot" aria-label="Hot">🔥</i>' : '') + '</span>' +
    '<span class="dirName">' + E(label) + '</span>' + (counts[name] ? '<b class="dirCount">' + counts[name] + '</b>' : '<small class="dirNone">No events</small>') + '</button>').join('');
}
function directoryBody() {
  return '<div class="dirHead"><div class="dirTabs" role="tablist">' + Object.keys(TABS).map(t =>
    '<button role="tab" aria-selected="' + (t === directoryTab) + '" onclick="sportDirectoryTab(\'' + t + '\')">' + t + '</button>').join('') + '</div>' +
    '<button class="dirAll" onclick="pickDirectorySport(\'All\')">Show all</button>' +
    '<button class="dirClose" aria-label="Close sport directory" onclick="closeSportDirectory()">×</button></div>' +
    '<div class="dirGrid" role="tabpanel" aria-label="' + directoryTab + '">' + directoryGrid() + '</div>';
}
window.openSportDirectory = function(tab) {
  if (tab) directoryTab = tab;
  else if (ESPORTS.some(([k]) => k === sport)) directoryTab = 'Esports';
  else if (RACING.some(([k]) => k === sport)) directoryTab = 'Racing';
  let d = document.getElementById('sportDirectory');
  if (!d) {
    d = document.createElement('dialog');
    d.id = 'sportDirectory';
    d.setAttribute('aria-label', 'All sports');
    d.addEventListener('click', e => { if (e.target === d) d.close(); });
    document.body.appendChild(d);
  }
  d.innerHTML = directoryBody();
  if (!d.open) d.showModal();
  d.querySelector('.dirGrid [aria-pressed=true], .dirTabs [aria-selected=true]')?.focus();
};
window.sportDirectoryTab = function(tab) {
  directoryTab = tab;
  const d = document.getElementById('sportDirectory');
  d.innerHTML = directoryBody();
  d.querySelector('.dirTabs [aria-selected=true]')?.focus();
};
window.closeSportDirectory = () => document.getElementById('sportDirectory')?.close();
window.pickDirectorySport = function(name) {
  closeSportDirectory();
  enterSport(name === 'Esports Hub' ? 'All' : name);
};

// Sidebar: proper names, "All sports" opens the directory, Racing gets its own group.
const alphaRailSport = railSport;
railSport = function(name) {
  if (name === 'All') return '<button data-sport="All" aria-label="All sports" title="All sports" class="openDirectory" onclick="openSportDirectory()">' + toolbarMark('sports') + '<span>All sports</span></button>';
  return alphaRailSport(name).replace(/(aria-label|title)="[^"]*"/g, (m, attr) => attr + '="' + E(sportLabel(name)) + '"').replace('<span>' + E(name) + '</span>', '<span>' + E(sportLabel(name)) + '</span>');
};
const alphaSiteRail = siteRail;
siteRail = function(casino) {
  let html = alphaSiteRail(casino);
  if (casino) return html;
  const racing = RACING.filter(([k]) => catalog.includes(k)).map(([k]) => railSport(k)).join('');
  for (const [k] of RACING) html = html.replace(railSport(k), '');
  for (const k of ['Novelties']) html = html.replace(railSport(k), '');
  return html.replace('<small>Esports</small>', '<small>Racing</small>' + racing + '<small>Esports</small>');
};
toggleDirectory = () => openSportDirectory();

// Home sport bar: an "All sports" button that opens the directory; pill labels use proper names.
const alphaSportRail = fixtureSportRail;
fixtureSportRail = function() {
  return alphaSportRail().replace('<div class="sportBar">', '<div class="sportBar"><button class="openDirectory barDirectory" onclick="openSportDirectory()" aria-label="Open all sports">' + toolbarMark('sports') + '<span>All sports</span></button>');
};
const alphaSportChoice = sportChoice;
sportChoice = name => alphaSportChoice(name).replace('>' + E(name) + '<', '>' + E(sportLabel(name)) + '<');
render();
}
