const { Profile } = require('../models/profileModels');
const mongoose = require('mongoose');

const verifyProfile = async (profileId) => {
    if (!mongoose.isValidObjectId(profileId)) {
        throw new Error('Profile not found');
    }
    const profile = await Profile.findById(profileId);
    if (!profile) {
        throw new Error('Profile not found');
    }
    profile.avatar = parseDiscordAvatarUrl(profile.avatar, profile.discord_id);
    return profile;
};

const parseDiscordAvatarUrl = (avatar, discordId) => {
    if (!avatar) return null;
    const isGif = avatar.startsWith('a_');
    const format = isGif ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.${format}`;
};

module.exports = { verifyProfile, parseDiscordAvatarUrl };