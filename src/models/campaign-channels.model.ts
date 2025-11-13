import { pgTable, varchar, bigserial, bigint, timestamp, text,pgEnum } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { campaigns } from './campaigns.model';

export const channelEnum = pgEnum('channel', ['sms', 'email', 'whatsapp']);

export const campaignChannels = pgTable('campaign_channels', {
  campaign_channel_id: bigserial('campaign_channel_id', { mode: 'number' }).primaryKey(),
  campaign_id: bigint('campaign_id', { mode: 'number' }).notNull(),
  channel: channelEnum('channel').notNull(),
  subject: varchar('subject', { length: 150 }),
  message: text('message').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow()
});

export const campaignChannelsRelations = relations(campaignChannels, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignChannels.campaign_id],
    references: [campaigns.campaign_id]
  })
}));
