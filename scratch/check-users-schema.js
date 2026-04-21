
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function checkUsersTable() {
    try {
        const result = await sql`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users'
        `;
        console.log("Users Table Schema:");
        console.table(result);
    } catch (err) {
        console.error("DB Error:", err);
    }
}

checkUsersTable();
