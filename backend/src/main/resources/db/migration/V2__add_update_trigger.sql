CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER categories_set_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER cart_items_set_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER addresses_set_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER order_items_set_updated_at BEFORE UPDATE ON order_items FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
