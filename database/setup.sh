#!/bin/bash

# Community Book Exchange - Database Setup Script
# This script sets up the PostgreSQL database for the community book exchange

echo "Setting up Community Book Exchange Database..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install PostgreSQL first."
    echo "On macOS: brew install postgresql"
    exit 1
fi

# Check if PostgreSQL is running
if ! pgrep -x "postgres" > /dev/null; then
    echo "PostgreSQL is not running. Please start PostgreSQL first."
    echo "On macOS: brew services start postgresql"
    exit 1
fi

# Load environment variables from .env
set -a
[ -f .env ] && source .env
set +a

# Database configuration
DB_NAME="${DB_NAME:-communitybook_db}"
DB_USER="${DB_USER:-communitybook_user}"
DB_PASSWORD="${DB_PASSWORD:-change-this-password}"

echo "DB_USER is: $DB_USER"

# Warn if password is default
if [ "$DB_PASSWORD" = "change-this-password" ]; then
    echo "WARNING: Using default password. Please set DB_PASSWORD in your .env file or export it."
    echo "Example: export DB_PASSWORD='your_secure_password'"
fi

# Drop existing database and user
echo "Dropping existing database and user (if they exist)..."
psql -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
psql -d postgres -c \
"DO \$\$ BEGIN 
   IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER') THEN 
     EXECUTE 'DROP USER $DB_USER'; 
   END IF; 
 END \$\$;"

# Create database
echo "Creating database and user..."
psql -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database $DB_NAME already exists"

# Create user with password if it doesn't exist
psql -d postgres -c \
"DO \$\$ 
 BEGIN 
   IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER') THEN 
     EXECUTE format('CREATE USER %I WITH ENCRYPTED PASSWORD %L', '$DB_USER', '$DB_PASSWORD'); 
   END IF; 
 END 
\$\$;"

# Grant privileges
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Apply schema
echo "Running schema setup..."
psql -d $DB_NAME -f schema.sql

# Grant privileges on all tables in public schema (in case tables were created after user)
psql -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;"

# Done
echo "Database setup complete!"
echo ""
echo "Database Details:"
echo "  Name: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo "  Host: localhost"
echo "  Port: 5432"
echo ""
echo "You can now start your Spring Boot application!"
echo "Make sure to update backend/src/main/resources/application.properties with these credentials."
