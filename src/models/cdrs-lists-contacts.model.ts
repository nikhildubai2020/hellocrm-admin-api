import { pgTable, bigserial, bigint , timestamp} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { contacts } from './contacts.model';

export const cdrsListsContacts = pgTable('cdrs_lists_contacts', {
  cdr_list_contact_id: bigserial('cdr_list_contact_id', { mode: 'number' }).primaryKey(),
  cdrs_list_id: bigint('cdrs_list_id', { mode: 'number' }).notNull(),
  contact_id: bigint('contact_id', { mode: 'number' }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});

export const cdrsListsContactsRelations = relations(cdrsListsContacts, ({ one }) => ({
  contact: one(contacts, {
    fields: [cdrsListsContacts.contact_id],
    references: [contacts.contact_id]
  })
}));
