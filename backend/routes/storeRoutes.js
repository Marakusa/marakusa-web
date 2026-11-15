const express = require('express');
const router = express.Router();
const { authAdmin } = require('../middlewares/auth');

const { getAllProducts, importJinxxyProducts, parseThumbnailUpload, uploadProductThumbnail, thumbnailDirectory } = require('../controllers/storeControllers');

router.get('/products', getAllProducts);

// Serve product thumbnails from the upload directory
router.use('/thumbnails', express.static(thumbnailDirectory, {
	setHeaders: res => res.setHeader('X-Content-Type-Options', 'nosniff'),
}), (req, res) => res.sendStatus(404));

router.use(authAdmin);
router.get('/import-jinxxy-products', importJinxxyProducts);
router.post('/products/:productId/thumbnail', parseThumbnailUpload, uploadProductThumbnail);

module.exports = router;