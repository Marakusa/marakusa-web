const { Pricing } = require('../models/pricingsModels');
const Base = require('../models/basesModels');
const { default: mongoose } = require('mongoose');

const getBases = async (req, res) => {
    try {
        const bases = await Base.find();
        res.status(200).json(bases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPricings = async (req, res) => {
    try {
        const pricings = await Pricing.find();
        res.status(200).json(pricings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPricing = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }
        if (!req.body.name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        
        const { name, price, description, image } = req.body;
        if (typeof name !== 'string'
            || (price !== undefined && typeof price !== 'number')
            || (description !== undefined && typeof description !== 'string')
            || (image !== undefined && typeof image !== 'string')) {
            return res.status(400).json({ message: 'Invalid field types' });
        }

        const pricing = new Pricing({ name, price, description, image });
        await pricing.save();
        res.status(201).json(pricing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const editPricing = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }
        if (!req.body.name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const { name, price, description, image } = req.body;
        if (typeof name !== 'string'
            || (price !== undefined && typeof price !== 'number')
            || (description !== undefined && typeof description !== 'string')
            || (image !== undefined && typeof image !== 'string')) {
            return res.status(400).json({ message: 'Invalid field types' });
        }

        const pricing = await Pricing.findById(id);
        if (!pricing) {
            return res.status(404).json({ message: 'Pricing not found' });
        }

        if (price !== undefined) pricing.price = price;
        if (description !== undefined) pricing.description = description;
        if (image !== undefined) pricing.image = image;
        pricing.name = name;

        await pricing.save();

        res.status(200).json(pricing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePricing = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const pricing = await Pricing.findByIdAndDelete(id);
        if (!pricing) {
            return res.status(404).json({ message: 'Pricing not found' });
        }
        res.status(200).json({ message: 'Pricing deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPricings, createPricing, editPricing, deletePricing, getBases };
