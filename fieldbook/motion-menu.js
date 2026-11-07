'use strict';
/* The Motion switch moves out of the header into the profile menu (it's a settings choice, not something
   to sit next to the wallet). It still remembers the choice and follows the device's Reduce Motion setting by default. */
{
const renderBeforeMenu = render;
render = function() {
  renderBeforeMenu();
  document.querySelectorAll('header .motionSwitch').forEach(b => b.remove());
  const menu = document.getElementById('profileMenu');
  if (menu && !menu.querySelector('.pmMotion')) {
    const settings = [...menu.querySelectorAll('button')].find(b => b.textContent === 'Settings');
    const html = '<button class="pmMotion" role="switch" aria-checked="' + motionOn + '" onclick="toggleMotion()">Animations<span>' + (motionOn ? 'On' : 'Off') + '</span></button>';
    settings ? settings.insertAdjacentHTML('beforebegin', html) : menu.insertAdjacentHTML('beforeend', html);
  }
};
window.render = render;
render();
}
