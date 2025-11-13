import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/adminapi';
const client = postgres(connectionString);
const db = drizzle(client);

async function updatePlansAddonsTable() {
  try {
    console.log('Updating plans_addons table structure...');
    
    // Drop the columns that are no longer needed
    await db.execute(`
      ALTER TABLE plans_addons 
      DROP COLUMN IF EXISTS plan_id,
      DROP COLUMN IF EXISTS addon_id;
    `);
    
    console.log('✅ plans_addons table updated successfully!');
    console.log('Removed columns: plan_id, addon_id');
  } catch (error) {
    console.error('❌ Error updating table:', error);
  } finally {
    await client.end();
  }
}

updatePlansAddonsTable();