
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function test() {
    const url = process.env.DATABASE_URL;
    if (!url) return;
    const sql = neon(url);
    
    try {
        console.log("Checking users schema...");
        const columns = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users'
        `;
        console.log("Users Columns:", columns);
    } catch (err) {
        console.error("Error:", err);
    }
}

test();
