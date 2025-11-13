import { pgTable, varchar, bigserial, bigint, boolean, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { business } from './business.model';

export const xLeadsTags = pgTable('x_leads_tags', {
  lead_tag_id: bigserial('lead_tag_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).default(0),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  lead_tag_name: varchar('lead_tag_name', { length: 100 }).notNull(),
  status: boolean('status').notNull().default(true),
createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const xLeadsTagsRelations = relations(xLeadsTags, ({ one }) => ({
  user: one(users, {
    fields: [xLeadsTags.user_id],
    references: [users.user_id]
  }),
  business: one(business, {
    fields: [xLeadsTags.business_id],
    references: [business.business_id]
  })
}));
