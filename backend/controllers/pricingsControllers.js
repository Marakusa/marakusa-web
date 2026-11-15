const { Pricing } = require('../models/pricingsModels');

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
        const pricing = new Pricing(req.body);
        await pricing.save();
        res.status(201).json(pricing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const editPricing = async (req, res) => {
    try {
        const pricing = await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pricing) {
            return res.status(404).json({ message: 'Pricing not found' });
        }
        res.status(200).json(pricing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePricing = async (req, res) => {
    try {
        const pricing = await Pricing.findByIdAndDelete(req.params.id);
        if (!pricing) {
            return res.status(404).json({ message: 'Pricing not found' });
        }
        res.status(200).json({ message: 'Pricing deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPricings, createPricing, editPricing, deletePricing };
