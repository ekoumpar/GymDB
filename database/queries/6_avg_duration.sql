# Find the average duration of classes in a room
USE gymdb;
SELECT AVG(w.duration) AS avg_duration
FROM workout w 
WHERE w.room_name = 'OnRepeat';
