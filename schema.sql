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
  `first` VARCHAR(255),
  `last` VARCHAR(255),
  `username` VARCHAR(255),
  `email` VARCHAR(255),
  `gender` VARCHAR(10),
  `birth_day` VARCHAR(2),
  `birth_month` VARCHAR(2),
  `birth_year` VARCHAR(4),
  `salt` VARCHAR(32),
  `hashed` VARCHAR(128),
  `token` VARCHAR(32),
  `reset_password_token` VARCHAR(128),
  `profile_picture` VARCHAR(255),
  `creation_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) COMMENT 'Original access_right list';


INSERT INTO
  access_right
SET
  first = 'James',
  last = 'Bond',
  username = '007',
  email = 'julesmoretti@me.com',
  gender = 'male',
  birth_day = 01,
  birth_month = 01,
  birth_year = 1980,
  salt = '59mGZ4SMawIM/hMV',
  hashed = 'd7818f0ab59c048f61cd45ea67fd6473750d744107ca7b69601682231a5705aa3b5fb90de48d4b800c638f03dccc0a617ea7a1b198e51e747b4ae4e66ba914ac',
  token = 'K2SckFbvRA5lyTu/DMu76g=='
;

