import { pgTable, varchar, bigserial, integer, bigint, boolean, timestamp } from 'drizzle-orm/pg-core';


export const xAddCities = pgTable('x_add_cities', {
  city_id: bigserial('city_id', { mode: 'number' }).primaryKey(),
  state_id: integer('state_id').notNull(),
  user_id: bigint('user_id', { mode: 'number' }),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  city_name: varchar('city_name', { length: 50 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});
