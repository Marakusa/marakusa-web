const { jinxxyProducts } = require('../models/storeModels');
const { Product, DISCORD_ROLE_NAME_MAX_LENGTH } = require('../models/productModels');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs/promises');
const { randomUUID } = require('node:crypto');

const thumbnailDirectory = path.resolve(process.env.THUMBNAIL_UPLOAD_DIR || path.join(__dirname, '../uploads/thumbnails'));
const thumbnailUrlPrefix = '/api/store/thumbnails/';
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } });

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
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
                await Product.findOneAndUpdate({ jinxxy_product_id: id }, data, { returnDocument: 'after' });
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

const parseThumbnailUpload = (req, res, next) => {
    upload.single('thumbnail')(req, res, error => {
        if (error) {
            return res.status(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ message: error.message });
        }
        next();
    });
};

const uploadProductThumbnail = async (req, res) => {
    const { productId } = req.params;
    if (!mongoose.isValidObjectId(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }
    if (!req.file) {
        return res.status(400).json({ message: 'A thumbnail image is required' });
    }

    let filePath;
    try {
        const { fileTypeFromBuffer } = await import('file-type');
        const fileType = await fileTypeFromBuffer(req.file.buffer).catch(() => null);
        // file-type reports PNGs containing an animation chunk as APNG; store them as plain .png
        const allowedTypes = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/apng': 'png', 'image/webp': 'webp' };
        const ext = fileType && allowedTypes[fileType.mime];
        if (!ext) {
            console.warn(`Rejected thumbnail upload with detected type: ${fileType ? fileType.mime : 'unknown'}`);
            return res.status(400).json({ message: 'Thumbnail must be a JPEG, PNG, or WebP image' });
        }

        const filename = `${randomUUID()}.${ext}`;
        filePath = path.join(thumbnailDirectory, filename);
        await fs.mkdir(thumbnailDirectory, { recursive: true });
        await fs.writeFile(filePath, req.file.buffer, { flag: 'wx' });

        const thumbnailUrl = thumbnailUrlPrefix + filename;
        const previousProduct = await Product.findByIdAndUpdate(productId, { thumbnail_url: thumbnailUrl });
        if (!previousProduct) {
            await fs.unlink(filePath);
            return res.status(404).json({ message: 'Product not found' });
        }

        const previousUrl = previousProduct.thumbnail_url || '';
        const previousFilename = previousUrl.startsWith(thumbnailUrlPrefix) ? previousUrl.slice(thumbnailUrlPrefix.length) : '';
        if (/^[0-9a-f-]{36}\.(jpg|png|webp)$/.test(previousFilename)) {
            await fs.unlink(path.join(thumbnailDirectory, previousFilename)).catch(error => {
                if (error.code !== 'ENOENT') console.error(error);
            });
        }
        return res.json({ thumbnail_url: thumbnailUrl });
    } catch (error) {
        if (filePath) {
            await fs.unlink(filePath).catch(() => {});
        }
        console.error(error);
        return res.status(500).json({ message: 'Failed to upload thumbnail' });
    }
};

const updateProductDiscordRole = async (req, res) => {
    const { productId } = req.params;
    if (!mongoose.isValidObjectId(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    const roleName = req.body?.discord_role_name;
    if (roleName !== undefined && roleName !== null && typeof roleName !== 'string') {
        return res.status(400).json({ message: 'discord_role_name must be a string' });
    }
    const trimmed = (roleName ?? '').trim();
    // Also enforced by the schema; checked here to return a clear 400 instead of a validation error
    if (trimmed.length > DISCORD_ROLE_NAME_MAX_LENGTH) {
        return res.status(400).json({ message: `discord_role_name must be at most ${DISCORD_ROLE_NAME_MAX_LENGTH} characters` });
    }

    try {
        // An empty value clears the role name so it falls back to the product name
        const update = trimmed
            ? { $set: { discord_role_name: trimmed } }
            : { $unset: { discord_role_name: 1 } };
        const product = await Product.findByIdAndUpdate(productId, update, { returnDocument: 'after', runValidators: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update Discord role' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    importJinxxyProducts,
    parseThumbnailUpload,
    uploadProductThumbnail,
    updateProductDiscordRole,
    thumbnailDirectory,
};