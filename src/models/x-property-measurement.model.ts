import { pgTable, varchar, serial, boolean, timestamp } from 'drizzle-orm/pg-core';


export const xPropertyAreaType = pgTable('x_property_area_type', {
  property_area_type_id: serial('property_area_type_id').primaryKey(),
  property_area_type_name: varchar('property_area_type_name', { length: 100 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});
