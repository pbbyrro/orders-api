-- Insert test user for authentication
-- User: admin
-- Password: Admin987!

-- Hash 'Admin987!' with bcrypt (10 rounds)
INSERT INTO users (username, password)
VALUES ('admin', '$2b$10$vp5z3LYqi3Nvfmx/PoatFerKJYYRO8Ex2VqD.NMJwDxsez4K7YUym')
ON CONFLICT (username) DO NOTHING;

-- Insert sample orders (optional)
INSERT INTO orders (order_id, value, creation_date)
VALUES
    ('v10089014vdb', 250.50, NOW() - INTERVAL '2 days'),
    ('v10089015vdb', 180.00, NOW() - INTERVAL '1 day')
ON CONFLICT (order_id) DO NOTHING;

-- Insert sample order items
INSERT INTO items (order_id, product_id, quantity, price)
VALUES
    ('v10089014vdb', 101, 2, 75.25),
    ('v10089014vdb', 102, 1, 100.00),
    ('v10089015vdb', 103, 3, 60.00)
ON CONFLICT DO NOTHING;
