import { pgTable, varchar, bigserial, bigint, timestamp, text } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { contacts } from './contacts.model';

export const contactUploads = pgTable('contact_uploads', {
  contacts_uploads_id: bigserial('contacts_uploads_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  contact_id: bigint('contact_id', { mode: 'number' }).notNull(),
  file_name: varchar('file_name', { length: 100 }).notNull(),
  file_path: text('file_path'),
  type: varchar('type', { length: 30 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const contactUploadsRelations = relations(contactUploads, ({ one }) => ({
  user: one(users, {
    fields: [contactUploads.user_id],
    references: [users.user_id]
  }),
  contact: one(contacts, {
    fields: [contactUploads.contact_id],
    references: [contacts.contact_id]
  })
}));
