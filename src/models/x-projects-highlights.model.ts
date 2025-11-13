import { pgTable, varchar, serial, bigint, boolean, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { business } from './business.model';

export const xProjectsHighlights = pgTable('x_projects_highlights', {
  project_highlight_id: serial('project_highlight_id').primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull().default(0),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  project_highlight_name: varchar('project_highlight_name', { length: 100 }).notNull(),
  status: boolean('status').notNull().default(true),
createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const xProjectsHighlightsRelations = relations(xProjectsHighlights, ({ one }) => ({
  user: one(users, {
    fields: [xProjectsHighlights.user_id],
    references: [users.user_id]
  }),
  business: one(business, {
    fields: [xProjectsHighlights.business_id],
    references: [business.business_id]
  })
}));
