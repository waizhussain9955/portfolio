import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';

export const dynamic = 'force-dynamic';

const fallbackServices = [
  {
    id: 1,
    title: 'Full-Stack Web App Development',
    description: 'Production-ready web applications with responsive UI, secure APIs, database integration, and deployment support.',
    price_range: '$800 - $2,500',
    delivery_time: '2-6 weeks',
    features: ['Next.js frontend', 'API integration', 'Database setup', 'Deployment'],
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
    show_on_homepage: true,
  },
  {
    id: 2,
    title: 'Portfolio & Business Website',
    description: 'Fast, modern websites for personal brands, agencies, and small businesses with CMS-ready sections.',
    price_range: '$300 - $900',
    delivery_time: '1-3 weeks',
    features: ['Responsive design', 'SEO basics', 'Contact form', 'Admin content updates'],
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
    show_on_homepage: true,
  },
  {
    id: 3,
    title: 'Admin Panel & CMS Setup',
    description: 'Custom dashboards to manage projects, blog posts, services, leads, media, and site settings.',
    price_range: '$600 - $1,800',
    delivery_time: '2-4 weeks',
    features: ['CRUD modules', 'Media upload', 'Role-based access', 'Analytics'],
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop',
    show_on_homepage: true,
  },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const homepage = searchParams.get('homepage') === 'true';

    const sql = getNeonSql();
    let services;

    if (homepage) {
      services = (await sql`
        SELECT id, title, description, price_range, delivery_time, features, is_active, image_url, show_on_homepage
        FROM services
        WHERE is_active = true AND show_on_homepage = true
        ORDER BY id ASC
      `) as any[];
    } else {
      services = (await sql`
        SELECT id, title, description, price_range, delivery_time, features, is_active, image_url, show_on_homepage
        FROM services
        WHERE is_active = true
        ORDER BY id ASC
      `) as any[];
    }

    return NextResponse.json({ services: services.length ? services : fallbackServices });
  } catch (error) {
    return NextResponse.json({ services: fallbackServices });
  }
}
