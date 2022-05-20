const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/commentCtrl');
const authMdw = require('../middleware/authentication');

const commentMdw = require('./../middleware/checkComment');


router.post('/', authMdw, commentMdw, commentCtrl.create);
router.get('/:id', authMdw, commentCtrl.getAll);
router.get('/comment/:id', authMdw, commentCtrl.getOne);
router.put('/:id', authMdw, commentMdw, commentCtrl.modify);
router.delete('/:id', authMdw, commentCtrl.delete);


module.exports = router;