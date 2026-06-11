# Project Details: Waiz Hussain Portfolio

This document contains the core details, features, and technical architecture of the AI-Powered Developer Portfolio. It is designed to be concise for AI agents while retaining all necessary context.

## 1. Project Overview
- **Name**: Waiz Hussain - Professional AI-Enhanced Portfolio Website
- **Purpose**: A live, interactive demonstration of engineering skills. It features a modern digital resume, dynamic project archive, secure authentication, and an intelligent AI chatbot that uses RAG (Retrieval-Augmented Generation) to answer questions based on Waiz's resume and projects.

## 2. Core Features
1. **AI Chatbot (RAG)**: Floating widget that answers queries instantly. It parses custom tokens (e.g., `[PROJECT_CARD: ...]`) to render interactive React components inline. Powered by Cerebras Llama 3.1 8B.
2. **Project Showcase**: Displays top projects in a responsive grid. Hover effects show live demo and GitHub links.
3. **Secure User Authentication**: Custom login/signup with PostgreSQL and bcrypt. Session state is managed via localStorage for client-side interactions.
4. **Automated Contact Form**: Uses EmailJS to deliver messages directly to Waiz. Pre-fills data for authenticated users.
5. **Modern UI/UX**: Built using Tailwind CSS and Framer Motion. Uses a custom dark glassmorphism theme with an HTML5 canvas particle background.

## 3. Technology Stack
- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Next.js Serverless API Routes, Node.js.
- **Database**: Neon DB (Serverless PostgreSQL).
- **AI Integration**: Cerebras Cloud SDK, `string-similarity-js` for vector-like string distance matching.

## 4. Database Schema (Neon DB)
The project uses three main tables:
1. `users`: Stores registered clients (`id`, `email`, `password`, `name`, `created_at`).
2. `projects`: Stores portfolio projects (`id`, `title`, `description`, `tags`, `gradient`, `image`, `live_link`, `github_link`).
3. `resume_chunks`: Stores text chunks for RAG context matching (`id`, `content`).

## 5. Key API Endpoints
- `POST /api/auth/signup`: Hashes password using bcrypt and creates a new user.
- `POST /api/auth/login`: Authenticates user and returns session data.
- `POST /api/chat`: Takes user message, queries DB for similar resume chunks and projects, injects them into the Cerebras AI prompt, and returns the AI's response.

## 6. Development Workflow
- **Environment Variables Required**: `DATABASE_URL`, `CEREBRAS_API_KEY`, EmailJS keys (`NEXT_PUBLIC_EMAILJS_*`).
- **Run Locally**: `npm install` -> `npm run dev`
- **Deployment**: Optimized for Vercel. Database is hosted on Neon.

> **Note for AI Agents**: When working on the chatbot, remember that the UI specifically parses brackets like `[PROJECT_CARD: title | desc | img | demo | github]` to render interactive cards. Ensure prompt outputs match this exact format.
