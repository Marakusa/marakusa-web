const { jinxxyProducts } = require('../models/storeModels');
const { Product } = require('../models/productModels');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        for (const product of products) {
            product.jinxxy_product_url = process.env.JINXXY_STORE_BASE_URL + product.jinxxy_product_url;
        }
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const importJinxxyProducts = async (req, res) => {
    try {
        const products = await jinxxyProducts();

        for (const productData of products) {
            const {id, name, base_price, currency_code, category, url} = productData;

            const existingProduct = await Product.findOne({ jinxxy_product_id: id });
            const data = {
                jinxxy_product_id: id,
                name,
                price: base_price,
                currency: currency_code,
                category,
                jinxxy_product_url: url,
            };

            if (existingProduct) {
                await Product.findOneAndUpdate({ jinxxy_product_id: id }, data, { new: true });
            } else {
                await Product.create(data);
            }
        }

        res.json({ message: 'Products imported successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProducts,
    importJinxxyProducts,
};