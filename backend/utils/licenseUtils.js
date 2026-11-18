const crypto = require('crypto');

const hashLicenseKey = (licenseKey) => {
    if (!licenseKey.trim()) throw new Error('License key is required');
    if (!process.env.LICENSE_KEY_SALT) throw new Error('LICENSE_KEY_SALT is not defined');
    if (process.env.LICENSE_KEY_SALT.length < 32) throw new Error('LICENSE_KEY_SALT is too short');
    return crypto.createHmac('sha256', process.env.LICENSE_KEY_SALT).update(licenseKey.trim()).digest('hex');
};

const maskLicenseKey = (licenseKey) => {
    const trimmedKey = licenseKey.trim();
    return '*'.repeat(Math.max(0, trimmedKey.length - 4)) + trimmedKey.slice(-4);
};

module.exports = { hashLicenseKey, maskLicenseKey };