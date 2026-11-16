const mongoose = require('mongoose');
mongoose.set("sanitizeFilter", true);

async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log("You successfully connected to MongoDB!");
        return mongoose;
    } catch (err) {
        console.dir(err);
        throw err;
    }
}
// Call this only when your application terminates
async function disconnectFromMongoDB() {
    await mongoose.connection.close();
}

module.exports = { connectToMongoDB, disconnectFromMongoDB };
