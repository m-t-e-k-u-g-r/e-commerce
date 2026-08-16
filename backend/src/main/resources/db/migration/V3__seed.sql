-- Seed database with categories and products
-- Categories
INSERT INTO categories (id, name)
VALUES
    ('019b76da-a800-7dc5-a19f-5daab11e2416', 'Fashion'),
    ('019b76da-a800-743c-8271-a3cbe6123456', 'Shoes'),
    ('019b76da-a800-7248-aee4-df7503a58b1c', 'Accessories'),
    ('019b76da-a800-742e-9642-cad6144729f8', 'Bags'),
    ('019b76da-a800-77a8-8b36-8ec8d6e80301', 'Electronics'),
    ('019b76da-a800-7d03-8600-dac41bd96053', 'Mobile Accessories'),
    ('019b76da-a800-7521-bee4-d5471ff7fa3f', 'Home & Living'),
    ('019b76da-a800-7f38-bf79-d574bc282d5a', 'Beauty'),
    ('019b76da-a800-7ea5-bd37-cc667676448f', 'Office'),
    ('019b76da-a800-7c8f-8699-72a8379fd348', 'Lifestyle');

-- Products
INSERT INTO products (id, name, price, image_id)
VALUES
    ('019b76da-a800-75c7-9f8d-fb3d894941f8', 'Plain Cotton T-Shirt', 24.90, '39qppv39qppv39qp'),
    ('019b76da-a800-7308-a5e1-79e6d7d4e241', 'Minimalist Hoodie', 49.90, 'aczrr7aczrr7aczr'),
    ('019b76da-a800-7715-9167-10dbbac65e7c', 'Modern Sneakers', 89.90, 's9w9zzs9w9zzs9w9'),
    ('019b76da-a800-7796-b287-221389c77118', 'Luxury Wristwatch', 149.90, 'vvgughvvgughvvgu'),
    ('019b76da-a800-7ee9-b95c-e19b935a9786', 'Classic Sunglasses', 39.90, '6990mo6990mo6990'),
    ('019b76da-a800-7fb6-9cec-4e15d160bdc4', 'Premium Perfume', 59.90, 'mc7djfmc7djfmc7d'),
    ('019b76da-a800-7ef9-88e5-61d0da4c27cc', 'Smartphone Case', 19.90, 'eccd08eccd08eccd'),
    ('019b76da-a800-73e1-875a-ef1ddd5aaa76', 'Travel Backpack', 69.90, 'uc2dtluc2dtluc2d'),
    ('019b76da-a800-7f3f-9032-4823df83cf0a', 'Reusable Water Bottle', 14.90, 'q4x3nlq4x3nlq4x3'),
    ('019b76da-a800-7ed0-a8e0-f1ae3aa542d5', 'Scented Candle', 18.90, 'oakmcfoakmcfoakm'),
    ('019b76da-a800-7e41-99d4-a9f87ac3ce56', 'Ceramic Coffee Mug', 12.90, 'g7dqxzg7dqxzg7dq'),
    ('019b76da-a800-76c9-828c-738b62a6966f', 'Laptop Sleeve', 29.90, 'xq0epmxq0epmxq0e'),
    ('019b76da-a800-7935-9bc9-6fd274b10e35', 'Wireless Headphones', 99.90, '98bomb98bomb98bo'),
    ('019b76da-a800-768c-abe7-004e1ded27bf', 'Portable Bluetooth Speaker', 79.90, '3ozy5s3ozy5s3ozy'),
    ('019b76da-a800-71e6-af65-2805a6a121d9', 'Modern Desk Lamp', 44.90, 'bxl0hxbxl0hxbxl0'),
    ('019b76da-a800-73f6-9a56-40c58fffdc71', 'Premium Notebook', 9.90, 'ek1jy1ek1jy1ek1j'),
    ('019b76da-a800-74b7-b103-418ebd3f1bff', 'Leather Wallet', 34.90, 'r12g1wr12g1wr12g'),
    ('019b76da-a800-7551-b411-f7e2cb0cb1b8', 'Silver Ring', 54.90, 'z05hxlz05hxlz05h'),
    ('019b76da-a800-7efb-9801-160bb25b2cf9', 'Skincare Cream Jar', 27.90, 'li85h3li85h3li85'),
    ('019b76da-a800-71f2-b293-34e0c3ac7073', 'Portable Power Bank', 39.90, 'ig78ulig78ulig78'),
    ('019b76da-a800-70d9-9ff2-2925910f29b9', 'Basic Polo Shirt', 29.90, '3m6b63m6b63m6b63'),
    ('019b76da-a800-7f8c-9ffc-33eac4bb5740', 'Travel Duffel Bag', 59.90, 'fjc0ycfjc0ycfjc0'),
    ('019b76da-a800-7482-8566-2a6301206c0a', 'Facial Serum', 24.90, 'xqsxtlxqsxtlxqsx'),
    ('019b76da-a800-764e-9988-17ac7a1ca32d', 'Running Shoes', 94.90, '54wnfvbai2p3gnz5'),
    ('019b76da-a800-7ed1-bf8e-be0dfafa89d3', 'Casual Leather Boots', 119.90, 'mxvpr2igbebqg23j'),
    ('019b76da-a800-7ee8-9aed-57e746c03716', 'Fast Charging Adapter', 24.90, '6dauzz6dauzz6dau'),
    ('019b76da-a800-7216-bdfe-2fd7f3fa116e', 'USB-C Charging Cable', 14.90, '9vrmwt9vrmwt9vrm'),
    ('019b76da-a800-7ed8-be43-7de075f3f145', 'Premium Pen Set', 19.90, 'o5kkefo5kkefo5kk'),
    ('019b76da-a800-7d44-80a7-45dff69ef3e3', 'Desk Organizer', 22.90, 't34k52t34k52t34k'),
    ('019b76da-a800-724a-bdf2-471060018fc6', 'Yoga Mat', 34.90, 'eougm7eougm7eoug'),
    ('019b76da-a800-7842-8840-12d1829b642c', 'Fitness Towel', 16.90, 'l5po6cl5po6cl5po');

-- Product-Category association
INSERT INTO product_category (product_id, category_id)
VALUES
    ('019b76da-a800-75c7-9f8d-fb3d894941f8', '019b76da-a800-7dc5-a19f-5daab11e2416'), -- Plain Cotton T-Shirt -> Fashion
    ('019b76da-a800-7308-a5e1-79e6d7d4e241', '019b76da-a800-7dc5-a19f-5daab11e2416'), -- Minimalist Hoodie -> Fashion
    ('019b76da-a800-7715-9167-10dbbac65e7c', '019b76da-a800-743c-8271-a3cbe6123456'), -- Modern Sneakers -> Shoes
    ('019b76da-a800-7796-b287-221389c77118', '019b76da-a800-7248-aee4-df7503a58b1c'), -- Luxury Wristwatch -> Accessories
    ('019b76da-a800-7ee9-b95c-e19b935a9786', '019b76da-a800-7248-aee4-df7503a58b1c'), -- Classic Sunglasses -> Accessories
    ('019b76da-a800-7fb6-9cec-4e15d160bdc4', '019b76da-a800-7f38-bf79-d574bc282d5a'), -- Premium Perfume -> Beauty
    ('019b76da-a800-7ef9-88e5-61d0da4c27cc', '019b76da-a800-7d03-8600-dac41bd96053'), -- Smartphone Case -> Mobile Accessories
    ('019b76da-a800-73e1-875a-ef1ddd5aaa76', '019b76da-a800-742e-9642-cad6144729f8'), -- Travel Backpack -> Bags
    ('019b76da-a800-7f3f-9032-4823df83cf0a', '019b76da-a800-7c8f-8699-72a8379fd348'), -- Reusable Water Bottle -> Lifestyle
    ('019b76da-a800-7ed0-a8e0-f1ae3aa542d5', '019b76da-a800-7521-bee4-d5471ff7fa3f'), -- Scented Candle -> Home & Living
    ('019b76da-a800-7e41-99d4-a9f87ac3ce56', '019b76da-a800-7521-bee4-d5471ff7fa3f'), -- Ceramic Coffee Mug -> Home & Living
    ('019b76da-a800-76c9-828c-738b62a6966f', '019b76da-a800-742e-9642-cad6144729f8'), -- Laptop Sleeve -> Bags
    ('019b76da-a800-7935-9bc9-6fd274b10e35', '019b76da-a800-77a8-8b36-8ec8d6e80301'), -- Wireless Headphones -> Electronics
    ('019b76da-a800-768c-abe7-004e1ded27bf', '019b76da-a800-77a8-8b36-8ec8d6e80301'), -- Portable Bluetooth Speaker -> Electronics
    ('019b76da-a800-71e6-af65-2805a6a121d9', '019b76da-a800-7521-bee4-d5471ff7fa3f'), -- Modern Desk Lamp -> Home & Living
    ('019b76da-a800-73f6-9a56-40c58fffdc71', '019b76da-a800-7ea5-bd37-cc667676448f'), -- Premium Notebook -> Office
    ('019b76da-a800-74b7-b103-418ebd3f1bff', '019b76da-a800-7248-aee4-df7503a58b1c'), -- Leather Wallet -> Accessories
    ('019b76da-a800-7551-b411-f7e2cb0cb1b8', '019b76da-a800-7248-aee4-df7503a58b1c'), -- Silver Ring -> Accessories
    ('019b76da-a800-7efb-9801-160bb25b2cf9', '019b76da-a800-7f38-bf79-d574bc282d5a'), -- Skincare Cream Jar -> Beauty
    ('019b76da-a800-71f2-b293-34e0c3ac7073', '019b76da-a800-77a8-8b36-8ec8d6e80301'), -- Portable Power Bank -> Electronics
    ('019b76da-a800-70d9-9ff2-2925910f29b9', '019b76da-a800-7dc5-a19f-5daab11e2416'), -- Basic Polo Shirt -> Fashion
    ('019b76da-a800-7f8c-9ffc-33eac4bb5740', '019b76da-a800-742e-9642-cad6144729f8'), -- Travel Duffel Bag -> Bags
    ('019b76da-a800-7482-8566-2a6301206c0a', '019b76da-a800-7f38-bf79-d574bc282d5a'), -- Facial Serum -> Beauty
    ('019b76da-a800-764e-9988-17ac7a1ca32d', '019b76da-a800-743c-8271-a3cbe6123456'), -- Running Shoes -> Shoes
    ('019b76da-a800-7ed1-bf8e-be0dfafa89d3', '019b76da-a800-743c-8271-a3cbe6123456'), -- Casual Leather Boots -> Shoes
    ('019b76da-a800-7ee8-9aed-57e746c03716', '019b76da-a800-7d03-8600-dac41bd96053'), -- Fast Charging Adapter -> Mobile Accessories
    ('019b76da-a800-7216-bdfe-2fd7f3fa116e', '019b76da-a800-7d03-8600-dac41bd96053'), -- USB-C Charging Cable -> Mobile Accessories
    ('019b76da-a800-7ed8-be43-7de075f3f145', '019b76da-a800-7ea5-bd37-cc667676448f'), -- Premium Pen Set -> Office
    ('019b76da-a800-7d44-80a7-45dff69ef3e3', '019b76da-a800-7ea5-bd37-cc667676448f'), -- Desk Organizer -> Office
    ('019b76da-a800-724a-bdf2-471060018fc6', '019b76da-a800-7c8f-8699-72a8379fd348'), -- Yoga Mat -> Lifestyle
    ('019b76da-a800-7842-8840-12d1829b642c', '019b76da-a800-7c8f-8699-72a8379fd348'); -- Fitness Towel -> Lifestyle
