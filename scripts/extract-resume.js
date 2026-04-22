const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

async function extractResume() {
    const resumePath = path.resolve(process.cwd(), 'public/resume/Waiz_Resume_Full_Stack_Dev.pdf');
    if (!fs.existsSync(resumePath)) {
        console.error("Resume not found at:", resumePath);
        return;
    }
    const dataBuffer = fs.readFileSync(resumePath);
    
    try {
        const parser = new PDFParse({ data: dataBuffer });
        const result = await parser.getText();
        const resumeText = result.text;
        
        const outputDir = path.resolve(process.cwd(), 'lib/data');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        fs.writeFileSync(path.join(outputDir, 'resume.txt'), resumeText);
        console.log("Resume text extracted to lib/data/resume.txt");
        
        await parser.destroy();
    } catch (error) {
        console.error("Error parsing PDF:", error);
    }
}

extractResume();
