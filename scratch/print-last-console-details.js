const fs = require('fs');
const readline = require('readline');

async function extract() {
    const rl = readline.createInterface({
        input: fs.createReadStream('.system_generated/logs/transcript.jsonl'),
        crlfDelay: Infinity
    });

    let entries = [];
    for await (const line of rl) {
        try {
            const data = JSON.parse(line);
            // Search for tool result output
            if (data.source === 'SYSTEM' && data.content && data.content.includes('Browser subagent result')) {
                entries.push({
                    step_index: data.step_index,
                    content: data.content
                });
            }
        } catch (_) {}
    }

    console.log(`Found ${entries.length} subagent result entries.`);
    const last = entries.slice(-1)[0];
    if (last) {
        console.log(`=== Step Index ${last.step_index} ===`);
        console.log(last.content);
    }
}

extract();
