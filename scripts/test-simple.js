const { Cerebras } = require('@cerebras/cerebras_cloud_sdk');
const fs = require('fs');
const path = require('path');
const { stringSimilarity } = require('string-similarity-js');
const dotenv = require('dotenv');

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = new Cerebras({
    apiKey: process.env.CEREBRAS_API_KEY,
});

async function testSimple() {
    const query = "What are Laiba's skills?";
    console.log("Testing Query:", query);

    const resumePath = path.join(process.cwd(), 'lib/data/resume.txt');
    const resumeText = fs.readFileSync(resumePath, 'utf-8');
    
    // Create prompt
    const systemPrompt = `You are a personal AI assistant for Laiba's portfolio. Use this resume context: ${resumeText.substring(0, 500)}...`;
    
    try {
        const response = await client.chat.completions.create({
            model: 'gpt-oss-120b',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: query }
            ],
        });
        console.log("Response:", response.choices[0].message.content);
    } catch (e) {
        console.error("Test Failed:", e);
    }
}

testSimple();
