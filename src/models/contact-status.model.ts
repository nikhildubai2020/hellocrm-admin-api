import { pgTable, bigserial, integer, bigint, timestamp, boolean } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { contacts } from './contacts.model';
import { users } from './users.model';

export const contactStatus = pgTable('contact_status', {
  contact_status_id: bigserial('contact_status_id', { mode: 'number' }).primaryKey(),
  contact_id: bigint('contact_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const contactStatusRelations = relations(contactStatus, ({ one }) => ({
  contact: one(contacts, {
    fields: [contactStatus.contact_id],
    references: [contacts.contact_id]
  }),
  user: one(users, {
    fields: [contactStatus.user_id],
    references: [users.user_id]
  })
}));
