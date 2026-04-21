const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function checkSchema() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'projects'
    `;
    console.log('Columns:', JSON.stringify(columns, null, 2));
    
    const rows = await sql`SELECT * FROM projects LIMIT 1`;
    console.log('First Row:', JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSchema();
