const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');
const rateLimitMdw = require('../middleware/rateLimitMdw');

router.post('/signup', userCtrl.signup);
router.post('/login', rateLimitMdw ,userCtrl.login);

module.exports = router;