import { pgTable, varchar, serial, boolean, timestamp, text } from 'drizzle-orm/pg-core';

export const xMeasurementUnits = pgTable('x_measurement_units', {
  measurement_unit_id: serial('measurement_unit_id').primaryKey(),
  measurement_unit_name: varchar('measurement_unit_name', { length: 50 }).notNull(),
  description: text('description'),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});