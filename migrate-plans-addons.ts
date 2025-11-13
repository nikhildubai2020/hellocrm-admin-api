import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { plansAddons } from './src/models/plans-addons.model';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/adminapi';
const client = postgres(connectionString);
const db = drizzle(client);

async function migratePlansAddons() {
  try {
    console.log('Creating plans_addons table...');
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS plans_addons (
        plans_addon_id SERIAL PRIMARY KEY,
        plan_id INTEGER NOT NULL,
        addon_id INTEGER NOT NULL,
        paid INTEGER NOT NULL,
        value INTEGER NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        duration INTEGER NOT NULL,
        status BOOLEAN DEFAULT true NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    
    console.log('✅ plans_addons table created successfully!');
  } catch (error) {
    console.error('❌ Error creating table:', error);
  } finally {
    await client.end();
  }
}

migratePlansAddons();