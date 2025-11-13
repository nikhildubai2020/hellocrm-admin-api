import { os } from '@orpc/server';
import { db } from '../db';

export const testConnection = os.handler(async ({ input = {} }) => {
  try {
    console.log('Testing database connection...');
    const result = await db.execute('SELECT 1 as test');
    console.log('Database connection successful:', result);
    return { success: true, message: 'Database connection working' };
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
});

export const createPlansAddonsTable = os.handler(async ({ input = {} }) => {
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
    console.log('Table created successfully');
    return { success: true, message: 'Table created' };
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
});