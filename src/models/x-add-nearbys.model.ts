import { pgTable, varchar, bigserial, bigint, boolean, timestamp } from 'drizzle-orm/pg-core';


export const xAddNearbys = pgTable('x_add_nearbys', {
  nearby_id: bigserial('nearby_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull().default(0),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  nearby_name: varchar('nearby_name', { length: 50 }).notNull(),
  status: boolean('status').notNull().default(true),
createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});
