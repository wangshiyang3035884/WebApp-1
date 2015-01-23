/*
MySQL Data Transfer
Source Host: localhost
Source Database: webapp
Target Host: localhost
Target Database: webapp
Date: 2015/1/23 15:43:06
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for office
-- ----------------------------
DROP TABLE IF EXISTS `office`;
CREATE TABLE `office` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(20) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `device` char(200) DEFAULT NULL,
  `develop` int(11) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for orderoffice
-- ----------------------------
DROP TABLE IF EXISTS `orderoffice`;
CREATE TABLE `orderoffice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `officeid` int(11) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `orderdate` date DEFAULT NULL,
  `start` int(11) DEFAULT NULL,
  `end` int(11) DEFAULT NULL,
  `name` char(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `officeid` (`officeid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(50) NOT NULL,
  `password` char(100) NOT NULL,
  `type` int(11) NOT NULL DEFAULT '1',
  `remark` char(200) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records 
-- ----------------------------
INSERT INTO `office` VALUES ('1', '1号', '45', '投影仪、笔记本', '1');
INSERT INTO `office` VALUES ('2', '2号', '15', '投影仪、笔记本、大屏电视', '1');
INSERT INTO `office` VALUES ('3', '3号', '5', '笔记本、多媒体电话', '1');
INSERT INTO `user` VALUES ('1', '宁肖', '933b49e5484462597167accd5270482e', '1', null);
INSERT INTO `user` VALUES ('6', '李金鹏', '933b49e5484462597167accd5270482e', '1', null);
INSERT INTO `user` VALUES ('7', 'nxiao', '933b49e5484462597167accd5270482e', '1', null);
INSERT INTO `user` VALUES ('8', 'nxiao', '933b49e5484462597167accd5270482e', '1', null);
