export type Assumptions = { units: number; price: number; discount: number; unitCost: number; fixedCost: number };
export const example: Assumptions = { units: 1000, price: 100, discount: 5, unitCost: 55, fixedCost: 25000 };
export const limits: Record<keyof Assumptions, number> = { units: 1000000, price: 1000000, discount: 100, unitCost: 1000000, fixedCost: 1000000000 };
export function calculate(a: Assumptions) {
  for (const key of Object.keys(limits) as (keyof Assumptions)[]) {
    if (!Number.isFinite(a[key]) || a[key] < 0 || a[key] > limits[key]) throw new Error(`Invalid ${key}`);
  }
  if (!Number.isInteger(a.units)) throw new Error('Units must be whole numbers');
  const netPrice = a.price * (1 - a.discount / 100);
  const unitContribution = netPrice - a.unitCost;
  const revenue = a.units * netPrice;
  const variableCost = a.units * a.unitCost;
  const profit = revenue - variableCost - a.fixedCost;
  // Positive fixed costs cannot be recovered when each sale contributes zero or less.
  const breakEven = unitContribution > 0 ? Math.ceil(a.fixedCost / unitContribution) : a.fixedCost === 0 ? 0 : null;
  const margin = revenue > 0 ? profit / revenue * 100 : null;
  const headroom = unitContribution > 0 && a.units > 0 ? (a.units - a.fixedCost / unitContribution) / a.units * 100 : null;
  return { netPrice, unitContribution, revenue, variableCost, profit, breakEven, margin, headroom };
}
export function comparePlans(base: Assumptions, scenario: Assumptions) {
  const before = calculate(base), after = calculate(scenario);
  // Sequential bridge: volume, list price, discount, variable cost, fixed cost.
  const drivers = [
    { label: 'Sales volume', value: (scenario.units - base.units) * before.unitContribution },
    { label: 'List price', value: scenario.units * (scenario.price - base.price) * (1 - base.discount / 100) },
    { label: 'Discount', value: -scenario.units * scenario.price * (scenario.discount - base.discount) / 100 },
    { label: 'Variable cost', value: -scenario.units * (scenario.unitCost - base.unitCost) },
    { label: 'Fixed costs', value: -(scenario.fixedCost - base.fixedCost) },
  ];
  const requiredUnits = after.unitContribution > 0 ? Math.max(0, Math.ceil((before.profit + scenario.fixedCost) / after.unitContribution)) : null;
  return { before, after, drivers, delta: after.profit - before.profit, requiredUnits };
}
