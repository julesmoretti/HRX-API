DROP DATABASE IF EXISTS `HRX`;

CREATE DATABASE `HRX`;

USE HRX;

-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;


-- ---
-- Table 'access_right'
-- Original access_right list
-- ---

DROP TABLE IF EXISTS `access_right`;

CREATE TABLE `access_right` (
  `id` INT(20) AUTO_INCREMENT,
  `full_name` VARCHAR(255),
  `username` VARCHAR(255),
  `email` VARCHAR(255),
  `blog` VARCHAR(255),
  `skill_1` VARCHAR(255),
  `skill_2` VARCHAR(255),
  `skill_3` VARCHAR(255),
  `token` VARCHAR(32),
  `cohort` INT(20),
  `user_status` VARCHAR(32) DEFAULT 'alumni',

  `latitude` FLOAT(17,14),
  `longitude` FLOAT(17,14),
  `geoposition_timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `share_geoposition` INT DEFAULT 1,

  `GH_id` VARCHAR(255),
  `GH_url` VARCHAR(255),
  `GH_public_repos` INT,
  `GH_private_repos` INT,
  `GH_profile_picture` VARCHAR(255),
  `GH_access_token` VARCHAR(255),

  `LI_id` VARCHAR(255),
  `LI_location_country_code` VARCHAR(32),
  `LI_location_name` VARCHAR(255),
  `LI_positions` VARCHAR(255),
  `LI_description` VARCHAR(2048),

  -- `LI_degrees` VARCHAR(255),  -- TODO
  `address` VARCHAR(255),
  `phone_number` VARCHAR(255),

  `LI_url` VARCHAR(255),
  `LI_company` INT,
  `LI_profile_picture` VARCHAR(255), -- as a backup but not used
  `LI_access_token` VARCHAR(255),

  `creation_date` TIMESTAMP DEFAULT 0,

  PRIMARY KEY (`id`)
) COMMENT 'Original access_right list';


DROP TABLE IF EXISTS `companies`;

CREATE TABLE `companies` (
  `id` INT(20) AUTO_INCREMENT,
  `company_id` INT(20),
  `alumni` VARCHAR(255) DEFAULT '[]',
  `name` VARCHAR(255),
  `industry` VARCHAR(255),
  `size` VARCHAR(255),
  `type` VARCHAR(255),
  `address` VARCHAR(255),
  `www` VARCHAR(255),
  `logo` VARCHAR(255),
  `latitude` FLOAT(17,14),
  `longitude` FLOAT(17,14),
  PRIMARY KEY (`id`)
) COMMENT 'List of companies for the HRX Alumn';


DROP TABLE IF EXISTS `hr_chapters`;

CREATE TABLE `hr_chapters` (
  `id` INT(20) AUTO_INCREMENT,
  `name` VARCHAR(255),
  `location` VARCHAR(255),
  `address` VARCHAR(255),
  `www` VARCHAR(255),
  `logo` VARCHAR(255),
  `phone_number` VARCHAR(255),
  `latitude` FLOAT(17,14),
  `longitude` FLOAT(17,14),
  PRIMARY KEY (`id`)
) COMMENT 'List of Hack Reactor chapters around the world';

INSERT INTO hr_chapters
SET
name = "Hack Reactor",
location = "Head Quarters",
address = "944 Market St #8, San Francisco, CA 94102",
www = "www.hackreactor.com",
phone_number = "4155470254",
latitude = 37.783624,
longitude = -122.408999;

DROP TABLE IF EXISTS `addition`;

CREATE TABLE `addition` (
  `id` INT(20) AUTO_INCREMENT,
  `category` VARCHAR(255),
  `category_id` INT(20),
  PRIMARY KEY (`id`)
) COMMENT 'List all new_user, company, geolocation, hr_chapter that undergot an update';

INSERT INTO addition
SET
category = "hr_chapter",
category_id = 1;


DROP TABLE IF EXISTS `devices`;

CREATE TABLE `devices` (
  `id` INT(20) AUTO_INCREMENT,
  `hrx_id` INT(20),
  `apn_token` VARCHAR(255),
  `state` INT DEFAULT 1,
  PRIMARY KEY (`id`)
) COMMENT 'Apple iOS device list and notification status';


DROP TABLE IF EXISTS `API_passwords`;

CREATE TABLE `API_passwords` (
  `id` INT(20) AUTO_INCREMENT,
  `password` VARCHAR(255),
  PRIMARY KEY (`id`)
) COMMENT 'Dumb passwords to manage database edits';
