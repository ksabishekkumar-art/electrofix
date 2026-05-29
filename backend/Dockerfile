FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy everything from the current build context
COPY . .

# If Render is using the repository root as the build context, 
# the backend files will be inside a 'backend' folder. 
# We move them up so gradlew is accessible at the root of /app.
RUN if [ -d "backend" ]; then cp -r backend/* ./; fi

# Fix for Windows line endings on gradlew
RUN apt-get update && apt-get install -y dos2unix && dos2unix gradlew

RUN chmod +x gradlew

RUN ./gradlew build -x test

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]
