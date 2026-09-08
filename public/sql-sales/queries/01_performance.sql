-- Q1: Is sales growth translating into profit growth?
-- LAG compares whole calendar years; 2024's comparison remains NULL.
WITH comparison AS (
  SELECT *, LAG(revenue) OVER (ORDER BY year) AS prior_revenue,
            LAG(profit) OVER (ORDER BY year) AS prior_profit
  FROM annual
)
SELECT year, revenue, profit, orders,
       profit / NULLIF(revenue,0) AS gross_margin,
       revenue / NULLIF(plan,0) AS plan_attainment,
       revenue / NULLIF(prior_revenue,0)-1 AS revenue_growth,
       profit / NULLIF(prior_profit,0)-1 AS profit_growth
FROM comparison ORDER BY year;
