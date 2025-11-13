import { pgTable, varchar, bigserial, integer, bigint, boolean, timestamp, text } from 'drizzle-orm/pg-core';


export const brokers = pgTable('brokers', {
  broker_id: bigserial('broker_id', { mode: 'number' }).primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  broker_type: integer('broker_type').notNull(),
  business_name: varchar('business_name', { length: 50 }).notNull(),
  address: text('address').notNull(),
  locality: varchar('locality', { length: 30 }),
  city: varchar('city', { length: 50 }).notNull(),
  state: varchar('state', { length: 50 }).notNull(),
  pincode: varchar('pincode', { length: 10 }),
  rera: varchar('rera', { length: 20 }),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});
