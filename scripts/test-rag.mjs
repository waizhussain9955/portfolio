import { getChatResponse } from '../lib/ai/chatbot.ts';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from .env.local
dotenv.config({ path: '.env.local' });

async function verifyBot() {
    console.log("🚀 Testing Chatbot RAG with Neon DB...\n");

    const tests = [
        "Who is Laiba Khan?",
        "Show me her projects built with Next.js",
        "Does she have experience with Agentic AI and MCP?",
        "What are her contact details?",
        "Can you show me the Wayne Watch Store project?",
        "What certifications does she hold?"
    ];

    for (const query of tests) {
        console.log(`\x1b[36mUser:\x1b[0m ${query}`);
        try {
            const response = await getChatResponse(query);
            console.log(`\x1b[32mBot:\x1b[0m ${response}\n`);
            console.log("-".repeat(50) + "\n");
        } catch (error) {
            console.log(`\x1b[31mError:\x1b[0m for query "${query}":`, error);
        }
    }
}

verifyBot();
