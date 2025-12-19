# Find \All-inclusive subscriptions from members older than 25 yo
USE gymdb;
SELECT subscription_name, duration, member_id
FROM subscription
WHERE category = 'All-inclusive'
  AND (subscription_name, member_id) NOT IN (
      SELECT s.subscription_name, s.member_id
      FROM subscription s
      JOIN member m ON s.member_id = m.member_id
      WHERE m.age < 25
  );