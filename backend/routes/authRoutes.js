const express = require('express');
const { login, verify, me } = require('../controllers/authControllers');
const router = express.Router();

router.get('/login', login);
router.get('/verify', verify);
router.get('/me', me);

module.exports = router;