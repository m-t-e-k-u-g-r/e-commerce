DROP DATABASE IF EXISTS `e_commerce`;
CREATE DATABASE IF NOT EXISTS `e_commerce`;
USE `e_commerce`;

CREATE TABLE `products` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(10,2) NOT NULL,
    `image_url` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `categories` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) UNIQUE
);

CREATE TABLE `product_category` (
    `product_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    PRIMARY KEY `product_category_id` (`product_id`, `category_id`),
    FOREIGN KEY `product_category_idfk` (`product_id`) REFERENCES products (`id`),
    FOREIGN KEY `product_category_idfk2` (`category_id`) REFERENCES categories (`id`)
);

CREATE TABLE `users` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `password_hash` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `refresh_tokens` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires_at` TIMESTAMP NOT NULL,
    `revoked` TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY `refresh_tokens_idfk` (`user_id`) REFERENCES users (`id`)
);