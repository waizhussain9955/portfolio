const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function checkResume() {
    try {
        const chunks = await sql`SELECT content FROM resume_chunks LIMIT 5`;
        console.log("Resume Chunks Found:", chunks.length);
        console.table(chunks);
    } catch (err) {
        console.error("DB Error (resume_chunks):", err);
    }
}

checkResume();
