const games=[{id:'snake',name:'Snake',category:'Arcade',desc:'An old-school classic. A growing ambition.',time:'2–5 min',art:'<div class="snake-art">▟▙<br>▀▜●</div>',tag:'THE CLASSIC'},{id:'memory',name:'Memory Match',category:'Brain',desc:'A little focus. A perfect pair.',time:'2–3 min',art:'<div class="memory-art"><span>✦</span><span>?</span><span>?</span><span>✦</span></div>',tag:'STAY SHARP'},{id:'ttt',name:'Tic-Tac-Toe',category:'Brain',desc:'Three in a row. You know the drill.',time:'1–2 min',art:'<div class="ttt-art">×│○<br>─┼─<br>○│×</div>',tag:'YOU VS. BOT'},{id:'reaction',name:'Reaction Time',category:'Quick',desc:'Less thinking. More lightning reflexes.',time:'30 sec',art:'<div class="reaction-art">ϟ</div>',tag:'QUICK FIRE'},{id:'2048',name:'2048',category:'Brain',desc:'Slide, combine, and chase the big one.',time:'5–10 min',art:'<div class="tiles-art"><span>128</span><span>256</span></div>',tag:'ONE MORE MOVE'},{id:'words',name:'Word Scramble',category:'Quick',desc:'A little mixed up. A lot of fun.',time:'2–3 min',art:'<div class="words-art">P L A Y</div>',tag:'WORD PLAY'}];
games.push(
  {id:'mines',name:'Minesweeper',category:'Brain',desc:'Follow the clues. Find a safe path.',time:'3–5 min',art:'<div class="mines-art"><span>1</span><span>⚑</span><span>2</span><span>✦</span></div>',tag:' THINK AHEAD'},
  {id:'connect',name:'Connect Four',category:'Brain',desc:'Four in a row. One clever move.',time:'3–5 min',art:'<div class="connect-art">● ● ○<br>○ ● ○<br>● ○ ●</div>',tag:' YOU VS. BOT'},
  {id:'sliding',name:'Sliding Puzzle',category:'Brain',desc:'A small shuffle. A satisfying finish.',time:'2–5 min',art:'<div class="sliding-art"><span>1</span><span>2</span><span>3</span><span></span></div>',tag:' MAKE A MOVE'}
);
games.push(
{id:'pong',name:'Pong',category:'Arcade',desc:'A tiny court. A timeless rivalry.',time:'2–5 min',art:'<div class="pong-art">▌ · ● · ▐</div>',tag:'NEW · RALLY TIME'},
{id:'moles',name:'Whack-a-Mole',category:'Quick',desc:'Catch a little mischief before it hides.',time:'30 sec',art:'<div class="mole-art">●ᴥ●</div>',tag:'NEW · QUICK TAPS'},
{id:'simon',name:'Simon Says',category:'Brain',desc:'Watch the pattern. Keep the rhythm.',time:'2–5 min',art:'<div class="simon-art"><span>1</span><span>2</span><span>3</span><span>4</span></div>',tag:'NEW · REPEAT AFTER ME'}
);
const $=s=>document.querySelector(s),stage=$('#game-stage'),dialog=$('#game-dialog');let cleanup=()=>{},current=null,stats={};try{stats=JSON.parse(localStorage.getItem('pocket-arcade-stats')||'{}')}catch{}function save(id,value,lower=false){if(stats[id]==null||(lower?value<stats[id]:value>stats[id])){stats[id]=value;try{localStorage.setItem('pocket-arcade-stats',JSON.stringify(stats))}catch{}}}function status(s){$('#game-status').textContent=s}function shuffle(a){for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}function render(filter='all'){$('#cards').innerHTML=games.filter(g=>filter==='all'||g.category===filter).map(g=>`<button class="card" data-game="${g.id}" aria-label="Play ${g.name}"><div class="art art-${g.id}"><span class="tag">${g.tag}</span><div class="illustration">${g.art}</div></div><div class="card-info"><div class="card-title"><h3>${g.name}</h3><span>↗</span></div><p>${g.desc}</p><div class="card-meta"><span>${g.category.toUpperCase()}</span><span>◷ ${g.time}</span></div></div></button>`).join('');document.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>openGame(b.dataset.game))}render();document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{document.querySelector('.filters .selected').classList.remove('selected');b.classList.add('selected');render(b.dataset.filter)});$('#surprise').onclick=()=>openGame(games[Math.floor(Math.random()*games.length)].id);function openGame(id){cleanup();current=id;const g=games.find(g=>g.id===id);$('#game-title').textContent=g.name;$('#game-category').textContent=g.category;stage.innerHTML='';status('');if(!dialog.open)dialog.showModal();({snake,memory,ttt,reaction,'2048':tiles,words,mines,connect,sliding,pong,moles,simon})[id]()}$('#restart').onclick=()=>openGame(current);$('#close-game').onclick=()=>dialog.close();dialog.addEventListener('close',()=>cleanup());$('#stats-button').onclick=()=>{$('#stats-list').innerHTML=games.map(g=>`<div class="stat-row"><span>${g.name}</span><strong>${stats[g.id]??'Not played'}${stats[g.id]!=null?({snake:' points',memory:' moves',ttt:' wins',reaction:' ms','2048':' points',words:' solved',mines:' wins',connect:' wins',sliding:' moves',pong:' wins',moles:' hits',simon:' rounds'}[g.id]):''}</strong></div>`).join('');$('#stats-dialog').showModal()};$('#close-stats').onclick=()=>$('#stats-dialog').close();function instructions(t){$('#instructions').textContent=t}function directions(handler){const el=document.createElement('div');el.className='controls';[['←','ArrowLeft'],['↑','ArrowUp'],['↓','ArrowDown'],['→','ArrowRight']].forEach(([label,key])=>{let b=document.createElement('button');b.textContent=label;b.setAttribute('aria-label',key.replace('Arrow','Move '));b.onclick=()=>handler(key);el.append(b)});stage.append(el)}
function snake(){instructions('Use arrow keys, WASD, or the buttons to steer. Take it easy at the new slower pace. Eat the orange snacks and avoid the walls and your tail.');stage.innerHTML='<canvas width="320" height="320" aria-label="Snake game board"></canvas>';let ctx=stage.querySelector('canvas').getContext('2d'),body=[{x:7,y:8},{x:6,y:8},{x:5,y:8}],dir={x:1,y:0},next=dir,food,score=0,ended=false,started=false;function snack(){let empty=[];for(let y=0;y<16;y++)for(let x=0;x<16;x++)if(!body.some(p=>p.x===x&&p.y===y))empty.push({x,y});food=empty[Math.floor(Math.random()*empty.length)]}snack();function draw(){ctx.fillStyle='#dbe3c8';ctx.fillRect(0,0,320,320);ctx.strokeStyle='#cbd5b8';for(let i=0;i<16;i++){ctx.beginPath();ctx.moveTo(i*20,0);ctx.lineTo(i*20,320);ctx.moveTo(0,i*20);ctx.lineTo(320,i*20);ctx.stroke()}body.forEach((p,i)=>{ctx.fillStyle=i?'#52714b':'#2c4d36';ctx.fillRect(p.x*20+1,p.y*20+1,18,18)});if(food){ctx.fillStyle='#c57943';ctx.beginPath();ctx.arc(food.x*20+10,food.y*20+10,7,0,Math.PI*2);ctx.fill()}}function key(k){const d={ArrowLeft:{x:-1,y:0},a:{x:-1,y:0},ArrowRight:{x:1,y:0},d:{x:1,y:0},ArrowUp:{x:0,y:-1},w:{x:0,y:-1},ArrowDown:{x:0,y:1},s:{x:0,y:1}}[k];if(d&&!ended){started=true;if(d.x!==-dir.x||d.y!==-dir.y)next=d}}const onkey=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','w','a','s','d'].includes(e.key)){e.preventDefault();key(e.key)}};document.addEventListener('keydown',onkey);directions(key);status('Press a direction to start.');draw();let timer=setInterval(()=>{if(!started||ended)return;dir=next;const h={x:body[0].x+dir.x,y:body[0].y+dir.y},eat=h.x===food.x&&h.y===food.y;if(h.x<0||h.x>15||h.y<0||h.y>15||body.slice(0,eat?body.length:-1).some(p=>p.x===h.x&&p.y===h.y)){ended=true;save('snake',score);status(`Game over · ${score} points`);return}body.unshift(h);if(eat){score+=10;snack();if(!food){ended=true;save('snake',score);status('You filled the board!');draw();return}}else body.pop();status(`Score: ${score}`);draw()},240);cleanup=()=>{clearInterval(timer);document.removeEventListener('keydown',onkey)}}
function memory(){instructions('Flip two cards at a time and find all eight pairs. Fewer moves means a better score.');const symbols=shuffle(['✦','☀','☘','♥','☾','♫','⚑','◆'].flatMap(x=>[x,x]));stage.innerHTML='<div class="board memory-board"></div>';let first=null,locked=false,moves=0,matches=0,timer;symbols.forEach((s,i)=>{let b=document.createElement('button');b.textContent='?';b.setAttribute('aria-label',`Face-down card ${i+1}`);b.onclick=()=>{if(locked||b.disabled||b===first)return;b.textContent=s;b.setAttribute('aria-label',s);if(!first){first=b;return}moves++;if(first.textContent===s){first.disabled=b.disabled=true;first.style.background=b.style.background='#c4d5ad';first=null;matches++;if(matches===8){save('memory',moves,true);status(`All matched! ${moves} moves`)}else status(`${moves} moves · ${matches}/8 pairs`)}else{locked=true;let prev=first;timer=setTimeout(()=>{b.textContent=prev.textContent='?';b.setAttribute('aria-label',`Face-down card ${i+1}`);prev.setAttribute('aria-label','Face-down card');first=null;locked=false},800);status(`${moves} moves · ${matches}/8 pairs`)}};stage.firstChild.append(b)});status('Find your first pair.');cleanup=()=>clearTimeout(timer)}
function ttt(){instructions('You are X. Get three in a row before the computer does.');let board=Array(9).fill(''),over=false,turn=true,timer;const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];stage.innerHTML='<div class="board ttt-board"></div>';function finish(){let win=lines.find(l=>l.every(i=>board[i]&&board[i]===board[l[0]]));if(win){over=true;let you=board[win[0]]==='X';status(you?'You win! Nicely played.':'The computer wins. Try again!');if(you)save('ttt',(stats.ttt||0)+1);return true}if(board.every(Boolean)){over=true;status('A draw. Great minds think alike.');return true}return false}function paint(){[...stage.firstChild.children].forEach((b,i)=>{b.textContent=board[i];b.disabled=!!board[i]||over||!turn})}for(let i=0;i<9;i++){let b=document.createElement('button');b.setAttribute('aria-label',`Cell ${i+1}`);b.onclick=()=>{if(board[i]||over||!turn)return;board[i]='X';if(finish()){paint();return}turn=false;paint();status('Computer is thinking…');timer=setTimeout(()=>{const findMove=s=>{for(const l of lines){let free=l.filter(i=>!board[i]);if(free.length===1&&l.filter(i=>board[i]===s).length===2)return free[0]}};let free=board.map((v,i)=>v?-1:i).filter(i=>i>=0);let move=findMove('O')??findMove('X')??(!board[4]?4:free[Math.floor(Math.random()*free.length)]);board[move]='O';turn=true;if(!finish())status('Your turn · X');paint()},400)};stage.firstChild.append(b)}status('Your turn · X');cleanup=()=>clearTimeout(timer)}
function reaction(){instructions('Click to start. Wait for green, then tap as quickly as you can.');stage.innerHTML='<button class="reaction-pad">Ready when you are. Click to start.</button>';const b=stage.firstChild;let state='idle',timer,start;b.onclick=()=>{if(state==='idle'){state='waiting';b.textContent='Wait for green…';b.style.background='';timer=setTimeout(()=>{state='ready';b.classList.add('ready');b.textContent='GO! TAP NOW';start=performance.now()},1500+Math.random()*3000);status('Patience is part of the game.')}else if(state==='waiting'){clearTimeout(timer);state='idle';b.textContent='Too soon! Click to try again.';status('Wait until the card turns green.')}else if(state==='ready'){let ms=Math.round(performance.now()-start);save('reaction',ms,true);state='idle';b.classList.remove('ready');b.textContent=`${ms} ms · Click to try again`;status(`Personal best: ${stats.reaction} ms`)}};cleanup=()=>clearTimeout(timer)}
function mergeLine(line){let a=line.filter(Boolean),out=[],gain=0;for(let i=0;i<a.length;i++){if(a[i]===a[i+1]){out.push(a[i]*2);gain+=a[i]*2;i++}else out.push(a[i])}while(out.length<4)out.push(0);return {line:out,gain}}function tiles(){instructions('Use arrow keys or the buttons to slide tiles. Matching numbers combine. Can you reach 2048?');let board=Array(16).fill(0),score=0,over=false;stage.innerHTML='<div class="board tile-board" aria-label="2048 board"></div>';function spawn(){let free=board.map((v,i)=>v?-1:i).filter(i=>i>=0);if(free.length)board[free[Math.floor(Math.random()*free.length)]]=Math.random()<.9?2:4}function draw(){stage.firstChild.innerHTML=board.map(v=>`<div class="tile ${v?'filled':''} ${v>=128?'big':''}">${v||''}</div>`).join('');status(`${over?'Game over · ':board.includes(2048)?'2048! Keep going · ':''}Score: ${score}`)}function move(k){if(over)return;let old=board.join(',');for(let r=0;r<4;r++){let ids=Array.from({length:4},(_,c)=>k==='ArrowLeft'?r*4+c:k==='ArrowRight'?r*4+3-c:k==='ArrowUp'?c*4+r:(3-c)*4+r);let merged=mergeLine(ids.map(i=>board[i]));ids.forEach((i,c)=>board[i]=merged.line[c]);score+=merged.gain}if(board.join(',')!==old){spawn();save('2048',score)}over=board.every(Boolean)&&!board.some((v,i)=>(i%4<3&&v===board[i+1])||(i<12&&v===board[i+4]));draw()}const key=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();move(e.key)}};document.addEventListener('keydown',key);directions(move);spawn();spawn();draw();cleanup=()=>document.removeEventListener('keydown',key)}
function words(){instructions('Unscramble five words. The clue gives you a nudge. Type your answer and press Enter.');const list=shuffle([['planet','A world in space'],['garden','Where flowers grow'],['puzzle','Something to solve'],['orange','A fruit and a color'],['rocket','A ride to space'],['pocket','A small home for your keys'],['forest','A place full of trees'],['arcade','You are in one right now'],['silver','A shiny precious metal'],['summer','The warmest season']]).slice(0,5);let index=0,solved=0;function show(){if(index===list.length){stage.innerHTML='<div class="scramble">NICE WORK ✦</div>';status(`${solved}/5 words solved`);save('words',solved);return}const [word,clue]=list[index];let mixed=shuffle([...word]).join('');if(mixed===word)mixed=word.slice(1)+word[0];stage.innerHTML=`<span class="eyebrow">WORD ${index+1} OF 5</span><div class="scramble">${mixed.toUpperCase()}</div><p>${clue}</p><form class="word-form"><input aria-label="Your answer" placeholder="Your answer" autocomplete="off" spellcheck="false"><button>Check ↗</button></form><button class="skip">Skip this word</button>`;stage.querySelector('form').onsubmit=e=>{e.preventDefault();if(stage.querySelector('input').value.trim().toLowerCase()===word){solved++;index++;status('That’s it! Keep going.');show()}else status('Not quite. Try rearranging those letters.')};stage.querySelector('.skip').onclick=()=>{status(`The word was ${word.toUpperCase()}.`);index++;show()};stage.querySelector('input').focus()}show();status('Your first word awaits.');cleanup=()=>{}}

function neighbors(index, size) {
  const row = Math.floor(index / size), col = index % size, result = [];
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    const y = row + dy, x = col + dx;
    if ((dx || dy) && y >= 0 && y < size && x >= 0 && x < size) result.push(y * size + x);
  }
  return result;
}
function makeMinefield(first) {
  const safe = new Set([first, ...neighbors(first, 8)]);
  return new Set(shuffle(Array.from({length:64}, (_, i) => i).filter(i => !safe.has(i))).slice(0, 10));
}
function mines() {
  instructions('Reveal every safe square on this 8×8 board. Numbers count nearby mines. Your first reveal is safe. Use Flag mode (or right-click) to mark suspected mines.');
  stage.innerHTML = '<div class="controls"><button id="flag-mode" aria-pressed="false">Flag mode: off</button></div><div class="board mine-board" aria-label="Minesweeper board"></div>';
  const grid = stage.querySelector('.mine-board'), toggle = stage.querySelector('#flag-mode');
  let bombs = null, flagMode = false, over = false;
  const opened = new Set(), flags = new Set(), buttons = [];
  function paint() {
    buttons.forEach((b, i) => {
      const n = bombs ? neighbors(i, 8).filter(j => bombs.has(j)).length : 0;
      const revealed = opened.has(i), showMine = over && bombs?.has(i);
      b.textContent = showMine ? '✹' : revealed ? (n || '·') : flags.has(i) ? '⚑' : '';
      b.className = showMine ? 'mine-hit' : revealed ? 'revealed' : '';
      b.disabled = over || revealed;
      b.setAttribute('aria-label', `Row ${Math.floor(i/8)+1}, column ${i%8+1}: ${showMine?'mine':revealed?`${n} nearby mines`:flags.has(i)?'flagged':'hidden'}`);
    });
  }
  function play(i, mark = flagMode) {
    if (over || opened.has(i)) return;
    if (mark) {
      if (flags.has(i)) flags.delete(i);
      else if (flags.size < 10) flags.add(i);
      else { status('All 10 flags used. Remove a flag to move it.'); return; }
    } else {
      if (flags.has(i)) { status('Remove the flag before revealing this square.'); return; }
      if (!bombs) bombs = makeMinefield(i);
      if (bombs.has(i)) { over = true; paint(); status('A mine! Play again for a fresh board.'); return; }
      const pending = [i];
      while (pending.length) {
        const cell = pending.pop();
        if (opened.has(cell) || flags.has(cell) || bombs.has(cell)) continue;
        opened.add(cell);
        const around = neighbors(cell, 8);
        if (!around.some(j => bombs.has(j))) pending.push(...around);
      }
    }
    if (opened.size === 54) {
      over = true; save('mines', (stats.mines || 0) + 1); status('All clear! You found every safe square.');
    } else status(`${opened.size}/54 safe squares · ${flags.size}/10 flags`);
    paint();
  }
  for (let i=0; i<64; i++) {
    const b = document.createElement('button');
    b.onclick = () => play(i);
    b.oncontextmenu = e => { e.preventDefault(); play(i, true); };
    buttons.push(b); grid.append(b);
  }
  toggle.onclick = () => {
    flagMode = !flagMode; toggle.textContent = `Flag mode: ${flagMode?'on':'off'}`;
    toggle.setAttribute('aria-pressed', String(flagMode));
  };
  paint(); status('10 mines · Choose your first square.'); cleanup = () => {};
}
function connectWinner(board, player) {
  for (let r=0; r<6; r++) for (let c=0; c<7; c++) {
    for (const [dr, dc] of [[0,1],[1,0],[1,1],[1,-1]]) {
      const endR=r+dr*3, endC=c+dc*3;
      if (endR<0 || endR>=6 || endC<0 || endC>=7) continue;
      if ([0,1,2,3].every(n => board[(r+dr*n)*7+c+dc*n] === player)) return true;
    }
  }
  return false;
}
function connectDrop(board, col, player) {
  for (let r=5; r>=0; r--) if (!board[r*7+col]) { board[r*7+col]=player; return r*7+col; }
  return -1;
}
function connectChoice(board) {
  const available = [3,2,4,1,5,0,6].filter(c => !board[c]);
  for (const player of [2,1]) for (const col of available) {
    const next = [...board]; connectDrop(next,col,player);
    if (connectWinner(next,player)) return col;
  }
  // Prefer columns that do not hand the player an immediate win.
  const safe = available.filter(col => {
    const next = [...board]; connectDrop(next,col,2);
    return !available.filter(c=>!next[c]).some(c=>{
      const reply=[...next]; connectDrop(reply,c,1); return connectWinner(reply,1);
    });
  });
  const choices = safe.length ? safe : available;
  return choices[Math.floor(Math.random()*Math.min(3,choices.length))];
}
function connect() {
  instructions('You are the green discs; the computer is orange. Choose a column to drop a disc. Connect four horizontally, vertically, or diagonally to win.');
  stage.innerHTML = '<div class="connect-drops" aria-label="Choose a column"></div><div class="connect-board" aria-label="Connect Four board"></div><span class="legend">● You (green) · ○ Computer (orange)</span>';
  const board=Array(42).fill(0), drops=stage.querySelector('.connect-drops'), grid=stage.querySelector('.connect-board');
  let turn=true, over=false, timer;
  function paint() {
    grid.innerHTML=board.map((v,i)=>`<span class="disc disc-${v}" role="img" aria-label="Row ${Math.floor(i/7)+1}, column ${i%7+1}: ${v===1?'you':v===2?'computer':'empty'}">${v===1?'●':v===2?'○':''}</span>`).join('');
    [...drops.children].forEach((b,c)=>b.disabled=over||!turn||!!board[c]);
  }
  function finish(player) {
    if (connectWinner(board,player)) {
      over=true; status(player===1?'Four in a row! You win.':'The computer connected four. Try again!');
      if(player===1) save('connect',(stats.connect||0)+1);
    } else if(board.every(Boolean)) { over=true; status('A full board and a draw. Well played!'); }
    return over;
  }
  for(let c=0;c<7;c++) {
    const b=document.createElement('button'); b.textContent='↓'; b.setAttribute('aria-label',`Drop in column ${c+1}`);
    b.onclick=()=>{
      if(!turn||over||board[c])return;
      connectDrop(board,c,1);
      if(finish(1)){paint();return;}
      turn=false;paint();status('Computer is thinking…');
      timer=setTimeout(()=>{
        connectDrop(board,connectChoice(board),2);turn=true;
        if(!finish(2))status('Your turn · Choose a column.');paint();
      },450);
    };
    drops.append(b);
  }
  paint(); status('Your turn · Choose a column.'); cleanup=()=>clearTimeout(timer);
}
function slideNeighbors(blank) {
  return [blank-3,blank+3,blank-1,blank+1].filter(i=>i>=0&&i<9&&Math.abs(Math.floor(i/3)-Math.floor(blank/3))+Math.abs(i%3-blank%3)===1);
}
function slideSolved(board) { return board.every((v,i)=>v===(i+1)%9); }
function makeSlideBoard() {
  const board=[1,2,3,4,5,6,7,8,0]; let blank=8, previous=-1;
  // Legal moves from the solved state keep every shuffle solvable.
  for(let n=0;n<60;n++) {
    const choices=slideNeighbors(blank).filter(i=>i!==previous);
    const next=choices[Math.floor(Math.random()*choices.length)];
    [board[blank],board[next]]=[board[next],board[blank]]; previous=blank; blank=next;
  }
  if(slideSolved(board)){const next=slideNeighbors(blank)[0];[board[blank],board[next]]=[board[next],board[blank]];}
  return board;
}
function sliding() {
  instructions('Arrange the tiles from 1 to 8, with the empty space at the bottom right. Tap a tile next to the gap to slide it. Every puzzle can be solved.');
  stage.innerHTML='<div class="board sliding-board" aria-label="Sliding puzzle board"></div><span class="legend">Goal: 1 2 3 / 4 5 6 / 7 8 □</span>';
  const board=makeSlideBoard(), grid=stage.querySelector('.sliding-board');let moves=0,over=false;
  function paint(){
    grid.innerHTML='';
    board.forEach((v,i)=>{
      const b=document.createElement('button');b.textContent=v||'';b.className=v?'':'gap';
      b.setAttribute('aria-label',v?`Tile ${v}`:'Empty space');b.disabled=over||!v;
      b.onclick=()=>{
        const blank=board.indexOf(0);
        if(over||!slideNeighbors(blank).includes(i)){status('Choose a tile touching the empty space.');return;}
        [board[blank],board[i]]=[board[i],board[blank]];moves++;
        over=slideSolved(board);
        if(over){save('sliding',moves,true);status(`Perfect order! Solved in ${moves} moves.`);}
        else status(`${moves} moves`);
        paint();
        if(!over)grid.querySelector(`[aria-label="Tile ${v}"]`).focus();
      };
      grid.append(b);
    });
  }
  paint();status('Slide a tile to get started.');cleanup=()=>{};
}

function pongStep(s, dt) {
  s.x += s.vx * dt; s.y += s.vy * dt;
  if (s.y < 6) { s.y = 6; s.vy = Math.abs(s.vy); }
  if (s.y > 234) { s.y = 234; s.vy = -Math.abs(s.vy); }
  if (s.vx < 0 && s.x <= 27 && s.x >= 14 && Math.abs(s.y-s.player) <= 35) {
    s.x=27; s.vx=Math.min(260,Math.abs(s.vx)+8); s.vy=(s.y-s.player)*5;
  }
  if (s.vx > 0 && s.x >= 333 && s.x <= 346 && Math.abs(s.y-s.bot) <= 35) {
    s.x=333; s.vx=-Math.min(260,Math.abs(s.vx)+8); s.vy=(s.y-s.bot)*5;
  }
  return s.x < -6 ? 'bot' : s.x > 366 ? 'player' : null;
}
function pong() {
  instructions('You are the left paddle. Move with ↑ / ↓ or W / S, drag on the court, or use the slider. First to 5 points wins.');
  stage.innerHTML='<canvas width="360" height="240" aria-label="Pong court: you on the left, computer on the right"></canvas><label class="paddle-label">Your paddle <input id="paddle" type="range" min="30" max="210" value="120" aria-label="Paddle position"></label><div class="controls"><button id="pong-start">Start match</button></div>';
  const canvas=stage.querySelector('canvas'), ctx=canvas.getContext('2d'), slider=stage.querySelector('input'), button=stage.querySelector('#pong-start');
  const s={x:180,y:120,vx:160,vy:65,player:120,bot:120};
  let yours=0,theirs=0,running=false,over=false,frame,last=0,serve=0;const keys=new Set();
  function score(){status(`You ${yours} · Computer ${theirs}${over?(yours===5?' · You win!':' · Computer wins.'):''}`);}
  function resetBall(){s.x=180;s.y=120;s.vx=(Math.random()<.5?-1:1)*160;s.vy=(Math.random()<.5?-1:1)*65;serve=.7;}
  function paint(){
    ctx.fillStyle='#263e30';ctx.fillRect(0,0,360,240);ctx.strokeStyle='#77906a';ctx.setLineDash([5,9]);ctx.beginPath();ctx.moveTo(180,0);ctx.lineTo(180,240);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#d6e7aa';ctx.fillRect(14,s.player-30,8,60);ctx.fillStyle='#e9a16e';ctx.fillRect(338,s.bot-30,8,60);ctx.fillStyle='#f8f2da';ctx.beginPath();ctx.arc(s.x,s.y,6,0,Math.PI*2);ctx.fill();
    if(!running&&!over){ctx.fillStyle='#f8f2da';ctx.font='16px sans-serif';ctx.textAlign='center';ctx.fillText(button.textContent==='Start match'?'Ready to rally?':'Paused',180,35);}
  }
  function tick(now){
    const dt=Math.min((now-last)/1000||0,.025);last=now;
    if(running&&!over){
      const direction=(keys.has('ArrowDown')||keys.has('s')?1:0)-(keys.has('ArrowUp')||keys.has('w')?1:0);
      s.player=Math.max(30,Math.min(210,s.player+direction*240*dt));slider.value=String(s.player);
      s.bot=Math.max(30,Math.min(210,s.bot+Math.max(-105*dt,Math.min(105*dt,s.y-s.bot))));
      if(serve>0)serve-=dt;else{
        const winner=pongStep(s,dt);
        if(winner){if(winner==='player')yours++;else theirs++;over=yours===5||theirs===5;if(over){running=false;button.disabled=true;button.textContent='Match finished';if(yours===5)save('pong',(stats.pong||0)+1);}else resetBall();score();}
      }
    }
    paint();frame=requestAnimationFrame(tick);
  }
  function pause(){if(running){running=false;button.textContent='Resume match';keys.clear();}}
  button.onclick=()=>{if(!over){running=!running;button.textContent=running?'Pause match':'Resume match';}};
  slider.oninput=()=>{s.player=Number(slider.value);};
  function point(e){const r=canvas.getBoundingClientRect();s.player=Math.max(30,Math.min(210,(e.clientY-r.top)/r.height*240));slider.value=String(s.player);}
  canvas.onpointerdown=e=>{canvas.setPointerCapture(e.pointerId);point(e);};canvas.onpointermove=e=>{if(e.buttons||e.pointerType==='mouse')point(e);};
  const keydown=e=>{if(['ArrowUp','ArrowDown','w','s'].includes(e.key)&&e.target!==slider){e.preventDefault();keys.add(e.key);}};
  const keyup=e=>keys.delete(e.key); const visibility=()=>{if(document.hidden)pause();};
  document.addEventListener('keydown',keydown);document.addEventListener('keyup',keyup);document.addEventListener('visibilitychange',visibility);window.addEventListener('blur',pause);
  score();frame=requestAnimationFrame(tick);
  cleanup=()=>{cancelAnimationFrame(frame);document.removeEventListener('keydown',keydown);document.removeEventListener('keyup',keyup);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('blur',pause);};
}
function moles() {
  instructions('Tap the mole before it hides. You have 30 seconds. Each mole counts once; empty holes do not count. You can also use keys 1–9.');
  stage.innerHTML='<div class="board mole-board" aria-label="Whack-a-Mole holes"></div><div class="controls"><button id="mole-start">Start 30-second round</button></div>';
  const grid=stage.querySelector('.mole-board'),start=stage.querySelector('#mole-start');
  let score=0,active=-1,running=false,deadline=0,nextPop=0,timer;
  function paint(){[...grid.children].forEach((b,i)=>{b.classList.toggle('up',i===active);b.textContent=i===active?'●ᴥ●':String(i+1);b.setAttribute('aria-label',`Hole ${i+1}: ${i===active?'mole':'empty'}`);b.disabled=!running;});}
  function finish(){running=false;active=-1;clearInterval(timer);save('moles',score);paint();status(`Time’s up! ${score} hits · Best: ${stats.moles}`);start.textContent='Round finished';}
  function hit(i){if(!running)return;if(performance.now()>=deadline){finish();return;}if(i===active){score++;active=-1;paint();status(`${score} hits · ${Math.ceil((deadline-performance.now())/1000)} seconds left`);}}
  for(let i=0;i<9;i++){const b=document.createElement('button');b.onclick=()=>hit(i);grid.append(b);}
  start.onclick=()=>{
    if(running)return;running=true;deadline=performance.now()+30000;nextPop=0;start.disabled=true;start.textContent='Catch them!';
    function tick(){const now=performance.now();if(now>=deadline){finish();return;}if(now>=nextPop){let choices=Array.from({length:9},(_,i)=>i).filter(i=>i!==active);active=choices[Math.floor(Math.random()*choices.length)];nextPop=now+850;paint();}status(`${score} hits · ${Math.ceil((deadline-now)/1000)} seconds left`);}
    tick();timer=setInterval(tick,50);
  };
  const key=e=>{if(/^[1-9]$/.test(e.key)&&!e.repeat){e.preventDefault();hit(Number(e.key)-1);}};
  document.addEventListener('keydown',key);paint();status('Ready for a quick round?');cleanup=()=>{clearInterval(timer);document.removeEventListener('keydown',key);};
}
function simon() {
  instructions('Watch the numbered pads light up, then repeat the pattern. One new step is added each round. Click the pads or press keys 1–4.');
  stage.innerHTML='<div class="simon-board" aria-label="Simon Says pads"></div><div class="controls"><button id="simon-start">Start pattern</button><button id="simon-replay" disabled>Replay pattern</button></div>';
  const grid=stage.querySelector('.simon-board'),start=stage.querySelector('#simon-start'),replay=stage.querySelector('#simon-replay'),pads=[],sequence=[],timers=new Set();
  let accepting=false,position=0,completed=0,over=false;
  function later(fn,ms){const t=setTimeout(()=>{timers.delete(t);fn();},ms);timers.add(t);}
  function lock(value){accepting=!value;pads.forEach(b=>b.disabled=value);replay.disabled=value;}
  function flash(i,ms=450){pads[i].classList.add('lit');later(()=>pads[i].classList.remove('lit'),ms);}
  function playback(){lock(true);position=0;pads.forEach(b=>b.classList.remove('lit'));status(`Round ${sequence.length} · Watch the pattern`);
    sequence.forEach((v,i)=>later(()=>{flash(v);status(`Watch: ${v+1}`);},350+i*750));
    later(()=>{lock(false);status(`Your turn · Repeat ${sequence.length} step${sequence.length===1?'':'s'}`);},350+sequence.length*750);
  }
  function next(){sequence.push(Math.floor(Math.random()*4));playback();}
  function press(i){if(!accepting||over)return;flash(i,220);
    if(i!==sequence[position]){over=true;lock(true);status(`Not quite! ${completed} rounds completed · Play again to retry.`);save('simon',completed);return;}
    position++;
    if(position===sequence.length){completed++;save('simon',completed);lock(true);status(`Round ${completed} complete!`);later(next,1000);}
    else status(`Your turn · ${position}/${sequence.length} steps`);
  }
  ['Green','Orange','Blue','Purple'].forEach((color,i)=>{const b=document.createElement('button');b.textContent=String(i+1);b.className=`simon-pad pad-${i}`;b.setAttribute('aria-label',`${color} pad ${i+1}`);b.onclick=()=>press(i);grid.append(b);pads.push(b);});
  start.onclick=()=>{start.disabled=true;start.textContent='Follow the pattern';next();};replay.onclick=()=>{if(accepting)playback();};
  const key=e=>{if(/^[1-4]$/.test(e.key)&&!e.repeat){e.preventDefault();press(Number(e.key)-1);}};
  document.addEventListener('keydown',key);lock(true);status('How long a pattern can you remember?');
  cleanup=()=>{timers.forEach(clearTimeout);timers.clear();document.removeEventListener('keydown',key);};
}
