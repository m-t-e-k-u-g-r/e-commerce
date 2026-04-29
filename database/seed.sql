-- Seed database with categories and products
-- Categories
INSERT INTO categories (name)
VALUES
    ('Fruits'),
    ('Vegetables'),
    ('Dairy'),
    ('Meat'),
    ('Bakery'),
    ('Beverages'),
    ('Grains'),
    ('Snacks');

-- Products
INSERT INTO products (name, description, price, image_url)
VALUES
    ('Apple', 'Fresh red apple', 0.50, 'https://placehold.co/800x450'),
    ('Banana', 'Ripe yellow banana', 0.30, 'https://placehold.co/800x450'),
    ('Orange', 'Juicy orange', 0.60, 'https://placehold.co/800x450'),
    ('Broccoli', 'Fresh green broccoli', 1.20, 'https://placehold.co/800x450'),
    ('Carrot', 'Organic carrot', 0.40, 'https://placehold.co/800x450'),
    ('Milk', 'Whole milk 1L', 1.10, 'https://placehold.co/800x450'),
    ('Cheese', 'Cheddar cheese block', 2.50, 'https://placehold.co/800x450'),
    ('Yogurt', 'Natural yogurt cup', 0.90, 'https://placehold.co/800x450'),
    ('Chicken Breast', 'Boneless chicken breast', 4.50, 'https://placehold.co/800x450'),
    ('Beef Steak', 'Premium beef steak', 8.99, 'https://placehold.co/800x450'),
    ('Pork Chop', 'Fresh pork chop', 5.20, 'https://placehold.co/800x450'),
    ('Bread', 'White bread loaf', 1.50, 'https://placehold.co/800x450'),
    ('Croissant', 'Butter croissant', 1.20, 'https://placehold.co/800x450'),
    ('Rice', 'White rice 1kg', 2.00, 'https://placehold.co/800x450'),
    ('Pasta', 'Durum wheat pasta', 1.30, 'https://placehold.co/800x450'),
    ('Oatmeal', 'Rolled oats', 1.80, 'https://placehold.co/800x450'),
    ('Orange Juice', 'Fresh orange juice', 2.20, 'https://placehold.co/800x450'),
    ('Coffee', 'Ground coffee', 3.50, 'https://placehold.co/800x450'),
    ('Potato Chips', 'Salted potato chips', 1.70, 'https://placehold.co/800x450'),
    ('Chocolate Bar', 'Milk chocolate bar', 1.00, 'https://placehold.co/800x450');

-- Product-Category association
INSERT INTO product_category (product_id, category_id)
VALUES
    (1, 1),  -- Apple -> Fruits
    (2, 1),  -- Banana -> Fruits
    (3, 1),  -- Orange -> Fruits
    (4, 2),  -- Broccoli -> Vegetables
    (5, 2),  -- Carrot -> Vegetables
    (6, 3),  -- Milk -> Dairy
    (7, 3),  -- Cheese -> Dairy
    (8, 3),  -- Yogurt -> Dairy
    (9, 4),  -- Chicken -> Meat
    (10, 4), -- Beef -> Meat
    (11, 4), -- Pork -> Meat
    (12, 5), -- Bread -> Bakery
    (13, 5), -- Croissant -> Bakery
    (14, 7), -- Rice -> Grains
    (15, 7), -- Pasta -> Grains
    (16, 7), -- Oatmeal -> Grains
    (17, 6), -- Juice -> Beverages
    (18, 6), -- Coffee -> Beverages
    (19, 8), -- Chips -> Snacks
    (20, 8); -- Chocolate -> Snacks
