const { getChatResponse } = require('../lib/ai/chatbot');

async function debug() {
    try {
        console.log("Starting debug chat...");
        const response = await getChatResponse("hi", []);
        console.log("Response:", response);
    } catch (error) {
        console.error("DEBUG ERROR:", error);
    }
}

debug();
