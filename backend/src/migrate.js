import { query, pool } from './config/db.js';

const statements = [
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS about (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    short_bio TEXT NOT NULL,
    full_bio TEXT NOT NULL,
    profile_photo TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level INT NOT NULL CHECK (level >= 0 AND level <= 100),
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT NOT NULL,
    github_link TEXT,
    demo_link TEXT,
    image TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS contact_info (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(255) NOT NULL,
    linkedin VARCHAR(255) NOT NULL,
    github VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
  )`,
];

(async () => {
  for (const sql of statements) await query(sql);
  console.log('Migrations complete');
  await pool.end();
})();
