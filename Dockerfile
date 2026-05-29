FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy the backend folder contents into /app
COPY backend /app

RUN chmod +x gradlew

RUN ./gradlew build -x test

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]
