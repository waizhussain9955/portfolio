
const fetch = require('node-fetch');

async function testChat() {
    try {
        const response = await fetch('http://localhost:3003/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "What projects do you have?" })
        });
        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

testChat();
