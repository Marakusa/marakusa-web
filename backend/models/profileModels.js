const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    discord_id: { type: String, required: true },
    username: { type: String },
    avatar: { type: String },
    role: { type: String, default: "user" }
});

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = { Profile };