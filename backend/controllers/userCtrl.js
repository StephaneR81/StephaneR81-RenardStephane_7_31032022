//Imports
const bcrypt = require('bcrypt');
const fs = require('fs');
const {
    fstat
} = require('fs');
const jwt = require('jsonwebtoken');

const db = require('../models');
const User = db.users;
const Picture = db.pictures;
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

//UPDATE USER PROFILE INFORMATIONS
exports.updateProfile = (req, res, next) => {
    User.findOne({
            attributes: ['id', 'name', 'email', 'password', 'isAdmin'],
            where: {
                id: req.body.userId
            }
        })

        .then((user) => {
            //If the user does not exist
            if (!user) {
                return res.status(404)
                    .json({
                        message: 'Echec de la modification du profil. (Code 404)'
                    });
            }

            //Encrypt the new password
            bcrypt.hash(req.body.password, 10)
                .then((hash) => {
                    //Creates object with new user informations for update it
                    //Email is not editable to avoid double accounts (email is unique)
                    //The user keeps its role
                    const updatedUser = {
                        name: req.body.name,
                        password: hash,
                        email: user.email,
                        isAdmin: user.isAdmin
                    };

                    //Update user informations
                    User.update({
                            ...updatedUser
                        }, {
                            where: {
                                id: user.id
                            }
                        })

                        .then((user) => {
                            return res.status(201)
                                .json({
                                    message: `Les informations de l'utilisateur ont été mises à jour avec succès. (Code 201). N'oubliez pas d'utiliser votre nouveau mot de passe le cas échéant lors de votre prochaine connexion`
                                });
                        })

                        .catch((error) => {
                            //Update method failed
                            res.status(500)
                                .json({
                                    message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                                });
                        });
                })

                .catch((error) => {
                    //Bcrypt method failed
                    res.status(500)
                        .json({
                            message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                        });
                });
        })

        .catch((error) => {
            //findOne method failed
            return res.status(500)
                .json({
                    message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                });
        });
};

//Get user informations
exports.getUser = (req, res, next) => {

    if (!req.auth.userId || req.auth.userId !== req.params.id) {
        return res.status(401)
            .json({
                message: "Demande non autorisée. (Code 401)"
            });
    }

    User.findOne({
            where: {
                id: req.auth.userId
            }
        })

        .then((user) => {
            if (!user) {
                return res.status(404)
                    .json({
                        message: "L'utilisateur n'a pas pu être trouvé. (Code 404)"
                    });
            }

            // if (!req.auth.userId || req.auth.userId !== req.params.id) {
            //     return res.status(401)
            //         .json({
            //             message: "Demande non autorisée. (Code 401)"
            //         });
            // }

            return res.status(200)
                .json({
                    user
                });
        })

        .catch((error) => {
            //findOne method failed
            return res.status(500)
                .json({
                    message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                });
        });
};

//Delete an user account
exports.deleteUser = (req, res, next) => {
    User.findOne({
            include: {
                model: Picture,
                attributes: ['url']
            },
            where: {
                id: req.params.id
            }
        })

        .then((userToDelete) => {

            //If user to delete owns at least one picture, delete pictures.
            if (Object.keys(userToDelete.pictures).length > 0) {
                for (const element of userToDelete.pictures) {
                    const fileName = element.dataValues.url.split('/images/')[1];
                    fs.unlink(`images/${fileName}`, () => {});
                }
            }

            //If sender is not Admin or owner
            if (!req.auth.isAdmin && req.auth.userId !== String(userToDelete.id)) {
                return res.status(401)
                    .json({
                        message: "Demande non autorisée !"
                    });
            }

            //Delete user's account
            User.destroy({
                    where: {
                        id: userToDelete.id
                    }
                })

                .then((result) => {
                    //Delete old authentication informations
                    delete req.headers.authorization;
                    delete req.auth;
                    return res.status(201)
                        .json({
                            message: `Le compte utilisateur de ${userToDelete.name} a été supprimé définitivement. (Code 201)\nRedirection en cours, patientez...`
                        });
                })

                .catch((error) => {
                    //destroy method failed
                    return res.status(500)
                        .json({
                            message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                        });
                });
        })

        .catch((error) => {
            //findOne method failed
            return res.status(500)
                .json({
                    message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)' + error
                });
        });
};