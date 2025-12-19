# Count the members that reserved on Monday, 15:00, Pliates class
USE gymdb;
SELECT COUNT(*) AS member_count
FROM MemberReserves mr 
JOIN reservation r ON mr.reservation_id = r.reservation_id
WHERE r.day = 'Monday' AND r.time = '15:00' AND r.workout_type = 'Pilates';