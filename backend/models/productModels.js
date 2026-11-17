const mongoose = require('mongoose');

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
    discord_role_name: { type: String },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product };