import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
    const res = await sql`SELECT title, image FROM projects`;
    console.log(JSON.stringify(res, null, 2));
}

main();
