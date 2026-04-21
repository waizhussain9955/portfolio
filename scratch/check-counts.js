
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function test() {
    const url = process.env.DATABASE_URL;
    if (!url) return;
    const sql = neon(url);
    
    try {
        const projects = await sql`SELECT count(*) FROM projects`;
        const resume = await sql`SELECT count(*) FROM resume_chunks`;
        console.log("Projects count:", projects[0].count);
        console.log("Resume chunks count:", resume[0].count);
    } catch (err) {
        console.error("Error:", err);
    }
}

test();
