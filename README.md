# Projet 7 Groupomania | OpenClassRooms #


## Backend installation ##

Please have a ready to use MySQL server.

First fill the required fields in `.env_sample` file and rename it as `.env`.

Then run `npm install` from backend folder. This should install the required dependencies :

- bcrypt 5.0.1
- dotenv 16.0.0
- express 4.17.3
- fs 0.0.1
- helmet 4.6.0
- jsonwebtoken 8.5.1
- multer 1.4.4
- mysql2 2.3.3
- nodemon 2.0.15
- path 0.12.7
- sequelize 6.19.0
- sequelize-cli 6.4.1
- xss-clean 0.1.1

### Usage ###

Run either `node server` or `nodemon server` from the backend folder. This should start the http server for the backend on port 3000.

The app should reload automatically when you make a change to a file in case where you starts the server with `nodemon server`.

Use `Ctrl+C` in the terminal to stop the local server.


------------

## Frontend Installation ##

Please run `ng serve -o` from the frontend folder. This should start the http frontend server at http://localhost:4200 and automatically open it in your default Internet browser.

The Angular server should reload automatically when you make a change to a file.

Use `Ctrl+C` in the terminal to stop the local server.

