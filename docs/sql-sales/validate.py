"""Independent totals, source coverage, constraints and bridge reconciliations."""
import csv
import itertools
import math
import sqlite3
from run import ROOT, investigate

def close(a,b):
    assert math.isclose(a,b,rel_tol=1e-10,abs_tol=0.00001),(a,b)

db,results=investigate()
with (ROOT/'sales.csv').open(newline='',encoding='utf-8') as f:
    rows=list(csv.DictReader(f))
assert len(rows)==576
keys={(r['month'],r['region'],r['category'],r['channel']) for r in rows}
expected=set(itertools.product([f'{y}-{m:02}-01' for y in [2024,2025] for m in range(1,13)],
    ['East','North','South','West'],['Essentials','Furniture','Technology'],['Direct','Online']))
assert keys==expected
for year in [2024,2025]:
    selected=[r for r in rows if r['month'].startswith(str(year))]
    revenue=sum(int(r['gross_cents'])-int(r['discount_cents']) for r in selected)/100
    profit=sum(int(r['gross_cents'])-int(r['discount_cents'])-int(r['cogs_cents']) for r in selected)/100
    actual=next(r for r in results['01_performance'] if r['year']==str(year))
    close(actual['revenue'],revenue);close(actual['profit'],profit)
    close(actual['gross_margin'],profit/revenue)
rev=results['02_revenue_drivers'][1]
gp=results['03_profit_drivers'][1]
close(rev['revenue_change'],rev['order_count_effect']+rev['order_value_effect'])
close(gp['profit_change'],gp['revenue_effect']+gp['margin_effect'])
# Reviewed Excel default-selection anchors (USD).
close(results['01_performance'][1]['revenue'],8242432.31)
close(results['01_performance'][1]['profit'],2573848.19)
close(gp['profit_change'],187360.54)
assert results['01_performance'][0]['revenue_growth'] is None
assert results['03_profit_drivers'][0]['margin_effect'] is None
close(sum(r['revenue'] for r in results['04_category_pressure']),8242432.31)
close(sum(r['plan_variance'] for r in results['05_regional_plan']),-209327.65)
assert results['05_regional_plan'][0]['region']=='West'
record=list(db.execute('SELECT * FROM sales LIMIT 1').fetchone())
try:
    db.execute('INSERT INTO sales VALUES (?,?,?,?,?,?,?,?,?,?)',record)
    raise AssertionError('Duplicate grain was accepted')
except sqlite3.IntegrityError:
    pass
record[0]='2026-01-01';record[7]=record[6]+1
try:
    db.execute('INSERT INTO sales VALUES (?,?,?,?,?,?,?,?,?,?)',record)
    raise AssertionError('Impossible discount was accepted')
except sqlite3.IntegrityError:
    pass
db.close()
print('PASS: 576-row coverage; exact grain; source totals; Excel anchors; weighted margins; two reconciled bridges; missing prior year; regional totals; duplicate and discount constraints.')
