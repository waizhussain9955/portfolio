import { getChatResponse } from '../lib/ai/chatbot.ts';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: '.env.local' });

async function runTests() {
    const testQueries = [
        "Who is Laiba Khan?",
        "What are her key skills?",
        "Show me her Next.js projects.",
        "Does she know Python?",
        "Tell me about her experience with Agentic AI.",
        "What can the AI assistant do?"
    ];

    console.log("--- Starting Chatbot Logic Verification ---\n");

    for (const query of testQueries) {
        console.log(`User: ${query}`);
        try {
            const response = await getChatResponse(query);
            console.log(`Bot Output: ${response}`);
            console.log("-------------------------------------------\n");
        } catch (error) {
            console.error(`Error for query "${query}":`, error);
        }
    }
}

runTests();
