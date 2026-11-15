require('dotenv').config();
const { verifyJwt } = require('./middlewares/auth');
const express = require('express');
const { connectToMongoDB, disconnectFromMongoDB } = require('./services/mongodb');

const storeRoutes = require('./routes/storeRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const pricingsRoutes = require('./routes/pricingsRoutes');
const licenseRoutes = require('./routes/licenseRoutes');

connectToMongoDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(verifyJwt);
app.use('/api/store', storeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/pricings', pricingsRoutes);
app.use('/api/licenses', licenseRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}).on('close', async () => {
    await disconnectFromMongoDB();
});