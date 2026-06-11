const fs = require('fs');
const readline = require('readline');

async function extract() {
    const rl = readline.createInterface({
        input: fs.createReadStream('.system_generated/logs/transcript.jsonl'),
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.includes('capture_browser_console_logs') && line.includes('"status":"DONE"')) {
            const data = JSON.parse(line);
            // Print the tool response/output
            if (data.output) {
                console.log(`--- Step ${data.step_index} Tool Output ---`);
                console.log(data.output);
            }
            if (data.content) {
                console.log(`--- Step ${data.step_index} Content ---`);
                console.log(data.content);
            }
        }
    }
}

extract();
