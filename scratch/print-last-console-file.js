const fs = require('fs');

function printFile(filePath) {
    if (fs.existsSync(filePath)) {
        console.log(`=== ${filePath} ===`);
        const content = fs.readFileSync(filePath, 'utf-8');
        console.log(content.substring(0, 5000));
    } else {
        console.log(`${filePath} does not exist.`);
    }
}

// Let's find the highest number in console_output_*.txt
let i = 1;
while (fs.existsSync(`d:/waiz-new-portfolio-with-chatbot/scratch/console_output_${i}.txt`)) {
    i++;
}
const max = i - 1;
console.log(`Max index is ${max}`);
printFile(`d:/waiz-new-portfolio-with-chatbot/scratch/console_output_${max}.txt`);
printFile(`d:/waiz-new-portfolio-with-chatbot/scratch/console_output_${max-1}.txt`);
printFile(`d:/waiz-new-portfolio-with-chatbot/scratch/console_output_${max-2}.txt`);
