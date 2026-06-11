const fs = require('fs');
const readline = require('readline');

async function extract() {
    const rl = readline.createInterface({
        input: fs.createReadStream('.system_generated/logs/transcript.jsonl'),
        crlfDelay: Infinity
    });

    let count = 0;
    for await (const line of rl) {
        if (line.includes('capture_browser_console_logs') && line.includes('"status":"DONE"')) {
            const data = JSON.parse(line);
            count++;
            if (data.output) {
                fs.writeFileSync(`d:/waiz-new-portfolio-with-chatbot/scratch/console_output_${count}.txt`, data.output, 'utf-8');
            }
        }
    }
    console.log(`Extracted ${count} console output files!`);
}

extract();
