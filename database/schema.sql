-- Community Book Exchange Database Setup
-- PostgreSQL Database Schema

-- Create database (run this first)
-- CREATE DATABASE communitybook_db;

-- Create user (optional, for security)
-- CREATE USER communitybook_user WITH ENCRYPTED PASSWORD 'change_this_password';
-- GRANT ALL PRIVILEGES ON DATABASE communitybook_db TO communitybook_user;

-- Use this database
-- \c communitybook_db;

CREATE TABLE IF NOT EXISTS books (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    price DECIMAL(10,2),
    type VARCHAR(20) NOT NULL CHECK (type IN ('SELL', 'GIVEAWAY')),
    description TEXT,
    owner_name VARCHAR(255) NOT NULL,
    contact_method VARCHAR(10) NOT NULL CHECK (contact_method IN ('EMAIL', 'PHONE')),
    contact_info VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_type ON books(type);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_owner_name ON books(owner_name);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at);

-- Sample data (optional)
INSERT INTO books (title, author, photo_url, price, type, description, owner_name, contact_method, contact_info) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'https://via.placeholder.com/300x400/4CAF50/white?text=The+Great+Gatsby', 5.00, 'SELL', 'Classic American novel in good condition', 'John Doe', 'EMAIL', 'john@example.com'),
('To Kill a Mockingbird', 'Harper Lee', 'https://via.placeholder.com/300x400/2196F3/white?text=To+Kill+a+Mockingbird', 0.00, 'GIVEAWAY', 'Free to a good home - excellent condition', 'Jane Smith', 'EMAIL', 'jane@example.com'),
('1984', 'George Orwell', 'https://via.placeholder.com/300x400/FF9800/white?text=1984', 3.50, 'SELL', 'Some wear but still readable', 'Bob Johnson', 'PHONE', '(555) 123-4567'),
('Pride and Prejudice', 'Jane Austen', 'https://via.placeholder.com/300x400/E91E63/white?text=Pride+and+Prejudice', 0.00, 'GIVEAWAY', 'Classic romance novel', 'Alice Brown', 'EMAIL', 'alice@example.com'),
('The Catcher in the Rye', 'J.D. Salinger', 'https://via.placeholder.com/300x400/9C27B0/white?text=The+Catcher+in+the+Rye', 7.00, 'SELL', 'Like new condition', 'Charlie Wilson', 'PHONE', '(555) 987-6543');
