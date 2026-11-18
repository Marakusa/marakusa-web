const { Profile } = require('../models/profileModels');

const crypto = require('crypto');
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

const authAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error('Unauthorized');
        }
        const profile = await Profile.findById(req.user.profileId);
        if (!profile || profile?.role !== 'admin') {
            throw new Error('Unauthorized');
        }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Hash and cache the bot API key for timing-safe comparison
let cachedBotKey;
let cachedBotKeyHash;
const getBotKeyHash = () => {
    const key = process.env.BOT_API_KEY;
    if (!key) return null;
    if (key !== cachedBotKey) {
        cachedBotKey = key;
        cachedBotKeyHash = crypto.createHash('sha256').update(key).digest();
    }
    return cachedBotKeyHash;
};

const botAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const expectedHash = getBotKeyHash();
        if (!token || !expectedHash) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Compare fixed-length digests so neither content nor length leaks via timing
        const tokenHash = crypto.createHash('sha256').update(token).digest();
        if (!crypto.timingSafeEqual(tokenHash, expectedHash)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = { auth, authAdmin, verifyJwt, botAuth };