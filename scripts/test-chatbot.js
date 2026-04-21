const { getChatResponse } = require('../lib/ai/chatbot');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runTests() {
    const testQueries = [
        "Who is Laiba Khan?",
        "What are her key skills?",
        "Show me her Next.js projects.",
        "Does she know Python?",
        "Tell me about her experience with Agentic AI.",
        "What is the weather today?" // Off-topic test
    ];

    console.log("--- Starting Chatbot Logic Verification ---\n");

    for (const query of testQueries) {
        console.log(`User: ${query}`);
        try {
            const response = await getChatResponse(query);
            console.log(`Bot: ${response}\n`);
            console.log("-------------------------------------------\n");
        } catch (error) {
            console.error(`Error for query "${query}":`, error);
        }
    }
}

runTests();
