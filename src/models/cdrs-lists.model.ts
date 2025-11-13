import { pgTable, varchar, bigserial, bigint, boolean, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';

export const cdrsLists = pgTable('cdrs_lists', {
  cdr_list_id: bigserial('cdr_list_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  list_name: varchar('list_name', { length: 200 }),
  status: boolean('status').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const cdrsListsAssigned = pgTable('cdrs_lists_assigned', {
  cdr_list_assigned_id: bigserial('cdr_list_assigned_id', { mode: 'number' }).primaryKey(),
  cdrs_list_id: bigint('cdrs_list_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull()
});

export const cdrsListsContacts = pgTable('cdrs_lists_contacts', {
  cdr_list_contact_id: bigserial('cdr_list_contact_id', { mode: 'number' }).primaryKey(),
  cdrs_list_id: bigint('cdrs_list_id', { mode: 'number' }).notNull(),
  contact_id: bigint('contact_id', { mode: 'number' }).notNull()
});

export const cdrsListsRelations = relations(cdrsLists, ({ one }) => ({
  user: one(users, {
    fields: [cdrsLists.user_id],
    references: [users.user_id]
  })
}));
