import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../app/tools/what-changed/compare.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const { parseCSV, compare, numeric, sampleBefore, sampleAfter, sampleQualityAfter, csvCell, profileReport, assessQuality } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));
const a = parseCSV(sampleBefore), b = parseCSV(sampleAfter);
void test('quality sample exposes every blocker while comparison stays blocked', () => {
 const dirty = parseCSV(sampleQualityAfter);
 const quality = assessQuality(a, dirty, 'Account ID', 'Revenue');
 assert.equal(quality.status, 'blocked');
 assert.deepEqual(quality.after.blankIDs, [10]);
 assert.deepEqual(quality.after.invalidMeasures, [11]);
 assert.equal(quality.after.missingCells, 2);
 assert.deepEqual(quality.after.missingByColumn, [{column:'Account ID',count:1},{column:'Region',count:1}]);
 assert.deepEqual(quality.after.duplicateIDs, [{id:'ACC-007',records:[7,8]}]);
 assert.equal(quality.after.exactDuplicates, 1);
 assert.throws(() => compare(a, dirty, 'Account ID', 'Revenue'), /blank ID/);
});
void test('quality checks distinguish missing optional cells from blocking measures', () => {
 const good = parseCSV('id,n,label\na,0,ok\nb,-2.5,ok');
 const optional = parseCSV('id,n,label\na,0,  \nb,-2.5,ok');
 assert.equal(assessQuality(good,good,'id','n').status,'clear');
 assert.equal(assessQuality(good,optional,'id','n').status,'review');
 assert.equal(compare(good,optional,'id','n').delta,0);
 const blocked = profileReport(parseCSV('id,n\na, \nb,abc\nc,"1,000"\nd,0'),'id','n');
 assert.deepEqual(blocked.invalidMeasures,[1,2,3]);
 assert.equal(blocked.missingCells,1);
});
void test('quality distinguishes missing columns from zero issues and flags schema drift', () => {
 const one=parseCSV('id,n\na,1'), two=parseCSV('key,n,extra\na,1,x');
 const q=assessQuality(one,two,'id','n');
 assert.equal(q.status,'blocked');assert.equal(q.after.keyPresent,false);
 assert.deepEqual(q.addedColumns,['key','extra']);assert.deepEqual(q.removedColumns,['id']);
 assert.equal(assessQuality(one,parseCSV('id,n,extra\na,1,x'),'id','n').status,'review');
 assert.equal(assessQuality(one,one,'id','missing').status,'blocked');
});
void test('quality preserves exact rows and uses comparison ID semantics without mutation', () => {
 const report=parseCSV('id,n\n a ,1\na,1\nA,2\na,1\n ,3');
 const original=JSON.stringify(report), q=profileReport(report,'id','n');
 assert.deepEqual(q.duplicateIDs,[{id:'a',records:[1,2,4]}]);
 assert.deepEqual(q.blankIDs,[5]);assert.equal(q.exactDuplicates,1);
 assert.equal(JSON.stringify(report),original);
});
void test('sample reconciles with duplicate contribution retained',()=>{const r=compare(a,b,'Account ID','Revenue');assert.equal(r.before,116000);assert.equal(r.after,145000);assert.equal(r.delta,29000);assert.equal(r.added,1);assert.equal(r.missing,1);assert.equal(r.changed,4);assert.equal(r.duplicateGroups,1);assert.equal(r.exactNew,1);assert.equal(r.entries.reduce((s,e)=>s+e.delta,0),r.delta);assert.equal(r.entries.find(e=>e.id==='ACC-007')?.delta,7000);});
void test('CSV supports BOM, escaped quotes, commas, multiline and CRLF',()=>{const r=parseCSV('\uFEFFID,Name,Value\r\n001,"A, ""B""\nC",12\r\n');assert.equal(r.rows[0][0],'001');assert.equal(r.rows[0][1],'A, "B"\nC');});
void test('rejects malformed, empty and inconsistent CSV',()=>{for(const s of ['', 'a,a\n1,2','a,\n1,2','a,b\n1','a\n"broken','a\n"x"z','a\n'])assert.throws(()=>parseCSV(s));});
void test('rejects blank IDs and invalid metrics',()=>{const valid=parseCSV('id,n\na,1'); for(const s of ['id,n\n,2','id,n\na,','id,n\na,abc'])assert.throws(()=>compare(valid,parseCSV(s),'id','n'));assert.equal(numeric('1,000'),null);assert.equal(numeric('-2.5'),-2.5);assert.equal(numeric('  '),null);});
void test('column reordering and unchanged records',()=>{const r=compare(parseCSV('id,n,label\na,1,x'),parseCSV('label,n,id\nx,1,a'),'id','n');assert.equal(r.entries[0].status,'Unchanged');assert.equal(r.delta,0);});
void test('case sensitive trimmed ID, schema change and text differences',()=>{const r=compare(parseCSV('id,n,old\n a ,1,x\nA,2,y'),parseCSV('id,n,new\na,1.0,z\nb,5,z'),'id','n');assert.equal(r.changed,1);assert.equal(r.added,1);assert.equal(r.missing,1);assert.deepEqual(r.addedColumns,['new']);assert.deepEqual(r.removedColumns,['old']);});
void test('duplicate new IDs are both added and ambiguous',()=>{const r=compare(parseCSV('id,n\na,0'),parseCSV('id,n\nb,1\nb,2'),'id','n');assert.equal(r.added,1);assert.equal(r.duplicateGroups,1);assert.equal(r.before,0);assert.equal(r.delta,3);});
void test('CSV export neutralizes formulas and escapes quotes',()=>{assert.equal(csvCell('=HYPERLINK("x")'),'"\'=HYPERLINK(""x"")"');assert.equal(csvCell('normal'),'"normal"');});
void test('50,000 records remain reconcilable',()=>{const s='id,n\n'+Array.from({length:50000},(_,i)=>`${i},${i%7}`).join('\n');const r=compare(parseCSV(s),parseCSV(s),'id','n');assert.equal(r.entries.length,50000);assert.equal(r.delta,0);});

void test('empty multi-column records are rejected as blank IDs',()=>{const r=parseCSV('id,n\na,1\n,');assert.equal(r.rows.length,2);assert.throws(()=>compare(r,r,'id','n'),/blank ID/);});

void test('worked example reconciles all four groups and preserves source references',()=>{
 const r=compare(a,b,'Account ID','Revenue');
 const sums=Object.fromEntries(['Changed','Added','Missing','Duplicate ID'].map(status=>[status,r.entries.filter(e=>e.status===status).reduce((sum,e)=>sum+e.delta,0)]));
 assert.deepEqual(sums,{'Changed':11000,'Added':16000,'Missing':-5000,'Duplicate ID':7000});
 assert.equal(Object.values(sums).reduce((sum,v)=>sum+v,0),r.delta);
 const duplicate=r.entries.find(e=>e.id==='ACC-007');
 assert.deepEqual(duplicate.oldRows,[7]);assert.deepEqual(duplicate.newRows,[7,8]);
 assert.deepEqual(r.entries.find(e=>e.id==='ACC-008').newRows,[]);
 assert.deepEqual(r.entries.find(e=>e.id==='ACC-009').oldRows,[]);
});
