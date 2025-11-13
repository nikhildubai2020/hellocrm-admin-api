import { pgTable, varchar, boolean, timestamp, decimal, bigserial, integer } from 'drizzle-orm/pg-core';

export const xPlanAddOns = pgTable('x_plan_addons', {
  plan_addons_id: bigserial('plan_addons_id', { mode: 'number' }).primaryKey(),
  plan_addons_name: varchar('plan_addons_name', { length: 50 }).notNull(),
  plan_addons_value: integer('plan_addons_value').notNull(),
  plan_addons_price: decimal('plan_addons_price', { precision: 10, scale: 2 }).notNull(),
  plan_addons_channel: varchar('plan_addons_channel', { length: 30 }),
  unit: varchar('unit', { length: 20 }).default('message'),
  is_active: boolean('is_active').default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});
