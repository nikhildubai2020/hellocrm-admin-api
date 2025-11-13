import { pgTable, varchar, bigserial, integer, bigint, timestamp , pgEnum} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { business } from './business.model';
import { users } from './users.model';
import { projects } from './projects.model';

export const campaignTypeEnum = pgEnum('campaign_type', ['sms', 'email', 'whatsapp', 'mixed']);
export const campaignStatusEnum = pgEnum('campaign_status', ['draft', 'scheduled', 'running', 'completed', 'cancelled']);

export const campaigns = pgTable('campaigns', {
  campaign_id: bigserial('campaign_id', { mode: 'number' }).primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  project_id: bigint('project_id', { mode: 'number' }),
  campaign_name: varchar('campaign_name', { length: 100 }).notNull(),
  campaign_type: campaignTypeEnum('campaign_type').default('mixed'),
  scheduled_at: timestamp('scheduled_at'),
  status: campaignStatusEnum('status').default('draft'),
  total_contacts: integer('total_contacts').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow()
});

export const campaignsRelations = relations(campaigns, ({ one }) => ({
  business: one(business, {
    fields: [campaigns.business_id],
    references: [business.business_id]
  }),
  user: one(users, {
    fields: [campaigns.user_id],
    references: [users.user_id]
  }),
  project: one(projects, {
    fields: [campaigns.project_id],
    references: [projects.project_id]
  })
}));
