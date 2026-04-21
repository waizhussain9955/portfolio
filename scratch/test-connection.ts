
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    const url = process.env.DATABASE_URL;
    console.log("Testing connection to:", url?.split('@')[1]); // Don't log password
    
    if (!url) {
        console.error("DATABASE_URL is missing");
        return;
    }

    const sql = neon(url);
    
    try {
        console.log("Running query...");
        const result = await Promise.race([
            sql`SELECT 1 as result`,
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout after 5s")), 5000))
        ]);
        console.log("Result:", result);
    } catch (err) {
        console.error("Error:", err);
    }
}

test();
