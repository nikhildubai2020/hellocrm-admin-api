import { pgTable, varchar, bigserial, integer, bigint, boolean, timestamp } from 'drizzle-orm/pg-core';


export const xAddLocalities = pgTable('x_add_localities', {
  locality_id: bigserial('locality_id', { mode: 'number' }).primaryKey(),
  city_id: bigint('city_id', { mode: 'number' }).notNull(),
  state_id: integer('state_id').notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  business_id: integer('business_id').notNull(),
  locality_name: varchar('locality_name', { length: 50 }).notNull(),
  status: boolean('status').notNull().default(true),
createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});
