require('dotenv').config();
const { verifyJwt } = require('./middlewares/auth');
const express = require('express');
const { connectToMongoDB, disconnectFromMongoDB } = require('./services/mongodb');

const storeRoutes = require('./routes/storeRoutes');
const authRoutes = require('./routes/authRoutes');

connectToMongoDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(verifyJwt);
app.use('/api/store', storeRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}).on('close', async () => {
    await disconnectFromMongoDB();
});