-- MySQL dump 10.13  Distrib 5.5.44, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: HRX
-- ------------------------------------------------------
-- Server version	5.5.44-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `access_right`
--

DROP TABLE IF EXISTS `access_right`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `access_right` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blog` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skill_1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skill_2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skill_3` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cohort` int(20) DEFAULT NULL,
  `user_status` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT 'alumni',
  `latitude` float(17,14) DEFAULT NULL,
  `longitude` float(17,14) DEFAULT NULL,
  `geoposition_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `share_geoposition` int(11) DEFAULT '1',
  `GH_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GH_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GH_public_repos` int(11) DEFAULT NULL,
  `GH_private_repos` int(11) DEFAULT NULL,
  `GH_profile_picture` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GH_access_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LI_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LI_location_country_code` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LI_location_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LI_positions` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LI_description` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LI_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LI_company` int(11) DEFAULT NULL,
  `LI_profile_picture` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LI_access_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creation_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Original access_right list';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_right`
--

LOCK TABLES `access_right` WRITE;
/*!40000 ALTER TABLE `access_right` DISABLE KEYS */;
INSERT INTO `access_right` VALUES (1,'Jules Moretti','julesmoretti','null','http://behance.net/julesmoretti','Design Technologist','Industrial Design','Full Stack','IIamsYXsyZrBqiM6alYfKA==',12,'alumni',34.02407455444336,-118.29157257080078,'2015-08-23 01:05:42',1,'744300','https://github.com/julesmoretti',26,19,'https://avatars.githubusercontent.com/u/744300?v=3','d3b016a14be28d40f9e6069fef25b259823f84c7','mzYEHm7Jbe','us','San Francisco Bay Area','Design Technologist','I am a trained international industrial designer with four years experience building and managing multi-million dollar water features located all around the world.\n\nI have evolved from mechanical engineering, through design to software engineering. French born and having lived from Scotland, to Los Angeles and now San Francisco, I believe I can bring an original point of view to most problems and hopefully an unexpected solution.\n\nI love challenges and look forward to being put to the test.\n\nSPECIALITIES\nCreative & Strategic Bridge · Team Building & Leadership · Project Management · Budgeting · Research & Development · Process Optimization & Cost control · Project & Strategic Planning · User Experience & Multimedia Design · Art Direction · Web Development · Graphic Design',NULL,NULL,'https://www.linkedin.com/in/julesmoretti',1,'https://media.licdn.com/mpr/mprx/0_0Mv5eX6dIr4ESbM8yeWCOyIoelNF7wc8eeWFyVcdUuMbObNhexWC7fBuo8Mb7IJ_JeeiHf9dMvvbpsv5R-Xox0nfavvFps5_D-XboXE7U7XapDqoDnqQ2-qIUg','AQVKGNPUgZD872bYQfddGiAZB-RyBwT1yHazwTrGA9HRusUnrIvZ9uXK52W1QIipCsyfv8U_-x_e4--gHH8jrjzw9xwV_hdlFNehD3arkORK16UKZcrSb4FQQWsgjiOr1ZsQmi1DvzddlDHA8xHesN3h6YGJpzFf1NJhgKfz6nTnyi5UCmA','2015-08-22 06:56:16');
/*!40000 ALTER TABLE `access_right` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `addition`
--

DROP TABLE IF EXISTS `addition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `addition` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` int(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='List all new_user, company, geolocation, hr_chapter that undergot an update';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addition`
--

LOCK TABLES `addition` WRITE;
/*!40000 ALTER TABLE `addition` DISABLE KEYS */;
INSERT INTO `addition` VALUES (1,'hr_chapter',1),(2,'geolocation',1),(3,'new_user',1),(4,'company',1),(5,'geolocation',1),(6,'new_user',1),(7,'geolocation',1),(8,'geolocation',1),(9,'geolocation',1),(10,'geolocation',1),(11,'geolocation',1),(12,'geolocation',1),(13,'geolocation',1),(14,'geolocation',1),(15,'geolocation',1),(16,'geolocation',1),(17,'geolocation',1),(18,'geolocation',1),(19,'geolocation',1),(20,'geolocation',1),(21,'geolocation',1),(22,'geolocation',1),(23,'geolocation',1),(24,'geolocation',1),(25,'geolocation',1),(26,'geolocation',1),(27,'geolocation',1),(28,'geolocation',1),(29,'geolocation',1),(30,'geolocation',1),(31,'new_user',1),(32,'geolocation',1),(33,'geolocation',1),(34,'geolocation',1),(35,'geolocation',1),(36,'geolocation',1),(37,'geolocation',1),(38,'geolocation',1),(39,'geolocation',1),(40,'geolocation',1),(41,'geolocation',1),(42,'geolocation',1),(43,'geolocation',1),(44,'geolocation',1),(45,'geolocation',1),(46,'geolocation',1),(47,'geolocation',1),(48,'geolocation',1),(49,'geolocation',1),(50,'geolocation',1),(51,'geolocation',1),(52,'geolocation',1),(53,'new_user',1),(54,'new_user',1),(55,'new_user',1),(56,'new_user',1),(57,'new_user',1),(58,'geolocation',1),(59,'new_user',1),(60,'geolocation',1),(61,'geolocation',1),(62,'new_user',1),(63,'geolocation',1),(64,'new_user',1),(65,'new_user',1),(66,'new_user',1),(67,'geolocation',1),(68,'geolocation',1),(69,'geolocation',1),(70,'new_user',1),(71,'geolocation',1),(72,'geolocation',1),(73,'new_user',1),(74,'geolocation',1),(75,'geolocation',1),(76,'geolocation',1),(77,'geolocation',1),(78,'new_user',1),(79,'new_user',1),(80,'new_user',1),(81,'geolocation',1),(82,'geolocation',1),(83,'geolocation',1),(84,'new_user',1),(85,'geolocation',1),(86,'geolocation',1),(87,'new_user',1),(88,'geolocation',1),(89,'geolocation',1),(90,'new_user',1),(91,'geolocation',1),(92,'new_user',1),(93,'geolocation',1),(94,'geolocation',1),(95,'geolocation',1),(96,'new_user',1),(97,'geolocation',1),(98,'new_user',1),(99,'new_user',1),(100,'new_user',1),(101,'new_user',1),(102,'geolocation',1),(103,'geolocation',1),(104,'new_user',1),(105,'geolocation',1),(106,'geolocation',1),(107,'geolocation',1),(108,'geolocation',1),(109,'geolocation',1),(110,'geolocation',1),(111,'geolocation',1),(112,'geolocation',1),(113,'geolocation',1),(114,'geolocation',1),(115,'geolocation',1),(116,'geolocation',1),(117,'geolocation',1),(118,'geolocation',1),(119,'geolocation',1),(120,'geolocation',1),(121,'geolocation',1),(122,'geolocation',1),(123,'geolocation',1),(124,'geolocation',1),(125,'geolocation',1),(126,'geolocation',1),(127,'geolocation',1),(128,'geolocation',1),(129,'geolocation',1),(130,'geolocation',1),(131,'geolocation',1),(132,'geolocation',1),(133,'geolocation',1),(134,'geolocation',1),(135,'geolocation',1),(136,'geolocation',1),(137,'geolocation',1),(138,'geolocation',1),(139,'geolocation',1),(140,'geolocation',1),(141,'geolocation',1),(142,'geolocation',1),(143,'geolocation',1),(144,'geolocation',1),(145,'geolocation',1),(146,'geolocation',1),(147,'geolocation',1),(148,'geolocation',1),(149,'geolocation',1),(150,'geolocation',1),(151,'geolocation',1),(152,'company',1),(153,'geolocation',1),(154,'geolocation',1),(155,'geolocation',1),(156,'geolocation',1),(157,'geolocation',1),(158,'geolocation',1),(159,'geolocation',1),(160,'geolocation',1),(161,'geolocation',1),(162,'geolocation',1);
/*!40000 ALTER TABLE `addition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `companies` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `company_id` int(20) DEFAULT NULL,
  `alumni` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '[]',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `industry` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `www` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` float(17,14) DEFAULT NULL,
  `longitude` float(17,14) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='List of companies for the HRX Alumn';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,163904,'[1]','frog','Design','501-1000 employees','Privately Held','660 3rd street, 4th floor, San Francisco - CA 94107','http://frogdesign.com',NULL,37.77918243408203,-122.39349365234375);
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `devices` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `hrx_id` int(20) DEFAULT NULL,
  `apn_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` int(11) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Apple iOS device list and notification status';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES (1,1,'3500d2dc866843fe3b6daa4a96354c9e88a5d14051e30da402be1876239241ab',1);
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_chapters`
--

DROP TABLE IF EXISTS `hr_chapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hr_chapters` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `www` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` float(17,14) DEFAULT NULL,
  `longitude` float(17,14) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='List of Hack Reactor chapters around the world';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_chapters`
--

LOCK TABLES `hr_chapters` WRITE;
/*!40000 ALTER TABLE `hr_chapters` DISABLE KEYS */;
INSERT INTO `hr_chapters` VALUES (1,'Hack Reactor','Head Quarters','944 Market St #8, San Francisco, CA 94102','www.hackreactor.com',NULL,'4155470254',37.78362274169922,-122.40899658203125);
/*!40000 ALTER TABLE `hr_chapters` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-23 15:32:57
