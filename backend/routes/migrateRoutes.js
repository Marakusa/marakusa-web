const express = require('express');
const { migrateFromAppwrite } = require('../controllers/migrateControllers');
const { authAdmin } = require('../middlewares/auth');

const router = express.Router();

router.use(authAdmin);
router.post('/appwrite', migrateFromAppwrite);

module.exports = router;