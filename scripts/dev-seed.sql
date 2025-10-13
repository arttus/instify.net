-- ============================================
-- Instify Development Database Seed Data
-- ============================================

-- Create development database if it doesn't exist
CREATE DATABASE IF NOT EXISTS instify_dev;

-- Use the development database
\c instify_dev;

-- ============================================
-- Development Users (for testing)
-- ============================================
CREATE TABLE IF NOT EXISTS dev_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test users
INSERT INTO dev_users (email, name, role) VALUES
    ('admin@instify.local', 'Admin User', 'admin'),
    ('test@instify.local', 'Test User', 'user'),
    ('demo@instify.local', 'Demo User', 'user')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Development Settings
-- ============================================
CREATE TABLE IF NOT EXISTS dev_settings (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert development settings
INSERT INTO dev_settings (key, value, description) VALUES
    ('environment', 'development', 'Current environment'),
    ('debug_mode', 'true', 'Enable debug logging'),
    ('mock_apis', 'true', 'Use mock external APIs'),
    ('seed_data_loaded', 'true', 'Development seed data has been loaded')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- Development Notifications
-- ============================================
\echo 'Development seed data loaded successfully!'
\echo 'Test users created:'
\echo '  - admin@instify.local (admin)'
\echo '  - test@instify.local (user)'
\echo '  - demo@instify.local (user)'
