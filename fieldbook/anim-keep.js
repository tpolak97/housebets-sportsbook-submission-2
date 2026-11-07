'use strict';
/* Animations carry on through redraws. Most clicks call render(), which rebuilds the page, so every animated element is
   new and its CSS animation starts over (the surfing Hubie, looping sport icons), and duels were set up a frame or two
   late (frozen, no ball). After each render this:
   - sets up the Hubie duels immediately (hubie-kits.js / hubie-sports.js expose hkWatchNow / hsWatchNow);
   - puts looping icon animations on the page clock (startTime 0), so a redrawn icon continues mid-loop;
   - gives the header logo's animations the start time of the first logo, so it continues (or stays finished)
     instead of replaying. Load after every other render wrapper. */
{
let brandStart = null;
const pin = () => {
  const brand = document.querySelector('.brandHubie');
  if (brand) {
    const anims = brand.getAnimations({subtree: true});
    if (brandStart == null && anims.length) brandStart = document.timeline.currentTime ?? 0;
    if (brandStart != null) anims.forEach(a => { if (a.startTime !== brandStart) a.startTime = brandStart; });
  }
  document.querySelectorAll('.motionIcon:not(.brandScene)').forEach(svg => {
    if (svg.closest('.brandHubie')) return;
    svg.getAnimations({subtree: true}).forEach(a => {
      if (a.effect?.getComputedTiming?.().iterations === Infinity && a.startTime !== 0) a.startTime = 0;
    });
  });
};
const renderBefore = render;
render = function() {
  renderBefore();
  window.hkWatchNow?.();
  window.hsWatchNow?.();
  pin();
};
window.render = render;
pin();
}
