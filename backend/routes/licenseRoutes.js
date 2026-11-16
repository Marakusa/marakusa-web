const express = require('express');
const { makeLimiter } = require('../middlewares/rateLimit');
const { getLicenses, redeemLicense } = require('../controllers/licenseControllers');
const { auth } = require('../middlewares/auth');

const router = express.Router();

const licenseLimiter = makeLimiter(15 * 60 * 1000, 10, {
    keyGenerator: (req) => req.user.profileId,
});

router.use(auth);
router.get('/', getLicenses);
router.post('/redeem', licenseLimiter, redeemLicense);

module.exports = router;