const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');


router.get('/register', userController.getUserRegister )

router.post('/register', userController.postUserRegister);

router.get('/login', userController.getUserLogin);

router.post('/login', userController.postUserLogin);

router.get('/home', userController.getHome)

router.post('/home', userController.postHome)

router.get('/logout', userController.getLogOut)

module.exports = router;