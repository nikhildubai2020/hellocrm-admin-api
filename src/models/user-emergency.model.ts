import { pgTable, varchar, bigserial, integer, bigint, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';

export const userEmergency = pgTable('user_emergency', {
  user_emergency_id: bigserial('user_emergency_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  number: integer('number').notNull(),
  relation: varchar('relation', { length: 20 }).notNull(),
  added_by: bigint('added_by', { mode: 'number' }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const userEmergencyRelations = relations(userEmergency, ({ one }) => ({
  user: one(users, {
    fields: [userEmergency.user_id],
    references: [users.user_id]
  })
}));
