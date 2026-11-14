const { Profile } = require('../models/authModels');

const { verifyProfile } = require('../utils/profileUtils');
const jwt = require('jsonwebtoken');

const verifyJwt = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            next();
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

const auth = (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error('Unauthorized');
        }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

const authAdmin = (req, res, next) => {
    try {
        if (!req.user || req.user?.role !== 'admin') {
            throw new Error('Unauthorized');
        }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = { auth, authAdmin, verifyJwt };