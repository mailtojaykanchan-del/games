const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('dist/app.js', 'utf8');
const context = vm.createContext({});
function include(start, end) { vm.runInContext(source.slice(source.indexOf('function '+start+'('), source.indexOf('function '+end+'(')), context); }
include('shuffle','render');
include('neighbors','mines');
include('connectWinner','connect');
include('slideNeighbors','sliding');
for (let first = 0; first < 64; first++) {
  const bombs = context.makeMinefield(first);
  assert.equal(bombs.size, 10);
  for (const i of [first, ...context.neighbors(first, 8)]) assert.equal(bombs.has(i), false);
  for (const i of bombs) assert.ok(i >= 0 && i < 64);
}
for (const cells of [[35,36,37,38],[0,7,14,21],[0,8,16,24],[6,12,18,24]]) {
  const board = Array(42).fill(0);
  cells.forEach(i => board[i] = 1);
  assert.ok(context.connectWinner(board,1));
  assert.equal(context.connectWinner(board,2),false);
}
const wrapping = Array(42).fill(0); [5,6,7,8].forEach(i=>wrapping[i]=1);
assert.equal(context.connectWinner(wrapping,1),false);
const full = Array(42).fill(0);
for(let n=0;n<6;n++)assert.equal(context.connectDrop(full,0,1),35-n*7);
assert.equal(context.connectDrop(full,0,1),-1);
for(const player of [1,2]) {
  const board=Array(42).fill(0); [35,36,37].forEach(i=>board[i]=player);
  assert.equal(context.connectChoice(board),3,'Bot should win or block immediately');
}
for(let trial=0;trial<100;trial++) {
  const board=Array.from(context.makeSlideBoard());
  assert.deepEqual([...board].sort(),[0,1,2,3,4,5,6,7,8]);
  assert.equal(context.slideSolved(board),false);
  const numbered=board.filter(Boolean); let inversions=0;
  numbered.forEach((v,i)=>numbered.slice(i+1).forEach(w=>{if(v>w)inversions++;}));
  assert.equal(inversions%2,0,'3×3 puzzle must be solvable');
}
assert.ok(context.slideSolved([1,2,3,4,5,6,7,8,0]));
assert.deepEqual(Array.from(context.slideNeighbors(0)).sort(),[1,3]);
assert.deepEqual(Array.from(context.slideNeighbors(4)).sort(),[1,3,5,7]);
console.log('Passed: 64 safe mine openings, Connect Four wins/edges/bot tactics, 100 solvable puzzle shuffles.');
include('pongStep','pong');
const ball = changes => ({x:180,y:120,vx:160,vy:65,player:120,bot:120,...changes});
let s=ball({y:5,vy:-65});context.pongStep(s,.01);assert.ok(s.vy>0);
s=ball({x:28,vx:-160,y:120});assert.equal(context.pongStep(s,.02),null);assert.ok(s.vx>0);
s=ball({x:332,vx:160,y:120});context.pongStep(s,.02);assert.ok(s.vx<0);
s=ball({x:-5,vx:-160,y:20});assert.equal(context.pongStep(s,.02),'bot');
s=ball({x:365,vx:160,y:20});assert.equal(context.pongStep(s,.02),'player');
console.log('Passed: Pong wall and paddle bounces, missed balls, scoring both sides.');
include('makeMaze','maze');
include('lightCross','lights');
include('guessResult','guess');
for(let trial=0;trial<100;trial++){
  const cells=context.makeMaze();const visited=new Set([12]),queue=[12];
  while(queue.length){const at=queue.shift();for(const key of ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight']){const next=context.mazeStep(cells,at,key);if(!visited.has(next)){visited.add(next);queue.push(next);}}}
  assert.ok(visited.has(108),'Maze exit must be reachable');
  assert.equal(visited.size,cells.filter(v=>!v).length,'All paths connected');
  assert.equal(context.mazeStep(cells,12,'ArrowUp'),12,'Walls block movement');
  const {board,solution}=context.makeLights();assert.ok(board.some(Boolean));
  // Arbitrary player moves must preserve a valid hint solution.
  for(const index of [0,3,8,12,12]){context.flipLights(board,index);if(solution.has(index))solution.delete(index);else solution.add(index);}
  for(const index of solution)context.flipLights(board,index);
  assert.ok(board.every(v=>!v),'Hint sequence must solve the current board');
}
assert.deepEqual(Array.from(context.lightCross(0)).sort((a,b)=>a-b),[0,1,4]);
assert.equal(context.guessResult('BALLOON',new Set('BALON')).won,true);
assert.equal(context.guessResult('BALLOON',new Set('CDEFGH')).lost,true);
assert.equal(context.guessResult('BALLOON',new Set('B')).misses,0);
console.log('Passed: 100 connected mazes, 100 Lights Out hint solutions, Word Guess win/loss rules.');
