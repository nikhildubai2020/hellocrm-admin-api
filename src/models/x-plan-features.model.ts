import { pgTable, varchar, serial, timestamp, text, boolean } from 'drizzle-orm/pg-core';


export const xPlanFeatures = pgTable('x_plan_features', {
  plan_feature_id: serial('plan_feature_id').primaryKey(),
  plan_feature_name: varchar('plan_feature_name', { length: 100 }).notNull(),
  description: text('description'),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});
