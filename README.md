# E-Commerce

## Description
This is a fullstack e-commerce application that supports
user authentication, product display and purchase (only mocked, no real payment).

### Technologies
- [Postgresql](https://www.postgresql.org)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Angular](https://angular.dev)

## Setup
To get the application running, follow the steps below:
```bash
# 1. clone the repository
git clone https://github.com/m-t-e-k-u-g-r/e-commerce.git
# 2. change directory to the cloned repository
cd e-commerce
# 3. start docker container
docker-compose up
```

### Public Deployment on [Render](https://render.com/)
The file render.yaml contains the necessary configuration to deploy the application on Render.
The configuration file is complete and can be used with a free account on Render.
If you would like to adjust the configuration, you can check out the [Blueprint specification](https://render.com/docs/blueprint-spec).

To deploy on Render, follow these steps:
1. Visit the [Render site](https://dashboard.render.com/select-repo?type=blueprint)
2. Scroll down and enter `https://github.com/m-t-e-k-u-g-r/e-commerce` in *Public Git Repository*
3. Click *Continue*
4. Enter a name for the Blueprint
5. Click *Deploy Blueprint*

Wait a few moments until the service has started and Render will tell you
where to find the application

### Requirements
**Development:**
- Java 25
- Maven 3.9.14
- Node 24.16.0
- NPM 11.6.4

*Versions have been used during development*

**Local Deployment:**
- Docker
- Docker Compose

### Environment variables
The following environment variables are required:
- DATABASE
- DB_USER
- DB_PASSWORD

Optionally, the variable LOG_LEVEL can be set to adjust the logging level of Spring Boot.

Default is ERROR.

## Image information
- The project includes 31 example images in the WebP format for products.
- These can be found in the folder `backend/src/main/resources/uploads/products/webp`
- The images have been created with the use of Google's Gemini AI