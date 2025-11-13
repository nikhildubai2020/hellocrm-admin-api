import { pgTable, bigint, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { brokers } from './brokers.model';
import { users } from './users.model';

export const brokersUsers = pgTable('brokers_users', {
  broker_id: bigint('broker_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const brokersUsersRelations = relations(brokersUsers, ({ one }) => ({
  broker: one(brokers, {
    fields: [brokersUsers.broker_id],
    references: [brokers.broker_id]
  }),
  user: one(users, {
    fields: [brokersUsers.user_id],
    references: [users.user_id]
  })
}));
