# Find trainers that teach TRX and work more than 30 hours per week
USE gymdb;
SELECT t.trainer_id, t.name
FROM trainer t
WHERE t.working_hours > 30
  AND t.trainer_id IN (
      SELECT tc.trainer_id
      FROM trainercoaches tc
      JOIN trainer t1 ON tc.trainer_id = t.trainer_id
      WHERE tc.workout_type = 'TRX'
  );