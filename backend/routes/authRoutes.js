const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');
const rateLimitMdw = require('../middleware/rateLimitMdw');
const authMdw = require('./../middleware/authentication');

const emailMdw = require('./../middleware/checkEmail');
const passwordMdw = require('./../middleware/checkPassword');
const nameMdw = require('./../middleware/checkName');


router.post('/signup', emailMdw, passwordMdw, userCtrl.signup);
router.post('/login', emailMdw, passwordMdw, rateLimitMdw, userCtrl.login);
router.put('/update', nameMdw, passwordMdw, authMdw, userCtrl.updateProfile);
router.get('/user/:id', authMdw, userCtrl.getUser);
router.get('/userlist', authMdw, userCtrl.getAllUsers);
router.delete('/delete/:id', authMdw, userCtrl.deleteUser);

module.exports = router;