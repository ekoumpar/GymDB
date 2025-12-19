# Find rooms for Yoga or rooms with capacity bigger than 50 
USE gymdb;
SELECT room_name
FROM workout
WHERE workout_type = 'Yoga'

UNION

SELECT room_name
FROM room
WHERE capacity > 50;