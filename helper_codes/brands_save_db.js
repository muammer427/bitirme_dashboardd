const axios = require('axios');
const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123456789',
    port: 5432,
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to the database.');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

async function createBrandsTableIfNotExists() {
    const query = `
        CREATE TABLE IF NOT EXISTS trendyol_brands (
            brand_id BIGINT PRIMARY KEY,
            brand_name VARCHAR(255) NOT NULL
        );
    `;

    try {
        await client.query(query);
        console.log('Table trendyol_brands is ready.');
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

async function fetchBrands() {
    try {
        const response = await axios.get('https://api.trendyol.com/sapigw/brands');
        return response.data.brands;
    } catch (error) {
        console.error('Error fetching brands:', error);
        return [];
    }
}

async function saveBrandsToDatabase(brands) {
    try {
        for (const brand of brands) {
            const query = `
                INSERT INTO trendyol_brands (brand_id, brand_name)
                VALUES ($1, $2)
                ON CONFLICT (brand_id) DO NOTHING;
            `;
            const values = [brand.id, brand.name];

            await client.query(query, values);
            console.log(`Brand ${brand.name} saved to database.`);
        }
    } catch (error) {
        console.error('Error saving brands to database:', error);
    }
}

async function deleteNumberOnlyBrands() {
    const query = `
        DELETE FROM trendyol_brands
        WHERE brand_name ~ '^[0-9]+$';
    `;

    try {
        const result = await client.query(query);
        console.log(`Deleted ${result.rowCount} number-only brand rows from the database.`);
    } catch (error) {
        console.error('Error deleting number-only brand rows:', error);
    }
}

async function updateBrandsTable() {
    try {
        console.log('Updating brands data...');

        // Ensure the table exists
        await createBrandsTableIfNotExists();

        // Fetch brands from Trendyol API
        const brands = await fetchBrands();

        // Save brands to database
        await saveBrandsToDatabase(brands);

        // Delete number-only brand names from the database
        await deleteNumberOnlyBrands();

        console.log('Brand data update completed.');

    } catch (error) {
        console.error('Error updating brands data:', error);
    } finally {
        // Close the client connection
        await client.end();
        console.log('Database connection closed.');
    }
}

// Start the update process
async function start() {
    try {
        // Connect to the database
        await connectToDatabase();

        // Update brands data
        await updateBrandsTable();

    } catch (error) {
        console.error('Error in script:', error);
    } finally {
        // Ensure client is closed even if an error occurred
        await client.end();
        console.log('Database connection closed.');
    }
}

// Start the process
start();
