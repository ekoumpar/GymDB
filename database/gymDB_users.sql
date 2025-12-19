# Create a user for the admin of the database
CREATE USER 'db_admin'@'localhost' IDENTIFIED BY 'db_admin7648';
GRANT ALL PRIVILEGES ON gymDB.* TO 'db_admin'@'localhost';

# Create a user for the admin and the administration of the gym
CREATE USER 'gym_admin'@'localhost' IDENTIFIED BY 'admin235';
CREATE USER 'gym_admin'@'185.107.80.231' IDENTIFIED BY 'admin235';
GRANT SELECT, INSERT, UPDATE ON gymDB.* TO 'gym_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE ON gymDB.* TO 'gym_admin'@'185.107.80.231';

# Create a user for the trainers of the gym
CREATE USER 'trainer'@'localhost' IDENTIFIED BY 'trainer2782';
CREATE USER 'trainer'@'%' IDENTIFIED BY 'trainer2782';
GRANT SELECT, INSERT, UPDATE ON gymDB.trainer  TO 'trainer'@'localhost';
GRANT SELECT ON gymDB.TrainerCoaches TO 'trainer'@'localhost';
GRANT SELECT ON gymDB.workout        TO 'trainer'@'localhost';
GRANT SELECT ON gymDB.room           TO 'trainer'@'localhost';
GRANT SELECT ON gymDB.member         TO 'trainer'@'localhost';
GRANT SELECT ON gymDB.reservation    TO 'trainer'@'localhost';
GRANT SELECT ON gymDB.equipment      TO 'trainer'@'localhost';
GRANT SELECT, INSERT, UPDATE ON gymDB.trainer  TO 'trainer'@'%';
GRANT SELECT ON gymDB.TrainerCoaches TO 'trainer'@'%';
GRANT SELECT ON gymDB.workout        TO 'trainer'@'%';
GRANT SELECT ON gymDB.room           TO 'trainer'@'%';
GRANT SELECT ON gymDB.member         TO 'trainer'@'%';
GRANT SELECT ON gymDB.reservation    TO 'trainer'@'%';
GRANT SELECT ON gymDB.equipment      TO 'trainer'@'%';


# Create a user for the members of the gym
CREATE USER 'member'@'localhost' IDENTIFIED BY 'member3648';
CREATE USER 'member'@'%' IDENTIFIED BY 'member3648';
GRANT SELECT ON gymDB.memberreserves TO 'member'@'localhost';
GRANT SELECT ON gymDB.payment TO 'member'@'localhost';
GRANT SELECT ON gymDB.subscription TO 'member'@'localhost';
GRANT SELECT, UPDATE, INSERT ON gymDB.member TO 'member'@'localhost';
GRANT SELECT ON gymDB.memberreserves TO 'member'@'%';
GRANT SELECT ON gymDB.payment TO 'member'@'%';
GRANT SELECT ON gymDB.subscription TO 'member'@'%';
GRANT SELECT, UPDATE, INSERT ON gymDB.member TO 'member'@'%';

