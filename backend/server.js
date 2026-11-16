require('dotenv').config();
const { verifyJwt } = require('./middlewares/auth');
const express = require('express');
const { connectToMongoDB, disconnectFromMongoDB } = require('./services/mongodb');

const { globalLimiter } = require('./middlewares/rateLimit');

const { router: storeRoutes, serveThumbnails } = require('./routes/storeRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const pricingsRoutes = require('./routes/pricingsRoutes');
const licenseRoutes = require('./routes/licenseRoutes');

connectToMongoDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST;

// 1 = nginx
// 2 = Cloudflare -> nginx
const trustProxy = process.env.TRUST_PROXY;
if (/^\d+$/.test(trustProxy)) app.set('trust proxy', Number(trustProxy));

app.use(express.json());

// No global rate limiter
app.use('/api/store/thumbnails', serveThumbnails); // static images
app.use('/api/auth', authRoutes);

// Global rate limiter applied
app.use(globalLimiter);
app.use(verifyJwt);

app.use('/api/store', storeRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/pricings', pricingsRoutes);
app.use('/api/licenses', licenseRoutes);

app.listen(port, host, () => {
    console.log(`Server running on ${host || 'localhost'}:${port}`);
}).on('close', async () => {
    await disconnectFromMongoDB();
});