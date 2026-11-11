# Backend

Configure the Appwrite project before starting the API:

1. Copy `.env.example` to `.env` and fill in the project, API key, database, and products collection IDs.
2. Create a products collection with a required string `name`, required numeric `price`, and optional string `description` attribute. Give the API key permission to read the database.
3. Run `npm install` and `npm run dev` from this directory.

The products endpoint is `GET /api/store/products`.