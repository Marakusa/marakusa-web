const express = require('express');
const { migrateFromAppwrite, getMigrationProgress } = require('../controllers/migrateControllers');
const { authAdmin } = require('../middlewares/auth');

const router = express.Router();

router.use(authAdmin);
router.get('/appwrite/progress', getMigrationProgress);
router.post('/appwrite', migrateFromAppwrite);

module.exports = router;