
const { Cerebras } = require('@cerebras/cerebras_cloud_sdk');
require('dotenv').config({ path: '.env.local' });

async function testCerebras() {
    const apiKey = process.env.CEREBRAS_API_KEY;
    console.log("API Key present:", !!apiKey);
    if (!apiKey) return;

    try {
        const client = new Cerebras({ apiKey });
        const response = await client.chat.completions.create({
            model: 'llama3.1-8b',
            messages: [{ role: 'user', content: 'hi' }],
            max_tokens: 10
        });
        console.log("Cerebras Response:", response.choices[0].message.content);
    } catch (err) {
        console.error("Cerebras Error:", err.message);
    }
}

testCerebras();
