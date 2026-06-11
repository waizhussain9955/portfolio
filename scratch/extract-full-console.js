const fs = require('fs');
const readline = require('readline');

async function extract() {
    const rl = readline.createInterface({
        input: fs.createReadStream('.system_generated/logs/transcript.jsonl'),
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        try {
            const data = JSON.parse(line);
            // Search for capture_browser_console_logs done calls
            if (data.type === 'CALL_TOOL' && data.tool_calls) {
                for (const call of data.tool_calls) {
                    if (call.name === 'capture_browser_console_logs') {
                        console.log(`--- CALL TOOL STEP ${data.step_index} ---`);
                        console.log(JSON.stringify(call, null, 2));
                    }
                }
            }
            if (data.type === 'SYSTEM_MESSAGE' && data.content && data.content.includes('capture_browser_console_logs')) {
                console.log(`--- SYSTEM MESSAGE STEP ${data.step_index} ---`);
                console.log(data.content.substring(0, 1500));
            }
        } catch (_) {}
    }
}

extract();
