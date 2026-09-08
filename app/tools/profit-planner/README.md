# Profit Scenario Planner

Browser-only monthly USD scenario model for one product or a stable product mix. The baseline and scenario each define units, list price, average discount, variable cost per unit and fixed costs. Inputs are held in React state and can be exported as a plain-text summary. There is no persistence, collection or server calculation.

Unit contribution = list price × (1 − discount / 100) − variable cost per unit.
Operating profit = units × contribution − fixed costs.
Break-even rounds up to whole units. Non-positive contribution cannot cover positive fixed costs. Margin is undefined at zero revenue. The target-volume calculation applies only when scenario unit contribution is positive.

The sequential bridge replaces volume, price, discount, variable unit cost and fixed costs in that order. Its sum reconciles exactly to the profit delta within floating-point tolerance. Individual contributions are order dependent. Displayed currency is rounded; calculations retain precision.

Model tests cover the known example, simultaneous changes, zero revenue, non-positive contribution, minimum whole-unit break-even and target volumes, identity scenarios and invalid input. Static checks cover the published route, discovery link, metadata and absence of network/storage APIs. Inputs are bounded to avoid unsafe or unreadable extremes.

Demand response, capacity constraints, tax, interest, inventory timing and cash flow are outside the model. Presets are hypothetical and are not estimated elasticities or verified client outcomes.
