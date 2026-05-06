-- Seed database with categories and products
-- Categories
INSERT INTO categories (name)
VALUES
    ('Fashion'),
    ('Shoes'),
    ('Accessories'),
    ('Bags'),
    ('Electronics'),
    ('Mobile Accessories'),
    ('Home & Living'),
    ('Beauty'),
    ('Office'),
    ('Lifestyle');

-- Products
INSERT INTO products (name, price, image_id)
VALUES
    ('Plain Cotton T-Shirt', 24.90, '39qppv39qppv39qp'),
    ('Minimalist Hoodie', 49.90, 'aczrr7aczrr7aczr'),
    ('Modern Sneakers', 89.90, 's9w9zzs9w9zzs9w9'),
    ('Luxury Wristwatch', 149.90, 'vvgughvvgughvvgu'),
    ('Classic Sunglasses', 39.90, '6990mo6990mo6990'),
    ('Premium Perfume', 59.90, 'mc7djfmc7djfmc7d'),
    ('Smartphone Case', 19.90, 'eccd08eccd08eccd'),
    ('Travel Backpack', 69.90, 'uc2dtluc2dtluc2d'),
    ('Reusable Water Bottle', 14.90, 'q4x3nlq4x3nlq4x3'),
    ('Scented Candle', 18.90, 'oakmcfoakmcfoakm'),
    ('Ceramic Coffee Mug', 12.90, 'g7dqxzg7dqxzg7dq'),
    ('Laptop Sleeve', 29.90, 'xq0epmxq0epmxq0e'),
    ('Wireless Headphones', 99.90, '98bomb98bomb98bo'),
    ('Portable Bluetooth Speaker', 79.90, '3ozy5s3ozy5s3ozy'),
    ('Modern Desk Lamp', 44.90, 'bxl0hxbxl0hxbxl0'),
    ('Premium Notebook', 9.90, 'ek1jy1ek1jy1ek1j'),
    ('Leather Wallet', 34.90, 'r12g1wr12g1wr12g'),
    ('Silver Ring', 54.90, 'z05hxlz05hxlz05h'),
    ('Skincare Cream Jar', 27.90, 'li85h3li85h3li85'),
    ('Portable Power Bank', 39.90, 'ig78ulig78ulig78'),
    ('Basic Polo Shirt', 29.90, '3m6b63m6b63m6b63'),
    ('Travel Duffel Bag', 59.90, 'fjc0ycfjc0ycfjc0'),
    ('Facial Serum', 24.90, 'xqsxtlxqsxtlxqsx'),
    ('Running Shoes', 94.90, '54wnfvbai2p3gnz5'),
    ('Casual Leather Boots', 119.90, 'mxvpr2igbebqg23j'),
    ('Fast Charging Adapter', 24.90, '6dauzz6dauzz6dau'),
    ('USB-C Charging Cable', 14.90, '9vrmwt9vrmwt9vrm'),
    ('Premium Pen Set', 19.90, 'o5kkefo5kkefo5kk'),
    ('Desk Organizer', 22.90, 't34k52t34k52t34k'),
    ('Yoga Mat', 34.90, 'eougm7eougm7eoug'),
    ('Fitness Towel', 16.90, 'l5po6cl5po6cl5po');

-- Product-Category association
INSERT INTO product_category (product_id, category_id)
VALUES
    (1, 1),    -- Plain Cotton T-Shirt -> Fashion
    (2, 1),    -- Minimalist Hoodie -> Fashion
    (3, 2),    -- Modern Sneakers -> Shoes
    (4, 3),    -- Luxury Wristwatch -> Accessories
    (5, 3),    -- Classic Sunglasses -> Accessories
    (6, 8),    -- Premium Perfume -> Beauty
    (7, 6),    -- Smartphone Case -> Mobile Accessories
    (8, 4),    -- Travel Backpack -> Bags
    (9, 10),   -- Reusable Water Bottle -> Lifestyle
    (10, 7),   -- Scented Candle -> Home & Living
    (11, 7),   -- Ceramic Coffee Mug -> Home & Living
    (12, 4),   -- Laptop Sleeve -> Bags
    (13, 5),   -- Wireless Headphones -> Electronics
    (14, 5),   -- Portable Bluetooth Speaker -> Electronics
    (15, 7),   -- Modern Desk Lamp -> Home & Living
    (16, 9),   -- Premium Notebook -> Office
    (17, 3),   -- Leather Wallet -> Accessories
    (18, 3),   -- Silver Ring -> Accessories
    (19, 8),   -- Skincare Cream Jar -> Beauty
    (20, 5),   -- Portable Power Bank -> Electronics
    (21, 1),   -- Basic Polo Shirt -> Fashion
    (22, 4),   -- Travel Duffel Bag -> Bags
    (23, 8),   -- Facial Serum -> Beauty
    (24, 2),   -- Running Shoes -> Shoes
    (25, 2),   -- Casual Leather Boots -> Shoes
    (26, 6),   -- Fast Charging Adapter -> Mobile Accessories
    (27, 6),   -- USB-C Charging Cable -> Mobile Accessories
    (28, 9),   -- Premium Pen Set -> Office
    (29, 9),   -- Desk Organizer -> Office
    (30, 10),  -- Yoga Mat -> Lifestyle
    (31, 10);  -- Fitness Towel -> Lifestyle
