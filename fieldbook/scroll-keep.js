'use strict';
/* Keep your place when the page redraws. Most clicks (market tabs, Follow, cash-out, filters) call render(), which
   rebuilds the page; when the new content is shorter the browser clamps the scroll and it feels like a jump to the top.
   On the same page, this keeps the market tabs (or the scroll position) where they were on screen and holds the page
   height so it cannot snap upward. Moving to another page scrolls normally. Load last. */
{
let lastKey = null;
const anchor = () => document.querySelector('.marketTabs') || document.querySelector('.mpBar');
const renderBefore = render;
render = function() {
  const key = p + ':' + (p === 'match' ? id : '');
  const same = key === lastKey;
  lastKey = key;
  if (!same) { document.body.style.minHeight = ''; return renderBefore(); }
  const y = scrollY, a = anchor(), aTop = a ? a.getBoundingClientRect().top : null;
  document.body.style.minHeight = document.documentElement.scrollHeight + 'px';
  renderBefore();
  const b = anchor();
  const target = Math.max(0, b && aTop != null && aTop < innerHeight && aTop > -b.offsetHeight ? scrollY + b.getBoundingClientRect().top - aTop : y);
  document.body.style.minHeight = Math.max(target + innerHeight, 0) + 'px';
  window.scrollTo(0, target);
  requestAnimationFrame(() => { if (Math.abs(scrollY - target) > 2) window.scrollTo(0, target); });
};
window.render = render;
}
