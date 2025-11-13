import { pgTable, varchar, serial, integer, timestamp, boolean } from 'drizzle-orm/pg-core';


export const xLeadsStatus = pgTable('x_leads_status', {
  lead_status_id: serial('lead_status_id').primaryKey(),
  lead_status_name: varchar('lead_status_name', { length: 30 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});