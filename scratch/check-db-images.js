
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function checkProjects() {
    const sql = neon(process.env.DATABASE_URL);
    try {
        const projects = await sql`SELECT title, image FROM projects`;
        console.log("Projects in DB:");
        console.table(projects);
    } catch (error) {
        console.error("Error:", error);
    }
}

checkProjects();
