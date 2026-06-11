# Waiz Hussain - AI-Powered Developer Portfolio

## Overview
A modern, interactive portfolio featuring a custom AI chatbot (Cerebras Llama 3) that answers questions using RAG (retrieval-augmented generation) over my resume and projects.

## Tech Stack
- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS, Framer Motion
- Neon DB (Serverless Postgres)
- Cerebras AI API

## Core Architecture & Critical Files (AI Context)
- **`lib/neon.ts`**: Database connection initialization.
- **`lib/ai/chatbot.ts`**: RAG context assembly rules, LLM model integration, and output filtering.
- **`components/Chatbot.tsx`**: UI for chatbot and logic for parsing AI token responses (e.g., `[PROJECT_CARD: ...]`).
- **`app/api/chat/route.ts`**: The main Chat API endpoint.

## Folder Structure
```text
waiz-new-portfolio-with-chatbot/
├── app/                  # Next.js App Router (Pages, layout and APIs)
│   ├── api/              # API routes (auth, chat)
│   ├── admin/            # Admin dashboard pages
│   ├── projects/         # Projects archive
│   └── ...               # Login, Signup, Homepage
├── components/           # Reusable React components (Chatbot, Navbar, ProjectCard, etc)
├── lib/                  # Infrastructure
│   ├── ai/               # AI chatbot logic
│   ├── data/             # Static data (projects.ts, resume info)
│   └── neon.ts           # DB client
├── public/               # Static assets & images
├── scripts/              # DB seeding and test scripts
├── middleware.ts         # Route protection middleware
└── tailwind.config.js    # UI config
```

## Running Locally
1. `npm install`
2. Configure `.env.local` with `DATABASE_URL` and `CEREBRAS_API_KEY`.
3. `npm run dev`
