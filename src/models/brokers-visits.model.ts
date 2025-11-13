import { pgTable, bigserial, bigint, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { brokers } from './brokers.model';
import { users } from './users.model';

export const brokersVisits = pgTable('brokers_visits', {
  broker_visit_id: bigserial('broker_visit_id', { mode: 'number' }).primaryKey(),
  broker_id: bigint('broker_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const brokersVisitsRelations = relations(brokersVisits, ({ one }) => ({
  broker: one(brokers, {
    fields: [brokersVisits.broker_id],
    references: [brokers.broker_id]
  }),
  user: one(users, {
    fields: [brokersVisits.user_id],
    references: [users.user_id]
  })
}));
