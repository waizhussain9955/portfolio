

export interface Project {
  title: string;
  desc: string;
  tags: string[];
  gradient: string;
  image: string;
  liveLink: string;
  githubLink: string;
  features?: string[];
  innovation?: string[];
}

export const projects: Project[] = [
  {
    title: "TIKTOK DOWNLOADER - FLAGSHIP SAAS",
    desc: "A complete SaaS ecosystem built from scratch for downloading TikTok videos efficiently. Features video downloading without watermark, bulk downloader system, fast processing engine, and clean UI. Full platform coverage: web application, mobile app, plugin/extension system.",
    tags: ["Next.js", "Node.js", "Express.js", "API Integration", "Scalable Architecture"],
    gradient: "from-emerald-950 via-teal-900 to-emerald-900",
    image: "/tiktok-web-downloader.png",
    liveLink: "https://tik-tokdownloader.xyz",
    githubLink: "https://github.com/waizhussain9955/tiktok-downloader",
  },
  {
    title: "MODERN WATCH STORE",
    desc: "A modern e-commerce frontend showcasing premium watch collections with responsive UI, product listing and display, and clean navigation system.",
    tags: ["HTML", "CSS", "JavaScript", "Modern Frontend Practices"],
    gradient: "from-gray-900 via-stone-900 to-emerald-950",
    image: "/modern-watch-store.png",
    liveLink: "https://modern-watch-store.vercel.app/",
    githubLink: "https://github.com/waizhussain9955/modern-watch-store",
  },
  {
    title: "T DOWNLOADER ANDROID APP",
    desc: "Android-based video downloader app for fast, watermark-free social media video downloads. Features high-speed downloading, built-in download manager with pause/resume, progress tracking, and clean dark/light mode UI.",
    tags: ["Flutter", "Android", "Download Manager", "Mobile-first Design"],
    gradient: "from-gray-900 via-emerald-950 to-teal-900",
    image: "/t-downloader.png",
    liveLink: "https://github.com/waizhussain9955/t-downloader-android-application/releases/download/v1.0.2-beta/T-downloader.apk",
    githubLink: "https://github.com/waizhussain9955/t-downloader-android-application",
  },
  {
    title: "WORD BLAZE GAME",
    desc: "An interactive browser-based word guessing game with dynamic word logic, user interaction handling, and improved UI focused on frontend logic and engaging user experience.",
    tags: ["JavaScript", "HTML", "CSS", "Game Logic"],
    gradient: "from-emerald-950 via-teal-900 to-emerald-900",
    image: "/word-blaze.png",
    liveLink: "https://word-blaze.vercel.app/",
    githubLink: "https://github.com/waizhussain9955/WordBlaze",
  },
  {
    title: "JEWELRY STORE WEBSITE",
    desc: "Modern aur elegant jewelry showcase website jo premium products ko visually appealing tareeke se present karti hai. Website ka focus clean UI, smooth user experience aur high-end brand feel create karna hai.",
    tags: ["Next.js", "HTML", "CSS", "JavaScript", "Vercel", "Custom CSS", "Modern UI principles"],
    gradient: "from-stone-950 via-gray-900 to-emerald-950",
    image: "/jewelry-store.png",
    liveLink: "https://jewelry-store-ochre.vercel.app/",
    githubLink: "https://github.com/waizhussain9955/jewelry-store",
    features: [
      "Responsive design (mobile + desktop optimized)",
      "Elegant product showcase layout",
      "Smooth navigation & user-friendly UI",
      "Fast loading performance (optimized assets)",
      "Modern UI design with luxury feel",
      "Product detail sections with clean structure"
    ],
    innovation: [
      "Luxury-focused UI design approach",
      "Minimalistic layout for better product highlighting",
      "Performance optimization for faster browsing",
      "Clean structure suitable for scalable e-commerce upgrade"
    ]
  },
  {
    title: "5 WORD LETTER WEBSITE",
    desc: "Interactive word-based web application for 5-letter word interactions with real-time input handling, instant feedback mechanism, clean responsive layout, and minimal distraction-free interface.",
    tags: ["Next.js", "HTML", "CSS", "JavaScript", "Vercel"],
    gradient: "from-gray-950 via-emerald-950 to-teal-900",
    image: "/5-word-letter.png",
    liveLink: "https://5-word-letter.vercel.app/",
    githubLink: "https://github.com/waizhussain9955/5-word-letter",
  },
  {
    title: "LAPTOP E-COMMERCE MOBILE APP",
    desc: "Laptop-focused mobile e-commerce application for browsing laptops, viewing product details, and smooth mobile shopping experience with mobile-first e-commerce architecture.",
    tags: ["Android", "Java/Kotlin", "Mobile-first Design", "E-commerce Architecture"],
    gradient: "from-gray-900 via-stone-900 to-emerald-950",
    image: "/laptop-ecom.png",
    liveLink: "",
    githubLink: "https://github.com/waizhussain9955/laptop-E-com",
  },
  {
    title: "SWIFT TRANSLATE PRO",
    desc: "AI-powered translation tool for multi-language support with API-based translation system, fast response handling, and clean interface for real-time translation.",
    tags: ["API Integration", "AI", "Translation", "JavaScript"],
    gradient: "from-teal-950 via-emerald-900 to-emerald-950",
    image: "/swift-translate.png",
    liveLink: "",
    githubLink: "https://github.com/waizhussain9955/SwiftTranslate-Pro",
  },
  {
    title: "SMART BACHAT COMMITTEE APP",
    desc: "A financial tracking application for committee savings systems with member tracking, contribution management, and data structuring using Flutter + local data management.",
    tags: ["Flutter", "Dart", "Local Storage", "Financial Tracking"],
    gradient: "from-gray-900 via-emerald-950 to-teal-900",
    image: "/smart-committee.png",
    liveLink: "https://github.com/waizhussain9955/smart-committee-app/releases/download/v1.0.2-beta/smart-committee-app.apk",
    githubLink: "https://github.com/waizhussain9955/smart-committee-app",
  },
  {
    title: "UNPLUG_AI CHATBOT",
    desc: "AI chatbot supporting both online and offline modes. Features Gemini API integration, local JSON chat history, smart response reuse system, and offline-first architecture to reduce API costs.",
    tags: ["Gemini API", "Node.js", "JSON", "Offline-first Architecture", "AI Chatbot"],
    gradient: "from-emerald-950 via-teal-900 to-gray-900",
    image: "/unplug-ai.png",
    liveLink: "https://github.com/waizhussain9955/smart-committee-app/releases/download/v1.0.2-beta/smart-committee-app.apk",
    githubLink: "https://github.com/waizhussain9955/tiktok-downloader",
  },
  {
    title: "SMART OCR SCANNER",
    desc: "Mobile OCR application for extracting text from images with real-time image scanning, API-based text extraction, and performance optimization.",
    tags: ["Flutter", "OCR", "API Integration", "Mobile Development"],
    gradient: "from-gray-950 via-emerald-950 to-teal-900",
    image: "/smart-ocr.png",
    liveLink: "",
    githubLink: "https://github.com/waizhussain9955/tiktok-downloader",
  },
  {
    title: "ADVANCED CURRENCY CONVERTER",
    desc: "Real-time currency converter web app jo multiple global currencies ke beech accurate aur fast conversion provide karta hai. Clean UI aur smooth user experience ke sath design kiya gaya hai.",
    tags: ["HTML", "CSS", "JavaScript", "Exchange Rate API", "Vercel"],
    gradient: "from-gray-950 via-stone-900 to-emerald-950",
    image: "/advanced-currency-converter.png",
    liveLink: "https://advanced-currency-converter.vercel.app/",
    githubLink: "https://github.com/waizhussain9955/advanced-currency-converter",
    features: [
      "Real-time currency conversion (API-based)",
      "Multiple currency support (USD, PKR, EUR, etc.)",
      "Currency swap functionality",
      "Fast and responsive UI",
      "User-friendly interface"
    ],
    innovation: [
      "Lightweight aur fast-performing design",
      "Simple UI for quick conversions",
      "Real-world financial utility integration",
      "Clean structure for future scalability"
    ]
  }
];