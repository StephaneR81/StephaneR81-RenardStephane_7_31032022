# Projet 7 Groupomania | OpenClassRooms

## **Backend installation**

As the backend server uses a MySQL database, please first have a ready to use MySQL server.

Navigate to the `/backend` folder and open the `.env_sample` file.

Fill the required fields in `.env_sample` file (with your own parameters) and rename it as `.env`.

Then run `npm install` from `/backend` folder. This should install the required dependencies :

- bcrypt 5.0.1
- dotenv 16.0.0
- express 4.17.3
- fs 0.0.1
- helmet 4.6.0
- jsonwebtoken 8.5.1
- multer 1.4.4
- mysql2 2.3.3
- nodemon 2.0.16
- path 0.12.7
- sequelize 6.19.0
- sequelize-cli 6.4.1
- xss-clean 0.1.1

### **Usage**

Always in the `/backend` folder, run either `node server` or `nodemon server`.

This should start the http server on port 3000 and generate the database automatically with Sequelize.

The app should reload automatically when you make a change to a file in case where you started the server with the `nodemon server` command.

Use `Ctrl+C` in the terminal to stop the local server.

---

## **Frontend Installation**

Navigate to the `/frontend` folder and run the `npm install` command.

The required dependencies wil be installed.

You also have to install `Angular` by typing the `npm i @angular/cli` command in your terminal.


### **Usage**

Please run `ng serve -o` from the `/frontend` folder. This should start the http frontend server at http://localhost:4200 and automatically open it in your default Internet browser.

The Angular server should reload automatically when you make a change to a file.

Use `Ctrl+C` in the terminal to stop the local server.

**IMPORTANT** :
Please notice that **only**
the **first created account** in the application is the **administrator** account.
The following account creations will be **user** accounts.
