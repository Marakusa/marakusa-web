const { products: jinxxyProductsService, product: jinxxyProductService } = require('../services/jinxxy');

/*const listProducts = () =>
    listCollectionDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_STORE_PRODUCTS_COLLECTION_ID,
    );*/

const jinxxyProducts = async () => {
    const limit = 10;

    const allResults = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        // GET products from Jinxxy API
        const result = await jinxxyProductsService(page, limit);

        if (result.length > 0) {
            for (const product of result) {
                // GET product details from Jinxxy API
                const productData = await jinxxyProductService(product.id);

                // Include only PUBLISHED products
                if (productData.visibility.trim().toUpperCase() !== 'PUBLISHED') {
                    continue;
                }

                allResults.push(productData);
            }
        }

        // Determine if there are more products to fetch
        hasMore = result.length >= limit;
        page += 1;
    }

    return allResults;
};

module.exports = { /*listProducts,*/ jinxxyProducts };