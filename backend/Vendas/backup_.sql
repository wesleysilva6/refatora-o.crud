-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: crud_login
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `crud_login`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `crud_login` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `crud_login`;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcionarios`
--

DROP TABLE IF EXISTS `funcionarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionarios` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cargo` enum('Vendedor','Estoquista','Gerente') COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `salario` decimal(10,2) NOT NULL,
  `status` enum('ativo','inativo','ferias') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ativo',
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_admissao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_demissao` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `funcionarios_email_unique` (`email`),
  UNIQUE KEY `funcionarios_telefone_unique` (`telefone`),
  KEY `funcionarios_nome_cargo_index` (`nome`,`cargo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionarios`
--

LOCK TABLES `funcionarios` WRITE;
/*!40000 ALTER TABLE `funcionarios` DISABLE KEYS */;
INSERT INTO `funcionarios` VALUES (1,'Funcionário Gerente','Gerente','funcionario.gerente@estoque.com','44 99742-2772',4599.90,'ativo','avatars/user.png','2025-10-01 10:36:37',NULL),(2,'Funcionário Vendedor','Vendedor','funcionario.vendedor@estoque.com','11 94543-9688',3499.90,'ativo','avatars/user.png','2025-10-01 10:37:10',NULL),(3,'Funcionário Estoquista','Estoquista','funcionario.estoquista@estoque.com','44 99231-3164',2599.90,'ativo','avatars/user.png','2025-10-01 10:37:56',NULL),(4,'Funcionário Teste','Estoquista','funcionario.teste@estoque.com','11 94543-9687',2300.02,'inativo','avatars/user.png','2025-10-01 11:55:58',NULL),(5,'Wesley','Estoquista','wesley.estoquista@estoque.com','44 93832-3281',1200.00,'inativo','avatars-func/7EwAgcpjukcjzPb3qT7fLZ8aSDbzVSnAsMoMGKyK.png','2025-10-02 09:05:10',NULL),(6,'Wesley Vendedor','Vendedor','wesley2.vendedor@gmail.com','44 93782-3743',4300.99,'ativo','avatars-func/XukCMi4qfl4pqjh5pQ4tHvOQVb21OlaUA0MTqyPu.png','2025-10-03 12:20:36',NULL),(7,'Funcionario Dinh','Estoquista','funcio332nario.gerente@estoque.com','44 99742-2775',45000.00,'ativo','avatars/user.png','2025-10-07 08:53:53',NULL),(8,'wewwqe','Estoquista','werqwer@werw','832402 2332',480000.00,'ativo','avatars/user.png','2025-10-07 08:58:21',NULL),(9,'Luan Teste','Gerente','luan.teste@gmai.com','44 98234-4783',1518.00,'ativo','avatars/user.png','2025-10-09 09:25:27',NULL),(10,'teste','Vendedor','teste22@gmail.com','44 83273-2673',2500.00,'ferias','avatars-func/ET5cmCpsTW50W0mNiX9w0lcN4bF9TSepDmIDsuF5.png','2025-10-10 08:22:16',NULL);
/*!40000 ALTER TABLE `funcionarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itens_venda`
--

DROP TABLE IF EXISTS `itens_venda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itens_venda` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `venda_id` bigint unsigned NOT NULL,
  `produto_id` bigint unsigned NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `quantidade` int unsigned NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `itens_venda_venda_id_index` (`venda_id`),
  KEY `itens_venda_produto_id_index` (`produto_id`),
  CONSTRAINT `itens_venda_produto_id_foreign` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `itens_venda_venda_id_foreign` FOREIGN KEY (`venda_id`) REFERENCES `vendas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itens_venda`
--

LOCK TABLES `itens_venda` WRITE;
/*!40000 ALTER TABLE `itens_venda` DISABLE KEYS */;
INSERT INTO `itens_venda` VALUES (18,17,45,255.00,3,765.00);
/*!40000 ALTER TABLE `itens_venda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000001_create_cache_table',1),(2,'0001_01_01_000002_create_jobs_table',1),(3,'2025_09_04_150456_create_personal_access_tokens_table',1),(4,'2025_09_12_125818_create_usuarios_table',1),(5,'2025_09_12_125819_create_topicos_table',1),(6,'2025_09_12_125820_create_produtos_table',1),(7,'2025_09_12_125821_create_password_reset_tokens_table',1),(8,'2025_09_16_125822_alter_foto_default_on_usuarios',1),(9,'2025_09_19_112540_create_simulacoes_table',1),(10,'2025_09_19_112541_create_simulacao_itens_table',1),(11,'2025_09_25_112542_create_funcionarios_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_reset_tokens_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES ('wesley.wagner@gazin.com.br','f76c6a6461db5a3affa73b602c20d805c1fbecf5bc8c73633bc73c11877f39a6','2025-10-13 12:03:50');
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\Usuario',2,'auth_token','3a1f529773efd37cb500b5fd0b1c5bb0cdb460fd067180d724306ac38e803b39','[\"*\"]','2025-09-26 14:27:18',NULL,'2025-09-26 14:26:41','2025-09-26 14:27:18'),(2,'App\\Models\\Usuario',2,'auth_token','85394bbc748f832d32c3ec5b7fba0412f5c4729fc11fc752078efbdc1359da14','[\"*\"]','2025-09-29 12:20:11',NULL,'2025-09-26 14:28:46','2025-09-29 12:20:11'),(3,'App\\Models\\Usuario',2,'auth_token','19b82f0df33d76d69b4e76215e34d91c49ccb6b22b47a872839bf7913a8dba68','[\"*\"]','2025-09-29 12:39:17',NULL,'2025-09-29 12:38:55','2025-09-29 12:39:17'),(4,'App\\Models\\Usuario',2,'auth_token','db1b4a90841b9b78f5770f2d06676ee5e97ea58586f4d4efb93ae51926abf27d','[\"*\"]','2025-09-29 12:39:24',NULL,'2025-09-29 12:39:22','2025-09-29 12:39:24'),(5,'App\\Models\\Usuario',3,'auth_token','9014bcfb5a68c4e1974e7db1b1ddec267450e8efa6f839979b093fb178d2a444','[\"*\"]','2025-09-29 14:56:52',NULL,'2025-09-29 12:40:32','2025-09-29 14:56:52'),(6,'App\\Models\\Usuario',2,'auth_token','a05e242964d71e14740d21eb80c09f631f95272bc9e9847c6ce898beea878a28','[\"*\"]','2025-09-30 12:22:41',NULL,'2025-09-30 11:31:44','2025-09-30 12:22:41'),(7,'App\\Models\\Usuario',2,'auth_token','9c41723e4dd6300531e675d7d1f9426d28e1326a23f2eb557e9d56b6d7699e87','[\"*\"]','2025-09-30 14:47:14',NULL,'2025-09-30 12:31:45','2025-09-30 14:47:14'),(8,'App\\Models\\Usuario',2,'auth_token','38bcfda6a23ee7d211dce8e9fbaa500354d124af65333e74ae659f04f0433a8d','[\"*\"]','2025-10-01 13:11:17',NULL,'2025-10-01 11:22:48','2025-10-01 13:11:17'),(9,'App\\Models\\Usuario',2,'auth_token','53c4053c39e3ea3059b23f40842c8bcb14eb4814abc4caa5619184b62605b1d8','[\"*\"]','2025-10-01 14:13:44',NULL,'2025-10-01 13:11:34','2025-10-01 14:13:44'),(10,'App\\Models\\Usuario',2,'auth_token','28a38504386a2bd7d9924b57a9dfe969d680a70f8f0679a829a4622d9bffda17','[\"*\"]','2025-10-01 15:09:24',NULL,'2025-10-01 14:14:36','2025-10-01 15:09:24'),(11,'App\\Models\\Usuario',2,'auth_token','55b6f2bd54b9797d55dfd2ebe7f7f6cea6177deb90503efbed5cacdd9b11d1ae','[\"*\"]','2025-10-01 15:11:45',NULL,'2025-10-01 15:11:13','2025-10-01 15:11:45'),(12,'App\\Models\\Usuario',2,'auth_token','b3c40978d5833446be3cea26e232d772f119dc2cd2f667972b11fd99ebff9f3d','[\"*\"]','2025-10-01 15:18:59',NULL,'2025-10-01 15:12:10','2025-10-01 15:18:59'),(13,'App\\Models\\Usuario',2,'auth_token','0760b2a4851072de84cf9311e34d9695f509622bfa543422d5027f58b52c318e','[\"*\"]','2025-10-02 11:22:54',NULL,'2025-10-02 11:18:24','2025-10-02 11:22:54'),(14,'App\\Models\\Usuario',2,'auth_token','7359e23b7880fd0f1b8eae51ba54ed145bd128c02e7ea33a539629dcb3e62967','[\"*\"]','2025-10-02 11:30:37',NULL,'2025-10-02 11:23:43','2025-10-02 11:30:37'),(15,'App\\Models\\Usuario',2,'auth_token','36e6f1ce81b511705e983da59dc80ee2680029c3d0c027a612975ce281102087','[\"*\"]','2025-10-02 15:30:05',NULL,'2025-10-02 11:30:56','2025-10-02 15:30:05'),(16,'App\\Models\\Usuario',2,'auth_token','4f47d4744cf13a7775da9f5b19c9aab008ae3a16a3c8fdc5178b901a9861a602','[\"*\"]','2025-10-03 13:57:56',NULL,'2025-10-03 11:18:01','2025-10-03 13:57:56'),(17,'App\\Models\\Usuario',2,'auth_token','bf3dcd15d2b043d1a6259a81339af45437aeb1ece0aee3ab831b30c4754cbe2a','[\"*\"]','2025-10-03 15:22:45',NULL,'2025-10-03 13:58:16','2025-10-03 15:22:45'),(18,'App\\Models\\Usuario',2,'auth_token','bfa559c8b81111e98add572f2a9cab67f7b63e05559910628a79019f1dc7f353','[\"*\"]','2025-10-06 15:43:06',NULL,'2025-10-06 11:29:55','2025-10-06 15:43:06'),(19,'App\\Models\\Usuario',2,'auth_token','01b814b02343112d1d8b888fdf7f49bd04d1c34d9f46a00bbf7bc487122ea5f4','[\"*\"]','2025-10-07 11:33:20',NULL,'2025-10-07 11:12:13','2025-10-07 11:33:20'),(20,'App\\Models\\Usuario',2,'auth_token','c443ed23c431e6c8fcf4997874b9c6a413d94be5d63c7a588894626624f5fb7a','[\"*\"]','2025-10-07 11:37:56',NULL,'2025-10-07 11:37:53','2025-10-07 11:37:56'),(21,'App\\Models\\Usuario',2,'auth_token','b1a47cd120e4d3a8651798c5c84e9a1a9526ffe70308d751e53d3e2163ce61c1','[\"*\"]','2025-10-07 11:40:45',NULL,'2025-10-07 11:39:20','2025-10-07 11:40:45'),(22,'App\\Models\\Usuario',2,'auth_token','1cc0b51fe7d78c991acd2d7702a40acd7888efd4d2bb91b1afb2c1e027da224b','[\"*\"]','2025-10-07 12:01:15',NULL,'2025-10-07 11:43:05','2025-10-07 12:01:15'),(23,'App\\Models\\Usuario',2,'auth_token','df465b282df6c93d35e9e01df353358b231ca166715207fc0418d6b11db39fb8','[\"*\"]','2025-10-07 14:31:27',NULL,'2025-10-07 12:44:09','2025-10-07 14:31:27'),(24,'App\\Models\\Usuario',2,'auth_token','13d53d795d1ea8cd5561fe6b04979f5f6000fc683549c508f0cb8f9ad61e1f5f','[\"*\"]','2025-10-07 15:08:15',NULL,'2025-10-07 14:31:21','2025-10-07 15:08:15'),(25,'App\\Models\\Usuario',2,'auth_token','2ac011de20dbbac075975fd5a3b167b87e4fb4f1434db295b91f73b1f8d5f98d','[\"*\"]','2025-10-08 13:08:09',NULL,'2025-10-08 11:17:58','2025-10-08 13:08:09'),(26,'App\\Models\\Usuario',2,'auth_token','b5aa0de59e78fd8c646faed667c249da9fa7d7f77ce85d8d27a9bb0e5c2dab9a','[\"*\"]','2025-10-08 13:28:37',NULL,'2025-10-08 13:15:11','2025-10-08 13:28:37'),(27,'App\\Models\\Usuario',2,'auth_token','fcafe12d264f97d9762912d1c8c97546a6da1d2ac23eea84d25786774c595708','[\"*\"]','2025-10-08 14:57:24',NULL,'2025-10-08 13:28:42','2025-10-08 14:57:24'),(28,'App\\Models\\Usuario',2,'auth_token','be4aa9ea6705d506d40c3bdeba4f50a2bbfe543ba250228ee62e7ef4e42d07da','[\"*\"]','2025-10-09 11:36:17',NULL,'2025-10-09 11:35:17','2025-10-09 11:36:17'),(29,'App\\Models\\Usuario',2,'auth_token','30283c5440b6fc85d915aebc52693f293482ea5dc781d6aab9f7a8b30158bc45','[\"*\"]','2025-10-09 13:44:16',NULL,'2025-10-09 11:37:39','2025-10-09 13:44:16'),(30,'App\\Models\\Usuario',2,'auth_token','e76ca0e210041b241854abf1de6c3378b694b2978de09322c5a29dc41025e9bb','[\"*\"]','2025-10-09 14:31:44',NULL,'2025-10-09 13:48:07','2025-10-09 14:31:44'),(31,'App\\Models\\Usuario',4,'auth_token','5132021b79ced49fae634d031590db6d0fe19be441d8ff137d423478c0b4b784','[\"*\"]','2025-10-09 14:45:02',NULL,'2025-10-09 14:41:57','2025-10-09 14:45:02'),(32,'App\\Models\\Usuario',2,'auth_token','b4814dd9abbe6ecbeff27796451b26f5c65af62cfafe3403fc56a9fb1ea91976','[\"*\"]','2025-10-09 14:46:07',NULL,'2025-10-09 14:45:14','2025-10-09 14:46:07'),(33,'App\\Models\\Usuario',2,'auth_token','9dc4fae0a9b709a93b3b4fc5e71d39022eb3f88c3d9660917bb9e91d6ce5d79d','[\"*\"]','2025-10-09 15:48:50',NULL,'2025-10-09 14:50:28','2025-10-09 15:48:50'),(34,'App\\Models\\Usuario',2,'auth_token','8159ffb4afbd4345885d2ad0b3620f6d5ad060c7a456a15e022780ac62ab365c','[\"*\"]','2025-10-10 14:52:42',NULL,'2025-10-10 11:15:28','2025-10-10 14:52:42'),(35,'App\\Models\\Usuario',2,'auth_token','73fb757b766738e5d035f799cc9646b5cc5ebee6d0ea903a92913c3195160e75','[\"*\"]','2025-10-13 13:23:02',NULL,'2025-10-13 12:05:08','2025-10-13 13:23:02'),(36,'App\\Models\\Usuario',6,'auth_token','43eed23d742602e7a9a490bbe7f442e4ba9309aefbd7bd81ab261432406dab15','[\"*\"]','2025-10-13 13:49:33',NULL,'2025-10-13 13:24:17','2025-10-13 13:49:33'),(37,'App\\Models\\Usuario',2,'auth_token','338101ef51ce932408d49fd5bfc32ee42a6f1d8e24aad8338f40c2874a8dd8b2','[\"*\"]','2025-10-13 13:52:30',NULL,'2025-10-13 13:50:48','2025-10-13 13:52:30');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `topico_id` bigint unsigned NOT NULL,
  `usuario_id` bigint unsigned NOT NULL,
  `nome_produto` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `quantidade` int NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `imagem` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `produtos_usuario_id_foreign` (`usuario_id`),
  KEY `produtos_topico_id_usuario_id_index` (`topico_id`,`usuario_id`),
  CONSTRAINT `produtos_topico_id_foreign` FOREIGN KEY (`topico_id`) REFERENCES `topicos` (`id_topico`) ON DELETE CASCADE,
  CONSTRAINT `produtos_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (45,9,2,'Mouse Logitech P34',255.00,7,'Mouse Gamer RGB','produtos/WCJ4evnMiK5STh8wf2JBNZ2H28CXJe9Dm34b9SxP.jpg','2025-10-13 12:06:13','2025-10-13 12:31:23'),(46,9,2,'iPhone 17 Pro Max',4300.00,23,'256GB DE ARMAZENAMENTO','produtos/UGNi5ohSRxXMhjQlmU6Irw4WE10kjnhrpCoWpFW1.jpg','2025-10-13 12:20:50','2025-10-13 12:26:56'),(47,10,2,'Teclado Mecânico',189.99,78,'Teclado 65% RGB, sem fio','produtos/Sur0qksH0W92LcvpInb89g6VODWp1YFZg3Y1L7kk.png','2025-10-13 13:15:39','2025-10-13 13:15:39');
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `simulacao_itens`
--

DROP TABLE IF EXISTS `simulacao_itens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `simulacao_itens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `simulacao_id` bigint unsigned NOT NULL,
  `produto_id` bigint unsigned NOT NULL,
  `nome_produto` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantidade` int NOT NULL,
  `preco` decimal(12,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `simulacao_itens_produto_id_foreign` (`produto_id`),
  KEY `simulacao_itens_simulacao_id_index` (`simulacao_id`),
  CONSTRAINT `simulacao_itens_produto_id_foreign` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`),
  CONSTRAINT `simulacao_itens_simulacao_id_foreign` FOREIGN KEY (`simulacao_id`) REFERENCES `simulacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `simulacao_itens`
--

LOCK TABLES `simulacao_itens` WRITE;
/*!40000 ALTER TABLE `simulacao_itens` DISABLE KEYS */;
/*!40000 ALTER TABLE `simulacao_itens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `simulacoes`
--

DROP TABLE IF EXISTS `simulacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `simulacoes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned NOT NULL,
  `cliente` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` enum('aberta','finalizada','cancelada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'finalizada',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `simulacoes_usuario_id_status_index` (`usuario_id`,`status`),
  CONSTRAINT `simulacoes_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `simulacoes`
--

LOCK TABLES `simulacoes` WRITE;
/*!40000 ALTER TABLE `simulacoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `simulacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topicos`
--

DROP TABLE IF EXISTS `topicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topicos` (
  `id_topico` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nome_topico` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_id` bigint unsigned NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_topico`),
  KEY `topicos_usuario_id_index` (`usuario_id`),
  CONSTRAINT `topicos_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topicos`
--

LOCK TABLES `topicos` WRITE;
/*!40000 ALTER TABLE `topicos` DISABLE KEYS */;
INSERT INTO `topicos` VALUES (9,'Tópico Teste',2,'2025-10-13 12:05:42','2025-10-13 12:05:42'),(10,'Eletrônicos',2,'2025-10-13 13:10:05','2025-10-13 13:10:05');
/*!40000 ALTER TABLE `topicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'avatars/user.png',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuarios_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'rerqwejr','jrbwqrwer1q@BSEKLF','$2y$12$oP4IOHYjGSnjv2QoeVpogOYoyd5qcRMu6obnyc6JvBhK/9RagX3vO','avatars/user.png',NULL,NULL),(2,'wesley.wagner','wesley.wagner@gazin.com.br','$2y$12$k1/w87IzwTAK/SJ3zmrMbe7SDwng.cyd4Vr8n1aPUwCtl5CtqKxwC','avatars/aYo41E5yG24opR1ZeN28tDy60zcQALRUPgaFYLQI.jpg',NULL,NULL),(3,'Teste','teste@gmail.com','$2y$12$U/DPgRqyVEenJK0IZd.kLOhbjilVZpd/bWviDZ6Sd3vzC24Ep3MGC','avatars/user.png',NULL,NULL),(4,'Luan','luan@gmail.com','$2y$12$ULAclHtRmK59Y1vCVMfUYujOTl0d88WGqh97nPznqe2hPov20XOz2','avatars/user.png',NULL,NULL),(5,'cadastro','cadastro@gmail.com','$2y$12$j1/jK1HVp0H95Gi83OMineh8/Uqd42rgaygZVmy.EyO5tr3fhFLFa','avatars/user.png',NULL,NULL),(6,'Testando','testando@teste.com','$2y$12$AykuSFwt9mvW/gXbbGYcZOXkAwgXHqCkHYtY3ESuln/gTqANPPIhC','avatars/user.png',NULL,NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendas`
--

DROP TABLE IF EXISTS `vendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cliente` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `funcionario_id` bigint unsigned NOT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `realizada_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `vendas_funcionario_id_index` (`funcionario_id`),
  CONSTRAINT `vendas_funcionario_id_foreign` FOREIGN KEY (`funcionario_id`) REFERENCES `funcionarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendas`
--

LOCK TABLES `vendas` WRITE;
/*!40000 ALTER TABLE `vendas` DISABLE KEYS */;
INSERT INTO `vendas` VALUES (1,'Wesley','21 99374-2374',6,12.00,'2025-10-06 15:21:35'),(2,'Wesley','21 99732-3271',6,484.00,'2025-10-06 15:26:38'),(3,'Cliente Teste','21 99374-2374',6,36.00,'2025-10-06 15:42:29'),(4,'Testamento',NULL,6,12.00,'2025-10-07 11:14:40'),(5,'Nunes','31 93843-3291',6,12.00,'2025-10-07 13:02:08'),(6,'Silva','55 92831-3198',6,4699.99,'2025-10-07 13:10:27'),(7,'Dudo','67 98129-8931',6,21.00,'2025-10-07 13:28:24'),(8,'Testando','21 99782-3271',6,21.00,'2025-10-07 13:29:31'),(9,'wewq','21 99732-3276',6,21.00,'2025-10-07 13:29:50'),(10,'João','44 98438-9321',6,21.00,'2025-10-08 13:17:46'),(11,'Gustavo','44 98233-3297',2,21.00,'2025-10-08 13:19:26'),(12,'Luan','44 93287-9802',2,63.00,'2025-10-08 14:51:41'),(13,'Lucas','44 93274-1272',2,63.00,'2025-10-08 14:52:35'),(14,'Cliente Refrigerante',NULL,2,206.00,'2025-10-09 12:16:44'),(15,'Tom',NULL,6,40.00,'2025-10-09 12:18:45'),(16,'Wesley','44 99823-2362',2,330.00,'2025-10-10 11:19:48'),(17,'Venda Teste','11 89423-7432',2,765.00,'2025-10-13 12:07:19');
/*!40000 ALTER TABLE `vendas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-13 11:02:00
