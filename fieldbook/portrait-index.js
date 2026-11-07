// The same selector can run in a provider adapter or in this static demo.
function buildPortraitIndex(roster) {
  const groups = new Map();
  for (const player of roster) {
    const {sport, season, teamId, id, name, seasonScore, image} = player;
    if (![sport, season, teamId, id, name].every(value => typeof value === 'string' && value.trim()) ||
        player.active !== true || player.approved !== true || !Number.isFinite(seasonScore) ||
        typeof image !== 'string' || !/^(?:https:\/\/|players\/[\w-]+\.webp$)/.test(image)) continue;
    const key = JSON.stringify([sport, season, teamId]);
    if (!groups.has(key)) groups.set(key, new Map());
    groups.get(key).set(id, player);
  }
  return Object.fromEntries([...groups].map(([key, members]) => [
    key, [...members.values()].sort((a,b) => b.seasonScore - a.seasonScore || a.id.localeCompare(b.id))
      .slice(0,3).map(({id,name,image}) => ({id,name,image}))
  ]));
}
if (typeof module !== 'undefined' && module.exports) module.exports = {buildPortraitIndex};
