import { pgTable, bigserial, integer, bigint, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { business } from './business.model';

export const messageCreditBalance = pgTable('message_credit_balance', {
  balance_id: bigserial('balance_id', { mode: 'number' }).primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  credit_type_id: integer('credit_type_id').notNull(),
  available_units: integer('available_units').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const messageCreditBalanceRelations = relations(messageCreditBalance, ({ one }) => ({
  business: one(business, {
    fields: [messageCreditBalance.business_id],
    references: [business.business_id]
  })
}));
