import { pgTable, bigserial, integer, bigint, timestamp, decimal } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { business } from './business.model';

export const messageCreditPurchase = pgTable('message_credit_purchase', {
  purchase_id: bigserial('purchase_id', { mode: 'number' }).primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  credit_type_id: integer('credit_type_id').notNull(),
  units: integer('units').notNull(),
  amount_paid: decimal('amount_paid', { precision: 10, scale: 2 }).notNull(),
  purchased_at: timestamp('purchased_at').defaultNow(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});

export const messageCreditPurchaseRelations = relations(messageCreditPurchase, ({ one }) => ({
  business: one(business, {
    fields: [messageCreditPurchase.business_id],
    references: [business.business_id]
  })
}));
