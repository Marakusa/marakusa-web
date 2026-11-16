const { discordLogin, discordCallback, generateToken, discordGetUser } = require('../models/authModels');
const { verifyProfile } = require('../utils/profileUtils');
const jwt = require('jsonwebtoken');
const { Profile } = require('../models/profileModels');

const login = async (_, res) => {
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
        let profile = await Profile.findOne({ discord_id: discordUserData.id });
        if (!profile) {
            profile = await Profile.create({ discord_id: discordUserData.id });
        }

        // Update username and avatar to the latest
        profile.username = discordUserData.username;
        profile.avatar = discordUserData.avatar;
        await profile.save();
        
        // Generate JWT for user
        const token = await generateToken(discordUserData.id, profile?._id);
        res.json({ token });
    } catch (error) {
        console.error('Error verifying Discord callback:', error);
        res.status(500).json({ error: error.message });
    }
};

const me = async (req, res) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);

        // Verify the user role
        const profile = await verifyProfile(decoded.profileId);
        res.json({ ...profile.toObject(), admin: profile?.role === 'admin' });
    } catch (error) {
        console.error('Error decoding token or verifying profile:', error);
        const authFailure = error instanceof jwt.JsonWebTokenError || error.message === 'Profile not found';
        res.status(authFailure ? 401 : 500).json({ message: authFailure ? 'Invalid token' : 'Failed to verify session' });
    }
};

module.exports = {
    login,
    verify,
    me,
};