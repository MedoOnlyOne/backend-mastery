const express = require('express');
const usersController = require('./controller/user.controller');
const router = express.Router();

router.post('/register', usersController.registerUser);
router.post('/login', usersController.login);
router.post('/refresh', usersController.generateAccessToken);
router.get('/me', usersController.getProfile);

module.exports = router;