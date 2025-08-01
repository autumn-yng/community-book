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

# Database configuration
DB_NAME="communitybook_db"
DB_USER="communitybook_user"
DB_PASSWORD="change_this_password"

echo "Creating database and user..."

# Create database and user
psql -U postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database $DB_NAME already exists"
psql -U postgres -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "User $DB_USER already exists"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "Running schema setup..."

# Run the schema file
psql -U postgres -d $DB_NAME -f schema.sql

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
