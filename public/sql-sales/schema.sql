-- SQLite. One row per month, region, category and channel.
-- Currency stored as integer USD cents; percentages calculated from totals.
CREATE TABLE sales (
  month TEXT NOT NULL,
  region TEXT NOT NULL CHECK(region IN ('East','North','South','West')),
  category TEXT NOT NULL CHECK(category IN ('Essentials','Furniture','Technology')),
  channel TEXT NOT NULL CHECK(channel IN ('Direct','Online')),
  orders INTEGER NOT NULL CHECK(orders > 0),
  units INTEGER NOT NULL CHECK(units > 0),
  gross_cents INTEGER NOT NULL CHECK(gross_cents >= 0),
  discount_cents INTEGER NOT NULL CHECK(discount_cents BETWEEN 0 AND gross_cents),
  cogs_cents INTEGER NOT NULL CHECK(cogs_cents >= 0),
  plan_cents INTEGER NOT NULL CHECK(plan_cents >= 0),
  PRIMARY KEY(month, region, category, channel)
);

CREATE VIEW annual AS
SELECT substr(month,1,4) AS year,
       SUM(orders) AS orders,
       SUM(gross_cents-discount_cents)/100.0 AS revenue,
       SUM(gross_cents-discount_cents-cogs_cents)/100.0 AS profit,
       SUM(plan_cents)/100.0 AS plan
FROM sales GROUP BY substr(month,1,4);
