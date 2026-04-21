import { getChatResponse } from '../lib/ai/chatbot';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function runComprehensiveTests() {
    console.log("🤖 Starting Comprehensive Chatbot Test Suite...\n");

    const queries = [
        "Who is Laiba Khan, what does she do, and where is she from?",
        "Where is she currently studying? Is her education complete?",
        "Can you show me her legacy projects regarding weather and currency?",
        "Tell me about her work with Next.js and Tailwind. Show me the Noir Éclat project.",
        "What is her Physical AI & Humanoid Robotics project about?",
        "I need a copy of her CV. Can I download her resume?"
    ];

    const history: { role: 'user' | 'assistant', content: string }[] = [];

    for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        console.log(`\x1b[36m👤 User:\x1b[0m ${query}`);
        
        try {
            const response = await getChatResponse(query, history);
            console.log(`\x1b[32m🤖 Bot:\x1b[0m ${response}\n`);
            
            // Maintain history limits just like the frontend
            history.push({ role: 'user', content: query });
            history.push({ role: 'assistant', content: response });
            
            if (history.length > 10) {
                history.splice(0, history.length - 10);
            }
        } catch (error) {
            console.error(`\x1b[31m❌ Error testing query:\x1b[0m`, error);
        }
        
        // Small delay to simulate natural chat
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log("✅ Comprehensive Test Suite Completed.");
}

runComprehensiveTests();
