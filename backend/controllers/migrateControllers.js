const { readAll } = require('../services/appwrite');
const { License } = require('../models/licenseModels');
const { Product } = require('../models/productModels');
const { Profile } = require('../models/profileModels');

const getMigrationProgress = async (req, res) => {
    try {
        // Your logic to get migration progress goes here
        res.status(200).json({ progress: 'Migration progress' });
    } catch (error) {
        console.error('Failed to get migration progress:', error);
        res.status(500).json({ error: 'Failed to get migration progress' });
    }
};

const migrateFromAppwrite = async (req, res) => {
    try {
        // Appwrite profile fields:
        // - $id: string (required)
        // - discord_id: string (required)
        // - gumroad_id: string
        // - createdAt: datetime (required)
        // - username: string
        // - avatar: string
        // - nextDiscordFetch: datetime (default: 2025-09-22)
        const awProfiles = await readAll(process.env.APPWRITE_PROFILES_COLLECTION, process.env.APPWRITE_DATABASE_ID);
        // Appwrite license fields:
        // - $id: string (required)
        // - createdAt: datetime (required)
        // - product_id: string (required) -> one of the product_id of product values
        // - internal_product_id: string (required) -> $id of product
        // - license_key: string (required)
        // - user_id: relationship with user_id
        const awLicenses = await readAll(process.env.APPWRITE_LICENSES_COLLECTION, process.env.APPWRITE_DATABASE_ID);
        const licensesByUser = Map.groupBy(awLicenses, l => l.user_id?.$id);
        
        // Fetch all from the current database
        const profiles = await Profile.find();
        const products = await Product.find();
        const licenses = await License.find();

        let skippedProfiles = 0;
        let migratedProfiles = 0;
        let skippedLicenses = 0;
        let notMigrateableLicenses = 0;
        let migratedLicenses = 0;
        
        for (const awProfile of awProfiles) {
            const profileLicenses = licensesByUser.get(awProfile.$id) ?? [];

            // Check if profile exists by Discord ID
            let profile = profiles.find(profile => profile.discord_id === awProfile.discord_id);
            if (!profile) {
                // Create new profile if it doesn't exist
                const newProfile = await Profile.create({
                    discord_id: awProfile.discord_id,
                    username: awProfile.username,
                    avatar: awProfile.avatar,
                });
                migratedProfiles++;
                profiles.push(newProfile);
                profile = newProfile;
            } else {
                skippedProfiles++;
            }

            // Migrate non existing licenses
            for (const awLicense of profileLicenses) {
                const existingLicense = licenses.find(license => license.license_key === awLicense.license_key);
                if (!existingLicense) {
                    const product = products.find(product => product.jinxxy_product_id === awLicense.product_id);
                    if (!product) {
                        notMigrateableLicenses++;
                        continue;
                    }
                    const newLicense = await License.create({
                        user_id: profile._id,
                        license_key: awLicense.license_key,
                        product_id: product.jinxxy_product_id,
                        internal_product_id: product._id
                    });
                    licenses.push(newLicense);
                    migratedLicenses++;
                } else {
                    skippedLicenses++;
                }
            }
        }
        
        const awProfileIds = new Set(awProfiles.map(p => p.$id));
        const licensesWithoutProfiles = awLicenses.filter(l => !awProfileIds.has(l.user_id?.$id)).length;
        skippedLicenses += licensesWithoutProfiles;

        console.log(`Migrated ${migratedProfiles} and skipped ${skippedProfiles} profiles`);
        console.log(`Migrated ${migratedLicenses} and skipped ${skippedLicenses} licenses`);
        console.log(`Not migrateable licenses: ${notMigrateableLicenses} (either Gumroad or Lemon Squeezy licenses)`);
        res.status(200).json({ message: 'Migration successful' });
    } catch (error) {
        console.error('Migration failed:', error);
        res.status(500).json({ error: 'Migration failed' });
    }
};

module.exports = { migrateFromAppwrite, getMigrationProgress };