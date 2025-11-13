import { pgTable, bigserial, bigint, timestamp, text } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { notes } from './notes.model';

export const notesAttachments = pgTable('notes_attachments', {
  note_attachment_id: bigserial('note_attachment_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  note_id: bigint('note_id', { mode: 'number' }).notNull(),
  file_name: text('file_name').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const notesAttachmentsRelations = relations(notesAttachments, ({ one }) => ({
  user: one(users, {
    fields: [notesAttachments.user_id],
    references: [users.user_id]
  }),
  note: one(notes, {
    fields: [notesAttachments.note_id],
    references: [notes.notes_id]
  })
}));
