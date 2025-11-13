import { pgTable, varchar, integer, bigint, timestamp, text } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';

export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }),
  ip_address: varchar('ip_address', { length: 45 }),
  user_agent: text('user_agent'),
  payload: text('payload').notNull(),
  last_activity: integer('last_activity').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.user_id],
    references: [users.user_id]
  })
}));
