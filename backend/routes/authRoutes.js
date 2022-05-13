const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');
const rateLimitMdw = require('../middleware/rateLimitMdw');
const authMdw = require('./../middleware/authentication');

router.post('/signup', userCtrl.signup);
router.post('/login', rateLimitMdw, userCtrl.login);
router.put('/update', authMdw, userCtrl.updateProfile);
router.get('/user/:id', authMdw, userCtrl.getUser);
router.delete('/delete/:id', authMdw, userCtrl.deleteUser);

module.exports = router;