# Getting Started with Node API

Run 
### docker compose up or docker-compose up
to create a docker container with postgresQl database and get Node 14 installed.

This will get your programme started on localhost on port 8080.

http://localhost:8080


## API documentation

visit http://localhost:8080/api-docs to view swagger documentation


## Endpoints

All endpoints are listed below

## Register user

http://localhost:8080/api/register

## Login user 

http://localhost:8080/api/login

## Get book details by ISBN


http://localhost:8080/api/book?isbn={ISBN}


### The following endpoints require authentication using jwt provided in the authorization header ###

## Post a book

 http://localhost:8080/api/book

## Get all books

http://localhost:8080/api/books


## Get a single book 

http://localhost:8080/api/book/:id

## Update a book 

http://localhost:8080/api/book:id


## Delete a book 

http://localhost:8080/api/book:id




   

 


