
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function checkUsersTable() {
    const sql = neon(process.env.DATABASE_URL);
    try {
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;
        console.log("Tables in DB:", tables.map(t => t.table_name));
        
        if (tables.some(t => t.table_name === 'users')) {
            const columns = await sql`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'users'
            `;
            console.log("Columns in 'users' table:");
            console.table(columns);
        } else {
            console.log("'users' table does NOT exist.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

checkUsersTable();
