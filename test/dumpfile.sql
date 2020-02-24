DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) AUTO_INCREMENT PRIMARY KEY,
  `gmt_create` datetime(6) NOT NULL,
  `email` varchar(256) NOT NULL UNIQUE,
  `nickname` varchar(256) NOT NULL
);
