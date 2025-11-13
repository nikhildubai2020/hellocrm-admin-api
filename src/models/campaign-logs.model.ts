import { pgTable, bigserial, bigint, timestamp, text , pgEnum} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { campaigns } from './campaigns.model';
import { contacts } from './contacts.model';

export const campaignLogStatusEnum = pgEnum('campaign_log_status', ['sent', 'failed', 'delivered', 'read']);
export const campaignLogChannelEnum = pgEnum('campaign_log_channel', ['sms', 'email', 'whatsapp']);

export const campaignLogs = pgTable('campaign_logs', {
  campaign_log_id: bigserial('campaign_log_id', { mode: 'number' }).primaryKey(),
  campaign_id: bigint('campaign_id', { mode: 'number' }).notNull(),
  contact_id: bigint('contact_id', { mode: 'number' }).notNull(),
  channel: campaignLogChannelEnum('channel').notNull(),
  status: campaignLogStatusEnum('status').default('sent'),
  response: text('response'),
  sent_at: timestamp('sent_at').defaultNow(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});

export const campaignLogsRelations = relations(campaignLogs, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignLogs.campaign_id],
    references: [campaigns.campaign_id]
  }),
  contact: one(contacts, {
    fields: [campaignLogs.contact_id],
    references: [contacts.contact_id]
  })
}));
