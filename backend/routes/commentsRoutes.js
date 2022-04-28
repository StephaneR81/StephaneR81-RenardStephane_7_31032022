const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/commentCtrl');
const authMdw = require('../middleware/authentication');

router.post('/', authMdw, commentCtrl.create);
router.get('/', authMdw, commentCtrl.getAll);
router.get('/:id', authMdw, commentCtrl.getOne);
router.put('/:id', authMdw, commentCtrl.modify);
router.delete('/:id', authMdw, commentCtrl.delete);


module.exports = router;