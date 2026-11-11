const products = async (page = 1, limit = 10) => {
    const result = await fetch(`${process.env.JINXXY_HOST}/products?page=${page}&limit=${limit}&sort_order=desc`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.JINXXY_API_KEY
        },
    });
    const data = await result.json();
    if (!data?.results || !Array.isArray(data.results)) {
        throw new Error('Invalid response from Jinxxy API');
    }

    return data.results;
};

const product = async (id) => {
    const result = await fetch(`${process.env.JINXXY_HOST}/products/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.JINXXY_API_KEY
        },
    });
    const data = await result.json();
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from Jinxxy API');
    }

    return data;
};

module.exports = { products, product };