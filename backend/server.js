require('dotenv').config();
const path = require('path');
const { verifyJwt, botAuth } = require('./middlewares/auth');
const { getLicensesForUser, redeemLicense } = require('./controllers/licenseControllers');
const express = require('express');
const { connectToMongoDB, disconnectFromMongoDB } = require('./services/mongodb');

const { globalLimiter, makeLimiter } = require('./middlewares/rateLimit');

const { router: storeRoutes, serveThumbnails } = require('./routes/storeRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const pricingsRoutes = require('./routes/pricingsRoutes');
const licenseRoutes = require('./routes/licenseRoutes');
const migrateRoutes = require('./routes/migrateRoutes');

connectToMongoDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST;

// Built frontend to serve (set in the Docker image); unset in development, where Vite serves it
const frontendDist = process.env.FRONTEND_DIST ? path.resolve(process.env.FRONTEND_DIST) : null;

// 1 = nginx
// 2 = Cloudflare -> nginx
const trustProxy = process.env.TRUST_PROXY;
if (/^\d+$/.test(trustProxy)) app.set('trust proxy', Number(trustProxy));

app.use(express.json());

// No global rate limiter
app.use('/api/store/thumbnails', serveThumbnails); // static images
app.use('/api/auth', authRoutes);
if (frontendDist) {
    app.use(express.static(frontendDist, { index: false })); // JS/CSS/images
}

// All bot traffic comes from one IP, so bot limits are keyed per Discord user instead of per IP.
// botAuth runs first so unauthenticated requests can't use up a real user's budget.
const botLimiter = makeLimiter(60 * 1000, 30, { keyGenerator: req => req.params.discordId });
// Same per-user redeem limit as the web route (/api/licenses/redeem)
const botRedeemLimiter = makeLimiter(15 * 60 * 1000, 10, { keyGenerator: req => req.params.discordId });
app.route('/api/licenses/bot/:discordId')
    .all(botAuth, botLimiter)
    .get(getLicensesForUser)
    .post(botRedeemLimiter, redeemLicense)
    .all((req, res) => res.status(405).json({ message: 'Method Not Allowed' }));

// Global rate limiter applied
app.use(globalLimiter);

app.use(verifyJwt);

app.use('/api/store', storeRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/pricings', pricingsRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/migrate', migrateRoutes);

// Single-page app fallback: any other GET outside /api returns index.html so client-side routes work
if (frontendDist) {
    app.use((req, res, next) => {
        if (req.method !== 'GET' || req.path === '/api' || req.path.startsWith('/api/')) return next();
        res.sendFile(path.join(frontendDist, 'index.html'));
    });
}

app.listen(port, host, () => {
    console.log(`Server running on ${host || 'localhost'}:${port}`);
}).on('close', async () => {
    await disconnectFromMongoDB();
});