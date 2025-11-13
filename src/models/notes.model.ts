import { pgTable, varchar, bigserial, integer, bigint, timestamp, text , pgEnum} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { contacts } from './contacts.model';

export const privateNoteEnum = pgEnum('private_note', ['Yes', 'No']);

export const notes = pgTable('notes', {
  notes_id: bigserial('notes_id', { mode: 'number' }).primaryKey(),
  note_type_id: integer('note_type_id').notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  contact_id: bigint('contact_id', { mode: 'number' }),
  note_title: varchar('note_title', { length: 100 }).notNull(),
  note_details: text('note_details'),
  private_note: privateNoteEnum('private_note').notNull().default('No'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.user_id],
    references: [users.user_id]
  }),
  contact: one(contacts, {
    fields: [notes.contact_id],
    references: [contacts.contact_id]
  })
}));
