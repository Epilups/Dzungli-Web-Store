-- E-commerce Database Schema for PostgreSQL

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT order_status_check CHECK (status IN ('pending', 'confirmed', 'payment_pending', 'payment_received', 'delivered', 'canceled'))
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shopping cart table
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id, order_id)
);

-- Sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- Insert some products
INSERT INTO products (name, description, price, image_url, category, stock_quantity, rating, review_count) VALUES
('Premium Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 149.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', 'electronics', 50, 0, 0),
('Smart Watch Pro', 'Advanced smartwatch with health tracking features', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop', 'electronics', 30, 0, 0),
('Ultra HD Camera', 'Professional 4K camera for photography enthusiasts', 799.99, 'https://images.unsplash.com/photo-1610933919313-52581002a659?w=500&h=500&fit=crop', 'electronics', 15, 0, 0),
('Laptop Stand Pro', 'Ergonomic laptop stand with adjustable height', 49.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', 'home', 100, 0, 0),
('Mechanical Keyboard', 'RGB mechanical keyboard with custom switches', 129.99, 'https://images.unsplash.com/photo-1587829191301-2a718cbf31f4?w=500&h=500&fit=crop', 'electronics', 75, 0, 0),
('Portable Charger', '20000mAh fast charging power bank', 39.99, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop', 'electronics', 200, 0, 0),
('Yoga Mat Premium', 'Eco-friendly yoga mat with extra cushioning', 59.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop', 'sports', 60, 0, 0),
('Running Shoes Pro', 'Professional running shoes with arch support', 129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop', 'sports', 45, 0, 0),
('Casual T-Shirt', 'Comfortable cotton t-shirt in various colors', 29.99, 'https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=500&h=500&fit=crop', 'fashion', 150, 0, 0),
('Blue Jeans Classic', 'Timeless denim jeans with perfect fit', 69.99, 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop', 'fashion', 90, 0, 0),
('Desk Lamp LED', 'Modern LED desk lamp with adjustable brightness', 79.99, 'https://images.unsplash.com/photo-1565636192335-14ae61a7f0d0?w=500&h=500&fit=crop', 'home', 80, 0, 0),
('Wall Clock Modern', 'Contemporary wall clock with silent mechanism', 34.99, 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop', 'home', 0, 0, 0)
ON CONFLICT DO NOTHING;

-- Create a default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (email, password_hash, first_name, last_name, is_admin) VALUES
('admin@storehub.com', '$2a$10$XqN7V7TZx8fV1PYGMp4HZu8KqX9ZxY0fHVGKqZ9X8fV1PYGMp4HZu', 'Admin', 'User', TRUE)
ON CONFLICT (email) DO NOTHING;