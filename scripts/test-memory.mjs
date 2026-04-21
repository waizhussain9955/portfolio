import { getChatResponse } from '../lib/ai/chatbot';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

async function verifyMemory() {
    console.log("🚀 Testing Chatbot Memory Accuracy...\n");

    const history = [
        { role: 'user', content: 'What is your name?' },
        { role: 'assistant', content: 'I am Laiba Khan\'s AI assistant.' },
        { role: 'user', content: 'What are your top 3 projects?' },
        { role: 'assistant', content: 'Her top projects include the Physical AI Humanoid, the AI Task Manager, and the Wayne Watch Store.' }
    ];

    const followUpQuery = "Tell me more about the first one you mentioned.";

    console.log(`\x1b[36mHistory Context:\x1b[0m ${JSON.stringify(history, null, 2)}`);
    console.log(`\x1b[36mFollow-up Query:\x1b[0m ${followUpQuery}\n`);

    try {
        const response = await getChatResponse(followUpQuery, history as any);
        console.log(`\x1b[32mBot:\x1b[0m ${response}\n`);
        
        if (response.toLowerCase().includes("physical ai") || response.toLowerCase().includes("humanoid")) {
            console.log("✅ Success: Bot correctly identified 'the first one' from history!");
        } else {
            console.log("❌ Failure: Bot might have lost context.");
        }
    } catch (error) {
        console.log(`\x1b[31mError:\x1b[0m`, error);
    }
}

verifyMemory();
