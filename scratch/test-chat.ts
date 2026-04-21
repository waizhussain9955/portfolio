import { getChatResponse } from '../lib/ai/chatbot';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testChat() {
    try {
        console.log("Testing chatbot...");
        const response = await getChatResponse("tell me about your projects", []);
        console.log("Bot Response:", response);
    } catch (err) {
        console.error("Chat Error:", err);
    }
}

testChat();
