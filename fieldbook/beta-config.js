'use strict';
/* Submission preview uses fictional players and illustrated kits. */
window.BETA_CONFIG = {PLAYER_PHOTOS: false};
if (typeof footballPlayers !== 'undefined')
  for (const club of Object.values(footballPlayers)) for (const pl of club.players || []) delete pl.image;
