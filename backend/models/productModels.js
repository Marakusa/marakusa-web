const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    jinxxy_product_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true }
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product };