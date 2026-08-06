FROM node:24-alpine AS build-frontend

WORKDIR /app

COPY ./frontend/package*.json .

RUN npm install

COPY ./frontend .

RUN npm run build

FROM eclipse-temurin:25-jdk AS build-backend

WORKDIR /app

COPY ./backend .
COPY --from=build-frontend /app/dist/*/browser /app/src/main/resources/static

RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

FROM eclipse-temurin:25-jre AS run

WORKDIR /app

COPY --from=build-backend /app/target/app.jar app.jar

EXPOSE 8080

ENTRYPOINT [ "java", "-jar", "app.jar" ]