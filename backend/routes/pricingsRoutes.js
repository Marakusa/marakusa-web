const express = require('express');
const { getPricings, createPricing, editPricing, deletePricing } = require('../controllers/pricingsControllers');
const { authAdmin } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getPricings);

router.use(authAdmin);
router.post('/', createPricing);
router.put('/:id', editPricing);
router.delete('/:id', deletePricing);

module.exports = router;