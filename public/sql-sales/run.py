"""Run with Python 3.8+; uses only the standard library. SQLite 3.25+ required."""
import csv
import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def investigate():
    db = sqlite3.connect(':memory:')
    db.row_factory = sqlite3.Row
    db.executescript((ROOT/'schema.sql').read_text(encoding='utf-8'))
    with (ROOT/'sales.csv').open(newline='',encoding='utf-8') as f:
        reader=csv.reader(f)
        next(reader)
        rows=[r[:4]+[int(v) for v in r[4:]] for r in reader]
    db.executemany('INSERT INTO sales VALUES (?,?,?,?,?,?,?,?,?,?)',rows)
    results={p.stem:[dict(r) for r in db.execute(p.read_text(encoding='utf-8'))]
             for p in sorted((ROOT/'queries').glob('*.sql'))}
    return db, results

if __name__=='__main__':
    db,results=investigate()
    output=ROOT/'results'
    output.mkdir(exist_ok=True)
    for name,rows in results.items():
        with (output/(name+'.csv')).open('w',newline='',encoding='utf-8') as f:
            writer=csv.DictWriter(f,fieldnames=rows[0].keys())
            writer.writeheader();writer.writerows(rows)
    (output/'results.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf-8')
    print('Five investigations complete. Results saved in results/. Run python validate.py to verify.')
    db.close()
