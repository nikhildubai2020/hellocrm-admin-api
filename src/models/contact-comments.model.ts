import { pgTable, bigserial, bigint, timestamp, text } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { contacts } from './contacts.model';
import { users } from './users.model';

export const contactComments = pgTable('contact_comments', {
  contact_comment_id: bigserial('contact_comment_id', { mode: 'number' }).primaryKey(),
  contact_id: bigint('contact_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  comments: text('comments'),
  recording: text('recording'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const contactCommentsRelations = relations(contactComments, ({ one }) => ({
  contact: one(contacts, {
    fields: [contactComments.contact_id],
    references: [contacts.contact_id]
  }),
  user: one(users, {
    fields: [contactComments.user_id],
    references: [users.user_id]
  })
}));
