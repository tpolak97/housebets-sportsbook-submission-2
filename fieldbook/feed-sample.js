// Replace this object before playbooks.js runs. Feed order is not significant.
window.fieldFeed={
 teams:[
  {id:"fra",name:"France",flag:"assets/fr.svg"},
  {id:"eng",name:"England",flag:"assets/eng.svg"},
  {id:"ori",name:"Orbit Five",flag:"assets/orbit.svg"},
  {id:"vel",name:"Velvet Circuit",flag:"assets/velvet.svg"}
 ],
 fixtures:[
  {id:"demo-mid-01",sport:"Dota 2",competition:"Lantern Invitational",home:"ori",away:"vel",live:true,score:"14–12",period:"Map 2 · 21:08",resultOdds:[1.83,2.12]},
  {id:"demo-hoops-01",sport:"Basketball",competition:"City Showcase",home:"vel",away:"ori",live:false,start:"18:25",resultOdds:[2.05,1.86]}
 ]
};

// Demo scheduling is relative to the presentation date; production sends an ISO instant.
const tomorrowTipoff = new Date();
tomorrowTipoff.setDate(tomorrowTipoff.getDate()+1);
tomorrowTipoff.setHours(18,0,0,0);
Object.assign(window.fieldFeed.fixtures.find(f=>f.id==='demo-hoops-01'), {
  start:'18:00', startsAt:tomorrowTipoff.toISOString(), season:'demo-season'
});
window.fieldFeed.season='demo-season';
// Synthetic season ratings. Basketball reuses the cutouts as stand-in artwork.
const demoRoster=[
 ['Football','fra',[['Luc Varenne','captain',93],['Remi Sol','keeper',87],['Noel Ardent','volley',84]]],
 ['Football','eng',[['Ellis Rowan','winger',95],['Robin Vale','defender',88],['Jude Fen','sprint',86]]],
 ['Basketball','vel',[['Mika Lane','celebration',89],['Sol Wren','volley',85],['Kit Hale','defender',83]]],
 ['Basketball','ori',[['Ari Gale','sprint',92],['Cam Ives','captain',86],['Ren Ames','keeper',82]]]
];
window.fieldFeed.roster=demoRoster.flatMap(([sport,teamId,members])=>members.map(([name,pose,seasonScore],index)=>({
 id:teamId+'-'+(index+1),name,sport,teamId,season:'demo-season',seasonScore,
 active:true,approved:true,image:'players/'+pose+'.webp'
})));
