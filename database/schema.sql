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
    photo_data BYTEA,
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
INSERT INTO books (id, title, author, photo_url, price, type, description, owner_name, contact_method, contact_info)
VALUES
(1, 'The Great Gatsby', 'F. Scott Fitzgerald', '/api/v1/books/1/photo', 5.00, 'SELL', 'Classic American novel in good condition', 'John Doe', 'EMAIL', 'john@example.com'),
(2, 'To Kill a Mockingbird', 'Harper Lee', '/api/v1/books/2/photo', 0.00, 'GIVEAWAY', 'Free to a good home - excellent condition', 'Jane Smith', 'EMAIL', 'jane@example.com'),
(3, '1984', 'George Orwell', '/api/v1/books/3/photo', 3.50, 'SELL', 'Some wear but still readable', 'Bob Johnson', 'PHONE', '(555) 123-4567'),
(4, 'Pride and Prejudice', 'Jane Austen', '/api/v1/books/4/photo', 0.00, 'GIVEAWAY', 'Classic romance novel', 'Alice Brown', 'EMAIL', 'alice@example.com'),
(5, 'The Catcher in the Rye', 'J.D. Salinger', '/api/v1/books/5/photo', 7.00, 'SELL', 'Like new condition', 'Charlie Wilson', 'PHONE', '(555) 987-6543');

-- Reset the sequence to continue from the highest ID
SELECT setval('books_id_seq', (SELECT MAX(id) FROM books));

-- Grant all privileges on all tables in public schema to the user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO communitybook_user;
-- Grant usage and select on the books_id_seq sequence to the user
GRANT USAGE, SELECT ON SEQUENCE books_id_seq TO communitybook_user;
-- Grant all privileges on all sequences in public schema to the user (future-proof)
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO communitybook_user;
