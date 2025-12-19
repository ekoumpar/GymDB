# Find Pilates timetable during the week
USE gymdb;
SELECT DISTINCT day, time
FROM reservation
WHERE workout_type = 'Pilates';