import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../app/tools/profit-planner/model.ts',import.meta.url),'utf8');
const compiled = ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const { calculate, comparePlans, example } = await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
test('default example reconciles revenue, contribution and operating profit',()=>{
  const r=comparePlans(example,{...example,price:105,units:950});
  assert.equal(r.before.revenue,95000);assert.equal(r.before.profit,15000);
  assert.equal(r.after.profit,17512.5);assert.equal(r.delta,2512.5);
  assert.equal(r.after.breakEven,559);assert.equal(r.requiredUnits,894);
  assert.deepEqual(r.drivers.map(x=>x.value),[-2000,4512.5,-0,-0,-0]);
});
test('bridge reconciles simultaneous changes including discount and costs',()=>{
  for(const units of [0,321,1200])for(const price of [0,75,112.51])for(const discount of [0,15,100]) {
    const s={units,price,discount,unitCost:63.21,fixedCost:21345};
    const r=comparePlans(example,s);
    assert.ok(Math.abs(r.drivers.reduce((n,d)=>n+d.value,0)-r.delta)<1e-7);
  }
});
test('zero revenue, loss-making units and no fixed costs remain interpretable',()=>{
  assert.equal(calculate({...example,units:0}).margin,null);
  assert.equal(calculate({...example,discount:100}).breakEven,null);
  assert.equal(calculate({...example,price:55,discount:0}).breakEven,null);
  assert.equal(calculate({...example,price:0,fixedCost:0}).breakEven,0);
  assert.equal(comparePlans(example,{...example,price:0}).requiredUnits,null);
  assert.equal(calculate({...example,fixedCost:0}).breakEven,0);
});
test('break-even and target units are the minimum whole-unit solutions',()=>{
  const a={...example,price:113.37,unitCost:59.18,discount:11.3};
  const r=comparePlans(example,a);
  assert.ok(calculate({...a,units:r.after.breakEven}).profit>=0);
  assert.ok(calculate({...a,units:r.after.breakEven-1}).profit<0);
  assert.ok(calculate({...a,units:r.requiredUnits}).profit>=r.before.profit);
  assert.ok(calculate({...a,units:r.requiredUnits-1}).profit<r.before.profit);
  assert.equal(comparePlans(example,example).delta,0);
});
test('invalid or out-of-range assumptions are rejected',()=>{
  for(const a of [{units:1.5},{units:-1},{price:NaN},{discount:101},{fixedCost:Infinity},{unitCost:-1},{price:1000001}]) assert.throws(()=>calculate({...example,...a}));
});
