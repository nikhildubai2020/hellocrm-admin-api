import { pgTable, serial, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const xPropertiesFurnishs = pgTable('x_properties_furnishs', {
  property_furnish_id: serial('property_furnish_id').primaryKey(),
  property_furnish_type: varchar('property_furnish_type', { length: 255 }).notNull(),
  description: text('Description'),
  status: boolean('status').default(true).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});