import { pgTable, bigint, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { business } from './business.model';
import { users } from './users.model';

export const businessUsers = pgTable('business_users', {
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const businessUsersRelations = relations(businessUsers, ({ one }) => ({
  business: one(business, {
    fields: [businessUsers.business_id],
    references: [business.business_id]
  }),
  user: one(users, {
    fields: [businessUsers.user_id],
    references: [users.user_id]
  })
}));
