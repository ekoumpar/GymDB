# Find the members that didn't attend Pilates class
USE gymdb;
SELECT m.member_id, m.name, r.day, r.time
FROM member m
JOIN MemberReserves mr ON m.member_id = mr.member_id
JOIN reservation r ON mr.reservation_id = r.reservation_id
WHERE r.status = 'NotAttended' AND r.workout_type = 'Pilates';