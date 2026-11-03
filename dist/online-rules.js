/* Authoritative room rules. Only the host applies actions; clients receive views. */
const onlineGames=['ttt','connect','memory','reversi','nim','rps','dots','pong'];
function onlineNew(game,random=Math.random){
 if(!onlineGames.includes(game))throw Error('Unknown game');
 const s={game,turn:1,winner:null,revision:0,scores:[0,0],board:[],phase:'play'};
 if(game==='ttt')s.board=Array(9).fill(0);
 if(game==='connect')s.board=Array(42).fill(0);
 if(game==='reversi'){s.board=Array(64).fill(0);s.board[27]=s.board[36]=2;s.board[28]=s.board[35]=1;}
 if(game==='nim')s.stones=21;
 if(game==='rps'){s.picks=[null,null];s.round=0;}
 if(game==='memory'){s.deck=[0,1,2,3,4,5,6,7,0,1,2,3,4,5,6,7];for(let i=15;i>0;i--){const j=Math.floor(random()*(i+1));[s.deck[i],s.deck[j]]=[s.deck[j],s.deck[i]];}s.matched=Array(16).fill(false);s.flipped=[];}
 if(game==='dots'){s.edges=Array(24).fill(0);s.board=Array(9).fill(0);}
 if(game==='pong'){s.paddles=[120,120];s.ball={x:180,y:120,vx:155,vy:60};s.running=false;s.ready=[false,false];s.delay=0;}
 return s;
}
function onlineFinish(s){s.winner=s.scores[0]===s.scores[1]?0:s.scores[0]>s.scores[1]?1:2;}
function onlineMove(s,player,a){
 if(!a||![1,2].includes(player)||s.winner!==null)return false;
 const n=a.index,valid=Number.isInteger(n);
 if(s.game==='pong'){
  if(a.type==='paddle'&&Number.isFinite(a.y)){s.paddles[player-1]=Math.max(30,Math.min(210,a.y));return true;}
  if(a.type==='ready'){s.ready[player-1]=true;s.running=s.ready.every(Boolean);return true;}
  if(a.type==='pause'){s.running=false;s.ready=[false,false];return true;}return false;
 }
 if(s.game==='rps'){
  if(a.type==='next'&&s.phase==='reveal'&&player===1){s.picks=[null,null];s.round++;s.phase='play';s.revision++;return true;}
  if(a.type!=='pick'||s.phase!=='play'||!valid||n<0||n>2||s.picks[player-1]!==null)return false;
  s.picks[player-1]=n;
  if(s.picks.every(v=>v!==null)){const [x,y]=s.picks;if(x!==y)s.scores[(x-y+3)%3===1?0:1]++;s.phase='reveal';if(s.scores.includes(5))onlineFinish(s);}s.revision++;return true;
 }
 if(s.turn!==player)return false;
 if(s.game==='memory'&&a.type==='continue'&&s.phase==='reveal'){s.flipped=[];s.phase='play';s.turn=3-player;s.revision++;return true;}
 if(a.type!=='move'||!valid||s.phase!=='play')return false;
 if(s.game==='ttt'){
  if(n<0||n>8||s.board[n])return false;s.board[n]=player;
  if([[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].some(l=>l.every(i=>s.board[i]===player)))s.winner=player;
  else if(s.board.every(Boolean))s.winner=0;s.turn=3-player;
 }else if(s.game==='connect'){
  if(n<0||n>6||s.board[n])return false;connectDrop(s.board,n,player);if(connectWinner(s.board,player))s.winner=player;else if(s.board.every(Boolean))s.winner=0;s.turn=3-player;
 }else if(s.game==='nim'){
  if(n<1||n>3||n>s.stones)return false;s.stones-=n;if(!s.stones)s.winner=player;s.turn=3-player;
 }else if(s.game==='reversi'){
  const move=reversiMoves(s.board,player).find(m=>m.i===n);if(!move)return false;s.board[n]=player;move.flips.forEach(i=>s.board[i]=player);
  if(reversiMoves(s.board,3-player).length)s.turn=3-player;else if(!reversiMoves(s.board,player).length){s.scores=[1,2].map(p=>s.board.filter(v=>v===p).length);onlineFinish(s);}
 }else if(s.game==='memory'){
  if(n<0||n>15||s.matched[n]||s.flipped.includes(n))return false;s.flipped.push(n);
  if(s.flipped.length===2){const [x,y]=s.flipped;if(s.deck[x]===s.deck[y]){s.matched[x]=s.matched[y]=true;s.scores[player-1]++;s.flipped=[];if(s.matched.every(Boolean))onlineFinish(s);}else s.phase='reveal';}
 }else if(s.game==='dots'){
  if(n<0||n>23||s.edges[n])return false;s.edges[n]=player;let earned=false;
  for(let i=0;i<9;i++){const r=Math.floor(i/3),c=i%3;if(!s.board[i]&&[r*3+c,(r+1)*3+c,12+r*4+c,12+r*4+c+1].every(e=>s.edges[e])){s.board[i]=player;s.scores[player-1]++;earned=true;}}
  if(!earned)s.turn=3-player;if(s.board.every(Boolean))onlineFinish(s);
 }else return false;
 s.revision++;return true;
}
function onlineTick(s,dt){
 if(s.game!=='pong'||!s.running||s.winner!==null)return;
 if(s.delay>0){s.delay-=dt;return;}
 s.ball.player=s.paddles[0];s.ball.bot=s.paddles[1];const result=pongStep(s.ball,dt);
 if(result){s.scores[result==='player'?0:1]++;if(s.scores.includes(5)){onlineFinish(s);s.running=false;}else{s.ball={x:180,y:120,vx:result==='player'?-155:155,vy:60};s.delay=.8;}}
}
function onlineView(s,player){
 const v=JSON.parse(JSON.stringify(s));
 if(s.game==='memory')v.deck=v.deck.map((x,i)=>s.matched[i]||s.flipped.includes(i)?x:null);
 if(s.game==='rps'&&s.phase!=='reveal'){v.chosen=s.picks.map(x=>x!==null);v.picks=v.picks.map((x,i)=>i===player-1?x:null);}
 return v;
}
