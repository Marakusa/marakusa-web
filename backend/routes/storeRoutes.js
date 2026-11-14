const express = require('express');
const router = express.Router();
const { authAdmin } = require('../middlewares/auth');

const { getAllProducts, importJinxxyProducts } = require('../controllers/storeControllers');

router.get('/products', getAllProducts);

router.use(authAdmin);
router.get('/import-jinxxy-products', importJinxxyProducts);

module.exports = router;