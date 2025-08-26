-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.31 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for booksy
CREATE DATABASE IF NOT EXISTS `booksy` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `booksy`;

-- Dumping structure for table booksy.address
CREATE TABLE IF NOT EXISTS `address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `line_1` text NOT NULL,
  `line_2` text NOT NULL,
  `postal_code` varchar(5) NOT NULL,
  `city_id` int NOT NULL,
  `user_id` int NOT NULL,
  `first_name` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `last_name` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `mobile` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_address_city1_idx` (`city_id`),
  KEY `fk_address_user1_idx` (`user_id`),
  CONSTRAINT `FK_7rod8a71yep5vxasb0ms3osbg` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_address_city1` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`),
  CONSTRAINT `fk_address_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table booksy.address: ~18 rows (approximately)
INSERT INTO `address` (`id`, `line_1`, `line_2`, `postal_code`, `city_id`, `user_id`, `first_name`, `last_name`, `mobile`) VALUES
	(2, 'Badyriya Mawatha', 'Silmiyapura', '90365', 1, 14, 'RizlaN', 'Ahmedd', '0784342391'),
	(3, 'ASFA', 'ASSS', '90366', 1, 15, 'Rizlan', 'dasd', '0784545412'),
	(4, 'Baduriya Mawatha', 'Silmiyapura', '90124', 1, 16, 'Lokesh', 'Kanagaraj', '0784545452'),
	(5, 'Baduriya', 'MAWATHA', '90125', 2, 16, 'Rizlan', 'Kanagaraj', '0784545452'),
	(6, 'bad', 'fdsg', '90123', 1, 16, 'Rizlan', 'Kanagaraj', '0784545452'),
	(7, 'Badulla', 'mASSDSD', '90123', 1, 16, 'Rizlan', 'Kanagaraj', '0784545452'),
	(8, 'Maja ', 'Area', '90124', 1, 16, 'Rizlan', 'Kanagaraj', '0784545452'),
	(9, 'Maja ', 'Area', '90124', 1, 16, 'Rizlan', 'Kanagaraj', '0784545452'),
	(10, 'Bssss', 'kkkjxc', '90145', 1, 16, 'Rizlan', 'Kanagaraj', '0784545452'),
	(11, 'axsdf', 'dfsfbgd', '90125', 1, 16, 'Rizlan', 'Kanagaraj', '0784545452'),
	(12, 'axsdf', 'dfsfbgd', '90125', 1, 16, 'Rizlan', 'Kanagaraj', '0784545452'),
	(13, 'Badulla', 'Ilamai', '90120', 1, 16, 'Rizlan', 'Kanagaraj', '0784545452'),
	(14, 'Assfd', 'ddfsggd', '90145', 2, 16, 'Rizlan', 'Kanagaraj', '0784545452'),
	(15, 'sdfg', 'fd', '90125', 1, 16, 'Rizlan', 'Kanagaraj', '0784545452'),
	(16, 'wert', 'sdfgh', '90125', 2, 16, 'Rizlan', 'Kanagaraj', '0784545452'),
	(17, 'Badulla', 'Silmiyapura', '90364', 1, 13, 'Riflan', 'Riflan', '0784342391'),
	(18, 'Badulla', 'Silmiyapura', '90364', 1, 13, 'Riflan', 'Riflan', '0784342391'),
	(19, 'Badulla', 'Silmiyapura', '90364', 1, 13, 'Riflan', 'Riflan', '0784342391'),
	(20, 'Badulla', 'Silmiyapura', '90364', 1, 13, 'Riflan', 'Riflan', '0784342391'),
	(21, 'Maja', 'AAgaya', '90122', 1, 13, 'Dinesh', 'Karthik', '0784547554'),
	(22, 'Baduriya', 'Mawathaa', '90125', 1, 14, 'RizlaN', 'Ahmedd', '0784342391');

-- Dumping structure for table booksy.books
CREATE TABLE IF NOT EXISTS `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `author` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `price` double NOT NULL,
  `created_at` datetime NOT NULL,
  `categories_id` int NOT NULL,
  `language_id` int NOT NULL,
  `status_id` int NOT NULL,
  `published_year` varchar(10) NOT NULL,
  `type_id` int NOT NULL,
  `format_id` int NOT NULL,
  `user_id` int NOT NULL,
  `ISBN` varchar(40) NOT NULL,
  `qty` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_books_categories_idx` (`categories_id`),
  KEY `fk_books_language1_idx` (`language_id`),
  KEY `fk_books_status1_idx` (`status_id`),
  KEY `fk_books_type1_idx` (`type_id`),
  KEY `fk_books_format1_idx` (`format_id`),
  KEY `fk_books_user1_idx` (`user_id`),
  CONSTRAINT `fk_books_categories` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_books_format1` FOREIGN KEY (`format_id`) REFERENCES `format` (`id`),
  CONSTRAINT `fk_books_language1` FOREIGN KEY (`language_id`) REFERENCES `language` (`id`),
  CONSTRAINT `fk_books_status1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`),
  CONSTRAINT `fk_books_type1` FOREIGN KEY (`type_id`) REFERENCES `type` (`id`),
  CONSTRAINT `fk_books_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table booksy.books: ~16 rows (approximately)
INSERT INTO `books` (`id`, `title`, `author`, `description`, `price`, `created_at`, `categories_id`, `language_id`, `status_id`, `published_year`, `type_id`, `format_id`, `user_id`, `ISBN`, `qty`) VALUES
	(31, 'The Silent Patient', 'Alex Michaelides', 'A psychological thriller about a woman\'s act of violence against her husband and the therapist obsessed with uncovering her motive.', 14.99, '2025-08-02 00:00:00', 1, 1, 1, '2019', 1, 1, 14, '9781250301697', 3),
	(32, 'Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'Explores the history of humankind from the Stone Age to the 21st century.', 18.5, '2025-08-02 00:00:00', 2, 1, 1, '2015', 2, 2, 15, '9780062316097', 8),
	(33, 'Atomic Habits', 'James Clear', 'Practical strategies for forming good habits and breaking bad ones.', 13.25, '2025-08-02 00:00:00', 7, 1, 1, '2018', 1, 2, 14, '9780735211292', 10),
	(34, 'Harry Potter and the Philosopher\'s Stone', 'J.K. Rowling', 'The first book in the Harry Potter series.', 10.99, '2025-08-02 00:00:00', 8, 1, 1, '1997', 2, 5, 15, '9780747532699', 15),
	(35, 'Wings of Fire', 'A.P.J. Abdul Kalam', 'Autobiography of India\'s missile man and former president.', 11.75, '2025-08-02 00:00:00', 5, 2, 1, '1999', 1, 5, 14, '9788173711466', 1),
	(36, 'The Theory of Everything', 'Stephen Hawking', 'A brief explanation of the origin and structure of the universe.', 16.8, '2025-08-02 00:00:00', 3, 1, 1, '2002', 2, 1, 15, '9788179925911', 4),
	(37, 'Goodnight Moon', 'Margaret Wise Brown', 'A beloved children\'s bedtime book.', 6.99, '2025-08-02 00:00:00', 4, 1, 1, '1947', 1, 5, 15, '9780060775858', 20),
	(38, 'Think Like a Monk', 'Jay Shetty', 'Offers practical advice on how to overcome negativity and find purpose.', 13.99, '2025-08-02 00:00:00', 7, 1, 1, '2020', 1, 2, 14, '9781982134488', 9),
	(39, 'The Alchemist', 'Paulo Coelho', 'A philosophical story about a shepherd\'s journey to find treasure.', 9.5, '2025-08-02 00:00:00', 1, 1, 1, '1988', 1, 2, 15, '9780061122415', 10),
	(40, 'A Brief History of Time', 'Stephen Hawking', 'Explores the nature of time and the universe.', 15, '2025-08-02 00:00:00', 3, 1, 1, '1988', 2, 1, 14, '9780553380163', 5),
	(41, 'LEO', 'Lokesh Kanagaraj', 'Action Thriller', 20, '2025-08-05 11:23:45', 1, 1, 1, '2025', 1, 1, 14, '9780857197689', -20),
	(42, 'Fourth Wing', 'Rebecca Yarros', 'Enter the brutal and elite world of Basgiath War College, where only the strongest survive â and where twenty-year-old Violet Sorrengail is forced to train as a dragon rider or die trying. Packed with danger, romance, and high-stakes battles, "Fourth Wing" is the beginning of an epic fantasy series.', 22.99, '2025-08-05 21:46:28', 5, 1, 1, '2023', 4, 2, 14, '9780857197689', 10),
	(43, 'The Psychology of Money', 'Morgan Housel', 'The Psychology of Money offers timeless lessons on wealth, greed, and happiness. Morgan Housel shares 19 short stories exploring how people think about money and how behavior often outweighs knowledge when it comes to financial decisions. ', 20, '2025-08-07 17:48:56', 2, 1, 1, '2025', 1, 5, 14, '9780857197689', -3),
	(45, 'Loki: Where Mischief Lies', 'Mackenzi Lee', 'Before he became the god of mischief, Loki was just a young Asgardian searching for purpose. Loki: Where Mischief Lies tells the untold story of Loki\'s formative yearsâhis struggles with identity, power, and fate. Set in 19th-century London and Asgard, this thrilling tale dives deep into Lokiâs complex personality and the journey that sets him on the path to becoming one of Marvel\'s most iconic characters.', 17, '2025-08-07 17:56:03', 1, 6, 1, '2019', 2, 5, 14, '9781368022262', 11),
	(59, 'A10', 'Kai-Fu Lee & Chen Qiufan', 'A visionary blend of science fiction and fact, AI 2041 explores how artificial intelligence could transform our world over the next two decades. Through ten futuristic stories paired with in-depth analyses, the authors reveal both the promise and the challenges of the AI revolution, touching on ethics, economics, and humanity\'s role in a rapidly evolving tech landscape.', 24, '2025-08-11 13:16:40', 5, 2, 1, '2023', 2, 1, 16, '97805932382953', 27),
	(61, 'New Book', 'Kai-Fu Lee & Chen Qiufan', 'Somehting', 20, '2025-08-15 14:23:05', 1, 2, 1, '2025', 1, 1, 14, '97805932382953', 10);

-- Dumping structure for table booksy.cart
CREATE TABLE IF NOT EXISTS `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `qty` int NOT NULL,
  `user_id` int NOT NULL,
  `books_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cart_user1_idx` (`user_id`),
  KEY `fk_cart_books1_idx` (`books_id`),
  CONSTRAINT `fk_cart_books1` FOREIGN KEY (`books_id`) REFERENCES `books` (`id`),
  CONSTRAINT `fk_cart_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table booksy.cart: ~6 rows (approximately)
INSERT INTO `cart` (`id`, `qty`, `user_id`, `books_id`) VALUES
	(6, 2, 15, 40),
	(7, 1, 15, 42),
	(8, 2, 15, 39),
	(38, 2, 17, 42),
	(39, 2, 17, 32),
	(40, 1, 17, 33);

-- Dumping structure for table booksy.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table booksy.categories: ~9 rows (approximately)
INSERT INTO `categories` (`id`, `type`) VALUES
	(1, 'Fiction'),
	(2, 'Non-Fiction'),
	(3, 'Science & Technology'),
	(4, 'Children'),
	(5, 'Biography'),
	(6, 'Education'),
	(7, 'Self-Help'),
	(8, 'Fantasy'),
	(9, 'History');

-- Dumping structure for table booksy.city
CREATE TABLE IF NOT EXISTS `city` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table booksy.city: ~2 rows (approximately)
INSERT INTO `city` (`id`, `name`) VALUES
	(1, 'Badulla'),
	(2, 'Kandy');

-- Dumping structure for table booksy.format
CREATE TABLE IF NOT EXISTS `format` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table booksy.format: ~5 rows (approximately)
INSERT INTO `format` (`id`, `name`) VALUES
	(1, 'PDF'),
	(2, 'EPUB'),
	(3, 'MOBI'),
	(4, 'MP3'),
	(5, 'Printed Copy');

-- Dumping structure for table booksy.language
CREATE TABLE IF NOT EXISTS `language` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table booksy.language: ~8 rows (approximately)
INSERT INTO `language` (`id`, `name`) VALUES
	(1, 'English'),
	(2, 'Tamil'),
	(3, 'Sinhala'),
	(4, 'Hindi'),
	(5, 'French'),
	(6, 'German'),
	(7, 'Spanish'),
	(8, 'Arabic');

-- Dumping structure for table booksy.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `user_id` int NOT NULL,
  `address_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_user1_idx` (`user_id`),
  KEY `fk_order_address1_idx` (`address_id`),
  CONSTRAINT `fk_order_address1` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`),
  CONSTRAINT `fk_order_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table booksy.orders: ~15 rows (approximately)
INSERT INTO `orders` (`id`, `created_at`, `user_id`, `address_id`) VALUES
	(1, '2025-08-12 00:08:11', 16, 16),
	(2, '2025-08-12 00:12:28', 16, 16),
	(3, '2025-08-12 00:20:09', 16, 16),
	(4, '2025-08-12 00:23:05', 16, 16),
	(5, '2025-08-12 00:29:09', 16, 16),
	(6, '2025-08-12 00:44:40', 16, 16),
	(16, '2025-08-12 01:02:08', 16, 16),
	(17, '2025-08-12 01:15:00', 16, 16),
	(18, '2025-08-12 22:53:59', 16, 16),
	(19, '2025-08-14 12:57:30', 13, 17),
	(22, '2025-08-14 13:00:05', 13, 20),
	(23, '2025-08-14 15:02:46', 14, 2),
	(24, '2025-08-14 15:04:44', 14, 2),
	(25, '2025-08-15 14:18:12', 14, 2),
	(26, '2025-08-15 14:18:39', 14, 2);

-- Dumping structure for table booksy.order_item
CREATE TABLE IF NOT EXISTS `order_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `qty` int NOT NULL,
  `books_id` int NOT NULL,
  `order_id` int NOT NULL,
  `order_status_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_item_books1_idx` (`books_id`),
  KEY `fk_order_item_order1_idx` (`order_id`),
  KEY `fk_order_item_order_status1_idx` (`order_status_id`),
  CONSTRAINT `fk_order_item_books1` FOREIGN KEY (`books_id`) REFERENCES `books` (`id`),
  CONSTRAINT `fk_order_item_order1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_order_item_order_status1` FOREIGN KEY (`order_status_id`) REFERENCES `order_status` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table booksy.order_item: ~34 rows (approximately)
INSERT INTO `order_item` (`id`, `qty`, `books_id`, `order_id`, `order_status_id`) VALUES
	(1, 5, 31, 1, 4),
	(2, 1, 39, 1, 1),
	(3, 2, 59, 2, 2),
	(4, 1, 45, 2, 5),
	(5, 1, 59, 3, 2),
	(6, 2, 45, 3, 5),
	(7, 1, 43, 3, 5),
	(8, 1, 59, 4, 5),
	(9, 1, 42, 4, 5),
	(10, 2, 41, 4, 3),
	(11, 1, 59, 5, 5),
	(12, 2, 45, 5, 5),
	(13, 1, 43, 6, 5),
	(14, 1, 42, 6, 5),
	(15, 2, 41, 6, 5),
	(16, 1, 42, 16, 5),
	(17, 1, 41, 16, 5),
	(18, 1, 45, 16, 5),
	(19, 1, 59, 16, 5),
	(20, 1, 45, 17, 5),
	(21, 1, 43, 17, 5),
	(22, 2, 59, 17, 5),
	(23, 1, 45, 18, 5),
	(24, 1, 35, 18, 5),
	(25, 2, 36, 18, 5),
	(26, 4, 31, 19, 5),
	(27, 2, 41, 22, 5),
	(28, 6, 45, 22, 5),
	(29, 5, 43, 23, 5),
	(30, 5, 42, 23, 5),
	(31, 68, 41, 23, 5),
	(32, 12, 42, 24, 5),
	(33, 1, 35, 25, 5),
	(34, 4, 35, 26, 5);

-- Dumping structure for table booksy.order_status
CREATE TABLE IF NOT EXISTS `order_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table booksy.order_status: ~4 rows (approximately)
INSERT INTO `order_status` (`id`, `type`) VALUES
	(1, 'Paid'),
	(2, 'Processing'),
	(3, 'Shipped'),
	(4, 'Delivered'),
	(5, 'Pending');

-- Dumping structure for table booksy.status
CREATE TABLE IF NOT EXISTS `status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table booksy.status: ~5 rows (approximately)
INSERT INTO `status` (`id`, `name`) VALUES
	(1, 'Available (New)'),
	(2, 'Available (Old)'),
	(3, 'Out of Stock'),
	(4, 'Pre-order'),
	(5, 'Discontinued');

-- Dumping structure for table booksy.type
CREATE TABLE IF NOT EXISTS `type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table booksy.type: ~4 rows (approximately)
INSERT INTO `type` (`id`, `name`) VALUES
	(1, 'Paperback'),
	(2, 'Hardcover'),
	(3, 'eBook'),
	(4, 'Audiobook');

-- Dumping structure for table booksy.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `mobile` varchar(10) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(20) NOT NULL,
  `verification` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table booksy.user: ~5 rows (approximately)
INSERT INTO `user` (`id`, `first_name`, `last_name`, `mobile`, `email`, `password`, `verification`, `created_at`) VALUES
	(13, 'Dinesh', 'Karthik', '0784547554', 'loki@gmail.com', 'Loki@12Ggh', 'Verified', '2025-08-14 12:50:02'),
	(14, 'RizlaN', 'Ahmedd', '0784342391', 'rizlan454@gmail.com', 'VyU@lka)_kS3', 'Verified', '2025-07-27 21:34:08'),
	(15, 'Rizlan', 'dasd', '0784545412', 'rockybe4545@gmail.com', 'Riz@lka)_kS3SS', 'Verified', '2025-07-27 21:45:21'),
	(16, 'Rizlan', 'Kanagaraj', '0784545452', 'thzjd4545@gmail.com', 'Rizlan@Yhus+9', 'Verified', '2025-08-11 11:53:03'),
	(17, 'Rizlan', 'Ahmed', '0784545456', 'rizlan4545@gmail.com', 'RizlU87"#S', 'Verified', '2025-08-15 14:12:03');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
