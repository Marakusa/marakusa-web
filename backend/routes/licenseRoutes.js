const express = require('express');
const { getLicenses, redeemLicense } = require('../controllers/licenseControllers');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.use(auth);
router.get('/', getLicenses);
router.post('/redeem', redeemLicense);

module.exports = router;