//Imports
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../models');
const User = db.users;
const {
    Sequelize
} = require('../models');

//CREATE A NEW USER ACCOUNT
exports.signup = (req, res) => {

    //Creates the new user
    const newUser = {
        ...req.body
    };

    //If the email address already exists
    User.findOne({
            attributes: ['email'],
            where: {
                email: req.body.email
            }
        })
        .then((doubleEmail) => {

            if (doubleEmail) {
                return res.status(401)
                    .json({
                        message: "L'adresse E-mail est déjà utilisée. (Code 401)"
                    });
            }

            //Checks if first account exists at least

            User.findAll({
                    attributes: ['email']
                })
                .then((existingUser) => {

                    //If it is the first account, it is an ADMIN account.
                    if (Object.keys(existingUser).length === 0) {
                        newUser.isAdmin = true;
                    }

                    //Creates a hash for the entered password with 10 salt rounds
                    bcrypt.hash(req.body.password, 10)
                        .then((hash) => {
                            newUser.password = hash;

                            //Registering the new user in the database
                            User.create(newUser)
                                .then((data) => {
                                    return res.status(201)
                                        .json({
                                            message: 'Nouvel utilisateur enregistré avec succès. (Code 201)'
                                        });
                                })

                                .catch((error) => {
                                    //Create method failed
                                    return res.status(500)
                                        .json({
                                            message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                                        });
                                });
                        })

                        .catch((error) => {
                            //Bcrypt method failed
                            return res.status(500)
                                .json({
                                    message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                                });
                        });
                })

                .catch((error) => {
                    //findAll method failed
                    return res.status(500)
                        .json({
                            message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                        });
                });
        })
        .catch((error) => {
            //FindOne method failed
            return res.status(500)
                .json({
                    message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)' + error
                });
        });
};




//AUTHENTICATES AN EXISTING USER
exports.login = (req, res) => {
    User.findOne({
            attributes: ['id', 'name', 'email', 'password', 'isAdmin'],
            where: {
                email: req.body.email
            }
        })
        .then((user) => {
            if (!user) {
                return res.status(404)
                    .json({
                        message: "Echec de l'authentification."
                    });
            }
            //Compares the provided password to the one stored in the database
            bcrypt.compare(req.body.password, user.password)
                .then((valid) => {

                    if (!valid) { //If the 2 passwords do not match
                        return res.status(403)
                            .json({
                                message: "Echec de l'authentification."
                            });
                    }
                    return res.status(200) //Returns an userId and a token
                        .json({
                            userId: user.id,
                            token: jwt.sign({
                                userId: user.id,
                                name: user.name,
                                isAdmin: user.isAdmin
                            }, process.env.TOKEN_SECRET, {
                                expiresIn: '24h'
                            })
                        });
                })

                .catch((error) => { //bcrypt.compare failed
                    return res.status(500)
                        .json({
                            message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                        });
                });
        })
        .catch((error) => { //findOne method failed
            res.status(500)
                .json({
                    message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                });
        });
};