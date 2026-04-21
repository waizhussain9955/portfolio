const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function listAllImages() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const projects = await sql`SELECT id, title, image FROM projects`;
    console.log('Project Images:', JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

listAllImages();
