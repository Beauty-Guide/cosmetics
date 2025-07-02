# Stage 1: сборка приложения
FROM maven:3.8.6-jdk-22 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package

# Stage 2: финальный образ с JRE
FROM openjdk:22-jre-oracle
WORKDIR /app
COPY --from=builder /app/target/cosmetic-service-0.0.1-SNAPSHOT.jar cosmetic-service.jar
ENTRYPOINT ["java", "-jar", "cosmetic-service.jar"]