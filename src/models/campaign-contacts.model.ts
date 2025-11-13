import { pgTable, bigserial, integer, bigint, timestamp,pgEnum } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { campaigns } from './campaigns.model';
import { contacts } from './contacts.model';

export const campaignContactStatusEnum = pgEnum('campaign_contact_status', ['pending', 'sent', 'failed', 'delivered', 'read']);

export const campaignContacts = pgTable('campaign_contacts', {
  campaign_contact_id: bigserial('campaign_contact_id', { mode: 'number' }).primaryKey(),
  campaign_id: bigint('campaign_id', { mode: 'number' }).notNull(),
  contact_id: bigint('contact_id', { mode: 'number' }).notNull(),
  status: campaignContactStatusEnum('status').default('pending'),
  attempt_count: integer('attempt_count').default(0),
  last_attempt_at: timestamp('last_attempt_at'),
  createdAt: timestamp('createdAt').defaultNow()
});

export const campaignContactsRelations = relations(campaignContacts, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignContacts.campaign_id],
    references: [campaigns.campaign_id]
  }),
  contact: one(contacts, {
    fields: [campaignContacts.contact_id],
    references: [contacts.contact_id]
  })
}));
