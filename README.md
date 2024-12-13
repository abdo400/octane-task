## Description

This is the task built for book recommendation system

## Project setup

1. Create .env file in root & follow the .env.example variable names
2. Download docker if you don't have it
3. Run the following command
```bash
$ docker-compose up --build
```
4. After it is done, these are the routes you can test with CURL or postman (assuming you are running it locally)
  POST http://localhost:3000/users/register - body: username: string, password: string, role: "admin" | "user"
  POST http://localhost:3000/users/login - body: username: string, password: string
  POST http://localhost:3000/books/create - title: username: string, totalPages: number
  POST http://localhost:3000/reading-intervals - body: user_id: number, book_id: number, start_page: number, end_page: number
  GET http://localhost:3000/books/top

5. Logging in will send you a response body with the access token
6. To make authenticated calls, you need to attach the token in your calls
  a. In postman, before making a request, click Headers
  b. Add `Authoriziation` in keys, and the value should be `Bearer ${token}`
  c. Send the call
7. Assign the role you want to give for the user on creation: user or admin
8. admin users will be able to create and update books

## Run tests

```bash
# unit tests
$ docker exec -it octane-task-app-1 bash
$ npm run test
```

## Stay in touch

- Author - [Abdelrahman Mohamed](abdoju9@gmail.com)
