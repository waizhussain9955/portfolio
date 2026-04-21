import { NextResponse } from 'next/server';
import { getChatResponse } from '@/lib/ai/chatbot';

export async function POST(req: Request) {
    try {
        const { message, history = [] } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const response = await getChatResponse(message, history);

        return NextResponse.json({ response });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
