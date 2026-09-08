# Sales & profitability: 72-second dashboard demo

Captioned visual walkthrough using actual exported Excel views. No audio. Fictional Northstar Supply data; not client work.

## 0:00–0:12 · The Question
This fictional example asks whether higher sales produce stronger profit. Start with the full-year 2025 view, with all regions and channels selected.

## 0:12–0:24 · Read The Headlines
Revenue is $8.24M and gross profit is $2.57M. Revenue grew 12.7%; profit grew 7.9%. Gross margin is 31.2%, down about 1.4 percentage points. Plan attainment is 97.5%.

## 0:24–0:36 · Narrow The Question
Choose Q3, West and Online in the blue dropdowns. The resulting view has about $313K revenue, $91K gross profit and 88.6% plan attainment. Headline metrics follow Q3; the trend retains full-year context.

## 0:36–0:48 · Explain The Change
Reset to the full-year view. Revenue growth contributes $302,455.59 to gross profit. The margin effect offsets $115,095.05. The two reconcile to the $187,360.54 increase.

## 0:48–1:00 · Follow The Evidence
Furniture has a 19.7% gross margin. The companion SQL investigation shows the largest category margin decline, about 4.0 percentage points. West has the largest annual revenue gap to plan, about $313K.

## 1:00–1:12 · Turn It Into A Question
Use these signals to prioritize a review, not to claim a cause. Open Analysis for formulas and checks, and Data for the 576 fictional monthly records. Download the workbook or follow the SQL investigation to reproduce the results.

## Reproduce and inspect
Open `sales-profitability-dashboard.xlsx` in desktop Excel. The default view is 2025 / Full year / All / All. At 0:24 the view changes to 2025 / Q3 / West / Online. At 0:36 it resets to the default. These are exported workbook views, not a recording of mouse clicks.

The annual findings are supported by the companion SQL result files `01_performance.csv`, `03_profit_drivers.csv`, `04_category_pressure.csv` and `05_regional_plan.csv`.
