const { discordLogin, discordCallback, generateToken, discordGetUser } = require('../models/authModels');
const jwt = require('jsonwebtoken');
const { queryDocuments } = require('../services/appwrite');
const { Query } = require('node-appwrite');

const login = async (req, res) => {
    try {
        // Get Discord OAuth authorization URL
        const authUrl = await discordLogin();
        res.redirect(authUrl);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const verify = async (req, res) => {
    try {
        const { code } = req.query;

        // Handle Discord OAuth callback
        const data = await discordCallback(code);
        const discordUserData = await discordGetUser(data.access_token);

        // Find the profile attached to the Discord ID
        const profiles = await queryDocuments(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_PROFILES_COLLECTION_ID,
            [Query.equal('discord_id', discordUserData.id)]
        );
        const profile = profiles.length ? profiles[0] : null;
        if (!profile) {
            throw new Error('Profile not found for Discord user');
        }
        
        // Generate JWT for user
        const token = await generateToken(
            discordUserData.id, 
            discordUserData.username, 
            parseDiscordAvatarUrl(discordUserData), 
            {
                $id: profile.$id ?? null,
                id: profile ? profile.$id : null
            }
        );
        
        res.json({ token });
    } catch (error) {
        console.error('Error verifying Discord callback:', error);
        res.status(500).json({ error: error.message });
    }
};

const parseDiscordAvatarUrl = (discordUserData) => {
    if (!discordUserData.avatar) return null;
    const isGif = discordUserData.avatar.startsWith('a_');
    const format = isGif ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${discordUserData.id}/${discordUserData.avatar}.${format}`;
};

const me = (req, res) => {
    try {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
        res.json({ user: decoded });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = {
    login,
    verify,
    me,
};