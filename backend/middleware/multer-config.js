const multer = require('multer');
//Regex that targets punctuation characters and other
const regex = /[!"#$%&'()*+,-/:;<=>?@[\]^`{|}~]/g;

const MIME_TYPES = {
    'image/gif': '.gif'
};
const storage = multer.diskStorage({
    destination: (req, file, callback) => { //Sets destination folder (images) for the uploaded files
        callback(null, 'images')
    },
    filename: (req, file, callback) => { //Sanitizes and formats the original filename
        const safeFilename = file.originalname.split('.')[0].replace(regex, '');
        const name = safeFilename.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + '_' + Date.now() + extension);
    }
});

module.exports = multer({
    storage
}).single('image');