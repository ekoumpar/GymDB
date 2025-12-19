USE gymdb;

INSERT INTO member (member_id, name, date_of_birth, sex, phone_number, height, weight)
VALUES
(32,'Leoudi Dimitra Eleni','2003-04-24','F','+30 6980606077',187,57),
(762,'Natalia Anastasia Kousta','2003-10-06','F','+30 6940078799',182,49),
(859,'Koumparidou Eleni','2003-02-07','F','+30 6940257161',175,60),
(957,'Nikos Papas','1970-03-15','M','+30 6944667792',183,85),
(1000,'Dimitris Papadopoulos','2010-04-25','M','+30 6980226033',200,100);

UPDATE member
SET age = TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE())
WHERE member_id > 0;

INSERT INTO room VALUES
('SweatRoom',150),('PlankIt',9),('YogaX',3),('OnRepeat',15),('SummerOn',2);


INSERT INTO workout VALUES
('Weights',3,60,'PlankIt'),
('Pilates',10,30,'OnRepeat'),
('Yoga',6,55,'YogaX'),
('TRX',4,45,'YogaX'),
('Personal-Training',7,60,'SummerOn');


INSERT INTO trainer VALUES
(3,'Amalia Tsipouktzioglou',45),
(10,'Giannis Papadopoulos',40),
(11,'Giannis Papadopoulos',35),
(17,'Andreas Raftis',25),
(24,'Sotiris Afentakis',16);


INSERT INTO equipment VALUES
(50,'Treadmill','Good','SweatRoom'),
(52,'Treadmill','NeedsRepair','SweatRoom'),
(100,'Mat','NeedsRepair','OnRepeat'),
(101,'Mat','Good','OnRepeat'),
(102,'Mat','Good','OnRepeat'),
(150,'Bike','Good','SweatRoom'),
(155,'Bike','Good','SweatRoom');


INSERT INTO subscription VALUES
('BlackFriday',1,'Basic',200,859),
('BlackFriday',3,'All-inclusive',250,762),
('BlackFriday',24,'Basic',500,32),
('Mega-Deal',6,'All-inclusive',150,957),
('Mega-Deal',12,'All-inclusive',200,1000);


INSERT INTO payment VALUES
('7h9',100,'2024-12-15','Card',762),
('geo',80,'2025-10-25','Cash',859),
('hh6',99,'2025-11-01','Online',32),
('ka8',100,'2025-09-10','Cash',1000);


INSERT INTO reservation VALUES
('5ga','Saturday','11:00','NotAttended','Pilates'),
('7h9','Friday','20:00','Attended','Yoga'),
('7hw','Monday','15:00','NotAttended','Pilates'),
('8h4','Monday','15:00','NotAttended','Pilates'),
('9gl','Saturday','12:00','Attended','TRX'),
('a30','Monday','17:00','Attended','Pilates'),
('huw','Saturday','12:00','NotAttended','Yoga');


INSERT INTO memberreserves VALUES
(762,'5ga'),(762,'7h9'),(859,'7hw'),(1000,'8h4'),(859,'9gl'),(1000,'a30'),(1000,'huw');


INSERT INTO trainercoaches VALUES
(11,'Weights'),(3,'Pilates'),(10,'Pilates'),(17,'Yoga'),(3,'TRX');
