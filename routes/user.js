const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const expenseController = require('../controllers/expense')

router.get('/register', userController.getUserRegister )

router.post('/register', userController.postUserRegister);

router.get('/login', userController.getUserLogin);

router.post('/login', userController.postUserLogin);

router.get('/home', expenseController.getHome)

router.post('/home', expenseController.postHome)

module.exports = router;