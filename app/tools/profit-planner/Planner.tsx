'use client';
import { useState } from 'react';
import { calculate, comparePlans, example, limits, type Assumptions } from './model';

const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.abs(n)<0.5?0:n);
const unitMoney = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const amount = (n: number) => new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(n);
const signed = (n: number) => `${n >= 0.5 ? '+' : ''}${money(n)}`;
const percent = (n: number | null) => n === null ? 'Not defined' : `${n.toFixed(1)}%`;
const fields: {key: keyof Assumptions; label: string; help: string; step: string}[] = [
  {key:'units',label:'Units sold',help:'Whole units in one month',step:'1'},
  {key:'price',label:'List price per unit ($)',help:'Before discounts',step:'0.01'},
  {key:'discount',label:'Average discount (%)',help:'Share of list price, from 0 to 100',step:'0.1'},
  {key:'unitCost',label:'Variable cost per unit ($)',help:'Costs that move with each unit sold',step:'0.01'},
  {key:'fixedCost',label:'Monthly fixed costs ($)',help:'Costs held constant at this sales level',step:'0.01'},
];
type Inputs = Record<keyof Assumptions,string>;
const strings = (a: Assumptions): Inputs => Object.fromEntries(Object.entries(a).map(([k,v])=>[k,String(v)])) as Inputs;
function parse(a: Inputs): Assumptions | null {
  if (Object.values(a).some(v=>!v.trim())) return null;
  const values = Object.fromEntries(Object.entries(a).map(([k,v])=>[k,Number(v)])) as Assumptions;
  try { calculate(values); return values; } catch { return null; }
}
export default function Planner() {
  const [baseInputs,setBase] = useState<Inputs>(strings(example));
  const [scenarioInputs,setScenario] = useState<Inputs>(strings({...example,price:105,units:950}));
  const [notice,setNotice] = useState('');
  const base=parse(baseInputs), scenario=parse(scenarioInputs);
  const result=base && scenario ? comparePlans(base,scenario) : null;
  function preset(name: 'same' | 'price' | 'discount') {
    if (!base) return;
    setScenario(strings(name === 'same' ? base : name === 'price' ? {...base,price:Math.min(limits.price,Math.round(base.price*1.05*100)/100),units:Math.round(base.units*.95)} : {...base,discount:Math.min(100,base.discount+5),units:Math.min(limits.units,Math.round(base.units*1.1))}));
    setNotice('Scenario updated. Review the assumptions below.');
  }
  function download() {
    if (!base || !scenario || !result) return;
    const text = ['PROFIT SCENARIO PLANNER','Monthly planning assumptions in USD. Illustrative model, not a forecast.','',...fields.map(f=>`${f.label}: baseline ${base[f.key]}, scenario ${scenario[f.key]}`),'',`Baseline revenue: ${money(result.before.revenue)}`,`Scenario revenue: ${money(result.after.revenue)}`,`Baseline operating profit: ${money(result.before.profit)}`,`Scenario operating profit: ${money(result.after.profit)}`,`Profit change: ${signed(result.delta)}`,`Scenario operating margin: ${percent(result.after.margin)}`,`Scenario break-even units: ${result.after.breakEven === null ? 'Not achievable at this contribution' : amount(result.after.breakEven)}`,`Units to match baseline profit: ${result.requiredUnits === null ? 'Not calculated for non-positive contribution' : amount(result.requiredUnits)}`,'','Sequential profit bridge (volume, list price, discount, variable cost, fixed cost):',...result.drivers.map(d=>`${d.label}: ${signed(d.value)}`),'','Unit contribution = price × (1 − discount / 100) − variable cost per unit.','Operating profit = units × unit contribution − monthly fixed costs.','Break-even uses whole units, rounded up. Driver attribution depends on calculation order; total change does not.','Assumes one product or a stable product mix, constant unit costs and fixed costs within capacity. Demand response is supplied by the user, not estimated. Excludes taxes, interest, inventory timing and cash flow. Displayed figures are rounded.'].join('\n');
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='profit-scenario-summary.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice('Summary download requested. Your assumptions have not been uploaded.');
  }
  return <main className="profit-planner shell" id="top">
    <header className="profit-heading"><a href="/tools">← All tools</a><div className="profit-heading-row"><div><p className="profit-kicker">DECISION LAB · MONTHLY PLANNING</p><h1>Profit Scenario Planner</h1><p>What would a price, volume or cost change mean for profit?</p></div><span className="profit-local">Runs in your browser</span></div></header>
    <div className="profit-workspace">
      <section className="profit-inputs" aria-labelledby="assumptions-title"><div className="profit-section-head"><h2 id="assumptions-title">Set your assumptions</h2><span>USD / month</span></div><p className="profit-small">Start with the fictional example or enter your own figures. Nothing is saved or uploaded.</p>
        <div className="profit-input-head" aria-hidden="true"><span>Assumption</span><b>Baseline</b><b>Scenario</b></div>
        {fields.map(f=><div className="profit-input-row" key={f.key}><div><b>{f.label}</b><small id={`${f.key}-help`}>{f.help}</small></div>{(['base','scenario'] as const).map(which=>{const inputs=which==='base'?baseInputs:scenarioInputs;const value=Number(inputs[f.key]);const invalid=!inputs[f.key].trim() || !Number.isFinite(value) || value<0 || value>limits[f.key] || (f.key==='units'&&!Number.isInteger(value));return <label key={which}><span className="profit-sr">{which==='base'?'Baseline':'Scenario'} {f.label}</span><input type="number" inputMode="decimal" min="0" max={limits[f.key]} step={f.step} aria-describedby={`${f.key}-help`} aria-invalid={invalid} value={inputs[f.key]} onChange={e=>{(which==='base'?setBase:setScenario)({...inputs,[f.key]:e.target.value});setNotice('');}}/></label>;})}</div>)}
        {!result && <p className="profit-error" role="alert">Complete all fields with non-negative numbers. Units must be whole numbers; discounts cannot exceed 100%. Use up to 1,000,000 units or dollars per unit and $1 billion in fixed costs.</p>}
        <div className="profit-presets"><span>Try a scenario</span><button disabled={!base} onClick={()=>preset('price')}>Price +5%, volume −5%</button><button disabled={!base} onClick={()=>preset('discount')}>Discount +5 pts, volume +10%</button><button disabled={!base} onClick={()=>preset('same')}>Match baseline</button></div>
        <p className="profit-small">Presets are assumptions, not estimated customer responses. “Pts” means percentage points.</p>
      </section>
      <section className="profit-results" aria-labelledby="result-title"><div className="profit-section-head"><h2 id="result-title">The profit impact</h2><span>Scenario vs baseline</span></div>
        {result && scenario ? <><div className="profit-hero-result"><span>Monthly operating profit</span><strong>{money(result.after.profit)}</strong><p className={result.delta<0?'profit-down':'profit-up'}>{signed(result.delta)} <span>vs {money(result.before.profit)} baseline</span></p></div>
        <dl className="profit-metrics"><div><dt>Net revenue</dt><dd>{money(result.after.revenue)}</dd><small>Baseline {money(result.before.revenue)}</small></div><div><dt>Operating margin</dt><dd>{percent(result.after.margin)}</dd><small>Baseline {percent(result.before.margin)}</small></div><div><dt>Break-even units</dt><dd>{result.after.breakEven === null?'Not achievable':amount(result.after.breakEven)}</dd><small>{result.after.breakEven === null?'Each sale contributes zero or less':`At ${amount(scenario.units)} planned units`}</small></div><div><dt>Contribution per unit</dt><dd>{unitMoney(result.after.unitContribution)}</dd><small>Net price less variable cost</small></div></dl>
        <div className="profit-readout"><b>{result.delta>0?'Profit improves under these assumptions.':result.delta<0?'Profit falls under these assumptions.':'Profit is unchanged under these assumptions.'}</b><p>{result.after.unitContribution<=0 ? 'Each sale contributes zero or less before fixed costs. More volume alone cannot repair the unit economics.' : result.requiredUnits===0 ? 'The scenario already matches baseline profit at zero units under this model.' : `You need at least ${amount(result.requiredUnits!)} units at the scenario economics to match baseline profit, versus ${amount(scenario.units)} planned.`}</p>{result.after.headroom!==null && <p>{result.after.headroom>=0 ? `Volume could fall ${result.after.headroom.toFixed(1)}% from the scenario level before reaching break-even.` : `Planned volume is below break-even. Close the ${amount(Math.max(0,(result.after.breakEven??0)-scenario.units))}-unit gap or improve contribution and fixed costs.`}</p>}</div>
        </> : <p className="profit-empty">Results will appear when all assumptions are valid.</p>}
      </section>
    </div>
    {result && <section className="profit-drivers" aria-labelledby="drivers-title"><div className="profit-section-head"><div><p className="profit-kicker">FROM ASSUMPTION TO OUTCOME</p><h2 id="drivers-title">What drives the change?</h2></div><strong>{signed(result.delta)} total</strong></div><p className="profit-small">Each step changes one assumption. Positive values add profit; negative values reduce it.</p><div className="profit-driver-grid">{result.drivers.map(d=><div key={d.label} className="profit-driver"><span>{d.label}</span><b className={d.value<0?'profit-down':'profit-up'}>{signed(d.value)}</b><div className="profit-track" aria-hidden="true"><i className={d.value<0?'negative':''} style={{width:`${Math.abs(d.value)/Math.max(1,...result.drivers.map(x=>Math.abs(x.value)))*100}%`}}/></div></div>)}</div><p className="profit-small">Bridge order: volume → list price → discount → variable cost → fixed costs. Contributions depend on this order; the total profit change does not. Values shown are rounded.</p></section>}
    <div className="profit-bottom"><div className="profit-actions"><button className="button blue" disabled={!result} onClick={download}>Download scenario summary ↓</button><button className="profit-reset" onClick={()=>{setBase(strings(example));setScenario(strings({...example,price:105,units:950}));setNotice('Fictional example restored.');}}>Reset example</button></div><p className="profit-small" role="status">{notice}</p><details><summary>How the model works and where it stops</summary><div><p><b>Operating profit</b> = units × [list price × (1 − discount / 100) − variable cost per unit] − fixed costs. Operating margin is profit divided by net revenue; it is undefined when revenue is zero.</p><p><b>Break-even units</b> = fixed costs ÷ contribution per unit, rounded up. With positive fixed costs and non-positive contribution, break-even is impossible. When fixed costs are zero, zero units breaks even; selling at negative contribution still creates a loss.</p><p><b>Scope:</b> one product or stable product mix, USD, one month. Unit costs stay constant and fixed costs stay fixed within the relevant capacity range. Demand, capacity constraints, taxes, interest, inventory timing and cash flow are not modeled. These are planning scenarios, not forecasts or verified client outcomes.</p></div></details></div>
  </main>;
}
