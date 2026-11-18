const mongoose = require('mongoose');

// Discord role names are limited to 100 characters; the bot prefixes "Owns " (5 chars)
const DISCORD_ROLE_NAME_MAX_LENGTH = 95;

const ProductSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    jinxxy_product_id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    category: { type: String },
    jinxxy_product_url: { type: String },
    thumbnail_url: { type: String },
    visible: { type: Boolean, default: true },
    discord_role_name: { type: String, trim: true, maxlength: DISCORD_ROLE_NAME_MAX_LENGTH },
});

// Add the store base URL to the jinxxy_product_url
const addStoreBaseUrl = {
    transform(doc, ret) {
        if (ret.jinxxy_product_url) {
            ret.jinxxy_product_url = (process.env.JINXXY_STORE_BASE_URL || '') + ret.jinxxy_product_url;
        }
        return ret;
    },
};
ProductSchema.set('toJSON', addStoreBaseUrl);

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product, DISCORD_ROLE_NAME_MAX_LENGTH };