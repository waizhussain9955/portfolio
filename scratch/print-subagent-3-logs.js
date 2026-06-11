const fs = require('fs');

function extract() {
    const content = fs.readFileSync('d:/waiz-new-portfolio-with-chatbot/scratch/subagent_result_3.txt', 'utf-8');
    
    // Let's find capture_browser_console_logs in the text
    const term = 'capture_browser_console_logs';
    let idx = 0;
    while ((idx = content.indexOf(term, idx)) !== -1) {
        console.log(`--- Match at index ${idx} ---`);
        // Print 3000 characters around the match
        console.log(content.substring(idx, idx + 4000));
        idx += term.length;
    }
}

extract();
