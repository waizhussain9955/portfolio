
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function test() {
    const url = process.env.DATABASE_URL;
    console.log("Testing connection to:", url ? url.split('@')[1] : "undefined");
    
    if (!url) {
        console.error("DATABASE_URL is missing");
        return;
    }

    const sql = neon(url);
    
    try {
        console.log("Running query...");
        const result = await Promise.race([
            sql`SELECT 1 as result`,
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout after 10s")), 10000))
        ]);
        console.log("Result:", result);
    } catch (err) {
        console.error("Error:", err);
    }
}

test().then(() => console.log("Done"));
