
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function checkProjects() {
    try {
        const projects = await sql`SELECT title, image FROM projects`;
        console.log("Current Projects in DB:");
        console.table(projects);
    } catch (err) {
        console.error("DB Error:", err);
    }
}

checkProjects();
