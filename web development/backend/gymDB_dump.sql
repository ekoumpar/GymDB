CREATE DATABASE  IF NOT EXISTS `gymdb` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gymdb`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: gymdb
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipment` (
  `equipment_id` int NOT NULL,
  `type` enum('Treadmill','Bike','Bench','Dumbbells','Mat','Machine') NOT NULL,
  `condition` enum('Good','NeedsRepair','ShortSupply','UnderRepair') NOT NULL,
  `room_name` enum('SweatRoom','PlankIt','YogaX','OnRepeat','SummerOn') NOT NULL,
  PRIMARY KEY (`equipment_id`),
  KEY `room_name_idx` (`room_name`),
  CONSTRAINT `fk_equipment_room` FOREIGN KEY (`room_name`) REFERENCES `room` (`room_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment`
--

LOCK TABLES `equipment` WRITE;
/*!40000 ALTER TABLE `equipment` DISABLE KEYS */;
INSERT INTO `equipment` VALUES (50,'Treadmill','Good','SweatRoom'),(52,'Treadmill','NeedsRepair','SweatRoom'),(100,'Mat','NeedsRepair','OnRepeat'),(101,'Mat','Good','OnRepeat'),(102,'Mat','Good','OnRepeat'),(150,'Bike','Good','SweatRoom'),(155,'Bike','Good','SweatRoom');
/*!40000 ALTER TABLE `equipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `financial_administration`
--

DROP TABLE IF EXISTS `financial_administration`;
/*!50001 DROP VIEW IF EXISTS `financial_administration`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `financial_administration` AS SELECT
 1 AS `member_id`,
 1 AS `subscription_name`,
 1 AS `duration`,
 1 AS `category`,
 1 AS `amount`,
 1 AS `date`,
 1 AS `method`,
 1 AS `current_balance`,
 1 AS `settled`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `member_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `date_of_birth` char(11) NOT NULL,
  `sex` enum('F','M') NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `height` int DEFAULT NULL,
  `weight` int DEFAULT NULL,
  `age` int DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`member_id`)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 AUTO_INCREMENT=1001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member`
VALUES
(32,'Leoudi Dimitra Eleni','2003-04-24','F','+30 6980606077',187,57,22,'123456Mil'),
(762,'Natalia Anastasia Kousta','2003-10-06','F','+30 6940078799',182,49,22,'123456Nat '),
(859,'Koumparidou Eleni','2003-02-07','F','+30 6940257161',175,60,22,'123456Kou'),
(957,'Nikos Papas','1970-03-15','M','+30 6944667792',183,85,56,'123456Nks'),
(1000,'Dimitris Papadopoulos','2010-04-25','M','+30 6980226033',200,100,16,'123456Dmp');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memberreserves`
--

DROP TABLE IF EXISTS `memberreserves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `memberreserves` (
  `member_id` int NOT NULL,
  `reservation_id` varchar(3) NOT NULL,
  PRIMARY KEY (`member_id`,`reservation_id`),
  KEY `reservation_id_idx` (`reservation_id`),
  CONSTRAINT `fk_reserves_member` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  CONSTRAINT `fk_reserves_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memberreserves`
--

LOCK TABLES `memberreserves` WRITE;
/*!40000 ALTER TABLE `memberreserves` DISABLE KEYS */;
INSERT INTO `memberreserves` VALUES (762,'5ga'),(762,'7h9'),(859,'7hw'),(1000,'8h4'),(859,'9gl'),(1000,'a30'),(1000,'huw');
/*!40000 ALTER TABLE `memberreserves` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` varchar(3) NOT NULL,
  `amount` int NOT NULL,
  `date` char(11) NOT NULL,
  `method` enum('Card','Cash','Online') NOT NULL,
  `member_id` int NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `member_id_idx` (`member_id`),
  CONSTRAINT `fk_payment_member` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES ('7h9',100,'2024-12-15','Card',762),('geo',80,'2025-10-25','Cash',859),('hh6',99,'2025-11-01','Online',32),('ka8',100,'2025-09-10','Cash',1000);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `reservation_id` varchar(3) NOT NULL,
  `day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `time` char(5) NOT NULL,
  `status` enum('Attended','NotAttended') NOT NULL,
  `workout_type` enum('Weights','Pilates','Yoga','TRX','Personal-Training') NOT NULL,
  PRIMARY KEY (`reservation_id`),
  KEY `workout_type_idx` (`workout_type`),
  CONSTRAINT `fk_reservation_workout` FOREIGN KEY (`workout_type`) REFERENCES `workout` (`workout_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
INSERT INTO `reservation` VALUES ('5ga','Saturday','11:00','NotAttended','Pilates'),('7h9','Friday','20:00','Attended','Yoga'),('7hw','Monday','15:00','NotAttended','Pilates'),('8h4','Monday','15:00','NotAttended','Pilates'),('9gl','Saturday','12:00','Attended','TRX'),('a30','Monday','17:00','Attended','Pilates'),('huw','Saturday','12:00','NotAttended','Yoga');
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `room_name` enum('SweatRoom','PlankIt','YogaX','OnRepeat','SummerOn') NOT NULL,
  `capacity` int NOT NULL,
  PRIMARY KEY (`room_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES ('SweatRoom',150),('PlankIt',9),('YogaX',3),('OnRepeat',15),('SummerOn',2);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription`
--

DROP TABLE IF EXISTS `subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscription` (
  `subscription_name` varchar(25) NOT NULL,
  `duration` int NOT NULL,
  `category` enum('Basic','All-inclusive') NOT NULL,
  `price` int NOT NULL,
  `member_id` int NOT NULL,
  PRIMARY KEY (`subscription_name`,`duration`),
  KEY `member_id_idx` (`member_id`),
  CONSTRAINT `fk_subscription_member` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription`
--

LOCK TABLES `subscription` WRITE;
/*!40000 ALTER TABLE `subscription` DISABLE KEYS */;
INSERT INTO `subscription` VALUES ('BlackFriday',1,'Basic',200,859),('BlackFriday',3,'All-inclusive',250,762),('BlackFriday',24,'Basic',500,32),('Mega-Deal',6,'All-inclusive',150,957),('Mega-Deal',12,'All-inclusive',200,1000);
/*!40000 ALTER TABLE `subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `timetable`
--

DROP TABLE IF EXISTS `timetable`;
/*!50001 DROP VIEW IF EXISTS `timetable`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `timetable` AS SELECT
 1 AS `workout_type`,
 1 AS `day`,
 1 AS `time`,
 1 AS `trainer_id`,
 1 AS `trainer_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `trainer`
--

DROP TABLE IF EXISTS `trainer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainer` (
  `trainer_id` int NOT NULL,
  `name` varchar(25) NOT NULL,
  `working_hours` int NOT NULL,
  PRIMARY KEY (`trainer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainer`
--

LOCK TABLES `trainer` WRITE;
/*!40000 ALTER TABLE `trainer` DISABLE KEYS */;
INSERT INTO `trainer` VALUES (3,'Amalia Tsipouktzioglou',45),(10,'Giannis Papadopoulos',40),(11,'Giannis Papadopoulos',35),(17,'Andreas Raftis',25),(24,'Sotiris Afentakis',16);
/*!40000 ALTER TABLE `trainer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainercoaches`
--

DROP TABLE IF EXISTS `trainercoaches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainercoaches` (
  `trainer_id` int NOT NULL,
  `workout_type` enum('Weights','Pilates','Yoga','TRX','Personal-Training') NOT NULL,
  PRIMARY KEY (`trainer_id`,`workout_type`),
  KEY `workout_type_idx` (`workout_type`),
  CONSTRAINT `fk_coaches_trainer` FOREIGN KEY (`trainer_id`) REFERENCES `trainer` (`trainer_id`),
  CONSTRAINT `fk_coaches_workout` FOREIGN KEY (`workout_type`) REFERENCES `workout` (`workout_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainercoaches`
--

LOCK TABLES `trainercoaches` WRITE;
/*!40000 ALTER TABLE `trainercoaches` DISABLE KEYS */;
INSERT INTO `trainercoaches` VALUES (11,'Weights'),(3,'Pilates'),(10,'Pilates'),(17,'Yoga'),(3,'TRX');
/*!40000 ALTER TABLE `trainercoaches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workout`
--

DROP TABLE IF EXISTS `workout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workout` (
  `workout_type` enum('Weights','Pilates','Yoga','TRX','Personal-Training') NOT NULL,
  `intensity` int NOT NULL,
  `duration` int NOT NULL,
  `room_name` enum('SweatRoom','PlankIt','YogaX','OnRepeat','SummerOn') NOT NULL,
  PRIMARY KEY (`workout_type`),
  KEY `room_name_idx` (`room_name`),
  CONSTRAINT `fk_workout_room` FOREIGN KEY (`room_name`) REFERENCES `room` (`room_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workout`
--

LOCK TABLES `workout` WRITE;
/*!40000 ALTER TABLE `workout` DISABLE KEYS */;
INSERT INTO `workout` VALUES ('Weights',3,60,'PlankIt'),('Pilates',10,30,'OnRepeat'),('Yoga',6,55,'YogaX'),('TRX',4,45,'YogaX'),('Personal-Training',7,60,'SummerOn');
/*!40000 ALTER TABLE `workout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `financial_administration`
--

/*!50001 DROP VIEW IF EXISTS `financial_administration`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `financial_administration` AS select `s`.`member_id` AS `member_id`,`s`.`subscription_name` AS `subscription_name`,`s`.`duration` AS `duration`,`s`.`category` AS `category`,`p`.`amount` AS `amount`,`p`.`date` AS `date`,`p`.`method` AS `method`,(`s`.`price` - coalesce(`p`.`amount`,0)) AS `current_balance`,if(((`s`.`price` - coalesce(`p`.`amount`,0)) = 0),1,0) AS `settled` from (`subscription` `s` left join `payment` `p` on((`s`.`member_id` = `p`.`member_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `timetable`
--

/*!50001 DROP VIEW IF EXISTS `timetable`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `timetable` AS select distinct `r`.`workout_type` AS `workout_type`,`r`.`day` AS `day`,`r`.`time` AS `time`,`t`.`trainer_id` AS `trainer_id`,`t`.`name` AS `trainer_name` from ((`reservation` `r` join `trainercoaches` `tc` on((`r`.`workout_type` = `tc`.`workout_type`))) join `trainer` `t` on((`tc`.`trainer_id` = `t`.`trainer_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-19 18:56:22
