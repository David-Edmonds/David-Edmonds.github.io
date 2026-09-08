import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../app/tools/what-changed/compare.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const { parseCSV, compare, numeric, sampleBefore, sampleAfter, csvCell } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));
const a = parseCSV(sampleBefore), b = parseCSV(sampleAfter);
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
