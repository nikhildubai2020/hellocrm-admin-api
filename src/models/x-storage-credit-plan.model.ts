import { pgTable, varchar, serial, integer, boolean, timestamp, decimal } from 'drizzle-orm/pg-core';


export const xStorageCreditPlan = pgTable('x_storage_credit_plan', {
  plan_id: serial('plan_id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  storage_quota_mb: integer('storage_quota_mb').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('INR'),
  duration_days: integer('duration_days').default(30),
  is_active: boolean('is_active').default(true),
  createdAt: timestamp('createdAt').defaultNow()
});
