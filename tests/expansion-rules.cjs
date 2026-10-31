const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync('dist/expansion.js','utf8');
const catalog=src.slice(src.indexOf('const extraGames'),src.indexOf('function kit'));
const ctx=vm.createContext({});vm.runInContext(catalog+';this.catalog=extraGames;function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}',ctx);
function include(name,end){vm.runInContext(src.slice(src.indexOf('function '+name+'('),src.indexOf('function '+end+'(')),ctx);}
include('quizQuestion','quizGame');include('reversiMoves','boardGame');include('handTotal','cardGame');
assert.equal(ctx.catalog.length,50);assert.equal(new Set(ctx.catalog.map(g=>g[0])).size,50);
for(const id of ['arithmetic','multiplication','division','fractions','binary','primes','sequence','stroop','oddone'])for(let n=0;n<100;n++){
 const q=ctx.quizQuestion(id,n);assert.ok(q.options.includes(q.answer),id+' must offer its correct answer');assert.equal(new Set(q.options).size,q.options.length);
 if(id==='fractions'){const [a,b]=q.prompt.match(/\d+/g).map(Number);const valid=q.options.filter(o=>{const [x,y]=o.split('/').map(Number);return a*y===b*x;});assert.equal(valid.length,1);}
 if(id==='primes')assert.equal(q.options.filter(v=>v>=2&&Array.from({length:v-2},(_,i)=>i+2).every(d=>v%d)).length,1);
 if(id==='binary')assert.equal(parseInt(q.prompt,2),q.answer);
}
let board=Array(64).fill(0);board[27]=board[36]=2;board[28]=board[35]=1;assert.equal(ctx.reversiMoves(board,1).length,4);
for(let n=0,turn=1;n<120;n++,turn=3-turn){const choices=ctx.reversiMoves(board,turn);if(!choices.length){if(!ctx.reversiMoves(board,3-turn).length)break;continue;}const m=choices[0];assert.equal(board[m.i],0);assert.ok(m.flips.every(i=>board[i]===3-turn));board[m.i]=turn;m.flips.forEach(i=>board[i]=turn);}
assert.equal(ctx.reversiMoves(board,1).length,0);assert.equal(ctx.reversiMoves(board,2).length,0);
assert.equal(ctx.handTotal([1,1,9]),21);assert.equal(ctx.handTotal([1,13]),21);assert.equal(ctx.handTotal([13,12,2]),22);
assert.equal(ctx.diceCombo([2,2,2,2,2])[1],100);assert.equal(ctx.diceCombo([1,2,3,4,5])[1],50);assert.equal(ctx.diceCombo([3,3,3,2,2])[1],60);
console.log('Passed: 50 unique games, 900 quiz rounds with unambiguous answers, complete legal Reversi match, ace totals and dice hands.');
