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
                    message: 'Comment successfully posted' + Object.entries(newComment.dataValues)
                });
        })
        .catch((error) => {
            //Create method failed
            return res.status(500)
                .json({
                    error: error.stack
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
                        message: 'No comment found !'
                    });
            }

            //Check if the sender is the owner or an administrator
            if (!req.auth.isAdmin && req.auth.userId !== String(foundComment.userId)) {
                return res.status(403)
                    .json({
                        error: 'Not authorized to modify this comment'
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
                            message: 'Successfully updated comment !'
                        });
                })
                .catch((error) => {
                    return res.status(500)
                        .json({
                            error: error.stack
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



//Delete a comment
exports.delete = (req, res) => {
    Comment.findOne()
        .then((foundComment) => {
            if (!foundComment) {
                return res.status(404)
                    .json({
                        message: 'Comment not found !'
                    });
            }

            //Check if the sender is an Administrator or the owner of the comment
            if (!req.auth.isAdmin && req.auth.userId !== String(foundComment.userId)) {
                return res.status(403)
                    .json({
                        error: 'Not authorized to modify this comment'
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
                                message: 'Comment successfully deleted !'
                            });
                    } else {
                        return res.status(401)
                            .json({
                                message: `Could not delete the comment ! with id : ${req.params.id} !`
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

        })
        .catch((error) => {
            //findOne method failed
            return res.status(500)
                .json({
                    error: error.stack
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
                        message: 'No comment to show !'
                    });
            }
            return res.status(200)
                .json(foundComments);
        })
        .catch((error) => {
            //findAll method failed
            return res.status(500)
                .json({
                    error: error.stack
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
                        message: 'No comment found !'
                    });
            }
            return res.status(200)
                .json(foundComment);

        })
        .catch((error) => {
            //findOne method failed
            return res.status(500)
                .json({
                    error: error.stack
                })
        });
};