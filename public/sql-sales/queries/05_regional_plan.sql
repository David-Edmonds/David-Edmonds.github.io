-- Q5: Where is the largest shortfall against plan?
WITH regional AS (
 SELECT region, SUM(gross_cents-discount_cents)/100.0 AS revenue,
        SUM(plan_cents)/100.0 AS plan
 FROM sales WHERE month>='2025-01-01' AND month<'2026-01-01'
 GROUP BY region
)
SELECT region, revenue, plan, revenue-plan AS plan_variance,
       revenue/NULLIF(plan,0) AS plan_attainment,
       RANK() OVER(ORDER BY revenue-plan) AS shortfall_rank
FROM regional ORDER BY shortfall_rank, region;
