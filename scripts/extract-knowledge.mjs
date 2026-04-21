import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import { projects } from '../components/Projects.tsx';

async function extractKnowledge() {
    const resumePath = path.resolve(process.cwd(), 'public/resume/Laiba_Khan_Resume.pdf');
    const dataBuffer = fs.readFileSync(resumePath);
    
    let resumeText = "";
    try {
        const data = await pdf(dataBuffer);
        resumeText = data.text;
    } catch (error) {
        console.error("Error parsing PDF:", error);
    }

    const knowledge = {
        resume: resumeText,
        projects: projects.map(p => ({
            title: p.title,
            description: p.desc,
            tags: p.tags.join(', '),
            link: p.liveLink || p.githubLink || 'N/A'
        }))
    };

    const outputPath = path.resolve(process.cwd(), 'lib/data/knowledge.json');
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(knowledge, null, 2));
    console.log("Knowledge base extracted and saved to lib/data/knowledge.json");
}

extractKnowledge();
