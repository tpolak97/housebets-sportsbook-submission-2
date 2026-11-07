'use strict';
/* Keep only the surfing Hubie header logo from hubie-motion.js; the sport icons stay classic (no Hubie).
   Loaded twice around hubie-motion.js: the first load snapshots the classic scenes and icon(), the second restores them.
   index.html: classic-icons.js → hubie-brand-only.js?save → hubie-motion.js → hubie-brand-only.js?restore */
{
const SM = window.sportMotion;
if (SM && !window.__hbClassic) {
  window.__hbClassic = {art: {...SM.art}, icon};
} else if (SM && window.__hbClassic) {
  const saved = window.__hbClassic;
  for (const k of Object.keys(SM.art)) if (!(k in saved.art)) delete SM.art[k];
  Object.assign(SM.art, saved.art);
  icon = saved.icon;
  SM.rebuild();
  delete window.__hbClassic;
  render();
}
}
