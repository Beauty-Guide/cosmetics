# Stage 1: сборка с Maven 3.9.10 + Eclipse Temurin 21
FROM maven:3.9.10-eclipse-temurin-21 AS build
WORKDIR /home/app

# Копируем pom.xml и исходники
COPY pom.xml ./
COPY src ./src/

# Сборка проекта с пропуском тестов
RUN mvn clean package -DskipTests

# Stage 2: финальный образ с Java 22
FROM eclipse-temurin:22-jre
WORKDIR /usr/local/lib

# Копируем JAR из этапа сборки
COPY --from=build /home/app/target/cosmetic-service-0.0.1-SNAPSHOT.jar demo.jar

# Открываем порт
EXPOSE 8080

# Точка входа
ENTRYPOINT ["java", "-jar", "demo.jar"]