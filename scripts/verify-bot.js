const { Cerebras } = require('@cerebras/cerebras_cloud_sdk');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = new Cerebras({
    apiKey: process.env.CEREBRAS_API_KEY,
});

async function runVerification() {
    const questions = [
        "Tell me about her experience with Agentic AI",
        "Show me her Next.js projects",
        "What are her key skills?"
    ];

    const resumeText = fs.readFileSync(path.join(process.cwd(), 'lib/data/resume.txt'), 'utf-8');
    
    console.log("--- FINAL VERIFICATION ---\n");

    for (const q of questions) {
        console.log(`Q: ${q}`);
        const response = await client.chat.completions.create({
            model: 'llama3.1-8b',
            messages: [
                { role: 'system', content: `You are Laiba Khan's AI assistant. context: ${resumeText}` },
                { role: 'user', content: q }
            ],
        });
        console.log(`A: ${response.choices[0].message.content}\n`);
    }
}

runVerification();
