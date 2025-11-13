import { pgTable, serial, integer, boolean, timestamp, text, decimal } from 'drizzle-orm/pg-core';


export const plansAddons = pgTable('plans_addons', {
  plans_addon_id: serial('plans_addon_id').primaryKey(),
  paid: integer('paid').notNull(),
  value: integer('value').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  duration: integer('duration').notNull(),
  status: boolean('status').default(true).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});
