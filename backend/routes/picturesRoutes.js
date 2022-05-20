const express = require('express');
const router = express.Router();

const pictureCtrl = require('../controllers/pictureCtrl');
const authMdw = require('../middleware/authentication');
const multerMdw = require('../middleware/multer-config');

const titleMdw = require('./../middleware/checkTitle');

router.post('/', authMdw, multerMdw, titleMdw, pictureCtrl.addPicture);
router.get('/', authMdw, pictureCtrl.getAllPictures);
router.get('/:id', authMdw, pictureCtrl.getOnePicture);
router.put('/:id', authMdw, multerMdw, titleMdw, pictureCtrl.modifyPicture);
router.delete('/:id', authMdw, pictureCtrl.deletePicture);


module.exports = router;