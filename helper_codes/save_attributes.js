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

async function createCategoryAttributesColumn() {
    try {
        // Check if the column exists
        const checkQuery = `
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'trendyol_categories' AND column_name = 'category_attributes'
            );
        `;
        const result = await client.query(checkQuery);
        const columnExists = result.rows[0].exists;

        if (!columnExists) {
            // Create the column if it does not exist
            const createQuery = `
                ALTER TABLE trendyol_categories
                ADD COLUMN category_attributes JSONB;
            `;
            await client.query(createQuery);
            console.log('Created category_attributes column.');
        } else {
            console.log('category_attributes column already exists.');
        }
    } catch (error) {
        console.error('Error creating category_attributes column:', error);
    }
}

async function fetchCategoryAttributes(categoryId) {
    try {
        const response = await axios.get(`https://api.trendyol.com/sapigw/product-categories/${categoryId}/attributes`);
        return response.data.categoryAttributes.slice(0, 5); // Take up to 5 attributes
    } catch (error) {
        console.error(`Error fetching attributes for category ${categoryId}:`, error);
        return [];
    }
}

async function updateCategoryAttributes() {
    try {
        console.log('Updating category attributes...');

        // Connect to the database
        await connectToDatabase();

        // Ensure category_attributes column exists
        await createCategoryAttributesColumn();

        // Fetch all categories from the database
        const query = 'SELECT category_id FROM trendyol_categories';
        const result = await client.query(query);

        // Process each category to fetch and update attributes
        const categories = result.rows;
        for (const category of categories) {
            const categoryId = category.category_id;
            console.log(`Fetching attributes for category ${categoryId}...`);
            const attributes = await fetchCategoryAttributes(categoryId);
            const attributesJson = JSON.stringify(attributes);

            // Update the category row with attributes
            const updateQuery = `
                UPDATE trendyol_categories
                SET category_attributes = $1
                WHERE category_id = $2
            `;
            const updateValues = [attributesJson, categoryId];
            await client.query(updateQuery, updateValues);
            console.log(`Updated attributes for category ${categoryId}`);
        }

        console.log('Category attributes update completed.');

    } catch (error) {
        console.error('Error updating category attributes:', error);
    } finally {
        // Close the database connection
        await client.end();
        console.log('Database connection closed.');
    }
}

// Start the update process
updateCategoryAttributes();
