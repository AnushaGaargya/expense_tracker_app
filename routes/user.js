const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/register', userController.getUserRegister )

router.post('/register', userController.postUserRegister);

router.get('/login', userController.getUserLogin);

module.exports = router;