import { pgTable, bigserial, integer, bigint, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { business } from './business.model';

export const storageCreditBalance = pgTable('storage_credit_balance', {
  balance_id: bigserial('balance_id', { mode: 'number' }).primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  storage_remaining_mb: integer('storage_remaining_mb').default(0),
  last_updated: timestamp('last_updated').defaultNow(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});

export const storageCreditBalanceRelations = relations(storageCreditBalance, ({ one }) => ({
  business: one(business, {
    fields: [storageCreditBalance.business_id],
    references: [business.business_id]
  })
}));
