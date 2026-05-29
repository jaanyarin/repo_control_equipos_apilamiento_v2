FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests -Dquarkus.package.jar.type=uber-jar

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S apilamiento && adduser -S apilamiento -G apilamiento
COPY --from=build /app/target/*-runner.jar app.jar
RUN chown -R apilamiento:apilamiento /app
USER apilamiento
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
