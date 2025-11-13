import { pgTable, varchar, serial, boolean, timestamp } from 'drizzle-orm/pg-core';


export const xNotesTypes = pgTable('x_notes_types', {
  note_type_id: serial('note_type_id').primaryKey(),
  note_type_name: varchar('note_type_name', { length: 30 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});
