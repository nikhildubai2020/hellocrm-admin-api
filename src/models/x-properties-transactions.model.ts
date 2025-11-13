import { pgTable, varchar, serial, boolean, timestamp } from 'drizzle-orm/pg-core';


export const xPropertiesTransactions = pgTable('x_properties_transactions', {
  property_transaction_id: serial('property_transaction_id').primaryKey(),
  property_transaction_type: varchar('property_transaction_type', { length: 50 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});
