const express = require('express');
const router = express.Router();
const { auth, authAdmin } = require('../middlewares/auth');

const { getAllProducts, importJinxxyProducts } = require('../controllers/storeControllers');

router.get('/products', getAllProducts);

router.use(auth);
router.use(authAdmin);
router.get('/import-jinxxy-products', importJinxxyProducts);

module.exports = router;