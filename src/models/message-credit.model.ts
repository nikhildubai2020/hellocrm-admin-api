import { pgTable, varchar, bigserial, integer, bigint, timestamp, text, decimal } from 'drizzle-orm/pg-core';


export const messageCreditBalance = pgTable('message_credit_balance', {
  balance_id: bigserial('balance_id', { mode: 'number' }).primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  credit_type_id: integer('credit_type_id').notNull(),
  available_units: integer('available_units').default(0),
  updatedAt: timestamp('updatedAt').defaultNow()
});

export const messageCreditPurchase = pgTable('message_credit_purchase', {
  purchase_id: bigserial('purchase_id', { mode: 'number' }).primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  credit_type_id: integer('credit_type_id').notNull(),
  units: integer('units').notNull(),
  amount_paid: decimal('amount_paid', { precision: 10, scale: 2 }).notNull(),
  purchased_at: timestamp('purchased_at').defaultNow()
});

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
