const { getDocument, upsertDocument } = require('../services/appwrite');
const jwt = require('jsonwebtoken');

const discordLogin = async () => {
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}&response_type=code&scope=identify&state=${process.env.DISCORD_STATE}`;
    return authUrl;
};

const discordCallback = async (code) => {
    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.DISCORD_REDIRECT_URI
        })
    });
    const data = await response.json();
    return data;
};

const discordGetUser = async (accessToken) => {
    const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    return data;
};

const generateToken = async (discordId, username, avatar, profile) => {
    const sessionData = {
        discordId,
        username,
        avatar,
        profile,
    };
    
    const token = jwt.sign(sessionData, process.env.JWT_SECRET, { expiresIn: '30d' });
    return token;
};

module.exports = {
    discordLogin,
    discordCallback,
    discordGetUser,
    generateToken
};