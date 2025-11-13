import { pgTable, varchar, bigserial, integer, bigint, timestamp,boolean } from 'drizzle-orm/pg-core';


export const xAmenities = pgTable('x_amenities', {
  amenity_id: bigserial('amenity_id', { mode: 'number' }).primaryKey(),
  amenity_type_id: integer('amenity_type_id').notNull(),
  user_id: bigint('user_id', { mode: 'number' }).default(0),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  amenity_name: varchar('amenity_name', { length: 100 }).notNull(),
  order: integer('order').notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});


