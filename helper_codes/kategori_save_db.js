const axios = require('axios');
const { Client } = require('pg');
const cron = require('node-cron');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123456789',
    port: 5432,
});

async function createTableIfNotExists() {
    const query = `
        CREATE TABLE IF NOT EXISTS trendyol_categories (
            category_id SERIAL PRIMARY KEY,
            category_name VARCHAR(255) NOT NULL,
            UNIQUE (category_id)
        );
    `;

    try {
        await client.connect();
        await client.query(query);
        console.log('Table trendyol_categories is ready.');
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

async function getCategoryTree() {
    try {
        const response = await axios.get('https://api.trendyol.com/sapigw/product-categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching category tree:', error);
        return null;
    }
}

async function saveCategoryToDatabase(categoryId, categoryName) {
    const query = `
        INSERT INTO trendyol_categories (category_id, category_name)
        VALUES ($1, $2)
        ON CONFLICT (category_id) DO UPDATE
        SET category_name = EXCLUDED.category_name;
    `;
    const values = [categoryId, categoryName];

    try {
        await client.query(query, values);
        console.log(`Category ${categoryName} saved to database.`);
    } catch (error) {
        console.error(`Error saving category ${categoryName} to database:`, error);
    }
}

async function processCategories(categories) {
    if (!Array.isArray(categories)) {
        console.error('Categories data is not an array:', categories);
        return;
    }

    for (const category of categories) {
        const { id, name, subCategories } = category;

        // Skip category if the name is only numbers
        if (isNameOnlyNumbers(name)) {
            console.log(`Skipping category with numeric name: ${name}`);
            continue;
        }

        // Save category to database
        await saveCategoryToDatabase(id, name);

        // Recursively process subcategories
        if (Array.isArray(subCategories) && subCategories.length > 0) {
            await processCategories(subCategories);
        }
    }
}

async function updateCategories() {
    const categoryTree = await getCategoryTree();
    if (categoryTree && Array.isArray(categoryTree.categories)) {
        await processCategories(categoryTree.categories);
    } else {
        console.error('No categories found or error fetching categories.');
    }
}

async function start() {
    try {
        // Ensure the table exists
        await createTableIfNotExists();

        // Update categories
        await updateCategories();

        // Close the client connection
        await client.end();
        console.log('Database connection closed.');

    } catch (error) {
        console.error('Error in script:', error);
    } finally {
        // Ensure client is closed even if an error occurred
        await client.end();
        console.log('Database connection closed.');

        // Schedule the script to run every day at midnight
        cron.schedule('0 0 * * *', async () => {
            console.log('Running category update...');
            try {
                await client.connect();
                await updateCategories();
                await client.end();
                console.log('Database connection closed.');
            } catch (error) {
                console.error('Error running scheduled update:', error);
                await client.end();
                console.log('Database connection closed due to error.');
            }
        });
    }
}

// Start the process
start();
