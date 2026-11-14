const { verifyProfile } = require('../utils/profileUtils');

const getProfile = async (req, res) => {
    try {
        const profile = await verifyProfile(req.user.profileId);
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getProfile };