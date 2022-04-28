const express = require('express');
const router = express.Router();

const pictureCtrl = require('../controllers/pictureCtrl');
const authMdw = require('../middleware/authentication');
const multerMdw = require('../middleware/multer-config');

router.post('/', authMdw, multerMdw, pictureCtrl.addPicture);
router.get('/', authMdw, pictureCtrl.getAllPictures);
router.get('/:id', authMdw, pictureCtrl.getOnePicture);
router.put('/:id', authMdw, multerMdw, pictureCtrl.modifyPicture);
router.delete('/:id', authMdw, pictureCtrl.deletePicture);


module.exports = router;