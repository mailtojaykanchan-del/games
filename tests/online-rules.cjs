const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({});
for(const [file,start,end] of [['app.js','connectWinner','connect'],['app.js','pongStep','pong'],['expansion.js','reversiMoves','boardGame']]){const src=fs.readFileSync('dist/'+file,'utf8');vm.runInContext(src.slice(src.indexOf('function '+start+'('),src.indexOf('function '+end+'(')),ctx);}
vm.runInContext(fs.readFileSync('dist/online-rules.js','utf8'),ctx);
const move=(s,p,index)=>ctx.onlineMove(s,p,{type:'move',index});
let s=ctx.onlineNew('ttt');assert.equal(move(s,2,0),false);assert.equal(move(s,1,-1),false);for(const [p,i] of [[1,0],[2,3],[1,1],[2,4],[1,2]])assert.ok(move(s,p,i));assert.equal(s.winner,1);assert.equal(move(s,2,8),false);
s=ctx.onlineNew('connect');for(const [p,i] of [[1,0],[2,1],[1,0],[2,1],[1,0],[2,1],[1,0]])move(s,p,i);assert.equal(s.winner,1);
s=ctx.onlineNew('rps');ctx.onlineMove(s,1,{type:'pick',index:0});assert.equal(ctx.onlineView(s,2).picks[0],null);assert.equal(ctx.onlineView(s,2).chosen[0],true);assert.equal(ctx.onlineMove(s,1,{type:'pick',index:1}),false);ctx.onlineMove(s,2,{type:'pick',index:2});assert.equal(s.scores[0],1);assert.equal(s.phase,'reveal');assert.equal(ctx.onlineMove(s,2,{type:'next'}),false);assert.ok(ctx.onlineMove(s,1,{type:'next'}));
s=ctx.onlineNew('memory');assert.ok(ctx.onlineView(s,2).deck.every(v=>v===null));const j=s.deck.findIndex(v=>v!==s.deck[0]);move(s,1,0);move(s,1,j);assert.equal(s.phase,'reveal');assert.equal(move(s,2,3),false);ctx.onlineMove(s,1,{type:'continue'});assert.equal(s.turn,2);assert.ok(ctx.onlineView(s,2).deck.every(v=>v===null));
s=ctx.onlineNew('dots');for(let i=0;i<24;i++)assert.ok(move(s,s.turn,i));assert.equal(s.scores.reduce((a,b)=>a+b),9);assert.notEqual(s.winner,null);
s=ctx.onlineNew('nim');while(s.winner===null)move(s,s.turn,Math.min(3,s.stones));assert.equal(s.stones,0);
s=ctx.onlineNew('reversi');for(let i=0;i<65&&s.winner===null;i++){const m=ctx.reversiMoves(s.board,s.turn)[0];assert.ok(m);assert.ok(move(s,s.turn,m.i));}assert.notEqual(s.winner,null);
s=ctx.onlineNew('pong');ctx.onlineMove(s,2,{type:'paddle',y:999});assert.equal(s.paddles[1],210);assert.equal(s.paddles[0],120);ctx.onlineMove(s,1,{type:'ready'});assert.equal(s.running,false);ctx.onlineMove(s,2,{type:'ready'});assert.equal(s.running,true);const x=s.ball.x;ctx.onlineTick(s,.033);assert.notEqual(s.ball.x,x);ctx.onlineMove(s,2,{type:'pause'});assert.equal(s.running,false);
console.log('Passed: all eight online games, turn enforcement, illegal moves, private choices, hidden cards, scoring, and Pong readiness/controls.');
