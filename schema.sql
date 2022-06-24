-- MySQL dump 10.13  Distrib 5.7.34, for Linux (x86_64)
--
-- Host: localhost    Database: management
-- ------------------------------------------------------
-- Server version	5.7.34-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chats`
--

DROP TABLE IF EXISTS `chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chats` (
  `userid` int(11) DEFAULT NULL,
  `to_id` int(11) DEFAULT NULL,
  `turn` tinyint(1) DEFAULT NULL,
  `message` text,
  KEY `userid` (`userid`),
  CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `login` (`userid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `e_members`
--

DROP TABLE IF EXISTS `e_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `e_members` (
  `userid` int(11) DEFAULT NULL,
  `eventsId` int(11) DEFAULT NULL,
  `agentId` int(11) DEFAULT NULL,
  KEY `userid` (`userid`,`eventsId`),
  CONSTRAINT `e_members_ibfk_1` FOREIGN KEY (`userid`, `eventsId`) REFERENCES `events` (`userid`, `eventsId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `emp`
--

DROP TABLE IF EXISTS `emp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `emp` (
  `managerId` int(11) DEFAULT NULL,
  `empId` int(11) DEFAULT NULL,
  KEY `managerId` (`managerId`),
  CONSTRAINT `emp_ibfk_1` FOREIGN KEY (`managerId`) REFERENCES `login` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `userid` int(11) DEFAULT NULL,
  `eventsId` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `starting_date` date DEFAULT NULL,
  PRIMARY KEY (`eventsId`),
  KEY `userid` (`userid`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `login` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `login` (
  `userid` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `firstlogin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `relations`
--

DROP TABLE IF EXISTS `relations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relations` (
  `userid` int(11) DEFAULT NULL,
  `relId` int(11) DEFAULT NULL,
  KEY `userid` (`userid`),
  KEY `relId` (`relId`),
  CONSTRAINT `relations_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `login` (`userid`) ON DELETE CASCADE,
  CONSTRAINT `relations_ibfk_2` FOREIGN KEY (`relId`) REFERENCES `login` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `userid` int(11) DEFAULT NULL,
  `taskId` int(11) DEFAULT NULL,
  `Name` varchar(200) DEFAULT NULL,
  `agentId` int(11) DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  KEY `userid` (`userid`),
  KEY `agentId` (`agentId`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `login` (`userid`),
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`agentId`) REFERENCES `login` (`userid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-20 14:50:16
