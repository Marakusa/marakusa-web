const { listProducts, jinxxyProducts } = require('../models/storeModels');

const getAllProducts = async (req, res) => {
    try {
        const products = await listProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const importJinxxyProducts = async (req, res) => {
    try {
        const products = await jinxxyProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProducts,
    importJinxxyProducts,
};