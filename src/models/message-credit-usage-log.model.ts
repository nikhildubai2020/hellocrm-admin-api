import { pgTable, varchar, bigserial, integer, bigint, timestamp, text } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { business } from './business.model';
import { users } from './users.model';

export const messageCreditUsageLog = pgTable('message_credit_usage_log', {
  usage_id: bigserial('usage_id', { mode: 'number' }).primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }),
  credit_type_id: integer('credit_type_id').notNull(),
  units_used: integer('units_used').default(1),
  usage_type: varchar('usage_type', { length: 100 }),
  recipient: varchar('recipient', { length: 100 }),
  message_content: text('message_content'),
  used_at: timestamp('used_at').defaultNow(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});

export const messageCreditUsageLogRelations = relations(messageCreditUsageLog, ({ one }) => ({
  business: one(business, {
    fields: [messageCreditUsageLog.business_id],
    references: [business.business_id]
  }),
  user: one(users, {
    fields: [messageCreditUsageLog.user_id],
    references: [users.user_id]
  })
}));
