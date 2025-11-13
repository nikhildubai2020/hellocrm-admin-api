import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../models';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/adminapi';
const client = postgres(connectionString);
export const db = drizzle(client, { 
  schema,
  logger: {
    logQuery: (query, params) => {
      console.log('🔍 SQL Query:', query);
      console.log('📋 Parameters:', params);
    }
  }
});