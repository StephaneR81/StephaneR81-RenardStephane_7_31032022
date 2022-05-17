//Imports

const fs = require('fs');
const {
    REPL_MODE_SLOPPY
} = require('repl');

const db = require('../models');
const Picture = db.pictures;
const Comment = db.comments;
const User = db.users;
const {
    Sequelize,
    pictures
} = require('../models');



//CREATE A NEW PICTURE
exports.addPicture = (req, res) => {
    const pictureObject = JSON.parse(req.body.picture);

    //If uploaded file is not of type image/gif
    if (req.file.mimetype !== 'image/gif') {
        fs.unlink(`images/${req.file.filename}`, () => {});
        return res.status(422)
            .json({
                message: "Format d'image accepté : GIF"
            });
    }
    const newPicture = {
        title: pictureObject.title,
        url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        userId: pictureObject.userId
    };
    //Registers the new picture in the database
    Picture.create(newPicture)
        .then((data) => {
            if (!data) {
                fs.unlink(`images/${req.file.filename}`, () => {});
            }
            return res.status(201)
                .json({
                    message: 'La photo a été ajoutée avec succès. (Code 201)'
                });
        })
        .catch((error) => {
            //Create picture method failed
            fs.unlink(`images/${req.file.filename}`, () => {});
            return res.status(500)
                .json({
                    message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                });
        });
};

//MODIFY A PICTURE
exports.modifyPicture = (req, res) => {
    Picture.findOne({
            attributes: ['id', 'url', 'title', 'userId'],
            where: {
                id: req.params.id
            }
        })
        .then((foundPicture) => {
            //If no picture is found
            if (!foundPicture) {
                return res.status(404)
                    .json({
                        message: 'Aucune photo à afficher. (Code 404)'
                    });
            }

            //Check if the sender is an Administrator or the owner of the picture
            if (!req.auth.isAdmin && req.auth.userId !== String(foundPicture.userId)) {
                return res.status(403)
                    .json({
                        message: "Vous n'avez pas la permission de modifier cette photo. (Code 403)"
                    });
            }

            //Formats the new Picture object regarding the presence of a new file or not
            const pictureObject = req.file ? {
                ...JSON.parse(req.body.picture),
                url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : {
                ...JSON.parse(req.body.picture)
            };

            //If there is a new image file, delete the old one
            if (req.file) {
                const oldFileName = foundPicture.url.split('/images/')[1];
                fs.unlink(`images/${oldFileName}`, () => {});
            }

            //Registers the modified picture in the database
            Picture.update(pictureObject, {
                    where: {
                        id: req.params.id
                    }
                })
                .then((updatedPicture) => {
                    return res.status(201)
                        .json({
                            message: 'La photo a été modifiée avec succès. (Code 201)'
                        });
                })
                .catch((error) => {
                    //UpdateOne method failed
                    return res.status(400)
                        .json({
                            message: 'Erreur interne, veuillez retenter ultérieurement. (Code 400)'
                        });
                });

        })
        .catch((error) => {
            //FindOne method failed
            return res.status(500)
                .json({
                    message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                });
        });
};

//Delete one picture
exports.deletePicture = (req, res) => {
    Picture.findOne({
            attributes: ['id', 'userId', 'url'],
            where: {
                id: req.params.id
            }
        })
        .then((foundPicture) => {
            //If no picture is found
            if (!foundPicture) {
                return res.status(404)
                    .json({
                        message: "Cette photo n'existe pas."
                    });
            }
            //Check if the sender is an Administrator or the owner of the picture
            if (!req.auth.isAdmin && req.auth.userId !== String(foundPicture.userId)) {
                return res.status(403)
                    .json({
                        message: "Vous n'avez pas la permission de modifier cette photo."
                    });
            }

            //Retrieving the image file name of the Picture to delete
            const fileName = foundPicture.url.split('/images/')[1];

            //Deletes the picture in "images" folder
            fs.unlink(`images/${fileName}`, () => {
                //Deletes the picture object
                Picture.destroy({
                        where: {
                            id: req.params.id
                        }
                    })
                    .then((result) => {
                        if (result == 1) {
                            return res.status(201)
                                .json({
                                    message: 'La photo a été supprimée avec succès.'
                                });
                        } else {
                            return res.status(401)
                                .json({
                                    message: `La photo ID : ${req.params.id} n'a pas pu être supprimée.`
                                });
                        }
                    })
                    .catch((error) => {
                        //delete method failed
                        return res.status(500)
                            .json({
                                message: 'Erreur interne, veuillez retenter ultérieurement.'
                            });
                    });
            });

        })
        .catch((error) => {
            //findOne method failed
            return res.status(500)
                .json({
                    message: 'Erreur interne, veuillez retenter ultérieurement.'
                });
        });
};

//Get all pictures
exports.getAllPictures = (req, res) => {
    Picture.findAll({
            include: {
                model: User,
                attributes: ['name']
            },
            order: [
                ['createdAt', 'desc']
            ]
        })
        .then((foundPictures) => {
            if (foundPictures.length === 0) {
                return res.status(404)
                    .json({
                        message: "Aucune photo à afficher."
                    });
            }
            return res.status(200)
                .json(foundPictures);
        })
        .catch((error) => {
            return res.status(500)
                .json({
                    message: 'Erreur interne, veuillez retenter ultérieurement.'
                });
        });
};

//Get one picture
exports.getOnePicture = (req, res) => {
    Picture.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: Comment,
                as: 'comments'
            }, {
                model: User,
                as: 'user',
                attributes: ['name']
            }]

        })
        .then((foundPicture) => {
            if (!foundPicture) {
                return res.status(404)
                    .json({
                        message: "La photo n'a pas pu être trouvée."
                    });
            }
            return res.status(200)
                .json(foundPicture);
        })
        .catch((error) => {
            //findOne method failed
            return res.status(500)
                .json({
                    message: 'Erreur interne, veuillez retenter ultérieurement.'
                });
        });
};