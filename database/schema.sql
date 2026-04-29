DROP DATABASE IF EXISTS `e_commerce`;
CREATE DATABASE IF NOT EXISTS `e_commerce`;
USE `e_commerce`;

CREATE TABLE `products` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(10,2) NOT NULL,
    `image_url` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `categories` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    `email` VARCHAR(255) UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `guests` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL,
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

CREATE TABLE `cart_items` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY `cartItems_idfk` (`user_id`) REFERENCES users (`id`),
    FOREIGN KEY `cartItems_idfk2` (`product_id`) REFERENCES products (`id`),
    UNIQUE (`user_id`, `product_id`)
);

CREATE TABLE `addresses` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `type` ENUM('BILLING', 'SHIPPING') NOT NULL,
    `salutation` ENUM('MR', 'MS') NOT NULL,
    `forename` VARCHAR(255) NOT NULL,
    `surname` VARCHAR(255) NOT NULL,
    `street` VARCHAR(255) NOT NULL,
    `house_number` VARCHAR(20) NOT NULL,
    `zip_code` VARCHAR(20) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `country` ENUM('DE', 'AT', 'CH'),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY `addresses_idfk` (`user_id`) REFERENCES users (`id`)
);

CREATE TABLE `orders` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT NULL,
    `guest_id` INT NULL,
    `access_token_hash` VARCHAR(255) NULL,
    `status` ENUM('PENDING','PAID','SHIPPED','DELIVERED','CANCELLED'),
    `total_price` DECIMAL(10,2) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY `orders_idfk` (`user_id`) REFERENCES users (`id`),
    FOREIGN KEY `orders_idfk_2` (`guest_id`) REFERENCES guests (`id`),
    CHECK (
        (user_id IS NOT NULL AND guest_id IS NULL AND access_token_hash IS NULL)
        OR
        (user_id IS NULL AND guest_id IS NOT NULL AND access_token_hash IS NOT NULL)
    )
);

CREATE TABLE `order_items` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `order_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL CHECK ( `quantity` > 0 ),
    `price` DECIMAL(10,2) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY `orderItems_idfk` (`product_id`) REFERENCES products (`id`),
    FOREIGN KEY `orderItems_idfk2` (`order_id`) REFERENCES orders (`id`),
    UNIQUE (`order_id`, `product_id`)
);

CREATE TABLE `order_addresses` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `order_id` INT NOT NULL UNIQUE,
    `street` VARCHAR(255) NOT NULL,
    `house_number` VARCHAR(20) NOT NULL,
    `zip_code` VARCHAR(20) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `country` ENUM('DE', 'AT', 'CH'),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY `orderAddresses_idfk` (`order_id`) REFERENCES orders (`id`)
);
