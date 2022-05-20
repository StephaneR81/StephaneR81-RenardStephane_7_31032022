const validator = require('validator');

module.exports = (req, res, next) => {
    if (validator.isEmpty(req.body.name)) { //If the name is empty
        return res.status(401)
            .json({
                message: 'Veuillez renseigner un nom'
            });
    }
    req.body.name = validator.trim(req.body.name); //Removes spaces at start and end of the name
    req.body.name = validator.escape(req.body.name); //Escapes some characters that have special meaning in HTML (<>"&)
    next();
}