import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/adminapi';
const client = postgres(connectionString);
const db = drizzle(client);

async function createPlansTable() {
  try {
    console.log('Creating plans table...');
    
    // Create enum first
    await db.execute(`
      CREATE TYPE IF NOT EXISTS plan_status AS ENUM ('active', 'inactive');
    `);
    
    // Create table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS plans (
        pid SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        duration INTEGER NOT NULL,
        status plan_status DEFAULT 'active',
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    
    console.log('✅ plans table created successfully!');
  } catch (error) {
    console.error('❌ Error creating table:', error);
  } finally {
    await client.end();
  }
}

createPlansTable();