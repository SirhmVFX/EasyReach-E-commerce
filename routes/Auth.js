const express = require('express');
const router = express.Router();

const { register, login, logout, forgetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgetPassword', forgetPassword);

module.exports = router;