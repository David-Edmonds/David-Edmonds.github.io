-- Q2: How much revenue growth comes from orders versus revenue per order?
-- Sequential decomposition: prior order value for the volume effect,
-- current order count for the order-value effect. Effects sum exactly.
WITH comparison AS (
 SELECT *, LAG(orders) OVER (ORDER BY year) AS prior_orders,
           LAG(revenue) OVER (ORDER BY year) AS prior_revenue
 FROM annual
)
SELECT year, revenue-prior_revenue AS revenue_change,
       (orders-prior_orders)*(prior_revenue/NULLIF(prior_orders,0)) AS order_count_effect,
       orders*(revenue/NULLIF(orders,0)-prior_revenue/NULLIF(prior_orders,0)) AS order_value_effect,
       orders*1.0/NULLIF(prior_orders,0)-1 AS order_growth,
       (revenue/NULLIF(orders,0))/(prior_revenue/NULLIF(prior_orders,0))-1 AS order_value_growth
FROM comparison ORDER BY year;
