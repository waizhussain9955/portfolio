import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { projects } from '../lib/data/projects';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not defined');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function migrate() {
  console.log('🚀 Starting migration to Neon DB...');

  try {
    // 1. Create Projects Table
    console.log('Creating projects table...');
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        tags TEXT[] NOT NULL,
        gradient TEXT NOT NULL,
        image TEXT NOT NULL,
        live_link TEXT NOT NULL,
        github_link TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 2. Create Resume Chunks Table
    console.log('Creating resume_chunks table...');
    await sql`
      CREATE TABLE IF NOT EXISTS resume_chunks (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 3. Create Users Table
    console.log('Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 3. Clear existing data (optional, but good for fresh seed)
    console.log('Clearing old data...');
    await sql`TRUNCATE TABLE projects, resume_chunks RESTART IDENTITY`;

    // 4. Insert Projects
    console.log(`Inserting ${projects.length} projects...`);
    for (const p of projects) {
      await sql`
        INSERT INTO projects (title, description, tags, gradient, image, live_link, github_link)
        VALUES (${p.title}, ${p.desc}, ${p.tags}, ${p.gradient}, ${p.image}, ${p.liveLink}, ${p.githubLink})
      `;
    }

    // 5. Insert Resume Chunks
    const resumePath = path.join(process.cwd(), 'lib/data/resume.txt');
    const resumeText = fs.readFileSync(resumePath, 'utf-8');
    const chunks = resumeText.split('\n\n').filter(c => c.trim().length > 0);

    console.log(`Inserting ${chunks.length} resume chunks...`);
    for (const chunk of chunks) {
      await sql`
        INSERT INTO resume_chunks (content)
        VALUES (${chunk.trim()})
      `;
    }

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
