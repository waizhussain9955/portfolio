const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function checkResume() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const chunks = await sql`SELECT count(*) FROM resume_chunks`;
    console.log('Resume Chunks Count:', chunks[0].count);
    
    const sample = await sql`SELECT content FROM resume_chunks LIMIT 1`;
    console.log('Sample Chunk:', JSON.stringify(sample, null, 2));
  } catch (error) {
    console.error('Error querying resume_chunks:', error);
  }
}

checkResume();
