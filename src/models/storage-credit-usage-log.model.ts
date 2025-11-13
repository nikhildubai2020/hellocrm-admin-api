import { pgTable, varchar, bigserial, bigint, timestamp, text, decimal } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { business } from './business.model';
import { users } from './users.model';

export const storageCreditUsageLog = pgTable('storage_credit_usage_log', {
  usage_id: bigserial('usage_id', { mode: 'number' }).primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }),
  file_name: varchar('file_name', { length: 255 }),
  file_size_mb: decimal('file_size_mb', { precision: 10, scale: 2 }).notNull(),
  action_type: varchar('action_type', { length: 20 }).default('upload'),
  description: text('description'),
  used_at: timestamp('used_at').defaultNow(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});

export const storageCreditUsageLogRelations = relations(storageCreditUsageLog, ({ one }) => ({
  business: one(business, {
    fields: [storageCreditUsageLog.business_id],
    references: [business.business_id]
  }),
  user: one(users, {
    fields: [storageCreditUsageLog.user_id],
    references: [users.user_id]
  })
}));
