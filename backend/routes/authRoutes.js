const express = require('express');
const { makeLimiter } = require('../middlewares/rateLimit');
const { login, verify, me } = require('../controllers/authControllers');
const router = express.Router();

const loginLimiter = makeLimiter(15 * 60 * 1000, 20);
const verifyLimiter = makeLimiter(15 * 60 * 1000, 20, {
    skipSuccessfulRequests: true
});
const meLimiter = makeLimiter(60 * 1000, 40);

router.get('/login', loginLimiter, login);
router.get('/verify', verifyLimiter, verify);
router.get('/me', meLimiter, me);

module.exports = router;