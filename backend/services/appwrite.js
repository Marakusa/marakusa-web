const { Query } = require('node-appwrite');

const PAGE_SIZE = 100;

const listDocuments = async (databaseId, collectionId, queries = []) => {
    const url = new URL(
        `${process.env.APPWRITE_ENDPOINT.replace(/\/+$/, '')}/databases/${encodeURIComponent(databaseId)}/collections/${encodeURIComponent(collectionId)}/documents`
    );
    for (const query of queries) {
        url.searchParams.append('queries[]', query);
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID,
            'X-Appwrite-Key': process.env.APPWRITE_API_KEY,
        },
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        const error = new Error(`Appwrite request failed (${response.status}): ${data?.message ?? response.statusText}`);
        error.statusCode = 502;
        throw error;
    }
    if (!Array.isArray(data?.documents)) {
        throw new Error('Invalid response from Appwrite API');
    }
    return data;
};

const readAll = async (collectionId, databaseId = process.env.APPWRITE_DATABASE_ID) => {
    const all = [];
    let cursor = null;

    while (true) {
        const queries = [Query.limit(PAGE_SIZE)];
        if (cursor) {
            queries.push(Query.cursorAfter(cursor));
        }

        const { documents } = await listDocuments(databaseId, collectionId, queries);

        all.push(...documents);
        if (documents.length < PAGE_SIZE) {
            break;
        }
        cursor = documents[documents.length - 1].$id;
    }

    return all;
};

module.exports = { readAll };
