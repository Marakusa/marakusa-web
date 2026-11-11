const { Client, Databases, Query } = require('node-appwrite');

let databases;

const initAppwrite = () => {
    if (databases) return databases;

    const requiredVariables = [
        'APPWRITE_ENDPOINT',
        'APPWRITE_PROJECT_ID',
        'APPWRITE_API_KEY',
    ];
    const missing = requiredVariables.filter((name) => !process.env[name]);

    if (missing.length) {
        throw new Error(`Missing Appwrite configuration: ${missing.join(', ')}`);
    }

    const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    databases = new Databases(client);
    return databases;
};

const listCollectionDocuments = async (databaseId, collectionId) => {
    if (!databases) {
        throw new Error('Appwrite must be initialized before querying collections');
    }

    const service = databases;

    if (!databaseId || !collectionId) {
        throw new Error('Appwrite database ID and collection ID are required');
    }

    const documents = [];
    const pageSize = 100;
    let offset = 0;

    while (true) {
        const result = await service.listDocuments(databaseId, collectionId, [
            Query.limit(pageSize),
            Query.offset(offset),
        ]);
        documents.push(...result.documents);

        if (result.documents.length < pageSize) break;
        offset += pageSize;
    }

    return documents;
};

module.exports = { initAppwrite, listCollectionDocuments };