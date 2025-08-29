# Use the official Maven image with OpenJDK 17 for building
FROM maven:3.9.4-eclipse-temurin-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml first (for better Docker layer caching)
# This allows Docker to cache the dependency download step if pom.xml hasn't changed
COPY pom.xml .

# Download dependencies
# This step will be cached if pom.xml hasn't changed
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the application
# This creates a JAR file in the target directory
RUN mvn clean package -DskipTests

# Use a smaller runtime image for the final application
FROM eclipse-temurin:17-jre-jammy

# Set the working directory
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/community-book-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the port that the application runs on
# Render will set the PORT environment variable, but default to 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
