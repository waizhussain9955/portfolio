import { Cerebras } from '@cerebras/cerebras_cloud_sdk';
import { sql } from '../neon';
import { stringSimilarity } from 'string-similarity-js';

const client = process.env.CEREBRAS_API_KEY 
    ? new Cerebras({ apiKey: process.env.CEREBRAS_API_KEY })
    : null;

interface Project {
    title: string;
    description: string;
    tags: string[];
    gradient: string;
    image: string;
    live_link: string;
    github_link: string;
}

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export async function getChatResponse(userMessage: string, history: ChatMessage[] = []) {
    // 1. Load configurations from site_settings database
    let chatbotConfig = {
        system_prompt: `⚠️ GOLDEN RULE: ONLY speak about projects explicitly listed in the "Relevant Projects Data" section below. 
- If a project is not in that list, IT DOES NOT EXIST.
- NEVER invent, hallucinate, or assume he has other projects.
- Speak in the third person.
- Keep answers SHORT and snappy.
- Use [PROJECT_CARD: Title | Description | ImagePath | LiveLink | GithubLink] for any project mentioned.
- Use [RESUME_BUTTON] if asked for a resume.`,
        temperature: 0.7,
        min_relevance_score: 0.1,
        offline_fallback_message: "I'm sorry, I'm currently in 'offline mode' because my AI brain (Cerebras API Key) hasn't been connected yet. Please add the CEREBRAS_API_KEY to the .env.local file to enable my full capabilities!"
    };

    let siteInfo = {
        hero_title: "Waiz Hussain",
        hero_subtitle: "Full Stack Developer | AI Builder | Autonomous Systems Developer",
        about_bio: "Building real-world applications across web, mobile, and AI domains using Next.js, Flutter & Node.js. Specialized in Autonomous Systems, SaaS products, and AI-powered workflows.",
        resume_url: "/resume/Waiz_Resume_Full_Stack_Dev.pdf"
    };

    try {
        const settingsRows = await sql`SELECT config_key, config_val FROM site_settings` as { config_key: string, config_val: any }[];
        const chatRow = settingsRows.find(r => r.config_key === 'chatbot_config');
        if (chatRow && chatRow.config_val) {
            chatbotConfig = { ...chatbotConfig, ...chatRow.config_val };
        }
        const siteRow = settingsRows.find(r => r.config_key === 'site_info');
        if (siteRow && siteRow.config_val) {
            siteInfo = { ...siteInfo, ...siteRow.config_val };
        }
    } catch (dbErr) {
        console.warn("[Chatbot] Failed to load dynamic settings from DB, using defaults:", dbErr);
    }

    if (!client) {
        return chatbotConfig.offline_fallback_message;
    }

    try {
        // 2. Core Knowledge (Dynamic/Static Blend)
        const coreKnowledge = `
Name: ${siteInfo.hero_title}
Role: ${siteInfo.hero_subtitle}
Location: Pakistan
Summary: ${siteInfo.about_bio}
Skills: Next.js, React, Node.js, Flutter, Python, JavaScript, TypeScript, MongoDB, Express.js, Supabase, Firebase, Gemini API, Prompt Engineering, AI Chatbot Systems, SaaS Development.
        `.trim();

        // 3. Fetch all resume chunks and knowledge base entries and rank them
        const resumeChunks = await sql`SELECT content FROM resume_chunks` as { content: string }[];
        let kbEntries: { content: string }[] = [];
        try {
            kbEntries = await sql`SELECT content FROM knowledge_base` as { content: string }[];
        } catch (_) {
            console.warn("[Chatbot] Could not load knowledge_base entries.");
        }
        const allChunks = [...resumeChunks, ...kbEntries];

        const rankedChunks = allChunks.map((row: { content: string }) => ({
            content: row.content,
            score: stringSimilarity(userMessage.toLowerCase(), row.content.toLowerCase())
        })).sort((a: any, b: any) => b.score - a.score);

        // Get top 6 relevant chunks
        const relevantContext = rankedChunks.slice(0, 6).map((item: any) => item.content);

        // 4. Fetch all projects and rank them
        const dbProjects = await sql`SELECT * FROM projects` as Project[];
        const rankedProjects = dbProjects.map(p => {
            const searchStr = `${p.title} ${p.description} ${p.tags.join(' ')}`.toLowerCase();
            const score = stringSimilarity(userMessage.toLowerCase(), searchStr);
            return { ...p, score };
        }).sort((a, b) => b.score - a.score);

        // Dynamic Project Selection using RAG score threshold from configuration
        const minScore = chatbotConfig.min_relevance_score;
        let relevantProjects = rankedProjects.filter(p => p.score > minScore); 
        if (relevantProjects.length < 5) {
            relevantProjects = rankedProjects.slice(0, 5);
        }
        relevantProjects = relevantProjects.slice(0, 12); 

        const projectContext = relevantProjects.map(p => 
            `- ${p.title}: ${p.description} (Tech: ${p.tags.join(', ')}) [ImagePath: ${p.image}] [LiveLink: ${p.live_link}] [GithubLink: ${p.github_link}]`
        ).join('\n');

        const context = `
Core Info:
${coreKnowledge}

Resume Download URL: ${siteInfo.resume_url}

Relevant Resume & Knowledge Details:
${relevantContext.join('\n\n')}

Relevant Projects Data (from Neon DB):
${projectContext}
`.trim();

        const systemPrompt = `${chatbotConfig.system_prompt}

Context:
${context}
`;

        const response = (await client.chat.completions.create({
            model: 'gpt-oss-120b', 
            messages: [
                { role: 'system', content: systemPrompt },
                ...history.map(msg => ({ role: (msg.role === 'assistant' ? 'assistant' : 'user') as "user" | "assistant", content: msg.content })),
                { role: 'user', content: userMessage }
            ],
            temperature: chatbotConfig.temperature,
            max_tokens: 1000,
        })) as any;

        const rawContent = response.choices[0].message.content;
        
        // Output Filtering
        let filteredContent = rawContent;
        const cardRegex = /\[PROJECT_CARD:(.*?)\]/g;
        let match;
        while ((match = cardRegex.exec(rawContent)) !== null) {
            const cardContent = match[1];
            const parts = cardContent.split('|').map(p => p.trim());
            if (parts.length >= 3) {
                const imagePath = parts[2];
                const isRealProject = dbProjects.some(p => p.image === imagePath);
                if (!isRealProject) {
                    filteredContent = filteredContent.replace(match[0], '');
                }
            } else {
                 filteredContent = filteredContent.replace(match[0], '');
            }
        }

        return filteredContent.trim();
    } catch (error) {
        console.error("Chat Error:", error);
        return "I'm having a bit of trouble accessing my project database right now, but I can tell you that Waiz Hussain is a brilliant Full Stack Developer specialized in AI and Autonomous Systems. What else would you like to know?";
    }
}


