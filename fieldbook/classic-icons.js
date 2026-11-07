'use strict';
/* Submission 2 / 3: classic sport icons without Hubie (hubie-motion.js is not loaded).
   The original scenes drew cut-off legs and arms kicking or throwing. This removes those body parts so each icon is
   just the gear in motion: the ball into the goal, the hoop, the puck off the stick. Ball paths and timing are unchanged. */
{
const SM = window.sportMotion;
if (SM) {
  const BODY = {
    Football: ['fbLeg', 'fbThigh', 'fbShin'], 'American Football': ['afLeg'], 'Aussie Rules': ['arLeg'], Rugby: ['rgLeg'], 'Rugby League': ['rgLeg'],
    Basketball: ['bbPlayer', 'bbArm'], Handball: ['hbArm'], Volleyball: ['vbArm'], 'Water Polo': ['wpArm']
  };
  for (const [name, groups] of Object.entries(BODY)) {
    let html = SM.art[name];
    if (!html) continue;
    const found = [...html.matchAll(/<g class="(\w+(?:Leg|Thigh|Shin|Arm|Player|Foot|Boot))"/g)].map(m => m[1]);
    for (const cls of [...groups, ...found]) { let el; while ((el = SM.element(html, cls))) html = html.replace(el, ''); }
    SM.art[name] = html;
  }
  // Football's standing leg and shorts are loose paths, not a group.
  if (SM.art.Football) SM.art.Football = SM.art.Football.replace(/<path d="(?:M7 6\.4 7\.6 16\.6|M7\.6 16\.6 6\.6 26|M3\.4 25\.6h5\.4[^"]*|M3\.6 0h9l1 7\.6H2\.6z|M8 0v7)"[^>]*\/>/g, '');
  // Football: the ball starts further back (it sat at the removed kicker's foot, right by the goal) and travels
  // the extra distance during the kick, so the shot reads as a proper strike into the net.
  if (SM.art.Football) {
    let html = SM.art.Football;
    const ball = SM.element(html, 'fbBall'), burst = SM.element(html, 'fbBurst');
    if (ball) html = html.replace(ball, '<g class="fbBallBack">' + ball + '</g>');
    if (burst) html = html.replace(burst, '<g transform="translate(-11 0)">' + burst + '</g>');
    SM.art.Football = html;
    const css = document.createElement('style');
    css.textContent = '.motionIcon .fbBallBack{transform:translateX(-11px)}' +
      '@keyframes sm-fbBallBack{0%,34%{transform:translateX(-11px)}70%,92%{transform:translateX(0)}96%,100%{transform:translateX(-11px)}}' +
      'html.iconMotionEnabled :is(button,a):is(:hover,:focus-visible,:active,[aria-pressed=true]) .motionIcon .fbBallBack,html.iconMotionEnabled .active .motionIcon .fbBallBack{animation:sm-fbBallBack 1.6s ease-in-out infinite}' +
      'html:not(.iconMotionEnabled) .motionIcon .fbBallBack{animation:none}';
    document.head.appendChild(css);
  }
  SM.rebuild();
  render();
}
}
