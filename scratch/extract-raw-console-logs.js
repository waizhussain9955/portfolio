const fs = require('fs');
const readline = require('readline');

async function extract() {
    const rl = readline.createInterface({
        input: fs.createReadStream('.system_generated/logs/transcript.jsonl'),
        crlfDelay: Infinity
    });

    let calls = [];
    for await (const line of rl) {
        try {
            const data = JSON.parse(line);
            // Check if there are tool calls or results in this step
            if (line.includes('capture_browser_console_logs')) {
                calls.push({
                    step_index: data.step_index,
                    type: data.type,
                    status: data.status,
                    tool_calls: data.tool_calls,
                    output: data.output,
                    content: data.content
                });
            }
        } catch (_) {}
    }

    // Write all matching calls to the file
    fs.writeFileSync('d:/waiz-new-portfolio-with-chatbot/scratch/raw_console_calls.txt', JSON.stringify(calls, null, 2), 'utf-8');
    console.log(`Successfully extracted ${calls.length} console log entries!`);
}

extract();
