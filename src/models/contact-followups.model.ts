import { pgTable, bigserial, bigint, timestamp , pgEnum} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { contacts } from './contacts.model';
import { users } from './users.model';

export const followupDoneEnum = pgEnum('followup_done', ['Yes', 'No']);

export const contactFollowups = pgTable('contact_followups', {
  contact_followup_id: bigserial('contact_followup_id', { mode: 'number' }).primaryKey(),
  contact_id: bigint('contact_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  followup_date: timestamp('followup_date').notNull(),
  followup_done: followupDoneEnum('followup_done').notNull().default('No'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const contactFollowupsRelations = relations(contactFollowups, ({ one }) => ({
  contact: one(contacts, {
    fields: [contactFollowups.contact_id],
    references: [contacts.contact_id]
  }),
  user: one(users, {
    fields: [contactFollowups.user_id],
    references: [users.user_id]
  })
}));
