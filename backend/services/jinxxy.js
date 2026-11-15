const getProducts = async (page = 1, limit = 10) => {
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

const getProduct = async (id) => {
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

const getJinxxyLicense = async (licenseKey) => {
    const headers = { 'x-api-key': process.env.JINXXY_API_KEY };
    const query = await fetch(`${process.env.JINXXY_HOST}/licenses?key=${encodeURIComponent(licenseKey)}`, { headers });
    if (!query.ok) {
        const error = new Error('Failed to verify license with Jinxxy');
        error.statusCode = 502;
        throw error;
    }

    const results = (await query.json())?.results;
    if (!Array.isArray(results) || !results[0]?.id) {
        return null;
    }

    const response = await fetch(`${process.env.JINXXY_HOST}/licenses/${encodeURIComponent(results[0].id)}`, { headers });
    if (!response.ok) {
        const error = new Error('Failed to fetch license details from Jinxxy');
        error.statusCode = 502;
        throw error;
    }
    return response.json();
};

module.exports = { getProducts, getProduct, getJinxxyLicense };