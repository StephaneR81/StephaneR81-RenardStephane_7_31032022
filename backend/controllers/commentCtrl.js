const db = require('../models');
const Comment = db.comments;
const {
    Sequelize,
    pictures
} = require('../models');


//Create a new comment
exports.create = (req, res) => {
    const commentObject = {
        ...req.body
    };
    Comment.create(commentObject)
        .then((newComment) => {
            return res.status(201)
                .json({
                    message: 'Votre commentaire a été publié avec succès. (Code 201)'
                });
        })
        .catch((error) => {
            //Create method failed
            return res.status(500)
                .json({
                    message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                });
        });
};



//Modify a comment
exports.modify = (req, res) => {

    Comment.findOne({
            attributes: ['id', 'comment', 'pictureId', 'userId'],
            where: {
                id: req.params.id
            }
        })
        .then((foundComment) => {
            if (!foundComment) {
                return res.status(404)
                    .json({
                        message: "Le commentaire n'a pas pu être trouvé. (Code 404)"
                    });
            }

            //Check if the sender is the owner or an administrator
            if (!req.auth.isAdmin && req.auth.userId !== String(foundComment.userId)) {
                return res.status(403)
                    .json({
                        message: "Vous n'avez pas la permission de modifier ce commentaire. (Code 403)"
                    });
            }

            //Creates the new object for update
            const commentObject = {
                ...foundComment,
                comment: req.body.comment
            };

            //Update the comment
            Comment.update(commentObject, {
                    where: {
                        id: req.params.id
                    }
                })
                .then((updatedComment) => {
                    return res.status(201)
                        .json({
                            message: "Le commentaire a été modifié avec succès. (Code 201)"
                        });
                })
                .catch((error) => {
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
                    message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                });
        });
};



//Delete a comment
exports.delete = (req, res) => {
    Comment.findOne()
        .then((foundComment) => {
            if (!foundComment) {
                return res.status(404)
                    .json({
                        message: "Le commentaire n'a pas pu être trouvé. (Code 404)"
                    });
            }

            //Check if the sender is an Administrator or the owner of the comment
            if (!req.auth.isAdmin && req.auth.userId !== String(foundComment.userId)) {
                return res.status(403)
                    .json({
                        message: "Vous n'avez pas la permission de modifier ce commentaire. (Code 403)"
                    });
            }

            //Delete the comment
            Comment.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                .then((result) => {
                    if (result == 1) {
                        return res.status(201)
                            .json({
                                message: "Le commentaire a été supprimé avec succès. (Code 201)"
                            });
                    } else {
                        return res.status(401)
                            .json({
                                message: `Le commentaire ID : ${req.params.id} n'a pas pu être supprimé. (Code 401)`
                            });
                    }
                })
                .catch((error) => {
                    //delete method failed
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
                    message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                });
        });
};



//Get all the comments
exports.getAll = (req, res) => {
    Comment.findAll()
        .then((foundComments) => {
            if (!foundComments) {
                return res.status(404)
                    .json({
                        message: "Aucun commentaire à afficher. (Code 404)"
                    });
            }
            return res.status(200)
                .json(foundComments);
        })
        .catch((error) => {
            //findAll method failed
            return res.status(500)
                .json({
                    message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                });
        });
};



//Get one comment
exports.getOne = (req, res) => {
    Comment.findOne({
            where: {
                id: req.params.id
            }
        })
        .then((foundComment) => {
            if (!foundComment) {
                return res.status(404)
                    .json({
                        message: "Le commentaire n'a pas pu être trouvé. (Code 404)"
                    });
            }
            return res.status(200)
                .json(foundComment);

        })
        .catch((error) => {
            //findOne method failed
            return res.status(500)
                .json({
                    message: 'Erreur interne, veuillez retenter ultérieurement. (Code 500)'
                })
        });
};