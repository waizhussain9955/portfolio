import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not defined');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function checkData() {
  console.log('Checking projects in database...');
  try {
    const projects = await sql`SELECT title, image FROM projects`;
    console.log('Projects:', JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error('Error querying database:', error);
  }
}

checkData();
