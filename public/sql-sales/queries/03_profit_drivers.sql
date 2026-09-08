-- Q3: What offsets the profit contribution of revenue growth?
-- Arithmetic contributions, not causal attribution.
WITH comparison AS (
 SELECT *, LAG(revenue) OVER (ORDER BY year) AS prior_revenue,
           LAG(profit) OVER (ORDER BY year) AS prior_profit
 FROM annual
)
SELECT year, profit-prior_profit AS profit_change,
       (revenue-prior_revenue)*(prior_profit/NULLIF(prior_revenue,0)) AS revenue_effect,
       revenue*(profit/NULLIF(revenue,0)-prior_profit/NULLIF(prior_revenue,0)) AS margin_effect,
       100*(profit/NULLIF(revenue,0)-prior_profit/NULLIF(prior_revenue,0)) AS margin_change_pp
FROM comparison ORDER BY year;
