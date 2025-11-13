import { pgTable, varchar, serial, boolean, timestamp, text } from 'drizzle-orm/pg-core';

export const xPropertiesConfigs = pgTable('x_properties_configs', {
  property_config_id: serial('property_config_id').primaryKey(),
  property_config_name: varchar('property_config_name', { length: 50 }).notNull(),
  description: text('Description'),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});