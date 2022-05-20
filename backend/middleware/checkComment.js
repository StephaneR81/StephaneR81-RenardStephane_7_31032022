const validator = require('validator');

module.exports = (req, res, next) => {
    if (validator.isEmpty(req.body.comment)) { //If the comment is empty
        return res.status(401)
            .json({
                message: 'Veuillez renseigner un commentaire'
            });
    }
    if (!validator.isLength(req.body.comment, {
            min: 6,
            max: 500
        })) { //If the textarea is not between 6-500 characters range
        return res.status(401)
            .json({
                message: 'Veuillez insérer un commentaire entre 6 et 500 caractères'
            });
    }
    req.body.comment = validator.trim(req.body.comment); //Removes spaces at start and end of the email
    req.body.comment = validator.escape(req.body.comment); //Escapes some characters that have special meaning in HTML (<>"&)
    next();
}