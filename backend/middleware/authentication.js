const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //Gets the token from headers
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET); //Decodes the token by using the secret key
        const userIdFromToken = decodedToken.userId.toString(); //Sets userIdFromToken to userId from decoded token
        const isAdmin = decodedToken.isAdmin;
        
        console.log('TOKEN ', token);

        req.auth = {
            userId: userIdFromToken,
            isAdmin: isAdmin
        };

        if (req.body.userId && req.body.userId !== userIdFromToken) {
            throw `Echec de l'authentification !`
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({
            error
        });
    }
};