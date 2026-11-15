const mongoose = require('mongoose');

const LicenseSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    license_key: { type: String, required: true, unique: true },
    /* Reference to the internal product in the database */
    internal_product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    /* Reference to the external product ID from the provider (Jinxxy) */
    product_id: { type: String, required: true }
});

const License = mongoose.model("License", LicenseSchema);

module.exports = { License };