/* One host and one invited friend, using a reliable WebRTC data channel. */
(() => {
 const room=document.createElement('dialog');room.className='online-room';room.setAttribute('aria-label','Online room');
 room.innerHTML='<div class="modal-head"><h2>Play with a friend</h2><button id="room-close" aria-label="Close room">×</button></div><p>Create a room and share its code. Your friend opens this website on their computer and joins.</p><div id="room-setup"><button id="room-create">Create room</button><form id="room-join-form"><label for="room-code-input">Friend’s room code</label><input id="room-code-input" maxlength="12" autocomplete="off" autocapitalize="characters" placeholder="Enter code" pattern="[A-Za-z0-9]{8}" required><button id="room-join">Join room</button></form></div><div id="room-session" hidden><span>Your room code</span><code id="room-code"></code><button id="room-copy">Copy invite link</button><label for="room-game">Game</label><select id="room-game"></select><button id="room-start" disabled>Start game</button><button id="room-leave">Leave room</button></div><p id="room-status" role="status" aria-live="polite">Choose Create room or enter a friend’s code.</p><p class="online-help">Keep both tabs open. Some school, work, or restricted networks may block connections. If joining fails, try another network.</p>';
 document.body.append(room);
 const el=id=>document.getElementById(id);
 onlineGames.forEach(id=>{const o=document.createElement('option');o.value=id;o.textContent=games.find(g=>g.id===id).name;el('room-game').append(o);});
 let peer=null,connection=null,host=false,player=1,code='',state=null,view=null,match='',connected=false,timer=null,timeout=null,epoch=0,sequence=0,lastSequence=-1,lastSeen=0,lastPing=0,uiKey='',paddle=120;
 const tell=t=>el('room-status').textContent=t;
 function send(data){if(connection?.open)try{connection.send(data);}catch{lost();}}
 function busy(value){el('room-create').disabled=value;el('room-join').disabled=value;}
 function sessionUI(){el('room-setup').hidden=!!peer;el('room-session').hidden=!peer;el('room-code').textContent=code;el('room-game').disabled=!host;el('room-start').disabled=!connected;el('room-start').textContent=host?'Start selected game':'Return to game';}
 function leave(){epoch++;clearInterval(timer);clearTimeout(timeout);timer=timeout=null;const old=peer;peer=null;connection=null;connected=false;state=view=null;match='';uiKey='';old?.destroy();busy(false);sessionUI();$('#restart').disabled=false;}
 function lost(){if(!peer)return;connected=false;clearInterval(timer);clearTimeout(timeout);if(state?.game==='pong')state.running=false;el('room-start').disabled=true;status('Your friend disconnected. Open Room to leave and reconnect.');tell('Connection lost. Leave this room, then create or join a new one.');if(dialog.open){stage.querySelectorAll('button,input').forEach(b=>{if(!b.closest('.online-toolbar'))b.disabled=true;});$('#restart').disabled=true;}else if(!room.open)room.showModal();}
 function errorText(error){return ({'peer-unavailable':'Room not found. Check the code and make sure your friend keeps their room open.','unavailable-id':'That room code is busy. Please create another room.','network':'Could not reach the room service. Check your connection and try again.','browser-incompatible':'This browser does not support online play. Try a recent Chrome, Safari, Firefox, or Edge.'})[error?.type]||'Could not connect. Try again, or try a different network.';}
 function showRoom(){if(dialog.open)dialog.close();sessionUI();if(!room.open)room.showModal();}
 function accept(c,token){
  connection=c;
  c.on('open',()=>{if(token!==epoch)return;connected=true;clearTimeout(timeout);busy(false);lastSeen=Date.now();sessionUI();tell(host?'Friend connected! Choose a game and press Start.':'Connected! Your friend chooses the game. You are Player 2.');send({type:'hello',version:1});timer=setInterval(()=>{if(Date.now()-lastSeen>18000){lost();return;}if(Date.now()-lastPing>3000){send({type:'ping'});lastPing=Date.now();}if(host&&state?.game==='pong'&&connected){onlineTick(state,.033);publish();}},33);});
  c.on('data',data=>{if(token!==epoch||!data||typeof data!=='object')return;lastSeen=Date.now();
   if(data.type==='ping')return;
   if(data.type==='hello'){if(data.version!==1){tell('Your friend has a different version. Both refresh the website.');c.close();}return;}
   if(host){if(data.type==='action'&&data.match===match&&(state?.game==='rps'?data.round===state.round:data.revision===state?.revision)&&Number.isSafeInteger(data.seq)&&data.seq>lastSequence){lastSequence=data.seq;if(onlineMove(state,2,data.action))publish();}}
   else if(data.type==='state'&&typeof data.match==='string'&&data.state&&onlineGames.includes(data.state.game)){
    const changed=match!==data.match;match=data.match;view=data.state;el('room-game').value=view.game;
    if(changed){room.close();openGame(view.game);}else if(dialog.open&&current===view.game)draw();
   }
  });
  c.on('close',()=>{if(token===epoch)lost();});c.on('error',()=>{if(token===epoch)lost();});
 }
 function begin(isHost,requested){
  leave();host=isHost;player=host?1:2;code=host?Array.from(crypto.getRandomValues(new Uint8Array(8)),x=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[x%32]).join(''):requested;
  const token=epoch;busy(true);tell(host?'Creating your room…':'Joining your friend…');
  try{peer=host?new Peer('pocket-arcade-v1-'+code,{debug:0}):new Peer({debug:0});}catch(e){leave();tell(errorText(e));return;}
  sessionUI();timeout=setTimeout(()=>{if(token!==epoch)return;leave();tell('Connection timed out. Check the code, keep both tabs open, or try another network.');},25000);
  peer.on('open',()=>{if(token!==epoch)return;if(host){clearTimeout(timeout);busy(false);tell('Room ready. Share the code or invite link with your friend. Waiting for Player 2…');}else accept(peer.connect('pocket-arcade-v1-'+code,{reliable:true,serialization:'json'}),token);});
  peer.on('connection',c=>{if(token!==epoch||!host||connection){c.on('open',()=>c.close());return;}accept(c,token);});
  peer.on('error',e=>{if(token!==epoch)return;const msg=errorText(e);leave();tell(msg);if(!room.open)showRoom();});
  peer.on('disconnected',()=>{if(token===epoch&&!connected){leave();tell('Room service disconnected. Please create or join again.');}});
 }
 function publish(){view=onlineView(state,1);send({type:'state',match,state:onlineView(state,2)});if(dialog.open&&current===state.game)draw();}
 function start(id){if(!host||!connected)return;state=onlineNew(id);view=onlineView(state,1);match=crypto.randomUUID();lastSequence=-1;uiKey='';room.close();openGame(id);publish();}
 function action(a){if(!connected||!view)return;if(host){if(onlineMove(state,1,a))publish();}else send({type:'action',match,revision:view.revision,round:view.round,seq:sequence++,action:a});}
 function button(parent,label,fn,disabled=false){const b=document.createElement('button');b.textContent=label;b.disabled=disabled;b.onclick=fn;parent.append(b);return b;}
 function draw(){
  const s=view;if(!s)return;
  const isTurn=s.turn===player&&s.winner===null,ended=s.winner!==null;
  if(s.game==='pong'&&uiKey===match){drawPong(s);return;}
  const gameName=games.find(g=>g.id===s.game).name;
  $('#game-title').textContent=gameName;$('#restart').disabled=!host||!connected;
  instructions(`Online · You are Player ${player}. ${s.game==='pong'?'Move your paddle with ↑ / ↓, W / S, touch, or the slider. Both players press Ready to begin.':s.game==='rps'?'Choose secretly on your own computer. First to five wins.':s.game==='memory'?'Find pairs. A match earns another turn. After a miss, press Hide cards & pass.':'Take turns with your friend. Only the current player can move.'}`);
  status(ended?(s.winner===0?'It’s a tie!':`Player ${s.winner} wins!`):s.game==='pong'?(s.running?'Match in progress':'Both players must be ready'):s.game==='rps'?(s.phase==='reveal'?'Round complete':s.chosen?.[player-1]?'Waiting for your friend…':'Make your choice'):isTurn?'Your turn':'Waiting for your friend…');
  uiKey=match;stage.replaceChildren();const toolbar=document.createElement('div');toolbar.className='online-toolbar';toolbar.append(`You: Player ${player} · Room ${code} `);button(toolbar,'Room',showRoom);stage.append(toolbar);
  const area=document.createElement('div');area.className='mini-area';stage.append(area);
  const controls=document.createElement('div');controls.className='mini-controls';stage.append(controls);
  function grid(count,cols,paint,enabled){const g=document.createElement('div');g.className='mini-grid';g.style.gridTemplateColumns=`repeat(${cols},minmax(0,1fr))`;area.append(g);for(let i=0;i<count;i++){const b=button(g,paint(i),()=>action({type:'move',index:i}),!isTurn||!enabled(i));b.setAttribute('aria-label',`Cell ${i+1}: ${paint(i)||'empty'}`);}}
  if(s.game==='ttt')grid(9,3,i=>['','X','O'][s.board[i]],i=>!s.board[i]);
  if(s.game==='connect'){const drops=document.createElement('div');drops.className='connect-drops';area.append(drops);for(let i=0;i<7;i++)button(drops,'↓',()=>action({type:'move',index:i}),!isTurn||!!s.board[i]).setAttribute('aria-label',`Drop in column ${i+1}`);const board=document.createElement('div');board.className='connect-board';s.board.forEach(v=>{const d=document.createElement('span');d.className='disc disc-'+v;d.textContent=['','●','○'][v];board.append(d);});area.append(board);}
  if(s.game==='nim'){area.textContent='● '.repeat(s.stones);for(let i=1;i<=3;i++)button(controls,'Take '+i,()=>action({type:'move',index:i}),!isTurn||i>s.stones);}
  if(s.game==='reversi'){const moves=reversiMoves(s.board,s.turn);grid(64,8,i=>s.board[i]===1?'●':s.board[i]===2?'○':moves.some(m=>m.i===i)?'·':'',i=>moves.some(m=>m.i===i));}
  if(s.game==='memory'){const symbols=['✦','☀','☘','♥','☾','♫','⚑','◆'];grid(16,4,i=>s.deck[i]===null?'?':symbols[s.deck[i]],i=>s.phase==='play'&&!s.matched[i]&&!s.flipped.includes(i));if(s.phase==='reveal')button(controls,'Hide cards & pass',()=>action({type:'continue'}),!isTurn);}
  if(s.game==='rps'){const names=['Rock','Paper','Scissors'];if(s.phase==='reveal'){area.textContent=`Player 1: ${names[s.picks[0]]} · Player 2: ${names[s.picks[1]]}`;if(!ended)button(controls,'Next round',()=>action({type:'next'}),!host);}else{area.textContent=s.chosen?.[player-1]?'Choice locked. Waiting for your friend…':'Rock, paper, or scissors?';names.forEach((name,i)=>button(controls,name,()=>action({type:'pick',index:i}),ended||!!s.chosen?.[player-1]));}}
  if(s.game==='dots'){const g=document.createElement('div');g.className='online-dots';area.append(g);for(let r=0;r<7;r++)for(let c=0;c<7;c++){if(r%2===0&&c%2===0){const d=document.createElement('span');d.className='dot';d.textContent='●';g.append(d);}else if(r%2&&c%2){const d=document.createElement('span');d.className='box';d.textContent=['','P1','P2'][s.board[Math.floor(r/2)*3+Math.floor(c/2)]];g.append(d);}else{const i=r%2?12+Math.floor(r/2)*4+c/2:r/2*3+Math.floor(c/2);const b=button(g,'',()=>action({type:'move',index:i}),!isTurn||!!s.edges[i]);b.className=(r%2?'edge-v':'edge-h')+(s.edges[i]?' taken':'');b.setAttribute('aria-label',`Edge ${i+1}${s.edges[i]?' taken':''}`);}}}
  if(s.game==='pong')buildPong(area,controls,s);
  if(['memory','dots','rps','pong'].includes(s.game)){const scores=document.createElement('p');scores.id='online-score';scores.textContent=`Player 1: ${s.scores[0]} · Player 2: ${s.scores[1]}`;controls.append(scores);}
 }
 function buildPong(area,controls,s){
  const canvas=document.createElement('canvas');canvas.id='online-canvas';canvas.className='online-court';canvas.width=360;canvas.height=240;canvas.setAttribute('aria-label','Online Pong court');area.append(canvas);
  const slider=document.createElement('input');slider.type='range';slider.min=30;slider.max=210;slider.value=s.paddles[player-1];slider.className='online-paddle';slider.setAttribute('aria-label','Your paddle');controls.append(slider);slider.oninput=()=>movePaddle(Number(slider.value));
  function point(e){const r=canvas.getBoundingClientRect();movePaddle((e.clientY-r.top)/r.height*240);}
  canvas.onpointerdown=e=>{canvas.setPointerCapture(e.pointerId);point(e);};canvas.onpointermove=e=>{if(canvas.hasPointerCapture(e.pointerId))point(e);};
  button(controls,'Ready',()=>action({type:'ready'})).id='online-ready';button(controls,'Pause',()=>action({type:'pause'})).id='online-pause';paddle=s.paddles[player-1];drawPong(s);
 }
 function movePaddle(y){paddle=Math.max(30,Math.min(210,y));action({type:'paddle',y:paddle});}
 function drawPong(s){const message=s.winner!==null?`Player ${s.winner} wins!`:s.running?'Match in progress':'Both players must be ready';if($('#game-status').textContent!==message)status(message);const canvas=el('online-canvas');if(!canvas)return;const c=canvas.getContext('2d');c.fillStyle='#263e30';c.fillRect(0,0,360,240);c.fillStyle='#82986d';for(let y=0;y<240;y+=16)c.fillRect(179,y,2,8);c.fillStyle='#d5e7a4';c.fillRect(14,s.paddles[0]-30,8,60);c.fillStyle='#e7a476';c.fillRect(338,s.paddles[1]-30,8,60);c.fillStyle='#f7e5a2';c.beginPath();c.arc(s.ball.x,s.ball.y,6,0,7);c.fill();c.font='24px sans-serif';c.textAlign='center';c.fillText(s.scores.join('     '),180,30);const scoreText=`Player 1: ${s.scores[0]} · Player 2: ${s.scores[1]}`;if(el('online-score')&&el('online-score').textContent!==scoreText)el('online-score').textContent=scoreText;el('online-ready').disabled=s.running||s.ready[player-1]||s.winner!==null;el('online-pause').disabled=!s.running;}
 document.addEventListener('keydown',e=>{if(!connected||!dialog.open||view?.game!=='pong'||e.target.tagName==='INPUT'||!['ArrowUp','ArrowDown','w','s'].includes(e.key))return;e.preventDefault();movePaddle(paddle+(['s','ArrowDown'].includes(e.key)?14:-14));});
 window.addEventListener('blur',()=>{if(connected&&view?.game==='pong')action({type:'pause'});});
 dialog.addEventListener('close',()=>{if(connected&&view?.game==='pong')action({type:'pause'});uiKey='';});
 el('room-create').onclick=()=>begin(true);
 el('room-join-form').onsubmit=e=>{e.preventDefault();const value=el('room-code-input').value.trim().toUpperCase();if(/^[A-Z0-9]{8}$/.test(value))begin(false,value);};
 el('room-close').onclick=()=>room.close();el('room-leave').onclick=()=>{leave();tell('You left the room. Create or join another room.');};
 el('room-start').onclick=()=>{if(host)start(el('room-game').value);else if(view){room.close();openGame(view.game);}};
 el('room-copy').onclick=async()=>{const url=new URL(location.href);url.hash='room='+code;try{await navigator.clipboard.writeText(url.href);tell('Invite link copied. Send it to your friend.');}catch{tell('Copy this code and send it to your friend: '+code);}};
 const priorMode=setPlayerMode,priorAllowed=window.arcadeMultiplayer.allowed,priorRunner=window.arcadeMultiplayer.runner,priorDescription=window.arcadeMultiplayer.description;
 setPlayerMode=function(mode){leave();room.close();priorMode(mode);if(mode===3){$('#active-mode').textContent='● ● Online with a friend';$('#stats-button').hidden=true;showRoom();}else $('#room-open').hidden=true;};
 window.arcadeMultiplayer.allowed=function(id){return this.mode===3?onlineGames.includes(id):priorAllowed.call(this,id);};
 window.arcadeMultiplayer.description=function(g){return this.mode===3?'Play with your friend on another computer.':priorDescription.call(this,g);};
 window.arcadeMultiplayer.runner=function(id){return this.mode===3?()=>{if(!connected){showRoom();return;}if(host&&(!state||state.game!==id)){start(id);return;}if(view?.game!==id){showRoom();tell('The room host chooses the game.');return;}cleanup=()=>{};uiKey='';draw();}:priorRunner.call(this,id);};
 $('#restart').onclick=()=>{if(window.arcadeMultiplayer.mode!==3)openGame(current);else if(host)start(current);};
 const roomButton=document.createElement('button');roomButton.id='room-open';roomButton.textContent='Room';roomButton.hidden=true;roomButton.onclick=showRoom;$('.mode-bar').append(roomButton);
 $('#choose-online').onclick=()=>{setPlayerMode(3);roomButton.hidden=false;};
 function invite(){const invited=new URLSearchParams(location.hash.slice(1)).get('room');if(invited&&/^[A-Z0-9]{8}$/i.test(invited)){setPlayerMode(3);roomButton.hidden=false;el('room-code-input').value=invited.toUpperCase();tell('Your friend invited you! Press Join room to connect.');}}
 window.addEventListener('hashchange',invite);invite();
})();
