import { pgTable, varchar, serial, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';

export const tokens = pgTable('tokens', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id'),
  name: varchar('name', { length: 255 }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  type: varchar('type', { length: 80 }).notNull(),
  is_revoked: boolean('is_revoked').default(false),
  expires_at: timestamp('expires_at'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow()
});

export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.user_id],
    references: [users.user_id]
  })
}));
