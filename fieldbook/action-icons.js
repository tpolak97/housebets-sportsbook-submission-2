{
const stroke = (d, colour = '#91ced0') =>
  '<path d="'+d+'" fill="none" stroke="'+colour+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
const disc = (x,y,r,fill) => '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'"/>';
const oval = '<ellipse cx="10" cy="21" rx="7" ry="4" fill="#ffd794"/>'+stroke('M7 21h6m-4-1v2m2-2v2','#924f38');
const net = stroke('M21 10v19m4-19v19m-4-16h4m-4 4h4m-4 4h4');
const posts = stroke('M30 5v18m10-18v18m-10-9h10m-5 0v15','#f9d582');
const wicket = stroke('M30 13v15m4-15v15m4-15v15m-9-16h10','#f5d39d');
const target = disc(34,16,9,'#dc817a')+disc(34,16,6,'#254658')+disc(34,16,3,'#ffd170');
const car = '<path fill="#ffac68" d="M2 19h4l3-5h7l3 4h4v6H2z"/>'+disc(7,24,2.8,'#bef6ff')+disc(18,24,2.8,'#bef6ff');
const glove = '<path d="M3 20v-5l3-4h6l3 3v4l3-1v4l-5 3H5z" fill="#ff9c88"/>'+stroke('M5 21h7','#623f50');
const puck = '<ellipse cx="10" cy="24" rx="5" ry="2.5" fill="#c4ebff"/>';
const spur = stroke('M4 18l6 6h8','#ffb489');
const stick = stroke('M3 6l8 18h7','#ffc47a');
const bat = stroke('M3 8l11 15','#f4b27a');
const batNet = stroke('M34 9v16h8V9zm4 0v16m-4-8h8');
const track = stroke('M2 28h18q9 0 12-12t12-11','#7294aa');
const flag = stroke('M34 28V5l9 3-9 4','#a9efc2');
const scene = (fixed, prop, mid, end) => ({fixed, prop, mid, end});
const scenes = {
  'MMA':scene(stroke('M23 5h13l7 8v9l-7 7H23','#679399')+disc(32,17,6,'#d4b0a0'),glove,[6,-5,-22],[17,-3,9]),
  'Boxing':scene(stroke('M34 2v5')+'<rect x="29" y="6" width="10" height="21" rx="5" fill="#dc7979"/>',glove,[-1,2,-9],[14,-3,4]),
  'Rugby':scene(posts+spur,oval,[11,-15,-48],[26,-13,-130]),
  'American Football':scene(stroke('M29 27l8-9m-8 0 4 4 8-8','#90e3bb'),oval,[12,-9,90],[26,-4,190]),
  'Aussie Rules':scene(stroke('M24 15v13m5-23v23m7-23v23m6-13v13'),oval,[7,-12,65],[22,-16,135]),
  'Volleyball':scene(net,disc(9,15,5,'#fbd77d')+stroke('M5 15q5-1 6-5m-3 9q1-4 6-4','#926455'),[8,-10,-30],[28,10,120]),
  'Motor Racing':scene(track,car,[13,1,-8],[24,-12,-52]),
  'Formula 1':scene(stroke('M1 27h43m-9-8h8m-6-3h6'),car,[10,0,0],[21,-2,-5]),
  'Novelties':scene(stroke('M24 24h17l-3 6H27z','#c199ff'),'<path d="m10 8 2 5 5 1-4 4 1 5-4-2-5 2 1-5-4-4 6-1z" fill="#ffce57"/>',[11,-7,125],[22,9,320]),
  'Baseball':scene(bat+stroke('M31 22l6-4 5 4-5 5z'),disc(12,20,3.8,'#ffe8d4'),[10,-10,45],[28,-14,120]),
  'Cricket':scene(wicket+bat,disc(7,15,3.5,'#fd8378'),[13,11,90],[26,-2,200]),
  'Badminton':scene(net,'<path d="m5 8 10 5-5 6z" fill="#d3eeef"/>'+disc(13,16,2.5,'#ffbd7f'),[9,-7,55],[28,6,110]),
  'Table Tennis':scene(net+stroke('M2 25h41m-35 0v5m31-5v5'),disc(9,14,3.4,'#ffb479'),[9,-5,0],[28,8,0]),
  'Golf':scene(flag+stroke('M23 29q10-4 19 0'),disc(7,25,3.2,'#e4f9df'),[15,-18,0],[27,2,0]),
  'Darts':scene(target,stroke('M3 16h12l-4-3m4 3-4 3','#ffde88'),[8,-2,-8],[20,0,0]),
  'Handball':scene(batNet+spur,disc(12,19,4.4,'#eea073'),[8,-10,0],[25,-4,90]),
  'Ice Hockey':scene(batNet+stick,puck,[9,0,0],[28,-4,0]),
  'Horse Racing':scene(flag,'<path d="m3 18 3-5 8 1 3-5 4 1-1 5-4 2-2 5 3 4m-7-5-4 5m3-10-6 5" fill="#e7b585" stroke="#e7b585" stroke-width="2"/>',[9,-4,-8],[21,0,6])
};

// The tool winds up first; the ball leaves from its contact point on the same beat.
const tool = art => '<g class="swing">'+art+'</g>';
const boot = '<path d="M4 3h7l-1 11 3 5 7 2q3 4-2 5L5 24l-2-5 3-6z" fill="#8bcfde"/>'+stroke('m10 18 4 2m-7 5 1 2m4-2 1 2','#efffff');
const plays={
 Football:[tool(boot),disc(23,23,5.6,'#ecf7f5')+'<path d="m23 19 3 2-1 4h-4l-1-3z" fill="#174351"/>',[9,-6,65],[16,-13,120]],
 Baseball:[tool('<path d="m5 28-2-2 5-4L18 7q3-3 5 0l-1 3L10 24z" fill="#f5bd80"/>'),disc(25,9,4.6,'#fff2db')+stroke('M23 6q3 3 1 6','#c05152'),[7,-2,30],[15,-4,100]],
 Tennis:[tool(stroke('m4 29 8-10','#ffb781')+'<ellipse cx="16" cy="15" rx="7" ry="9" transform="rotate(30 16 15)" fill="#225563" stroke="#8ce8d9" stroke-width="2.5"/>'+stroke('m12 12 8 4m-9 0 7 3m-1-10-4 10m7-8-4 10','#8ce8d9')),disc(25,12,4,'#d8f366')+stroke('m24 9 2 5','#ffffd7'),[8,-5,35],[16,0,95]],
 'American Football':[posts+tool('<path d="m2 16 5 1 3 6 6 1v4H5z" fill="#92ccde"/>'),'<ellipse cx="18" cy="23" rx="6" ry="3.7" transform="rotate(-25 18 23)" fill="#d89366"/>'+stroke('m15 24 6-3m-4 1 1 2','#fff1cc'),[8,-10,-55],[17,-16,-115]],
 Basketball:[stroke('M38 3h5v11h-5m-13 3 3 10h5l3-10m-10 1 7 8m1-8-6 8','#aadbe0')+stroke('M24 16h14','#ff8553')+'<g class="reach"><path d="m2 28 5-7 8-5 2-5 2 1-1 5 4-3 2 2-5 6-8 4-5 7z" fill="#dda17a"/></g>',disc(20,11,5.7,'#ffa450')+stroke('M15 11h10m-6-5q4 6 1 11','#743b28'),[10,-4,5],[11,13,20]],
 'Ice Hockey':[batNet+tool(stroke('m3 3 9 21 9 1','#ffc888')+stroke('m15 24 6 1','#fff0ce')),'<ellipse cx="23" cy="25" rx="4.8" ry="2.6" fill="#bddef4"/>',[9,-1,0],[15,-6,0]]
};
const emblems={
 'League of Legends':['#edc571','M10 4h11l-3 4v17h9l3-4-2 9H9l3-4V8z'],
 'Dota 2':['#ff8974','M3 3h26v26H3z M6 6l18 21 2-3L10 5z M22 6l4 7V6z M6 20v6h7z'],
 'Overwatch':['#ffb454','M3 17a13 13 0 1 1 26 0h-4a9 9 0 1 0-18 0z M4 21l10-9v8l-7 7z M28 21l-10-9v8l7 7z'],
 'Rainbow Six':['#eaeff5','M23 3H12L6 12v12l5 5h11l5-6v-9H15l2-5h6z M14 19h6v5h-6z']
};
const soldier = '<circle cx="9" cy="11" r="3.5" fill="#ffcc97"/><path d="M5 11q0-7 7-4l2 4zm2 4 6-1 3 3 5-1v3l-7 2-3-2-1 4 4 5-3 2-5-6-2 5H1l3-10z" fill="#94bdc5"/>'+stroke('M14 15h11m-7 0 1 4','#f0dac0')+'<path class="flash" d="m25 15 5-3-1 3 4 1-7 1z" fill="#ffe29b"/>';
// Play a self-contained SVG on entry. Its clock starts when the image loads,
// so the strike and ball flight share a timeline independent of ambient CSS.
const replayImages=new Map();
const motion=(type,values,times)=>'<animateTransform attributeName="transform" type="'+type+'" values="'+values+'" keyTimes="'+times+'" dur="1.45s" repeatCount="indefinite"/>';
function replayImage(name){
 if(replayImages.has(name))return replayImages.get(name);
 const [equipment,ball,mid,end]=plays[name];
 const pivot={Football:'7 9',Tennis:'5 27',Baseball:'5 26','American Football':'5 18','Ice Hockey':'4 6'};
 let moving=equipment;
 if(name==='Basketball'){
   moving=moving.replace('<g class="reach">','<g>'+motion('translate','0 0;3 -2;10 -4;11 4;3 0;0 0','0;.16;.4;.65;.85;1'));
 }else{
   const center=pivot[name];
   const rotate=[0,-42,0,20,0,0].map(a=>a+' '+center).join(';');
   moving=moving.replace('<g class="swing">','<g>'+motion('rotate',rotate,'0;.19;.34;.5;.83;1'));
 }
 const path=name==='Basketball'?'0 0;3 -2;10 -4;11 5;11 15;11 15;0 0;0 0':
   '0 0;0 0;0 0;'+mid.slice(0,2).join(' ')+';'+end.slice(0,2).join(' ')+';'+end.slice(0,2).join(' ')+';0 0;0 0';
 const flight=motion('translate',path,'0;.16;.34;.53;.69;.77;.78;1');
 const fade='<animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0;.69;.77;.8;.92;1" dur="1.45s" repeatCount="indefinite"/>';
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 34">'+moving+'<g>'+flight+fade+ball+'</g></svg>';
 const src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
 replayImages.set(name,src);
 return src;
}
function replaySport(event){
 const button=event.target.closest?.('button[data-sport]');
 if(!button||button.contains(event.relatedTarget)||!plays[button.dataset.sport]||button.querySelector('.contactReplay'))return;
 const original=button.querySelector('.contactPlay');
 if(!original)return;
 const player=document.createElement('img');
 player.className='contactReplay';
 player.alt='';
 player.src=replayImage(button.dataset.sport);
 original.after(player);
}
function stopReplay(event){
 const button=event.target.closest?.('button[data-sport]');
 if(button&&!button.contains(event.relatedTarget))button.querySelector('.contactReplay')?.remove();
}
document.addEventListener('pointerover',replaySport);
document.addEventListener('pointerout',stopReplay);
document.addEventListener('focusin',replaySport);
document.addEventListener('focusout',stopReplay);
const previous=icon;
icon=function(name){
 const svg=(cls,body,style='')=>'<svg aria-hidden="true" class="sportIcon actionIcon '+cls+'" viewBox="0 0 46 34" style="'+style+'">'+body+'</svg>';
 if(catalog.indexOf(name)>=catalog.indexOf('Arena of Valor')){
   if(['Call of Duty','Counter-Strike 2','CS2 Duels'].includes(name)){
     const dual=name!=='Call of Duty';
     return svg('shooter',dual?'<g transform="translate(0 4) scale(.76)">'+soldier+'</g><g transform="translate(46 4) scale(-.76 .76)">'+soldier+'</g>':'<g transform="translate(4 -2) scale(1.2)">'+soldier+'</g>');
   }
   const [ink,d]=emblems[name]||[inks[catalog.indexOf(name)%inks.length],glyphs[name]];
   return svg('gameMark','<g class="seal"><circle cx="23" cy="17" r="14" fill="#0d1e27" stroke="currentColor"/><path d="'+d+'" transform="translate(11 5) scale(.75)" fill="currentColor" fill-rule="evenodd" stroke="currentColor" stroke-width=".9"/></g>','color:'+ink);
 }
 const p=plays[name], action=p?scene(...p):scenes[name];
 if(!action)return previous(name);
 const t=([x,y,r])=>'translate('+x+'px,'+y+'px) rotate('+r+'deg)';
 return svg(p?'contactPlay':'sportScene',action.fixed+'<g class="'+(p?'shot':'actProp')+'">'+action.prop+'</g>','--mid:'+t(action.mid)+';--finish:'+t(action.end));
};
}
