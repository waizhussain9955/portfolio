import * as dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config({ path: '.env.local' });

async function test() {
    console.log("Testing Neon connection...");
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error("DATABASE_URL is not defined");
        return;
    }
    const sql = neon(databaseUrl);
    try {
        const result = await sql`SELECT 1 as connected`;
        console.log("Result:", result);
    } catch (error) {
        console.error("Neon Error:", error);
    }
}

test();
