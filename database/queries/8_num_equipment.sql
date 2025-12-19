# Find the number of matresses in good condition
USE gymdb;
SELECT COUNT(*) AS good_matresses
FROM equipment e
WHERE e.type = 'Mat' AND e.condition = 'Good';