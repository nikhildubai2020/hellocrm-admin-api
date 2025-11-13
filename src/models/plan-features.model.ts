import { pgTable, varchar, serial, integer, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { plans } from './plans.model';

export const planFeatures = pgTable('plan_features', {
  pfid: serial('pfid').primaryKey(),
  plan_id: integer('plan_id').notNull(),
  feature_id: integer('feature_id').notNull(),
  feature_value: integer('feature_value').notNull(),
  description: varchar('description', { length: 100 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const planFeaturesRelations = relations(planFeatures, ({ one }) => ({
  plan: one(plans, {
    fields: [planFeatures.plan_id],
    references: [plans.pid]
  })
}));
