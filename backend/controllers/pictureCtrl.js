//Imports
const fs = require('fs');

const db = require('../models');
const Picture = db.pictures;
const {
    Sequelize,
    pictures
} = require('../models');



//CREATE A NEW PICTURE
exports.addPicture = (req, res) => {
    const pictureObject = JSON.parse(req.body.picture);
    const newPicture = {
        title: pictureObject.title,
        url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        userId: pictureObject.userId
    };
    //Registers the new picture in the database
    Picture.create(newPicture)
        .then((data) => {
            return res.status(201)
                .json({
                    message: 'Picture successfully created ' + Object.entries(data.dataValues)
                });
        })
        .catch((error) => {
            //Create picture method failed
            return res.status(500)
                .json({
                    error: error.errors.map(e => e.message)
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
                        message: 'No picture was found !'
                    });
            }

            //Check if the sender is an Administrator or the owner of the picture
            if (!req.auth.isAdmin && req.auth.userId !== String(foundPicture.userId)) {
                return res.status(403)
                    .json({
                        error: 'Not authorized to modify this picture'
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
                            message: 'Successfully updated picture !'
                        });
                })
                .catch((error) => {
                    //UpdateOne method failed
                    return res.status(400)
                        .json({
                            error
                        });
                });

        })
        .catch((error) => {
            //FindOne method failed
            return res.status(500)
                .json({
                    error
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
                        message: 'No picture was found'
                    });
            }
            console.log('FOUNDPICTURE => ', foundPicture)
            //Check if the sender is an Administrator or the owner of the picture
            if (!req.auth.isAdmin && req.auth.userId !== String(foundPicture.userId)) {
                return res.status(403)
                    .json({
                        error: 'Not authorized to modify this picture'
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
                                    message: 'Picture successfully deleted !'
                                });
                        } else {
                            return res.status(401)
                                .json({
                                    message: `Could not delete the picture with id : ${req.params.id} !`
                                });
                        }
                    })
                    .catch((error) => {
                        //delete method failed
                        return res.status(500)
                            .json({
                                error: error.stack
                            });
                    });
            });

        })
        .catch((error) => {
            //findOne method failed
            return res.status(500)
                .json({
                    error: error.stack
                });
        });
};


//Get all pictures
exports.getAllPictures = (req, res) => {
    Picture.findAll()
        .then((foundPictures) => {
            if (!foundPictures) {
                return res.status(404)
                    .json({
                        message: 'No picture to show !'
                    });
            }
            return res.status(200)
                .json(foundPictures);
        })
        .catch((error) => {
            return res.status(500)
                .json({
                    error: error.stack
                });
        });
};


//Get one picture
exports.getOnePicture = (req, res) => {
    Picture.findOne({
            where: {
                id: req.params.id
            }
        })
        .then((foundPicture) => {
            if (!foundPicture) {
                return res.status(404)
                    .json({
                        message: 'No picture found !'
                    });
            }
            return res.status(200)
                .json(foundPicture);
        })
        .catch((error) => {
            //findOne method failed
            return res.status(500)
                .json({
                    error: error.stack
                });
        });
};