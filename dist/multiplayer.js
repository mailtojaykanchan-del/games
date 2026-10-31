/* Local two-player games. The mode choice is deliberately shown on every visit. */
const mpDescriptions={ttt:'Player 1 is X. Player 2 is O.',connect:'Drop discs together. First to four wins.',memory:'Find pairs. Collect more than your friend.',pong:'Two paddles. Two players. First to five.',reversi:'Dark vs. light. Flip your friend’s discs.',nim:'Take turns. Take the last stone to win.',rps:'Secret picks. First to five wins.',dots:'Draw edges together and claim the boxes.'};
const mpRunners={ttt:()=>mpTicTacToe(),connect:()=>mpConnect(),memory:()=>mpMemory(),pong:()=>mpPong(),reversi:()=>mpReversi(),nim:()=>mpNim(),rps:()=>mpRps(),dots:()=>boardGame('dots')};
window.arcadeMultiplayer={mode:null,allowed(id){return this.mode===2?Object.hasOwn(mpRunners,id):this.mode===1?id!=='dots':true;},runner(id){return this.mode===2?mpRunners[id]:null;},description(g){return this.mode===2?mpDescriptions[g.id]:g.desc;},choose(){if(dialog.open)dialog.close();if($('#stats-dialog').open)$('#stats-dialog').close();if(!$('#mode-dialog').open)$('#mode-dialog').showModal();}};
function setPlayerMode(mode){
 window.arcadeMultiplayer.mode=mode;
 $('#mode-dialog').close();$('#active-mode').textContent=mode===1?'● One player · Solo & computer opponents':'● ● Two players · Same device';
 $('#game-search').value='';$('#game-search').placeholder=mode===1?'Search solo games…':'Search two-player games…';
 document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('selected',b.dataset.filter==='all');b.hidden=b.dataset.filter!=='all'&&!games.some(g=>window.arcadeMultiplayer.allowed(g.id)&&g.category===b.dataset.filter);});
 $('#stats-button').hidden=mode===2;render('all');
}
$('#choose-solo').onclick=()=>setPlayerMode(1);$('#choose-duo').onclick=()=>setPlayerMode(2);$('#change-mode').onclick=()=>window.arcadeMultiplayer.choose();
$('#mode-dialog').addEventListener('cancel',e=>{if(!window.arcadeMultiplayer.mode)e.preventDefault();});
$('#surprise').onclick=()=>{const available=games.filter(g=>window.arcadeMultiplayer.allowed(g.id));openGame(pick(available).id);};
window.arcadeMultiplayer.choose();
function mpResult(a,b){return a===b?'It’s a tie!':`Player ${a>b?1:2} wins!`;}
function mpTicTacToe(){
 const k=kit('ttt','Share this device. Player 1 is X, Player 2 is O. Take turns placing a mark. Three in a row wins.');let board=Array(9).fill(''),turn=1;
 const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
 function draw(){gridButtons(k,9,(b,i)=>{b.textContent=board[i];b.disabled=!!board[i];b.setAttribute('aria-label',`Cell ${i+1}${board[i]?': '+board[i]:''}`);},i=>{if(board[i])return;board[i]=turn===1?'X':'O';draw();if(lines.some(l=>l.every(j=>board[j]===board[i]))){k.end(`Player ${turn} wins!`);return;}if(board.every(Boolean)){k.end('It’s a tie!');return;}turn=3-turn;status(`Player ${turn}’s turn · ${turn===1?'X':'O'}`);},3);}
 draw();status('Player 1’s turn · X');
}
function mpConnect(){
 const k=kit('connect','Player 1 is green (●), Player 2 is orange (○). Take turns dropping a disc in a column. Four in a row wins.');const board=Array(42).fill(0);let turn=1;
 k.area.innerHTML='<div class="connect-drops"></div><div class="connect-board" aria-label="Two-player Connect Four board"></div>';const drops=k.area.firstChild,grid=k.area.lastChild;
 function draw(){grid.innerHTML=board.map((v,i)=>`<span class="disc disc-${v}" aria-label="Row ${Math.floor(i/7)+1}, column ${i%7+1}: ${v?'Player '+v:'empty'}">${v===1?'●':v===2?'○':''}</span>`).join('');[...drops.children].forEach((b,i)=>b.disabled=!!board[i]);}
 for(let col=0;col<7;col++){const b=k.button('↓',()=>{if(board[col])return;connectDrop(board,col,turn);draw();if(connectWinner(board,turn)){k.end(`Player ${turn} connects four. You win!`);return;}if(board.every(Boolean)){k.end('The board is full. It’s a tie!');return;}turn=3-turn;status(`Player ${turn}’s turn · ${turn===1?'Green ●':'Orange ○'}`);},drops);b.setAttribute('aria-label',`Drop in column ${col+1}`);}
 draw();status('Player 1’s turn · Green ●');
}
function mpMemory(){
 const k=kit('memory','Take turns flipping two cards. A matching pair earns a point and another turn. A miss passes the turn. Most pairs wins.');const symbols=shuffle(['✦','☀','☘','♥','☾','♫','⚑','◆'].flatMap(s=>[s,s])),matched=new Set();let turn=1,scores=[0,0],first=-1,second=-1,locked=false;
 function message(){status(`Player ${turn}’s turn · P1 ${scores[0]} pairs · P2 ${scores[1]} pairs`);}
 function draw(){gridButtons(k,16,(b,i)=>{b.textContent=matched.has(i)||i===first||i===second?symbols[i]:'?';b.disabled=matched.has(i)||locked;b.classList.toggle('chosen',matched.has(i));b.setAttribute('aria-label',`Card ${i+1}${matched.has(i)?' matched':i===first||i===second?': '+symbols[i]:''}`);},i=>{if(locked||matched.has(i)||i===first)return;if(first<0){first=i;draw();return;}second=i;locked=true;draw();if(symbols[first]===symbols[second]){matched.add(first);matched.add(second);scores[turn-1]++;k.later(()=>{first=second=-1;locked=false;draw();if(matched.size===16)k.end(`${mpResult(...scores)} P1 ${scores[0]} · P2 ${scores[1]}`);else message();},500);}else k.later(()=>{first=second=-1;locked=false;turn=3-turn;draw();message();},1000);},4);}
 draw();message();
}
function mpReversi(){
 const k=kit('reversi','Player 1 is dark (●), Player 2 is light (○). Choose a dotted square to trap and flip discs. No legal move? Your turn passes. Most discs wins.');const board=Array(64).fill(0);board[27]=board[36]=2;board[28]=board[35]=1;let turn=1;
 function draw(){const options=reversiMoves(board,turn);gridButtons(k,64,(b,i)=>{b.textContent=board[i]===1?'●':board[i]===2?'○':options.some(m=>m.i===i)?'·':'';b.disabled=!options.some(m=>m.i===i);b.setAttribute('aria-label',`Square ${i+1}: ${board[i]?'Player '+board[i]:'empty'}`);},i=>{const m=options.find(m=>m.i===i);if(!m)return;board[i]=turn;m.flips.forEach(j=>board[j]=turn);const next=3-turn;let passed=false;if(reversiMoves(board,next).length)turn=next;else if(reversiMoves(board,turn).length)passed=true;else{draw();const a=board.filter(v=>v===1).length,b=board.filter(v=>v===2).length;k.end(`${mpResult(a,b)} P1 ${a} · P2 ${b}`);return;}draw();status(`${passed?'Other player has no move. ':''}Player ${turn}’s turn · ${turn===1?'Dark ●':'Light ○'}`);},8);}
 draw();status('Player 1’s turn · Dark ●');
}
function mpNim(){
 const k=kit('nim','Take turns removing one, two, or three stones. Whoever takes the last stone wins. Player 1 starts.');let stones=21,turn=1;const buttons=[];
 function draw(){k.text('● '.repeat(stones));buttons.forEach((b,i)=>b.disabled=i+1>stones);status(`Player ${turn}’s turn · ${stones} stones left`);}
 for(let n=1;n<=3;n++)buttons.push(k.button('Take '+n,()=>{if(n>stones)return;stones-=n;if(!stones){k.text('No stones left');k.end(`Player ${turn} took the last stone and wins!`);return;}turn=3-turn;draw();}));draw();
}
function mpRps(){
 const k=kit('rps','Pass the device for secret choices. Player 1 picks first, then Player 2. Look away while the other player chooses! First to five round wins takes the match.');const names=['Rock','Paper','Scissors'];let scores=[0,0],first=-1;
 function choice(player){k.area.innerHTML=`<h3>Player ${player}: make your secret choice</h3>`;k.controls.innerHTML='';names.forEach((name,i)=>k.button(name,()=>{if(player===1){first=i;k.area.innerHTML='<h3>Player 1’s choice is hidden</h3><p>Pass the device to Player 2.</p>';k.controls.innerHTML='';k.button('Player 2 is ready',()=>choice(2));}else{if(i!==first){if((first-i+3)%3===1)scores[0]++;else scores[1]++;}k.text(`Player 1: ${names[first]} · Player 2: ${name}`);k.controls.innerHTML='';status(`P1 ${scores[0]} · P2 ${scores[1]}`);if(scores.includes(5))k.end(`${mpResult(...scores)} ${scores[0]}–${scores[1]}`);else k.button('Next round',()=>choice(1));}}));status(`P1 ${scores[0]} · P2 ${scores[1]} · First to five`);}
 choice(1);
}
function mpPong(){
 const k=canvasKit('pong','Player 1 (left) uses W / S. Player 2 (right) uses ↑ / ↓. On touch screens, drag your side of the court or use your paddle slider. First to five wins.');
 // Use a wider court and independent controls for both players.
 k.canvas.width=360;k.canvas.height=240;k.canvas.style.aspectRatio='3 / 2';const c=k.ctx,keys=new Set();let p1=120,p2=120,score=[0,0],ball={x:180,y:120,vx:155,vy:60},running=false,delay=0;
 const sliders=document.createElement('div');sliders.className='mp-sliders';sliders.innerHTML='<label>Player 1<input type="range" min="30" max="210" value="120" aria-label="Player 1 paddle"></label><label>Player 2<input type="range" min="30" max="210" value="120" aria-label="Player 2 paddle"></label>';k.controls.append(sliders);const inputs=sliders.querySelectorAll('input');inputs[0].oninput=()=>p1=Number(inputs[0].value);inputs[1].oninput=()=>p2=Number(inputs[1].value);
 const start=k.button('Start match',()=>{running=!running;start.textContent=running?'Pause match':'Resume match';});
 const onKey=e=>{if(['w','s','ArrowUp','ArrowDown'].includes(e.key)&&e.target.tagName!=='INPUT'){e.preventDefault();keys.add(e.key);}};k.on(document,'keydown',onKey);k.on(document,'keyup',e=>keys.delete(e.key));k.on(window,'blur',()=>{keys.clear();running=false;start.textContent='Resume match';});
 const pointers=new Map();function point(e){const r=k.canvas.getBoundingClientRect(),y=clamp((e.clientY-r.top)/r.height*240,30,210),side=pointers.get(e.pointerId);if(side===0)p1=y;else if(side===1)p2=y;}
 k.on(k.canvas,'pointerdown',e=>{e.preventDefault();const r=k.canvas.getBoundingClientRect();pointers.set(e.pointerId,e.clientX-r.left<r.width/2?0:1);k.canvas.setPointerCapture(e.pointerId);point(e);});k.on(k.canvas,'pointermove',e=>{if(pointers.has(e.pointerId))point(e);});for(const type of ['pointerup','pointercancel'])k.on(k.canvas,type,e=>pointers.delete(e.pointerId));
 function draw(){c.fillStyle='#263e30';c.fillRect(0,0,360,240);c.setLineDash([5,8]);c.strokeStyle='#82986d';c.beginPath();c.moveTo(180,0);c.lineTo(180,240);c.stroke();c.setLineDash([]);c.fillStyle='#d5e7a4';c.fillRect(14,p1-30,8,60);c.fillStyle='#e7a476';c.fillRect(338,p2-30,8,60);c.fillStyle='#f7e5a2';c.beginPath();c.arc(ball.x,ball.y,6,0,7);c.fill();c.font='24px sans-serif';c.textAlign='center';c.fillText(score[0]+'     '+score[1],180,30);if(!running){c.font='14px sans-serif';c.fillText('Press Start / Resume',180,65);}}
 k.loop(dt=>{if(running){p1=clamp(p1+((keys.has('s')?1:0)-(keys.has('w')?1:0))*230*dt,30,210);p2=clamp(p2+((keys.has('ArrowDown')?1:0)-(keys.has('ArrowUp')?1:0))*230*dt,30,210);if(delay>0)delay-=dt;else{ball.player=p1;ball.bot=p2;const result=pongStep(ball,dt);if(result){score[result==='player'?0:1]++;if(score.includes(5)){draw();k.end(`Player ${score[0]===5?1:2} wins! ${score[0]}–${score[1]}`);return;}ball={x:180,y:120,vx:(Math.random()<.5?-1:1)*155,vy:60};delay=.7;status(`Player 1: ${score[0]} · Player 2: ${score[1]}`);}}}inputs[0].value=p1;inputs[1].value=p2;draw();});status('Player 1: 0 · Player 2: 0');
}
