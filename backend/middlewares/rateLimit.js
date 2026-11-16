const { rateLimit } = require('express-rate-limit');

const makeLimiter = (windowMs, limit, opts = {}) => rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ...opts,
});

module.exports = {
    makeLimiter,
    globalLimiter: makeLimiter(60 * 1000, 40),
};