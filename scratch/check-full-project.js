const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function checkProjects() {
    try {
        const projects = await sql`SELECT * FROM projects LIMIT 1`;
        console.log("Full Project Object:");
        console.log(JSON.stringify(projects[0], null, 2));
    } catch (err) {
        console.error("DB Error:", err);
    }
}

checkProjects();
