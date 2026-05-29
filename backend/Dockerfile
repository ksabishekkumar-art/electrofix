FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . /app

RUN chmod +x gradlew

RUN ./gradlew build -x test

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]
