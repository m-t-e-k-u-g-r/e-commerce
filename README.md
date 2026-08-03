# E-Commerce

## Description
This is a fullstack e-commerce application that supports
user authentication, product display and purchase (only mocked, no real payment).

### Technologies
- [Postgresql](https://www.postgresql.org)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Angular](https://angular.dev)

## Setup
You need the following application.properties for the backend:
- spring.datasource.url
- spring.datasource.driver-class-name
- spring.datasource.username
- spring.datasource.password
- jwt.refresh-token-secret
- jwt.access-token-secret
- server.servlet.context-path=/api

## Image information
- The project includes 31 example images in the WebP format for products.
- These can be found in the folder uploads/products/webp
- The images have been created with the use of Google's Gemini AI