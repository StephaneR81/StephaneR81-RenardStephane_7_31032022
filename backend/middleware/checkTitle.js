const validator = require('validator');
const fs = require('fs');
const regex = new RegExp('/^[a-zA-Z0-9_ -]{3,20}$/');

module.exports = (req, res, next) => {


    const pictureObject = JSON.parse(req.body.picture);
    if (validator.isEmpty(pictureObject.title)) {
        //If the picture title is empty
        fs.unlink(`images/${req.file.filename}`, () => {});
        return res.status(401)
            .json({
                message: 'Veuillez renseigner un titre'
            });
    }

    if (!validator.isLength(pictureObject.title, {

            min: 3,
            max: 30
        })) {
        //If the title is not between 3-30 characters range
        fs.unlink(`images/${req.file.filename}`, () => {});
        return res.status(401)
            .json({
                message: 'Veuillez indiquer un titre entre 3 et 30 caractères'
            });
    }

    if (!validator.isAlphanumeric(pictureObject.title, 'fr-FR', {
            ignore: ' '
        })) {}

    pictureObject.title = validator.trim(pictureObject.title); //Removes spaces at start and end of the title
    pictureObject.title = validator.escape(pictureObject.title); //Escapes some characters that have special meaning in HTML (<>"&)
    req.body.picture = JSON.stringify(pictureObject);
    next();
};