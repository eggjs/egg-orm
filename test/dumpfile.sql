DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `comments`;

CREATE TABLE `users` (
  `id` bigint(20) AUTO_INCREMENT PRIMARY KEY,
  `gmt_create` datetime(6) NOT NULL,
  `email` varchar(256) NOT NULL UNIQUE,
  `nickname` varchar(256) NOT NULL
);

CREATE TABLE `posts` (
  `id` bigint(20) AUTO_INCREMENT PRIMARY KEY,
  `gmt_create` datetime(6) NOT NULL,
  `content` TEXT,
  `description` varchar(256) NOT NULL,
  `user_id` bigint(20)
);

CREATE TABLE `comments` (
  `id` bigint(20) AUTO_INCREMENT PRIMARY KEY,
  `content` TEXT,
  `user_id` bigint(20)
)
