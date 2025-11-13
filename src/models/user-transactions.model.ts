import { pgTable, varchar, bigserial, bigint, timestamp, decimal , pgEnum} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';

export const transactionTypeEnum = pgEnum('transaction_type', ['plan', 'addon', 'refund', 'adjustment']);
export const transactionStatusEnum = pgEnum('transaction_status', ['completed', 'pending', 'failed', 'refunded']);

export const userTransactions = pgTable('user_transactions', {
  user_transaction_id: bigserial('user_transaction_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }),
  transaction_date: timestamp('transaction_date').defaultNow().notNull(),
  transaction_type: transactionTypeEnum('transaction_type'),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  payment_method: varchar('payment_method', { length: 255 }),
  status: transactionStatusEnum('status').default('completed'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const userTransactionsRelations = relations(userTransactions, ({ one }) => ({
  user: one(users, {
    fields: [userTransactions.user_id],
    references: [users.user_id]
  })
}));
