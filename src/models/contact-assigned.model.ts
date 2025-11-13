import { pgTable, bigserial, bigint, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { contacts } from './contacts.model';
import { users } from './users.model';

export const contactAssigned = pgTable('contact_assigned', {
  contact_assigned_id: bigserial('contact_assigned_id', { mode: 'number' }).primaryKey(),
  contact_id: bigint('contact_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const contactAssignedRelations = relations(contactAssigned, ({ one }) => ({
  contact: one(contacts, {
    fields: [contactAssigned.contact_id],
    references: [contacts.contact_id]
  }),
  user: one(users, {
    fields: [contactAssigned.user_id],
    references: [users.user_id]
  })
}));
