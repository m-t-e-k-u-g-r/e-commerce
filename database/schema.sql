CREATE DATABASE IF NOT EXISTS `e_commerce`;
USE `e_commerce`;

CREATE TABLE `products` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(10,2) NOT NULL,
    `image_url` VARCHAR(255),
    `created_at` TIMESTAMP NOT NULL
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