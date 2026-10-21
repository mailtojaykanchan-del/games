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
