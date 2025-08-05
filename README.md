# Community Book Exchange

A full-stack web application for the residents in my local apartment buildings to share, sell, and discover used books within our community.

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for development and build tooling
- CSS for styling

**Backend:**
- Java 17 with Spring Boot 3.1
- Spring Data JPA for database operations
- PostgreSQL database
- Maven for dependency management

**Database:**
- PostgreSQL with a simple books table
- Stores book details, photos, and contact information


## Features

- Browse available books in a grid layout
- Add new books with photos and descriptions
- Mark books as "for sale" or "giveaway"
- View book details and contact information
- Photo upload support (including HEIC conversion)

## What This Project Demonstrates

- **Full-stack development**: React frontend consuming Spring Boot REST API endpoints
- **Database operations**: PostgreSQL integration with JPA/Hibernate for CRUD operations
- **REST API design**: Standard HTTP methods (GET, POST) with JSON request/response handling
- **Postman API testing**: Manual endpoint testing and validation using Postman
- **File handling**: Multipart file uploads with image processing (HEIC conversion)
- **React fundamentals**: Component state management using hooks (useState, useEffect)
- **Java OOP concepts**: Entity models, service layers, and dependency injection
- **Basic project structure**: Separation of concerns across frontend, backend, and database layers
- **AI-assisted development**: Learning from and collaborating with GitHub Copilot and ChatGPT while constantly and critically validating code suggestions

## Running the Application

1. **Database Setup:**
   ```bash
   # Start PostgreSQL
   brew services start postgresql
   
   # Run the setup script
   cd database && ./setup.sh
   ```

2. **Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   # Runs on http://localhost:8080
   ```

3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   # Runs on http://localhost:3000
   ```