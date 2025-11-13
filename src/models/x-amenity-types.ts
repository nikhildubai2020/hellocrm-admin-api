import { pgTable, varchar, bigserial, integer, bigint, timestamp,boolean } from 'drizzle-orm/pg-core';

export const xAmenitiesTypes = pgTable('x_amenities_types', {
  amenity_type_id: bigserial('amenity_type_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  amenity_type_name: varchar('amenity_type_name', { length: 100 }).notNull(),
  order: integer('order').notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});