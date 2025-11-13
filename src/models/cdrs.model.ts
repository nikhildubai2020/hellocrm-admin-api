import { pgTable, varchar, bigserial, bigint, boolean, timestamp, text, date, time } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { contacts } from './contacts.model';
import { users } from './users.model';

export const cdrs = pgTable('cdrs', {
  cdr_id: bigserial('cdr_id', { mode: 'number' }).primaryKey(),
  contact_id: bigint('contact_id', { mode: 'number' }).notNull(),
  list_id: bigint('list_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  connected: boolean('connected'),
  duration: time('duration'),
  date: timestamp('date'),
  recording: text('recording'),
  status: varchar('status', { length: 10 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const cdrsRelations = relations(cdrs, ({ one }) => ({
  contact: one(contacts, {
    fields: [cdrs.contact_id],
    references: [contacts.contact_id]
  }),
  user: one(users, {
    fields: [cdrs.user_id],
    references: [users.user_id]
  })
}));
