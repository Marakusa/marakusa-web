const express = require('express');
const { getProfile } = require('../controllers/profileControllers');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.use(auth);
router.get('/', getProfile);

module.exports = router;