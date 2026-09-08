-- Q4: Which category has the largest margin decline?
-- Weighted margins use total profit / total revenue, never an average of row margins.
WITH category_year AS (
 SELECT substr(month,1,4) AS year, category,
        SUM(gross_cents-discount_cents)/100.0 AS revenue,
        SUM(gross_cents-discount_cents-cogs_cents)/100.0 AS profit
 FROM sales GROUP BY substr(month,1,4), category
), comparison AS (
 SELECT *, LAG(profit/NULLIF(revenue,0)) OVER(PARTITION BY category ORDER BY year) AS prior_margin
 FROM category_year
)
SELECT category, revenue, profit,
       profit/NULLIF(revenue,0) AS margin,
       100*(profit/NULLIF(revenue,0)-prior_margin) AS margin_change_pp,
       revenue*(profit/NULLIF(revenue,0)-prior_margin) AS within_category_margin_effect
FROM comparison WHERE year='2025' ORDER BY margin_change_pp, category;
-- Category margin effects exclude shifts in category revenue mix.
-- Do not sum them and call the result the aggregate margin effect in Q3.
