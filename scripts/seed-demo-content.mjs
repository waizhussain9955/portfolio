import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not defined in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const posts = [
  {
    title: 'How I Build Modern Full-Stack Apps',
    slug: 'how-i-build-modern-full-stack-apps',
    summary: 'A practical look at planning, building, and shipping reliable full-stack applications with clean UI and secure APIs.',
    content: `# How I Build Modern Full-Stack Apps

Every solid product starts with a clear user flow. I map the main screens, define the data model, and then build the API contract before polishing the interface.

## My Usual Stack
- Next.js for the frontend
- API routes for backend features
- PostgreSQL for durable data
- Admin panels for content control

The goal is simple: the client should be able to update real content without touching code.`,
    tags: ['Next.js', 'Full Stack', 'CMS'],
    banner_image: '/tiktok-web-downloader.png',
  },
  {
    title: 'Why Every Portfolio Needs a CMS',
    slug: 'why-every-portfolio-needs-a-cms',
    summary: 'Static portfolios are hard to maintain. A CMS makes projects, blogs, services, and media easy to update from one dashboard.',
    content: `# Why Every Portfolio Needs a CMS

A portfolio should grow with your work. When every update needs a code change, projects and case studies become outdated quickly.

## CMS Benefits
- Add new projects from the admin panel
- Upload images from your computer
- Publish blog posts instantly
- Keep services and pricing fresh

This is why I connect the admin panel directly to the frontend sections.`,
    tags: ['Portfolio', 'Admin Panel', 'Content'],
    banner_image: '/modern-watch-store.png',
  },
  {
    title: 'Building Better Client Dashboards',
    slug: 'building-better-client-dashboards',
    summary: 'Client dashboards should be useful, focused, and easy to scan. Here is the approach I use when designing admin and portal systems.',
    content: `# Building Better Client Dashboards

A dashboard is not just a collection of cards. It should answer the user’s most important questions quickly.

## What I Focus On
- Clear project status
- Recent activity
- Contact and lead tracking
- Simple content management

Good dashboards save time because users can take action without hunting through the app.`,
    tags: ['Dashboard', 'UX', 'Admin'],
    banner_image: '/smart-committee.png',
  },
];

const services = [
  {
    title: 'Full-Stack Web App Development',
    description: 'Production-ready web applications with responsive UI, secure APIs, database integration, and deployment support.',
    price_range: '$800 - $2,500',
    delivery_time: '2-6 weeks',
    features: ['Next.js frontend', 'API integration', 'Database setup', 'Deployment'],
  },
  {
    title: 'Portfolio & Business Website',
    description: 'Fast, modern websites for personal brands, agencies, and small businesses with CMS-ready sections.',
    price_range: '$300 - $900',
    delivery_time: '1-3 weeks',
    features: ['Responsive design', 'SEO basics', 'Contact form', 'Admin content updates'],
  },
  {
    title: 'Admin Panel & CMS Setup',
    description: 'Custom dashboards to manage projects, blog posts, services, leads, media, and site settings.',
    price_range: '$600 - $1,800',
    delivery_time: '2-4 weeks',
    features: ['CRUD modules', 'Media upload', 'Role-based access', 'Analytics'],
  },
];

await sql`
  DELETE FROM posts
  WHERE slug <> ALL(${posts.map((post) => post.slug)})
`;

await sql`
  DELETE FROM services
  WHERE true
`;

for (const post of posts) {
  await sql`
    INSERT INTO posts (title, slug, summary, content, tags, banner_image, is_published, published_at)
    VALUES (
      ${post.title},
      ${post.slug},
      ${post.summary},
      ${post.content},
      ${post.tags},
      ${post.banner_image},
      true,
      NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      summary = EXCLUDED.summary,
      content = EXCLUDED.content,
      tags = EXCLUDED.tags,
      banner_image = EXCLUDED.banner_image,
      is_published = true,
      published_at = COALESCE(posts.published_at, NOW())
  `;
}

for (const service of services) {
  await sql`
    INSERT INTO services (title, description, price_range, delivery_time, features, is_active)
    VALUES (
      ${service.title},
      ${service.description},
      ${service.price_range},
      ${service.delivery_time},
      ${service.features},
      true
    )
  `;
}

const postCount = await sql`SELECT COUNT(*)::int AS count FROM posts`;
const serviceCount = await sql`SELECT COUNT(*)::int AS count FROM services`;

console.log(`Seed complete: ${postCount[0].count} blog posts, ${serviceCount[0].count} services.`);
