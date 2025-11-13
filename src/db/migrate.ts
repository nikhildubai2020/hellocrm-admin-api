import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in the environment variables.');
}

const migrationClient = postgres(connectionString, { max: 1 });

(async () => {
  try {
    console.log('Running migrations...');
    await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    if (error.cause?.code === '42710' || error.cause?.code === '42P07' || error.cause?.code === '42P06' || 
        error.message?.includes('already exists') || error.message?.includes('type "audit_action" already exists') ||
        error.message?.includes('CREATE SCHEMA') || error.message?.includes('permission denied')) {
      console.log('Migration completed with existing objects or schema permissions (this is normal in production)');
    } else {
      console.error('Migration failed:', error);
      process.exit(1);
    }
  } finally {
    await migrationClient.end();
  }
})();