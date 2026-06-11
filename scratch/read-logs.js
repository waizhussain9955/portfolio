const fs = require('fs');
const readline = require('readline');

async function readLogs() {
    const rl = readline.createInterface({
        input: fs.createReadStream('.system_generated/logs/transcript.jsonl'),
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.includes('capture_browser_console_logs')) {
            const data = JSON.parse(line);
            if (data.content && data.content.includes('Warning:')) {
                console.log("--- BROWSER CONSOLE ---");
                console.log(data.content);
            }
            // If it's a tool output, print it
            if (data.type === 'SYSTEM_MESSAGE' && data.content) {
                const text = data.content;
                const match = text.match(/Output:([\s\S]*?)Log:/);
                if (match) {
                    console.log("--- SYSTEM OUTPUT ---");
                    console.log(match[1]);
                }
            }
        }
    }
}

readLogs();
