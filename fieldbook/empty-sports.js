'use strict';
/* Sports in the directory with no fixtures yet (Snooker, Sumo...) get a clear empty state instead of a blank list. */
{
// Older Beta visits were seeded with a made-up 'North Dock' open bet; drop it from saved history.
if (bets.some(b => /North Dock/.test(b.fixture || ''))) { bets = bets.filter(b => !/North Dock/.test(b.fixture || '')); persist(); }
const renderBeforeEmpty = render;
render = function() {
  renderBeforeEmpty();
  if (p !== 'home' || sport === 'All' || all.some(i => sportOf(events[i]) === sport)) return;
  const head = document.querySelector('main .slateHeading');
  if (!head || head.nextElementSibling?.classList.contains('noEvents')) return;
  const name = typeof sportLabel === 'function' ? sportLabel(sport) : sport;
  head.insertAdjacentHTML('afterend', '<section class="noEvents" aria-live="polite"><div class="noEventsIcon">' + icon(sport) + '</div>' +
    '<h3>No ' + E(name) + ' events right now</h3><p>Fixtures appear here as soon as they are scheduled. In the meantime:</p>' +
    '<div><button onclick="enterSport(\'Football\')">Browse Football</button><button onclick="openSportDirectory()">All sports</button></div></section>');
};
window.render = render;
render();
}
