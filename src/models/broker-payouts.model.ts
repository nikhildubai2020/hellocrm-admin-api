import { pgTable, varchar, bigserial, bigint, timestamp, text, date, decimal } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { brokers } from './brokers.model';

export const brokerPayouts = pgTable('broker_payouts', {
  broker_payout_id: bigserial('broker_payout_id', { mode: 'number' }).primaryKey(),
  broker_id: bigint('broker_id', { mode: 'number' }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  payout_date: date('payout_date').notNull(),
  payment_method: varchar('payment_method', { length: 50 }),
  remarks: text('remarks'),
  createdAt: timestamp('createdAt').defaultNow()
});

export const brokerPayoutsRelations = relations(brokerPayouts, ({ one }) => ({
  broker: one(brokers, {
    fields: [brokerPayouts.broker_id],
    references: [brokers.broker_id]
  })
}));
