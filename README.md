# 🚀 Waiz Hussain — Portfolio & AI Chatbot

A modern, full-stack portfolio website with an AI-powered chatbot, CRM admin panel, client portal, blog CMS, and multilingual support (EN / UR / DE).

**Live:** [waiz-portfolio.vercel.app](https://waiz-portfolio.vercel.app)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/waizhussain9955/portfolio)

---

## ✨ Features

- 🎨 **Stunning UI** — Dark mode, glassmorphism, Framer Motion animations
- 🤖 **AI Chatbot** — Powered by Cerebras LLM with portfolio-aware context
- 🌐 **Multilingual** — English, Urdu (RTL), German
- 📊 **Admin CRM Panel** — Manage leads, contacts, projects, blog, services
- 👤 **Client Portal** — Project tracking for clients
- 📝 **Blog CMS** — Full blog with slug routing
- 🔐 **Auth System** — JWT-based login/signup with role management
- 📱 **Fully Responsive** — Mobile-first design (280px → 4K)
- ⚡ **SEO Optimized** — Sitemap, robots.txt, meta tags

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + Custom CSS |
| Animations | Framer Motion |
| Database | NeonDB (PostgreSQL Serverless) |
| AI | Cerebras Cloud SDK |
| Auth | JWT + bcryptjs |
| Deployment | Vercel |

---

## 🚀 Deploy to Vercel (3 Steps)

### Step 1 — Clone & Push to Your GitHub
```bash
git clone https://github.com/waizhussain9955/portfolio
cd portfolio
git push origin main
```

### Step 2 — Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select the `portfolio` repo
4. Click **Deploy**

### Step 3 — Add Environment Variables
In Vercel Dashboard → **Project → Settings → Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your NeonDB connection string |
| `CEREBRAS_API_KEY` | Your Cerebras API key |
| `JWT_SECRET` | A strong random 32+ char string |

> See `.env.example` for details on where to get each value.

---

## 💻 Local Development

```bash
# 1. Clone
git clone https://github.com/waizhussain9955/portfolio
cd portfolio

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Fill in your values in .env.local

# 4. Run dev server
npm run dev
# Open http://localhost:3000
```

---

## 📁 Project Structure

```
portfolio/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (Hero, About, Skills, Projects...)
│   ├── admin/             # Admin CRM panel (protected)
│   ├── blog/              # Blog pages
│   ├── portal/            # Client portal (protected)
│   ├── projects/          # Projects page
│   ├── services/          # Services page
│   └── api/               # API routes (auth, admin, public)
├── components/             # Reusable React components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Skills.tsx
│   ├── Projects.tsx
│   ├── Chatbot.tsx
│   └── ...
├── lib/                   # Utilities & data
│   ├── auth.ts            # JWT auth helpers
│   ├── data/
│   │   └── translations.ts # i18n strings (EN/UR/DE)
│   └── ...
├── public/                # Static assets
│   ├── resume/            # Resume PDF
│   └── uploads/           # Project images
├── .env.example           # Environment variables template
├── next.config.mjs        # Next.js config
├── tailwind.config.js     # Tailwind config
└── vercel.json            # Vercel deployment config
```

---

## 📬 Contact

**Waiz Hussain** — Full Stack Developer & AI Builder  
🌐 [Portfolio](https://waiz-portfolio.vercel.app) | 💼 [LinkedIn](https://www.linkedin.com/in/waiz-hussain-6750392ba) | 🐙 [GitHub](https://github.com/waizhussain9955)
