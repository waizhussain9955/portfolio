# Waiz Hussain - AI-Powered Developer Portfolio

Welcome to the repository for my personal developer portfolio! This project is a modern, highly interactive, and responsive portfolio built to showcase my projects, skills, and experience. It features a fully integrated **AI Chatbot** that allows visitors to ask questions about my work and experience in real-time.

## 🚀 Features

- **AI-Powered Chatbot**: A custom-built AI assistant powered by Cerebras API. It knows all about my projects and resume and answers visitor queries instantly.
- **Dynamic Projects Showcase**: Fetches and displays projects beautifully.
- **Modern UI/UX**: Designed with **Next.js 14** and **Tailwind CSS** for a sleek, responsive, and mobile-friendly experience.
- **Smooth Animations**: Uses **Framer Motion** for elegant page transitions and micro-interactions.
- **Secure Authentication**: Basic Authentication endpoints for admin/secure areas, backed by a **Neon PostgreSQL Database**.
- **Dark/Light Theme**: Built with rich aesthetics, gradients, and glassmorphism UI elements.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Neon DB (Serverless Postgres)](https://neon.tech/)
- **AI Integration**: [Cerebras AI API](https://cerebras.ai/)
- **Deployment**: Ready for [Vercel](https://vercel.com/)

## 🔒 Security & Best Practices

- Environment variables (`.env.local`, `.env`) are securely ignored via `.gitignore`.
- Database connections and AI API keys are strictly kept server-side to prevent exposure to the client.
- Secure, type-checked API routes.

## 💻 Running Locally

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/waizhussain9955/portfolio.git
cd portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory and add the following keys:
```env
# Neon Database Connection URL
DATABASE_URL="postgresql://<user>:<password>@<host>/<dbname>?sslmode=require"

# Cerebras AI API Key for Chatbot
CEREBRAS_API_KEY="your_cerebras_api_key_here"
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚀 Deployment

This project is optimized for deployment on Vercel. 
Simply connect the GitHub repository to your Vercel account and ensure the environment variables (`DATABASE_URL` and `CEREBRAS_API_KEY`) are added to your Vercel project settings.

---

*Designed and Built by Waiz Hussain.*
