const { Cerebras } = require('@cerebras/cerebras_cloud_sdk');
require('dotenv').config({ path: '.env.local' });

async function testCerebras() {
    const apiKey = process.env.CEREBRAS_API_KEY;
    console.log("API Key present:", !!apiKey);
    if (!apiKey) return;

    try {
        const client = new Cerebras({ apiKey });
        const response = await client.chat.completions.create({
            model: 'gpt-oss-120b',
            messages: [{ role: 'user', content: 'Say hello in 3 words' }],
            max_tokens: 100
        });
        console.log("Full Response Choice message:", JSON.stringify(response.choices[0].message, null, 2));
    } catch (err) {
        console.error("Cerebras Error:", err.message);
    }
}

testCerebras();
