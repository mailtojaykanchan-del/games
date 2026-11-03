/* Pocket Arcade expansion: self-contained games, no downloads or external engines. */
const extraGames = [
['munch','Maze Muncher','Arcade','Eat every dot. Outsmart the chasers.','◕','maze'],
['bricks','Brick Breaker','Arcade','Bounce through a wall of color.','▰','live'],
['invaders','Space Defender','Arcade','Protect your corner of the galaxy.','♜','live'],
['asteroids','Asteroid Dodge','Arcade','Stay clear of the falling rocks.','☄','live'],
['sky','Sky Hopper','Arcade','A little flap. A narrow gap.','⌁','live'],
['crossing','Road Crossing','Arcade','Five safe trips across the traffic.','↟','live'],
['racer','Lane Racer','Arcade','Three lanes. Keep your cool.','▥','live'],
['catcher','Star Catcher','Arcade','Catch stars and leave the bombs.','★','live'],
['fruit','Fruit Tap','Arcade','Catch flying fruit with a tap.','◒','live'],
['targets','Target Practice','Quick','Ten targets. Make every tap count.','◎','live'],
['balloons','Balloon Pop','Quick','Pop them before they float away.','♧','live'],
['orbit','Orbit Dash','Arcade','Circle the sun. Dodge the comets.','◉','live'],
['runner','Hurdle Runner','Arcade','Jump your way to a new best.','⌃','live'],
['balance','Balance Ball','Arcade','A steady hand wins the day.','⚖','live'],
['stack','Stack Tower','Arcade','Stop each block on the one below.','▤','live'],
['lander','Moon Lander','Arcade','A soft landing makes all the difference.','♧','live'],
['keepup','Keepy Uppy','Arcade','Keep the ball off the ground.','●','live'],
['tunnel','Tunnel Flight','Arcade','Steer through a winding passage.','〰','live'],
['bubbles','Bubble Clusters','Brain','Clear connected groups of color.','●●','grid'],
['fifteen','Fifteen Puzzle','Brain','Put fifteen tiles back in order.','15','grid'],
['sudoku','Mini Sudoku','Brain','Sixteen squares. Four of each number.','1234','grid'],
['code','Code Breaker','Brain','Crack a secret four-digit code.','? ?','board'],
['reversi','Reversi','Brain','Flip the board in your favor.','◐','board'],
['hanoi','Tower of Hanoi','Brain','Move the tower, one disc at a time.','△','board'],
['nim','Last Stone','Brain','Take one, two, or three. Take the last to win.','•••','board'],
['pegs','Peg Solitaire','Brain','Jump pegs until only one remains.','⊙','board'],
['battleships','Fleet Finder','Brain','Find the hidden fleet in 30 shots.','⚑','board'],
['dots','Dots & Boxes','Brain','Close a square. Claim a point.','▧','board'],
['rps','Rock Paper Scissors','Quick','First to five wins the showdown.','✌','cards'],
['highlow','Higher or Lower','Cards','Read the next card. Beat your streak.','↑↓','cards'],
['blackjack','Twenty One','Cards','Get close to 21 without going over.','A♠','cards'],
['shutbox','Shut the Box','Cards','Roll, choose, and close every number.','⚄','cards'],
['pigdice','Dice Dash','Cards','Bank your points before a one appears.','⚂','cards'],
['dicepoker','Dice Combos','Cards','Two rerolls to find a winning hand.','⚅','cards'],
['arithmetic','Math Sprint','Brain','Ten sums. How many can you solve?','+−','quiz'],
['multiplication','Times Table','Brain','A quick multiplication workout.','×','quiz'],
['division','Division Dash','Brain','Divide and conquer ten questions.','÷','quiz'],
['fractions','Fraction Match','Brain','Spot the equivalent fraction.','½','quiz'],
['binary','Binary Decoder','Brain','Turn ones and zeros into numbers.','101','quiz'],
['primes','Prime Hunt','Brain','Find the prime in the crowd.','17','quiz'],
['sequence','Number Patterns','Brain','Find what comes next.','2 4 ?','quiz'],
['stroop','Color Clash','Quick','Name the ink. Ignore the word.','Aa','quiz'],
['numbermemory','Number Recall','Brain','Remember a longer number each round.','1?3','memory'],
['typing','Typing Sprint','Word','A sentence, a keyboard, a personal best.','Aa','word'],
['wordsearch','Word Search','Word','Discover five words in the letter grid.','ABC','word'],
['wordladder','Word Ladder','Word','Change one letter at a time.','CAT','word'],
['alphabet','Alphabet Dash','Word','Tap A to Z in order.','A→Z','grid'],
['oddone','Odd One Out','Quick','One symbol is different. Find it.','◆◇','quiz'],
['visualmemory','Pattern Recall','Brain','Remember where the squares light up.','▦','memory'],
['darkmaze','Flashlight Maze','Arcade','Find the exit with only a little light.','◌','maze']
];
const rand=n=>Math.floor(Math.random()*n), pick=a=>a[rand(a.length)], clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function kit(id,text){
 instructions(text);stage.innerHTML='<div class="mini-area"></div><div class="mini-controls"></div>';const area=stage.firstChild,controls=stage.lastChild;
 let dead=false;const timers=new Set(),frames=new Set(),events=[];
 const k={id,area,controls,get dead(){return dead;},button(label,fn,parent=controls){const b=document.createElement('button');b.textContent=label;b.onclick=()=>{if(!dead)fn(b);};parent.append(b);return b;},later(fn,ms){const t=setTimeout(()=>{timers.delete(t);if(!dead)fn();},ms);timers.add(t);return t;},on(target,type,fn){target.addEventListener(type,fn);events.push([target,type,fn]);},loop(fn){let prev=0;function frame(now){if(dead)return;fn(Math.min((now-prev)/1000||0,.035),now);prev=now;const f=requestAnimationFrame(frame);frames.clear();frames.add(f);}frames.add(requestAnimationFrame(frame));},end(message,score=0){if(dead)return;save(id,score);status(message);k.stop();controls.querySelectorAll('button,input').forEach(b=>b.disabled=true);},stop(){dead=true;timers.forEach(clearTimeout);frames.forEach(cancelAnimationFrame);events.forEach(([t,e,f])=>t.removeEventListener(e,f));},text(t){area.textContent=t;}};
 cleanup=()=>k.stop();return k;
}
function gridButtons(k,n,paint,click,columns){k.area.innerHTML='';const grid=document.createElement('div');grid.className='mini-grid';grid.style.gridTemplateColumns=`repeat(${columns||Math.sqrt(n)},minmax(0,1fr))`;k.area.append(grid);for(let i=0;i<n;i++){const b=document.createElement('button');paint(b,i);b.onclick=()=>{if(!k.dead)click(i);};grid.append(b);}return grid;}
function inputForm(k,label,submit){const form=document.createElement('form');form.className='mini-form';const input=document.createElement('input');input.setAttribute('aria-label',label);input.placeholder=label;input.autocomplete='off';const b=document.createElement('button');b.textContent='Check';form.append(input,b);k.controls.append(form);form.onsubmit=e=>{e.preventDefault();if(!k.dead)submit(input.value,input);};return input;}
function canvasKit(id,text){const k=kit(id,text);const canvas=document.createElement('canvas');canvas.width=360;canvas.height=360;canvas.setAttribute('aria-label',(games.find(g=>g.id===id)?.name||id)+' playfield');k.area.append(canvas);k.canvas=canvas;k.ctx=canvas.getContext('2d');k.point=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*360/r.width,y:(e.clientY-r.top)*360/r.height};};return k;}
function runExtra(id,type){({live:arcadeGame,maze:chaseGame,grid:gridGame,board:boardGame,cards:cardGame,quiz:quizGame,memory:recallGame,word:wordGame})[type](id);}
extraGames.forEach(([id,name,category,desc,icon,type],i)=>games.push({id,name,category,desc,time:type==='live'?'1–3 min':'2–5 min',tag:id==='munch'?'NEW · MAZE CHASE':'NEW',art:`<div class="extra-art tone-${i%6}"><span>${icon}</span></div>`,run:()=>runExtra(id,type)}));
let libraryFilter='all';
render=function(filter=libraryFilter){libraryFilter=filter;const q=$('#game-search').value.trim().toLowerCase();const shown=games.filter(g=>(!window.arcadeMultiplayer||window.arcadeMultiplayer.allowed(g.id))&&(filter==='all'||g.category===filter)&&(g.name+' '+g.desc).toLowerCase().includes(q));$('#cards').innerHTML=shown.map(g=>`<button class="card" data-game="${g.id}" aria-label="Play ${g.name}"><div class="art art-${g.id}"><span class="tag">${window.arcadeMultiplayer?.mode===3?'ONLINE':window.arcadeMultiplayer?.mode===2?'2 PLAYERS':g.tag}</span><div class="illustration">${g.art}</div></div><div class="card-info"><div class="card-title"><h3>${g.name}</h3><span>↗</span></div><p>${window.arcadeMultiplayer?.description(g)||g.desc}</p><div class="card-meta"><span>${g.category.toUpperCase()}</span><span>◷ ${g.time}</span></div></div></button>`).join('')||'<p>No games match. Try another search.</p>';$('#game-count').textContent=`${shown.length} of ${games.filter(g=>!window.arcadeMultiplayer||window.arcadeMultiplayer.allowed(g.id)).length} games`;document.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>openGame(b.dataset.game));};
for(const category of ['Cards','Word']){const b=document.createElement('button');b.dataset.filter=category;b.textContent=category+' games';$('.filters').append(b);}
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{document.querySelector('.filters .selected')?.classList.remove('selected');b.classList.add('selected');render(b.dataset.filter);});$('#game-search').oninput=()=>render();render();
function chaseGame(id){
 const dark=id==='darkmaze',size=15,cells=makeMaze(size),start=size+1,end=size*(size-1)-2;
 // Open some joins to give the chase multiple escape routes.
 if(!dark)for(let r=2;r<size-2;r++)for(let c=2;c<size-2;c++)if(cells[r*size+c]&&rand(5)===0&&((!cells[r*size+c-1]&&!cells[r*size+c+1])||(!cells[(r-1)*size+c]&&!cells[(r+1)*size+c])))cells[r*size+c]=0;
 const k=canvasKit(id,dark?'Use arrows, WASD, or the direction buttons. Explore with your flashlight and reach the star in the bottom-right.':'An original maze-chase game inspired by Pac-Man. Eat all the dots, avoid three chasers, and collect orange power dots to turn the tables. Arrows/WASD or direction buttons.');
 let at=start,dir='ArrowRight',next=dir,points=0,lives=3,power=0,acc=0,ghostAcc=0,started=false,paused=false;
 const dots=new Set(cells.map((v,i)=>!v&&i!==start?i:-1).filter(i=>i>=0)),total=dots.size,boost=new Set([end,size+size-2,size*(size-2)+1]);
 const homes=[end,end-2,end-size*2].map(p=>cells[p]?end:p),ghosts=homes.slice();const seen=new Set();
 const startButton=k.button('Start game',()=>{started=true;paused=!paused&&startButton.textContent==='Pause';startButton.textContent=paused?'Resume':'Pause';});
 function turn(key){next=key;if(dark&&!k.dead){const p=mazeStep(cells,at,key,size);if(p!==at){at=p;points++;if(at===end){draw();k.end(`Exit found in ${points} steps!`,1000-points);}}}}
 const keys={w:'ArrowUp',s:'ArrowDown',a:'ArrowLeft',d:'ArrowRight'};
 k.on(document,'keydown',e=>{const key=keys[e.key]||e.key;if(key.startsWith('Arrow')){e.preventDefault();turn(key);}});
 for(const [label,key]of[['←','ArrowLeft'],['↑','ArrowUp'],['↓','ArrowDown'],['→','ArrowRight']])k.button(label,()=>turn(key));
 if(dark){startButton.remove();started=true;}
 function draw(){const c=k.ctx,u=360/size;c.fillStyle='#162b28';c.fillRect(0,0,360,360);
 cells.forEach((wall,i)=>{const d=Math.abs(i%size-at%size)+Math.abs(Math.floor(i/size)-Math.floor(at/size));if(d<4)seen.add(i);if(dark&&!seen.has(i))return;c.globalAlpha=dark&&d>=4?.25:1;if(wall){c.fillStyle='#527b70';c.fillRect(i%size*u+1,Math.floor(i/size)*u+1,u-2,u-2);}else if(!dark&&dots.has(i)){c.fillStyle=boost.has(i)?'#f7ad5a':'#e9e4b9';c.beginPath();c.arc(i%size*u+u/2,Math.floor(i/size)*u+u/2,boost.has(i)?5:2,0,7);c.fill();}});c.globalAlpha=1;
 if(dark&&seen.has(end)){c.fillStyle='#ffc760';c.font='20px sans-serif';c.fillText('★',end%size*u,Math.floor(end/size)*u+u);}
 c.fillStyle='#f4d164';c.beginPath();const angle={ArrowRight:0,ArrowDown:Math.PI/2,ArrowLeft:Math.PI,ArrowUp:-Math.PI/2}[dir];c.moveTo(at%size*u+u/2,Math.floor(at/size)*u+u/2);c.arc(at%size*u+u/2,Math.floor(at/size)*u+u/2,9,angle+.35,angle+Math.PI*2-.35);c.fill();
 if(!dark)ghosts.forEach((g,i)=>{c.fillStyle=power>0?'#80b8eb':['#df8586','#a49ad6','#81c6a5'][i];c.beginPath();c.arc(g%size*u+u/2,Math.floor(g/size)*u+u/2,8,Math.PI,0);c.lineTo(g%size*u+u/2+8,Math.floor(g/size)*u+u/2+7);c.lineTo(g%size*u+u/2-8,Math.floor(g/size)*u+u/2+7);c.fill();});
 }
 function collide(){for(let i=0;i<ghosts.length;i++)if(ghosts[i]===at){if(power>0){points+=50;ghosts[i]=homes[i];}else{lives--;at=start;ghosts.splice(0,3,...homes);dir=next='ArrowRight';if(!lives){draw();k.end(`Caught! ${points} points.`,points);return;}started=false;startButton.textContent='Continue';status(`${lives} lives left · Press Continue`);}}}
 k.loop(dt=>{if(!dark&&started&&!paused){power=Math.max(0,power-dt);acc+=dt;ghostAcc+=dt;if(acc>.19){acc=0;if(mazeStep(cells,at,next,size)!==at)dir=next;at=mazeStep(cells,at,dir,size);if(dots.delete(at)){points+=10;if(boost.has(at))power=6;if(!dots.size){draw();k.end(`All ${total} dots collected! ${points} points`,points+500);return;}}collide();}if(ghostAcc>.38&&started){ghostAcc=0;ghosts.forEach((g,i)=>{let options=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].map(key=>mazeStep(cells,g,key,size)).filter(p=>p!==g);if(options.length){options.sort((a,b)=>(Math.abs(a%size-at%size)+Math.abs(Math.floor(a/size)-Math.floor(at/size)))-(Math.abs(b%size-at%size)+Math.abs(Math.floor(b/size)-Math.floor(at/size))));ghosts[i]=power>0?options[options.length-1]:Math.random()<.7?options[0]:pick(options);}});collide();}if(started)status(`${points} points · ${lives} lives · ${dots.size} dots${power>0?' · POWER!':''}`);}draw();});
 status(dark?'Explore and reach the star.':'Ready for the chase?');draw();
}
function arcadeGame(id){
 const rules={bricks:'Move the paddle with left/right, A/D, or your pointer. Break all 35 bricks. Three balls.',invaders:'Move left/right. Hold Space or the Fire button to shoot. Clear the fleet before it reaches you.',asteroids:'Move in any direction to dodge asteroids for 45 seconds. Three shields.',sky:'Press Space, tap Jump, or tap the court to flap through 15 gaps.',crossing:'Use arrows or the direction buttons. Cross four traffic lanes and reach the top five times. Three lives.',racer:'Use left/right to switch lanes. Dodge 25 cars. Three lives.',catcher:'Move left/right to catch 20 gold stars. Avoid red bombs. Three lives.',fruit:'Tap the flying fruit before it falls. Red X objects are bombs! Score 20 hits with three lives.',targets:'Tap 20 targets in 30 seconds. Missed taps cost a point.',balloons:'Pop 25 balloons before five escape through the top.',orbit:'Hold Space or Jump to move to the outer orbit. Release to return. Dodge comets for 40 seconds.',runner:'Press Space or Jump to clear 20 hurdles. Three lives.',balance:'Use left/right to keep the ball near the center for 30 seconds. Don’t let it fall off.',stack:'Press Space or Drop to stop each moving block over the tower. Stack 15 layers.',lander:'Hold Space or Thrust to slow descent. Left/right steers. Land on the orange pad below 45 speed. Fuel is limited.',keepup:'Tap the ball to kick it up. Keep it in play for 20 kicks.',tunnel:'Move up/down or drag on the court. Stay inside the winding tunnel for 40 seconds.'};
 const k=canvasKit(id,rules[id]),c=k.ctx,keys=new Set();let running=false,paused=false,t=0,spawn=0,score=0,lives=3,x=180,y=300,vx=0,vy=0,objects=[],shots=[],count=0,fire=0,fuel=100,layer=0,width=160,base=100,moving=0,moveDir=1,serve=0;
 let ball={x:180,y:260,vx:120,vy:-150},bricks=Array.from({length:35},(_,i)=>({x:9+(i%7)*49,y:35+Math.floor(i/7)*20,alive:true}));
 if(id==='lander'){x=120;y=35;}if(id==='sky'||id==='tunnel')y=180;if(id==='crossing')y=336;if(id==='runner')y=292;if(id==='balance'){x=180;y=180;}if(id==='keepup'){x=180;y=130;vx=70;}
 const start=k.button('Start',()=>{if(!running){running=true;paused=false;}else paused=!paused;start.textContent=paused?'Resume':'Pause';});
 function action(){if(!running||paused)return;if(id==='sky')vy=-170;if(id==='runner'&&y>=291)vy=-300;if(id==='stack'){const left=Math.max(base,moving),right=Math.min(base+width,moving+width);width=right-left;if(width<5){k.end(`Tower stopped at ${score} layers.`,score);return;}base=left;score++;layer++;if(score===15){k.end('15 layers! A perfect skyline.',1500);return;}objects.push({x:base,w:width,y:320-layer*16});} }
 function held(label,key){const b=k.button(label,()=>{});b.onpointerdown=e=>{e.preventDefault();keys.add(key);if(key===' ')action();if(id==='crossing')cross(key);if(id==='racer')lane(key);};for(const evt of ['pointerup','pointercancel','pointerleave'])b.addEventListener(evt,()=>keys.delete(key));return b;}
 function cross(key){if(!running||paused)return;const delta={ArrowLeft:[-36,0],ArrowRight:[36,0],ArrowUp:[0,-36],ArrowDown:[0,36]}[key];if(delta){x=clamp(x+delta[0],18,342);y=clamp(y+delta[1],12,336);if(y<50){score++;x=180;y=336;if(score===5)k.end('Five safe crossings!',500);}}}
 function lane(key){if(!running||paused)return;if(key==='ArrowLeft')x=clamp(x-110,70,290);if(key==='ArrowRight')x=clamp(x+110,70,290);}
 if(['targets','fruit','balloons','keepup'].includes(id)){}else{held('←','ArrowLeft');held('→','ArrowRight');if(['asteroids','crossing','tunnel'].includes(id)){held('↑','ArrowUp');held('↓','ArrowDown');}if(['sky','runner','orbit','lander','stack','invaders'].includes(id))held(({lander:'Thrust',stack:'Drop',invaders:'Fire'})[id]||'Jump',' ');}
 const map={a:'ArrowLeft',d:'ArrowRight',w:'ArrowUp',s:'ArrowDown'};
 k.on(document,'keydown',e=>{const key=map[e.key]||e.key;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(key)){e.preventDefault();if(!keys.has(key)){if(key===' ')action();if(id==='crossing')cross(key);if(id==='racer')lane(key);}keys.add(key);}});k.on(document,'keyup',e=>keys.delete(map[e.key]||e.key));k.on(window,'blur',()=>{keys.clear();if(running){paused=true;start.textContent='Resume';}});
 k.on(k.canvas,'pointermove',e=>{const p=k.point(e);if(['bricks','invaders','catcher'].includes(id))x=clamp(p.x,30,330);if(id==='asteroids'){x=clamp(p.x,15,345);y=clamp(p.y,15,345);}if(id==='tunnel')y=clamp(p.y,15,345);});
 k.on(k.canvas,'pointerdown',e=>{if(!running||paused)return;const p=k.point(e);if(['sky','runner','stack'].includes(id))action();if(id==='keepup'&&Math.hypot(p.x-x,p.y-y)<34){vy=-230;vx=(x-180)*.5;score++;if(score===20)k.end('Twenty kicks! Beautiful control.',200);}if(['fruit','balloons','targets'].includes(id)){const index=objects.findIndex(o=>Math.hypot(o.x-p.x,o.y-p.y)<o.r+8);if(index>=0){const o=objects[index];objects.splice(index,1);if(o.bad)hurt();else score++;}else if(id==='targets')score=Math.max(0,score-1);}});
 function hurt(){lives--;if(lives<=0)k.end(`Game over · ${score} points`,score);}
 function circle(px,py,r,color){c.fillStyle=color;c.beginPath();c.arc(px,py,r,0,7);c.fill();}
 function rect(px,py,w,h,color){c.fillStyle=color;c.fillRect(px,py,w,h);}
 const overlaps=(a,b)=>Math.abs(a.x-b.x)<(a.w+b.w)/2&&Math.abs(a.y-b.y)<(a.h+b.h)/2;
 function update(dt){
 t+=dt;spawn-=dt;fire-=dt;serve=Math.max(0,serve-dt);const dx=(keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0),dy=(keys.has('ArrowDown')?1:0)-(keys.has('ArrowUp')?1:0);
 if(!['crossing','racer','stack','sky','keepup','balance','orbit','runner'].includes(id))x=clamp(x+dx*220*dt,15,345);
 if(['asteroids','tunnel'].includes(id))y=clamp(y+dy*220*dt,15,345);
 if(id==='bricks'){ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;if(ball.x<7||ball.x>353){ball.vx*=-1;ball.x=clamp(ball.x,7,353);}if(ball.y<7)ball.vy=Math.abs(ball.vy);if(ball.vy>0&&ball.y>310&&ball.y<325&&Math.abs(ball.x-x)<42){ball.vy=-Math.abs(ball.vy);ball.vx=(ball.x-x)*5;}for(const b of bricks)if(b.alive&&ball.x>b.x-5&&ball.x<b.x+47&&ball.y>b.y-5&&ball.y<b.y+20){b.alive=false;ball.vy*=-1;score+=10;break;}if(ball.y>370){hurt();ball={x:180,y:260,vx:120,vy:-150};}if(bricks.every(b=>!b.alive))k.end('Every brick cleared!',score+100);}
 if(id==='invaders'){if(!objects.length&&!count){objects=Array.from({length:24},(_,i)=>({x:30+i%8*42,y:40+Math.floor(i/8)*30,w:24,h:18}));count=1;}let bounce=false;objects.forEach(o=>{o.x+=moveDir*25*dt;if(o.x<15||o.x>345)bounce=true;});if(bounce){moveDir*=-1;objects.forEach(o=>o.y+=12);}if(keys.has(' ')&&fire<=0){shots.push({x,y:310});fire=.22;}shots.forEach(b=>b.y-=300*dt);for(const b of shots){const hit=objects.find(o=>Math.abs(o.x-b.x)<15&&Math.abs(o.y-b.y)<13);if(hit){objects.splice(objects.indexOf(hit),1);b.y=-50;score+=10;}}shots=shots.filter(b=>b.y>0);if(!objects.length)k.end('Fleet cleared!',score);if(objects.some(o=>o.y>290))k.end('The fleet landed. Try again!',score);}
 if(['asteroids','racer','catcher','fruit','balloons','targets','crossing'].includes(id)){
 if(spawn<=0){spawn=id==='targets'?1.1:id==='crossing'?.7:.65;let o={x:20+rand(320),y:-20,r:12+rand(10),speed:60+rand(80),bad:false};if(id==='racer'){o.x=pick([70,180,290]);o.w=32;o.h=52;}if(id==='catcher')o.bad=rand(4)===0;if(id==='fruit'){o.y=370;o.vy=-240-rand(100);o.vx=rand(80)-40;o.bad=rand(6)===0;}if(id==='balloons')o.y=390;if(id==='targets'){o.y=30+rand(290);o.life=1.8;}if(id==='crossing'){const row=rand(4);o.y=84+row*54;o.speed=(row%2?1:-1)*(75+rand(50));o.x=o.speed>0?-40:400;o.w=50;o.h=24;}objects.push(o);}
 for(const o of objects){if(id==='fruit'){o.vy+=280*dt;o.y+=o.vy*dt;o.x+=o.vx*dt;}else if(id==='balloons')o.y-=o.speed*dt;else if(id==='targets')o.life-=dt;else if(id==='crossing')o.x+=o.speed*dt;else o.y+=o.speed*dt;
 if(id==='asteroids'&&Math.hypot(o.x-x,o.y-y)<o.r+10){o.counted=true;o.y=500;hurt();}if(id==='racer'&&overlaps({x,y:305,w:30,h:50},o)){o.counted=true;o.y=500;hurt();}if(id==='crossing'&&overlaps({x,y,w:20,h:20},o)){hurt();x=180;y=336;}
 if(id==='catcher'&&o.y>300&&o.y<330&&Math.abs(o.x-x)<34){if(o.bad)hurt();else score++;o.y=500;}
 if(id==='balloons'&&o.y<-25){count++;o.y=-100;if(count===5)k.end(`Five escaped · ${score} popped`,score);}
 if((id==='racer'||id==='asteroids')&&o.y>380&&!o.counted){o.counted=true;score++;}}
 objects=objects.filter(o=>o.y<450&&o.y>-70&&o.x>-80&&o.x<440&&(o.life===undefined||o.life>0));
 if(id==='targets'&&t>=30)k.end(`Time! ${score} targets`,score);if(id==='asteroids'&&t>=45)k.end('You survived the asteroid field!',score+100);if(['racer','balloons'].includes(id)&&score>=25)k.end('Challenge complete!',score+100);if(['catcher','fruit','targets'].includes(id)&&score>=20)k.end('Twenty caught! Great aim.',score+100);
 }
 if(id==='sky'){vy+=380*dt;y+=vy*dt;if(spawn<=0){spawn=1.8;objects.push({x:380,gap:90+rand(170),counted:false});}objects.forEach(o=>{o.x-=100*dt;if(o.x<65&&!o.counted){o.counted=true;score++;}if(o.x<100&&o.x>48&&(y<o.gap-55||y>o.gap+55))k.end(`Flight over · ${score} gaps`,score);});objects=objects.filter(o=>o.x>-50);if(y<8||y>352)k.end(`Flight over · ${score} gaps`,score);if(score>=15)k.end('Fifteen gaps cleared!',150);}
 if(id==='runner'){vy+=650*dt;y=Math.min(292,y+vy*dt);if(y===292)vy=0;if(spawn<=0){spawn=1.4+Math.random()*.6;objects.push({x:380,w:20,h:25+rand(20)});}objects.forEach(o=>{o.x-=170*dt;if(o.x<55&&!o.counted){o.counted=true;score++;}if(Math.abs(o.x-70)<20&&y+12>320-o.h&&!o.hit){o.hit=true;hurt();}});objects=objects.filter(o=>o.x>-30);if(score>=20)k.end('Twenty hurdles cleared!',200);}
 if(id==='orbit'){const radius=keys.has(' ')?125:75;x=180+Math.cos(t*1.6)*radius;y=180+Math.sin(t*1.6)*radius;if(spawn<=0){spawn=.85;const a=Math.random()*Math.PI*2;objects.push({a,r:250});}objects.forEach(o=>{o.r-=65*dt;if(Math.hypot(180+Math.cos(o.a)*o.r-x,180+Math.sin(o.a)*o.r-y)<17){o.r=-10;hurt();}});objects=objects.filter(o=>o.r>0);score=Math.floor(t);if(t>=40)k.end('Orbit complete!',400);}
 if(id==='balance'){vx+=(Math.sin(t*1.7)*22+dx*70)*dt;vx*=1-dt*.4;x+=vx*dt;score=Math.floor(t);if(x<25||x>335)k.end(`Off balance after ${score} seconds.`,score);if(t>=30)k.end('Thirty seconds of perfect balance!',300);}
 if(id==='stack'){moving+=moveDir*(110+score*4)*dt;if(moving<0||moving+width>360){moving=clamp(moving,0,360-width);moveDir*=-1;}}
 if(id==='lander'){if(keys.has(' ')&&fuel>0){vy-=90*dt;fuel-=15*dt;}vy+=35*dt;y+=vy*dt;y=Math.max(8,y);if(y>=319){if(x>=140&&x<=220&&vy<45)k.end(`Soft landing! ${Math.round(fuel)} fuel left.`,100+Math.round(fuel));else k.end('Hard landing. Slow down and aim for the orange pad.',0);}}
 if(id==='keepup'){vy+=300*dt;y+=vy*dt;x+=vx*dt;if(x<18||x>342){vx*=-1;x=clamp(x,18,342);}if(y<18){y=18;vy=Math.abs(vy);}if(y>375)k.end(`Ball dropped · ${score} kicks`,score);}
 if(id==='tunnel'){const center=180+Math.sin(t*1.1)*85;score=Math.floor(t);if(Math.abs(y-center)>65){k.end(`Tunnel run: ${score} seconds`,score);return;}if(t>=40)k.end('You made it through!',400);}
 }
 function draw(){rect(0,0,360,360,'#233c35');c.strokeStyle='#ffffff12';for(let i=0;i<360;i+=30){c.beginPath();c.moveTo(i,0);c.lineTo(i,360);c.stroke();}
 if(id==='bricks'){bricks.filter(b=>b.alive).forEach(b=>rect(b.x,b.y,44,15,['#c3d49b','#ddad74','#a99cc8'][Math.floor(b.y/20)%3]));rect(x-36,320,72,9,'#e7e4bb');circle(ball.x,ball.y,6,'#f8d36a');}
 else if(id==='invaders'){objects.forEach(o=>{rect(o.x-12,o.y-9,24,18,'#b9cf8b');rect(o.x-7,o.y-3,4,4,'#233c35');rect(o.x+3,o.y-3,4,4,'#233c35');});shots.forEach(b=>rect(b.x-2,b.y,4,10,'#ffdc70'));rect(x-14,316,28,14,'#f2c66d');}
 else if(id==='sky'){objects.forEach(o=>{rect(o.x,0,36,o.gap-55,'#709269');rect(o.x,o.gap+55,36,360-o.gap-55,'#709269');});circle(75,y,11,'#ffce69');}
 else if(id==='runner'){rect(0,320,360,40,'#668262');objects.forEach(o=>rect(o.x,320-o.h,o.w,o.h,'#d58e6e'));circle(70,y,12,'#f4d173');}
 else if(id==='stack'){rect(base,335,width,15,'#849b6a');objects.forEach((o,i)=>rect(o.x,o.y,o.w,14,i%2?'#dca96e':'#bed194'));rect(moving,320-(layer+1)*16,width,14,'#f2d272');}
 else if(id==='balance'){rect(20,195,320,6,'#abc194');circle(x,180,14,'#f4cb71');c.fillStyle='#c5d9a3';c.fillText('← keep it centered →',115,240);}
 else if(id==='lander'){rect(0,335,360,25,'#7c8170');rect(140,331,80,5,'#ecad65');rect(x-10,y-10,20,20,'#c5dba7');if(keys.has(' ')&&fuel>0)rect(x-4,y+10,8,12,'#edab50');}
 else if(id==='keepup'){circle(x,y,19,'#f6d278');circle(x-5,y-5,5,'#7a8e62');}
 else if(id==='orbit'){circle(180,180,24,'#e5b35d');for(const r of[75,125]){c.strokeStyle='#71866c';c.beginPath();c.arc(180,180,r,0,7);c.stroke();}objects.forEach(o=>circle(180+Math.cos(o.a)*o.r,180+Math.sin(o.a)*o.r,8,'#d68579'));circle(x,y,9,'#dbe7aa');}
 else if(id==='tunnel'){for(let px=0;px<360;px+=4){let mid=180+Math.sin(t*1.1+(px-60)*.005)*85;rect(px,0,4,mid-75,'#7c966b');rect(px,mid+75,4,360-mid-75,'#7c966b');}circle(60,y,9,'#f5cc75');}
 else{if(id==='crossing'){for(let row=0;row<4;row++)rect(0,66+row*54,360,35,'#45544b');}if(id==='racer'){c.strokeStyle='#c0c49c';c.setLineDash([15,15]);for(const px of[125,235]){c.beginPath();c.moveTo(px,0);c.lineTo(px,360);c.stroke();}c.setLineDash([]);}
 objects.forEach(o=>{if(id==='crossing'||id==='racer')rect(o.x-o.w/2,o.y-o.h/2,o.w,o.h,'#d58c76');else{circle(o.x,o.y,o.r,o.bad?'#c66966':id==='asteroids'?'#9caaa0':id==='balloons'?'#ba9acb':'#e7bf68');if(o.bad){c.fillStyle='white';c.fillText('×',o.x-4,o.y+4);}if(id==='targets'){circle(o.x,o.y,o.r*.65,'#f5e3bc');circle(o.x,o.y,o.r*.3,'#b9675d');}}});
 if(['asteroids','racer','crossing'].includes(id))rect(x-10,(id==='racer'?305:y)-10,20,20,'#d8e6a4');if(id==='catcher')rect(x-30,318,60,10,'#d8e6a4');}
 if(!running||paused){rect(70,155,220,45,'#142c29dd');c.fillStyle='#f7efcf';c.font='18px sans-serif';c.textAlign='center';c.fillText(paused?'Paused':'Press Start',180,183);c.textAlign='left';}
 }
 k.loop(dt=>{if(running&&!paused&&!k.dead){update(dt);if(!k.dead)status(`${score} points · ${id==='balloons'?5-count+' escapes left':lives+' lives'}${id==='lander'?' · Fuel '+Math.ceil(fuel):''}`);}draw();});status('Ready when you are.');
}
function quizQuestion(id,round){
 const a=2+rand(18),b=2+rand(12);let prompt,answer,options,style='';
 if(id==='arithmetic'){const minus=rand(2);prompt=`${a} ${minus?'−':'+'} ${b}`;answer=minus?a-b:a+b;}
 if(id==='multiplication'){prompt=`${a%12+1} × ${b}`;answer=(a%12+1)*b;}
 if(id==='division'){prompt=`${a*b} ÷ ${b}`;answer=a;}
 if(id==='binary'){answer=1+rand(63);prompt=answer.toString(2).padStart(6,'0')+'₂';}
 if(id==='sequence'){const step=2+rand(7),start=1+rand(10);prompt=`${start}, ${start+step}, ${start+2*step}, ?`;answer=start+3*step;}
 if(id==='fractions'){const n=1+rand(5),d=n+1+rand(6),m=2+rand(4);prompt=`Which equals ${n}/${d}?`;answer=`${n*m}/${d*m}`;options=[answer,`${n*m+1}/${d*m}`,`${n*m}/${d*m+1}`,`${n*m+2}/${d*m}`];}
 if(id==='primes'){const primes=[2,3,5,7,11,13,17,19,23,29,31,37],composite=[4,6,8,9,10,12,14,15,16,18,20,21,22,24,25,26,27,28,30,32,33,34,35,36];prompt='Which number is prime?';answer=pick(primes);options=[answer,...shuffle(composite).slice(0,3)];}
 if(id==='stroop'){const names=['Green','Orange','Blue','Purple'];answer=pick(names);prompt=pick(names);style={Green:'#3c7844',Orange:'#b9641d',Blue:'#396cb1',Purple:'#8456a4'}[answer];options=names;}
 if(id==='oddone'){const symbols=pick([['●','○'],['◆','◇'],['▲','△'],['■','□']]);const odd=rand(16);return {prompt:'Tap the different symbol.',answer:odd,options:Array.from({length:16},(_,i)=>i),symbols,odd};}
 if(!options){const values=new Set([answer]);while(values.size<4)values.add(answer+rand(17)-8);options=[...values];}
 return {prompt,answer,options:shuffle(options),style};
}
function quizGame(id){
 const k=kit(id,id==='stroop'?'Choose the color of the ink, not the word. Ten rounds, ten points per correct answer.':'Choose the correct answer. Ten rounds, ten points for each correct answer.');let round=0,score=0,locked=false;
 function next(){if(round===10){k.text(`${score}/100`);k.end(`Quiz complete · ${score} points`,score);return;}locked=false;const q=quizQuestion(id,round);k.area.innerHTML='<div class="mini-question"></div><div class="mini-answers"></div>';const title=k.area.firstChild;title.textContent=q.prompt;if(q.style)title.style.color=q.style;const answers=k.area.lastChild;if(q.symbols)answers.classList.add('odd-grid');q.options.forEach(v=>{const b=k.button(q.symbols?(v===q.odd?q.symbols[1]:q.symbols[0]):String(v),()=>{if(locked)return;locked=true;const correct=v===q.answer;if(correct)score+=10;status(correct?'Correct!':`Answer: ${q.symbols?'the outlined symbol':q.answer}`);answers.querySelectorAll('button').forEach(el=>el.disabled=true);round++;k.later(next,650);},answers);if(q.symbols)b.setAttribute('aria-label',`Symbol ${v+1}: ${v===q.odd?'outline':'filled'}`);});status(`Question ${round+1}/10 · ${score} points`);}
 next();
}
function gridGame(id){
 if(id==='bubbles'){
 const k=kit(id,'Tap a connected group of two or more matching colors. Remaining bubbles fall down. Clear as many as possible.');const colors=['#8d68a0','#5b8563','#cb8948'];let board=Array.from({length:64},()=>rand(3)),score=0;
 function group(i){if(board[i]===null)return[];const found=new Set([i]),pending=[i];while(pending.length){const p=pending.pop();for(const n of[p-8,p+8,p-1,p+1])if(n>=0&&n<64&&Math.abs(n%8-p%8)+Math.abs(Math.floor(n/8)-Math.floor(p/8))===1&&!found.has(n)&&board[n]===board[i]){found.add(n);pending.push(n);}}return[...found];}
 function draw(){gridButtons(k,64,(b,i)=>{b.style.background=board[i]===null?'transparent':colors[board[i]];b.textContent=board[i]===null?'':['●','◆','▲'][board[i]];b.disabled=board[i]===null;b.setAttribute('aria-label',`Bubble row ${Math.floor(i/8)+1} column ${i%8+1}`);},i=>{const g=group(i);if(g.length<2){status('Find a group of at least two.');return;}score+=g.length*g.length;g.forEach(j=>board[j]=null);for(let col=0;col<8;col++){const vals=board.filter((_,j)=>j%8===col).filter(v=>v!==null);for(let row=7;row>=0;row--)board[row*8+col]=vals.pop()??null;}draw();if(!board.some((v,j)=>v!==null&&group(j).length>=2))k.end(`No more groups · ${score} points`,score);else status(`${score} points`);},8);}
 draw();status('Find a matching group.');return;
 }
 if(id==='alphabet'){
 const k=kit(id,'Tap the letters A to Z in order. The clock starts on your first correct letter.');const letters=shuffle([...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']);let next=0,start=0;const grid=gridButtons(k,26,(b,i)=>b.textContent=letters[i],i=>{if(letters[i]!==String.fromCharCode(65+next)){status(`Find ${String.fromCharCode(65+next)} next.`);return;}if(!start)start=performance.now();grid.children[i].disabled=true;next++;if(next===26){const secs=(performance.now()-start)/1000;k.end(`A to Z in ${secs.toFixed(1)} seconds!`,Math.max(1,Math.round(10000/secs)));}else status(`Next: ${String.fromCharCode(65+next)}`);},6);status('Find A to start.');return;
 }
 if(id==='fifteen'){
 const k=kit(id,'Slide adjacent tiles into the empty space. Put 1–15 in reading order, leaving the bottom-right empty.');let board=Array.from({length:16},(_,i)=>(i+1)%16),blank=15,prev=-1,moves=0;const near=i=>[i-4,i+4,i-1,i+1].filter(j=>j>=0&&j<16&&Math.abs(i%4-j%4)+Math.abs(Math.floor(i/4)-Math.floor(j/4))===1);
 for(let n=0;n<70;n++){let j=pick(near(blank).filter(j=>j!==prev));[board[blank],board[j]]=[board[j],board[blank]];prev=blank;blank=j;}
 function draw(){gridButtons(k,16,(b,i)=>{b.textContent=board[i]||'';b.disabled=!board[i];},i=>{if(!near(blank).includes(i))return;[board[i],board[blank]]=[board[blank],board[i]];blank=i;moves++;draw();if(board.every((v,j)=>v===(j+1)%16))k.end(`Solved in ${moves} moves!`,Math.max(1,1000-moves));else status(`${moves} moves`);});}draw();status('Put the numbers in order.');return;
 }
 if(id==='sudoku'){
 const k=kit(id,'Fill each row, column, and 2×2 box with 1, 2, 3, and 4 exactly once. Select an empty cell, then a number.');
 const digits=shuffle([1,2,3,4]),solution=[0,1,2,3,2,3,0,1,1,0,3,2,3,2,1,0].map(v=>digits[v]);const fixed=new Set([0,3,5,6,9,10,12,15]),board=solution.map((v,i)=>fixed.has(i)?v:0);let selected=-1;
 function draw(){gridButtons(k,16,(b,i)=>{b.textContent=board[i]||'·';b.disabled=fixed.has(i);b.classList.toggle('chosen',i===selected);b.style.borderRight=i%4===1?'3px solid #667958':'';b.style.borderBottom=Math.floor(i/4)===1?'3px solid #667958':'';b.setAttribute('aria-label',`Row ${Math.floor(i/4)+1}, column ${i%4+1}: ${board[i]||'empty'}`);},i=>{selected=i;draw();});}
 for(let n=1;n<=4;n++)k.button(String(n),()=>{if(selected<0){status('Select a cell first.');return;}board[selected]=n;draw();status('Keep filling the grid.');});k.button('Clear',()=>{if(selected>=0){board[selected]=0;draw();}});k.button('Check',()=>{const groups=[];for(let r=0;r<4;r++)groups.push(board.slice(r*4,r*4+4),board.filter((_,i)=>i%4===r));for(const start of[0,2,8,10])groups.push([board[start],board[start+1],board[start+4],board[start+5]]);if(groups.every(g=>g.every(Boolean)&&new Set(g).size===4))k.end('Sudoku solved!',100);else status('Not solved yet. Every group needs all four digits.');});draw();status('Select a cell to begin.');
 }
}
function recallGame(id){
 const number=id==='numbermemory',k=kit(id,number?'Memorize the number before it disappears, then type it back. Each round adds a digit.':'Remember the highlighted squares, then select the same squares. Each round adds one more.');let round=1,accepting=false,answer='',positions=[],selected=new Set();
 const start=k.button('Start round',()=>{start.disabled=true;show();});
 function show(){accepting=false;selected.clear();k.controls.querySelector('form')?.remove();if(number){answer=String(1+rand(9))+Array.from({length:round+1},()=>rand(10)).join('');k.text(answer);k.area.classList.add('recall-number');k.later(()=>{k.text('What was the number?');accepting=true;const input=inputForm(k,'Remembered number',value=>{if(!accepting)return;accepting=false;if(value.trim()===answer){round++;save(id,round-1);status('Correct!');if(round>10){k.end('Ten rounds remembered!',10);return;}k.later(show,800);}else k.end(`The number was ${answer} · ${round-1} rounds completed`,round-1);});input.inputMode='numeric';input.focus();},1500+round*250);}else{positions=shuffle(Array.from({length:16},(_,i)=>i)).slice(0,Math.min(10,round+2));draw(true);k.later(()=>{accepting=true;draw(false);status(`Select ${positions.length} squares, then Check.`);},1800);}}
 function draw(showing){gridButtons(k,16,(b,i)=>{b.textContent=showing&&positions.includes(i)?'✦':selected.has(i)?'●':'';b.classList.toggle('chosen',showing?positions.includes(i):selected.has(i));b.setAttribute('aria-label',`Square ${i+1}`);},i=>{if(!accepting)return;if(selected.has(i))selected.delete(i);else selected.add(i);draw(false);});}
 if(!number)k.button('Check pattern',()=>{if(!accepting)return;accepting=false;const correct=selected.size===positions.length&&positions.every(i=>selected.has(i));if(correct){round++;save(id,round-1);if(round>8){k.end('All eight patterns remembered!',8);return;}status('Correct! Next pattern…');k.later(show,900);}else{draw(true);k.end(`Pattern missed · ${round-1} rounds completed`,round-1);}});
 status('Ready to remember?');
}
function wordGame(id){
 if(id==='typing'){
 const text=pick(['Small games can turn an ordinary afternoon into a little adventure.','The quick brown fox jumps over the lazy dog beside the quiet river.','Keep your eyes on the stars and your feet on the ground.']);const k=kit(id,'Type the sentence exactly, including capitals and punctuation. The timer starts with your first keystroke.');k.text(text);k.area.classList.add('typing-copy');let start=0;const input=inputForm(k,'Type the sentence',value=>{if(value!==text){status('Not quite identical. Check spelling, capitals, and punctuation.');return;}const elapsed=Math.max(1,(performance.now()-start)/1000),wpm=Math.round(text.length/5/(elapsed/60));k.end(`Complete! ${wpm} words per minute`,wpm);input.disabled=true;});input.oninput=()=>{if(!start)start=performance.now();status(`${input.value.length}/${text.length} characters`);};return;
 }
 if(id==='wordladder'){
 const paths=[['COLD','CORD','CARD','WARD','WARM'],['CAT','COT','COG','DOG'],['HEAD','HEAL','TEAL','TELL','TALL','TAIL']];const path=pick(paths),k=kit(id,'Change one letter at a time along the ladder. Choose the word that is one letter away and moves toward the goal.');let step=0;
 function draw(){k.area.innerHTML=`<div class="mini-question">${path[step]} → ${path[path.length-1]}</div><p>Step ${step+1} of ${path.length-1}</p><div class="mini-answers"></div>`;const candidates=shuffle([path[step+1],...shuffle(['MOON','FISH','BIRD','TREE','STAR','BOOK','SUN','ICE','MAP'].filter(w=>w.length===path[0].length&&!path.includes(w))).slice(0,3)]);candidates.forEach(w=>k.button(w,()=>{if(w!==path[step+1]){status('That changes more than one letter. Try another.');return;}step++;if(step===path.length-1){k.text(path.join(' → '));k.end('Ladder complete!',100);return;}draw();},k.area.lastChild));}draw();status('Find the next rung.');return;
 }
 if(id==='wordsearch'){
 const k=kit(id,'Find STAR, MOON, GAME, PLAY, and FUN. Tap the first and last letter of a word. Words run across or down.');const size=8,board=Array.from({length:64},()=>pick([...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'])),words=['STAR','MOON','GAME','PLAY','FUN'],placements=[[0,1],[18,1],[33,1],[7,8],[56,1]],found=new Set(),marked=new Set();let first=-1;
 words.forEach((word,i)=>[...word].forEach((letter,j)=>board[placements[i][0]+placements[i][1]*j]=letter));
 function draw(){gridButtons(k,64,(b,i)=>{b.textContent=board[i];b.classList.toggle('chosen',i===first||marked.has(i));b.setAttribute('aria-label',`Row ${Math.floor(i/8)+1} column ${i%8+1}: ${board[i]}`);},i=>{if(first<0){first=i;draw();return;}const a=first,b=i;first=-1;const row=Math.floor(a/8)===Math.floor(b/8),col=a%8===b%8;if(!row&&!col){status('Choose a straight row or column.');draw();return;}const step=row?(b>a?1:-1):(b>a?8:-8),indices=[];for(let j=a;;j+=step){indices.push(j);if(j===b)break;}const text=indices.map(j=>board[j]).join(''),word=words.find(w=>w===text||w===[...text].reverse().join(''));if(word&&!found.has(word)){found.add(word);indices.forEach(j=>marked.add(j));status(`Found ${word}! ${found.size}/5`);}else status('No new word there. Try again.');draw();if(found.size===5)k.end('All five words found!',100);},8);const list=document.createElement('p');list.textContent=words.map(w=>found.has(w)?'✓ '+w:w).join(' · ');k.area.append(list);}draw();status('Tap the first letter of a word.');
 }
}
function reversiMoves(board,player){const result=[];for(let i=0;i<64;i++){if(board[i])continue;const flips=[];for(const [dr,dc]of[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]){let r=Math.floor(i/8)+dr,c=i%8+dc,line=[];while(r>=0&&r<8&&c>=0&&c<8&&board[r*8+c]===3-player){line.push(r*8+c);r+=dr;c+=dc;}if(line.length&&r>=0&&r<8&&c>=0&&c<8&&board[r*8+c]===player)flips.push(...line);}if(flips.length)result.push({i,flips});}return result;}
function boardGame(id){
 if(id==='code'){
 const secret=shuffle([...'0123456789']).slice(0,4).join(''),k=kit(id,'Guess four different digits in eight attempts. Exact means right digit/right place; misplaced means right digit/wrong place. Leading zero is allowed.');let attempts=0;k.area.innerHTML='<div class="code-history"></div>';const input=inputForm(k,'Four unique digits',(value)=>{if(!/^\d{4}$/.test(value)||new Set(value).size!==4){status('Enter four different digits.');return;}attempts++;let exact=0,total=0;[...value].forEach((v,i)=>{if(secret[i]===v)exact++;if(secret.includes(v))total++;});const line=document.createElement('p');line.textContent=`${value} — ${exact} exact, ${total-exact} misplaced`;k.area.firstChild.append(line);input.value='';if(exact===4){input.disabled=true;k.end(`Code cracked in ${attempts} guesses!`,900-attempts*100);}else if(attempts===8){input.disabled=true;k.end(`The code was ${secret}.`,0);}else status(`${8-attempts} attempts left`);});input.inputMode='numeric';input.maxLength=4;status('Eight attempts to crack the code.');return;
 }
 if(id==='hanoi'){
 const k=kit(id,'Move all four discs from the left tower to the right. Select a tower to lift its top disc, then select the destination. A larger disc cannot sit on a smaller one.');let towers=[[4,3,2,1],[],[]],from=-1,moves=0;
 function draw(){k.area.innerHTML='';const g=document.createElement('div');g.className='hanoi';k.area.append(g);towers.forEach((tower,i)=>{const b=k.button('',()=>{if(from<0){if(tower.length)from=i;}else if(from===i)from=-1;else{const disc=towers[from].at(-1);if(!tower.length||tower.at(-1)>disc){tower.push(towers[from].pop());moves++;from=-1;}else status('That disc is too large for this tower.');}draw();if(towers[2].length===4)k.end(`Tower moved in ${moves} moves!`,Math.max(1,100-moves));else status(`${moves} moves · ${from<0?'Select a source':'Select a destination'}`);},g);b.className=from===i?'chosen':'';b.setAttribute('aria-label',`Tower ${i+1}, ${tower.length} discs`);[...tower].reverse().forEach(d=>{const bar=document.createElement('span');bar.style.width=(d*18+15)+'%';bar.textContent=d;bar.className='hanoi-disc';b.append(bar);});});}draw();status('Move the tower to the right.');return;
 }
 if(id==='nim'){
 const k=kit(id,'There are 21 stones. You and the computer take turns removing 1–3. Whoever takes the last stone wins.');let stones=21,turn=true;k.text('● '.repeat(stones));for(let n=1;n<=3;n++)k.button('Take '+n,()=>{if(!turn||n>stones)return;stones-=n;k.text('● '.repeat(stones));if(!stones){k.end('You took the last stone. You win!',100);return;}turn=false;status('Computer is choosing…');k.later(()=>{let take=Math.min(stones,(stones%4)||1);stones-=take;k.text('● '.repeat(stones));if(!stones)k.end('Computer took the last stone.',0);else{turn=true;status(`Computer took ${take}. ${stones} left.`);}},500);});status('21 stones · Your turn');return;
 }
 if(id==='reversi'){
 const k=kit(id,'You are the dark discs. Place on a dotted square to trap and flip the computer’s discs. Most discs at the end wins. If you have no legal move, your turn passes automatically.');let board=Array(64).fill(0),turn=true;board[27]=board[36]=2;board[28]=board[35]=1;
 function done(){const you=board.filter(v=>v===1).length,bot=board.filter(v=>v===2).length;k.end(`${you}–${bot} · ${you>bot?'You win!':you===bot?'A draw.':'Computer wins.'}`,you);}
 function place(move,player){board[move.i]=player;move.flips.forEach(i=>board[i]=player);}
 function botTurn(){if(k.dead)return;const options=reversiMoves(board,2);if(options.length){options.sort((a,b)=>b.flips.length-a.flips.length);place(options[0],2);}if(reversiMoves(board,1).length){turn=true;draw();status('Your turn · Choose a dot.');}else if(reversiMoves(board,2).length){draw();status('No move for you · Computer plays again');k.later(botTurn,650);}else{draw();done();}}
 function draw(){const legal=reversiMoves(board,1);gridButtons(k,64,(b,i)=>{b.textContent=board[i]===1?'●':board[i]===2?'○':legal.some(m=>m.i===i)?'·':'';b.disabled=!turn||!legal.some(m=>m.i===i);b.setAttribute('aria-label',`Square ${i+1}: ${board[i]===1?'you':board[i]===2?'computer':'empty'}`);},i=>{const move=legal.find(m=>m.i===i);if(!move||!turn)return;place(move,1);turn=false;draw();status('Computer is thinking…');k.later(botTurn,450);},8);}draw();status('Your turn · Choose a dot.');return;
 }
 if(id==='pegs'){
 const k=kit(id,'Select a peg, then jump it over one adjacent peg into an empty hole two spaces away, horizontally or vertically. Remove jumped pegs. Aim to leave one peg.');const board=Array.from({length:49},(_,i)=>{const r=Math.floor(i/7),c=i%7;return (r>=2&&r<=4)||(c>=2&&c<=4)?1:-1;});board[24]=0;let selected=-1;
 function moves(){const list=[];board.forEach((v,i)=>{if(v!==1)return;for(const d of[-14,14,-2,2]){const j=i+d,mid=i+d/2;if(j>=0&&j<49&&Math.abs(j%7-i%7)+Math.abs(Math.floor(j/7)-Math.floor(i/7))===2&&board[j]===0&&board[mid]===1)list.push([i,j,mid]);}});return list;}
 function draw(){gridButtons(k,49,(b,i)=>{b.textContent=board[i]===1?'●':board[i]===0?'○':'';b.disabled=board[i]===-1;b.classList.toggle('chosen',i===selected);b.style.visibility=board[i]===-1?'hidden':'';b.setAttribute('aria-label',`Hole ${i+1}`);},i=>{if(board[i]===1)selected=i;else{const m=moves().find(m=>m[0]===selected&&m[1]===i);if(m){board[m[0]]=board[m[2]]=0;board[m[1]]=1;selected=-1;}}draw();const left=board.filter(v=>v===1).length;if(!moves().length)k.end(`${left} pegs remain${left===1?' — perfect!':''}`,33-left);else status(`${left} pegs remain`);},7);}draw();status('Jump a peg into the empty center.');return;
 }
 if(id==='battleships'){
 const k=kit(id,'Find all three hidden ships (lengths 3, 2, and 2) in 30 shots. Tap a square. Hits turn orange; misses show a dot.');const ships=[];for(const length of[3,2,2]){let cells;do{const horizontal=rand(2),r=rand(horizontal?6:7-length),c=rand(horizontal?7-length:6);cells=Array.from({length},(_,j)=>(r+(horizontal?0:j))*6+c+(horizontal?j:0));}while(cells.some(i=>ships.flat().includes(i)));ships.push(cells);}const shots=new Set(),hits=new Set();
 function draw(){gridButtons(k,36,(b,i)=>{b.textContent=hits.has(i)?'✹':shots.has(i)?'·':'?';b.disabled=shots.has(i);b.classList.toggle('chosen',hits.has(i));b.setAttribute('aria-label',`Sea row ${Math.floor(i/6)+1} column ${i%6+1}`);},i=>{shots.add(i);if(ships.flat().includes(i))hits.add(i);draw();if(hits.size===7)k.end(`Fleet found in ${shots.size} shots!`,100-shots.size);else if(shots.size===30){ships.flat().forEach(j=>{k.area.querySelectorAll('button')[j].textContent='✹';});k.end(`Out of shots · ${hits.size}/7 hits`,hits.size);}else status(`${30-shots.size} shots left · ${hits.size}/7 hits · ${ships.filter(s=>s.every(j=>hits.has(j))).length}/3 ships sunk`);},6);}draw();status('30 shots · Find the fleet.');return;
 }
 if(id==='dots'){
 const k=kit(id,'Two-player game on one screen. Take turns drawing edges. Completing a box earns a point and another turn. Most boxes wins.');const edges=new Set(),owners=Array(9).fill(0);let turn=1;
 const required=i=>{const r=Math.floor(i/3),c=i%3;return[`h${r},${c}`,`h${r+1},${c}`,`v${r},${c}`,`v${r},${c+1}`];};
 function draw(){k.area.innerHTML='';const g=document.createElement('div');g.className='dots-grid';k.area.append(g);for(let r=0;r<7;r++)for(let c=0;c<7;c++){if(r%2===0&&c%2===0){const dot=document.createElement('span');dot.textContent='•';g.append(dot);}else if(r%2&&c%2){const cell=document.createElement('span');cell.textContent=owners[Math.floor(r/2)*3+Math.floor(c/2)]||'';g.append(cell);}else{const key=(r%2===0?'h':'v')+Math.floor(r/2)+','+Math.floor(c/2);const b=k.button(edges.has(key)?(r%2===0?'━':'┃'):'',()=>{edges.add(key);let scored=false;owners.forEach((v,i)=>{if(!v&&required(i).every(e=>edges.has(e))){owners[i]=turn;scored=true;}});if(!scored)turn=3-turn;draw();const a=owners.filter(v=>v===1).length,b=owners.filter(v=>v===2).length;if(owners.every(Boolean))k.end(`Player 1: ${a} · Player 2: ${b} · ${a>b?'Player 1':'Player 2'} wins!`,Math.max(a,b));else status(`Player ${turn} to draw · ${a}–${b}`);},g);b.disabled=edges.has(key);b.setAttribute('aria-label',`${key[0]==='h'?'Horizontal':'Vertical'} edge row ${Math.floor(r/2)+1} column ${Math.floor(c/2)+1}`);}}}draw();status('Player 1 to draw.');return;
 }
}
function handTotal(hand){let total=hand.reduce((s,v)=>s+(v===1?11:Math.min(v,10)),0),aces=hand.filter(v=>v===1).length;while(total>21&&aces-- >0)total-=10;return total;}
function diceCombo(dice){const counts=Object.values(dice.reduce((o,d)=>(o[d]=(o[d]||0)+1,o),{})).sort((a,b)=>b-a),sorted=[...new Set(dice)].sort();if(counts[0]===5)return['Five of a kind',100];if(counts[0]===4)return['Four of a kind',70];if(counts[0]===3&&counts[1]===2)return['Full house',60];if(sorted.length===5&&sorted[4]-sorted[0]===4)return['Straight',50];if(counts[0]===3)return['Three of a kind',35];if(counts[0]===2&&counts[1]===2)return['Two pairs',25];if(counts[0]===2)return['One pair',15];return['High dice',dice.reduce((a,b)=>a+b,0)];}
function cardGame(id){
 if(id==='rps'){
 const k=kit(id,'Choose rock, paper, or scissors. First to five wins. Ties do not count.');let you=0,bot=0;const names=['Rock','Paper','Scissors'];names.forEach((name,i)=>k.button(name,()=>{const other=rand(3);if(i!==other){if((i-other+3)%3===1)you++;else bot++;}k.text(`${name} vs ${names[other]}`);status(`You ${you} · Computer ${bot}`);if(you===5||bot===5)k.end(you===5?'You won the match!':'Computer won the match.',you===5?100:you*10);}));k.text('Rock · Paper · Scissors');return;
 }
 if(id==='highlow'){
 const k=kit(id,'Predict whether the next card is higher or lower. Aces are low, kings high. Equal cards are a free pass. Ten correct predictions wins.');let value=1+rand(13),score=0;const label=n=>({1:'A',11:'J',12:'Q',13:'K'})[n]||n;const draw=()=>k.text(`Current card: ${label(value)}`);for(const direction of['Higher','Lower'])k.button(direction,()=>{const next=1+rand(13),good=next===value||(direction==='Higher'?next>value:next<value);if(!good){k.text(`${label(value)} → ${label(next)}`);k.end(`Streak ended at ${score}.`,score);return;}if(next!==value)score++;value=next;draw();if(score===10)k.end('Ten predictions! You win.',100);else status(`${score}/10 correct`);});draw();return;
 }
 if(id==='blackjack'){
 const k=kit(id,'A no-money card game. Get closer to 21 than the dealer without going over. Aces count as 1 or 11; face cards count as 10. Dealer draws below 17.');let deck=shuffle(Array.from({length:52},(_,i)=>i%13+1)),you=[deck.pop(),deck.pop()],dealer=[deck.pop(),deck.pop()],done=false;const label=hand=>hand.map(n=>({1:'A',11:'J',12:'Q',13:'K'})[n]||n).join(' · ');
 function draw(){k.area.innerHTML=`<p>Dealer: ${done?label(dealer)+' = '+handTotal(dealer):label([dealer[0]])+' · ?'}</p><div class="mini-question">${label(you)}</div><p>Your total: ${handTotal(you)}</p>`;}
 function end(){done=true;draw();const a=handTotal(you),b=handTotal(dealer);k.end(a>21?'Bust! Dealer wins.':b>21||a>b?'You win!':a===b?'A tie.':'Dealer wins.',a<=21&&(b>21||a>b)?100:a===b?50:0);}
 k.button('Hit',()=>{you.push(deck.pop());draw();if(handTotal(you)>21)end();});k.button('Stand',()=>{while(handTotal(dealer)<17)dealer.push(deck.pop());end();});draw();return;
 }
 if(id==='pigdice'){
 const k=kit(id,'Race the computer to 30 banked points. Roll adds to this turn; rolling 1 loses the unbanked points. Bank ends your turn.');let you=0,bot=0,pot=0,turn=true;
 const show=()=>k.text(`You ${you} · Computer ${bot} · This turn ${pot}`);
 function computer(){turn=false;k.later(()=>{let subtotal=0;while(subtotal<8){const roll=1+rand(6);if(roll===1){subtotal=0;break;}subtotal+=roll;}bot+=subtotal;pot=0;turn=true;show();if(bot>=30)k.end('Computer reached 30 first.',you);else status(`Computer banked ${subtotal}. Your turn.`);},600);}
 k.button('Roll',()=>{if(!turn)return;const roll=1+rand(6);if(roll===1){pot=0;status('Rolled 1! Turn points lost.');computer();}else{pot+=roll;status(`Rolled ${roll}. Roll again or bank.`);}show();});k.button('Bank',()=>{if(!turn)return;you+=pot;pot=0;show();if(you>=30)k.end('You reached 30 first!',you+100);else computer();});show();return;
 }
 if(id==='shutbox'){
 const k=kit(id,'Roll two dice. Select open numbers that add to the total, then Close numbers. Keep rolling until every number is shut or no combination is possible.');let open=Array.from({length:9},(_,i)=>i+1),selected=new Set(),target=0;
 function possible(i=0,sum=0){if(sum===target)return true;if(i===open.length||sum>target)return false;return possible(i+1,sum)||possible(i+1,sum+open[i]);}
 function draw(){gridButtons(k,9,(b,i)=>{b.textContent=i+1;b.disabled=!open.includes(i+1);b.classList.toggle('chosen',selected.has(i+1));},i=>{if(!target)return;const n=i+1;if(selected.has(n))selected.delete(n);else selected.add(n);draw();status(`Dice total ${target} · Selected ${[...selected].reduce((a,b)=>a+b,0)}`);},3);}
 const roll=k.button('Roll dice',()=>{if(target)return;const a=1+rand(6),b=1+rand(6);target=a+b;roll.disabled=true;status(`Rolled ${a} + ${b} = ${target}`);if(!possible())k.end(`No combination for ${target}. ${open.length} numbers remain.`,45-open.reduce((a,b)=>a+b,0));});k.button('Close numbers',()=>{if(!target)return;if([...selected].reduce((a,b)=>a+b,0)!==target){status(`Choose numbers adding to ${target}.`);return;}open=open.filter(n=>!selected.has(n));selected.clear();target=0;draw();roll.disabled=false;if(!open.length)k.end('You shut the whole box!',100);else status('Numbers closed. Roll again.');});draw();status('Roll to begin.');return;
 }
 if(id==='dicepoker'){
 const k=kit(id,'Roll five dice, tap any you want to hold, then reroll up to twice. Score your best combination. No bets or money.');let dice=Array.from({length:5},()=>1+rand(6)),held=new Set(),rolls=1;
 function draw(){gridButtons(k,5,(b,i)=>{b.textContent=['','⚀','⚁','⚂','⚃','⚄','⚅'][dice[i]];b.classList.toggle('chosen',held.has(i));b.setAttribute('aria-label',`Die ${i+1}: ${dice[i]}, ${held.has(i)?'held':'free'}`);},i=>{if(held.has(i))held.delete(i);else held.add(i);draw();},5);status(`Roll ${rolls}/3 · ${diceCombo(dice)[0]} · Tap dice to hold`);}
 const reroll=k.button('Reroll',()=>{if(rolls>=3)return;dice=dice.map((v,i)=>held.has(i)?v:1+rand(6));rolls++;draw();if(rolls===3)reroll.disabled=true;});k.button('Score hand',()=>{const [name,score]=diceCombo(dice);k.end(`${name}! ${score} points`,score);});draw();
 }
}
