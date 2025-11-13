import { pgTable, bigserial, integer, bigint, timestamp, decimal } from 'drizzle-orm/pg-core';


export const storageCreditBalance = pgTable('storage_credit_balance', {
  balance_id: bigserial('balance_id', { mode: 'number' }).primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  storage_remaining_mb: integer('storage_remaining_mb').default(0),
  last_updated: timestamp('last_updated').defaultNow()
});

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


