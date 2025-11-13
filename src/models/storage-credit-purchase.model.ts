import { pgTable, bigserial, integer, bigint, timestamp, decimal } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { business } from './business.model';

export const storageCreditPurchase = pgTable('storage_credit_purchase', {
  purchase_id: bigserial('purchase_id', { mode: 'number' }).primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  plan_id: integer('plan_id').notNull(),
  storage_allocated_mb: integer('storage_allocated_mb').notNull(),
  amount_paid: decimal('amount_paid', { precision: 10, scale: 2 }).notNull(),
  purchased_at: timestamp('purchased_at').defaultNow(),
  valid_until: timestamp('valid_until'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});

export const storageCreditPurchaseRelations = relations(storageCreditPurchase, ({ one }) => ({
  business: one(business, {
    fields: [storageCreditPurchase.business_id],
    references: [business.business_id]
  })
}));
