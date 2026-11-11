require('dotenv').config();

const express = require('express');
const { initAppwrite } = require('./services/appwrite');
const storeRoutes = require('./routes/storeRoutes');

initAppwrite();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/store', storeRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});