const { License } = require('../models/licenseModels');
const { Product } = require('../models/productModels');
const { Profile } = require('../models/profileModels');
const { getJinxxyLicense } = require('../services/jinxxy');

const maskLicenseKey = (licenseKey) => {
    const visibleCharacters = Math.min(4, Math.max(0, licenseKey.length - 1));
    return `${licenseKey.slice(0, visibleCharacters)}${'*'.repeat(licenseKey.length - visibleCharacters)}`;
};

const getLicenses = async (req, res) => {
    try {
        const profile = await Profile.findById(req.user.profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const licenses = await License.find({ user_id: profile._id })
            .populate('internal_product_id', 'name thumbnail_url jinxxy_product_url');
        res.json(licenses.map(license => ({
            ...license.toObject(),
            license_key: maskLicenseKey(license.license_key),
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const redeemLicense = async (req, res) => {
    const licenseKey = typeof req.body?.license_key === 'string' ? req.body.license_key.trim() : '';
    if (!licenseKey) {
        console.error('License key is required');
        return res.status(400).json({ message: 'A license key is required' });
    }

    try {
        const profile = await Profile.findById(req.user.profileId);
        if (!profile) {
            console.error('Profile not found');
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (await License.exists({ license_key: licenseKey })) {
            console.error('License already redeemed');
            return res.status(409).json({ message: 'License already redeemed' });
        }

        const licenseData = await getJinxxyLicense(licenseKey);
        const productId = licenseData?.inventory_item?.item?.id;
        if (!licenseData || licenseData.key !== licenseKey || !productId) {
            console.error('Invalid license key');
            return res.status(400).json({ message: 'Invalid license key' });
        }

        if (licenseData.order?.payment_status === 'REFUNDED') {
            console.error('License is not eligible for redemption');
            return res.status(400).json({ message: 'License is not eligible for redemption' });
        }

        const product = await Product.findOne({ jinxxy_product_id: String(productId) });
        if (!product) {
            console.error('License product is not available');
            return res.status(400).json({ message: 'License product is not available' });
        }

        const license = await License.create({
            user_id: profile._id,
            license_key: licenseKey,
            internal_product_id: product._id,
            product_id: String(productId),
        });
        await license.populate('internal_product_id', 'name thumbnail_url jinxxy_product_url');
        res.status(201).json({
            ...license.toObject(),
            license_key: maskLicenseKey(license.license_key),
        });
    } catch (error) {
        if (error.code === 11000) {
            console.error('License already redeemed');
            return res.status(409).json({ message: 'License already redeemed' });
        }
        console.error(error.message);
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

module.exports = { getLicenses, redeemLicense };