const fs = require('fs');
const readline = require('readline');

async function extract() {
    const rl = readline.createInterface({
        input: fs.createReadStream('.system_generated/logs/transcript.jsonl'),
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.includes('capture_browser_console_logs')) {
            const data = JSON.parse(line);
            console.log("Keys:", Object.keys(data));
            console.log("type:", data.type);
            console.log("status:", data.status);
            console.log("source:", data.source);
            if (data.tool_calls) {
                console.log("tool_calls:", JSON.stringify(data.tool_calls, null, 2));
            }
            if (data.output) {
                console.log("output snippet:", data.output.substring(0, 500));
            }
            if (data.content) {
                console.log("content snippet:", data.content.substring(0, 500));
            }
            break; // just print the first one to inspect structure
        }
    }
}

extract();
