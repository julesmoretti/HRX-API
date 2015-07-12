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
  `skills` VARCHAR(255),
  `token` VARCHAR(32),

  `lat` INT,
  `long` INT,

  `GH_id` VARCHAR(255),
  `GH_url` VARCHAR(255),
  `GH_location` VARCHAR(255),
  `GH_public_repos` INT,
  `GH_private_repos` INT,
  `GH_profile_picture` VARCHAR(255),
  `GH_access_token` VARCHAR(255),

  `LI_id`INT,
  `LI_location_country_code` VARCHAR(32),
  `LI_location_name` VARCHAR(255),
  `LI_positions` VARCHAR(255),
  `LI_description` VARCHAR(2048),

  `LI_degrees` VARCHAR(255),
  `LI_address` VARCHAR(255),
  `LI_phone_number` VARCHAR(255),

  `LI_url` VARCHAR(255),
  `LI_company` INT,
  `LI_profile_picture` VARCHAR(255),
  `LI_access_token` VARCHAR(255),

  `creation_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) COMMENT 'Original access_right list';


DROP TABLE IF EXISTS `companies`;

CREATE TABLE `companies` (
  `id` INT(20) AUTO_INCREMENT,
  `company_id` INT(20),
  `name` VARCHAR(255),
  `industry` VARCHAR(255),
  `size` VARCHAR(255),
  `type` VARCHAR(255),
  `address_no` VARCHAR(255),
  `address_street` VARCHAR(255),
  `address_suite` VARCHAR(255),
  `city` VARCHAR(255),
  `state` VARCHAR(255),
  `postcode` VARCHAR(255),
  `country` VARCHAR(255),
  `lat` INT,
  `long` INT,
  PRIMARY KEY (`id`)
) COMMENT 'List of companies for the HRX Alumn';


DROP TABLE IF EXISTS `devices`;

CREATE TABLE `devices` (
  `id` INT(20) AUTO_INCREMENT,
  `hrx_id` INT(20),
  `apn_token` VARCHAR(255),
  `state` INT DEFAULT 1,
  PRIMARY KEY (`id`)
) COMMENT 'Apple iOS device list and notification status';
