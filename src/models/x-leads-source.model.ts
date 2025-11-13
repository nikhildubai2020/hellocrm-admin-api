import { pgTable, varchar, serial, boolean, timestamp } from 'drizzle-orm/pg-core';


export const xLeadsSource = pgTable('x_leads_source', {
  lead_source_id: serial('lead_source_id').primaryKey(),
  lead_source_name: varchar('lead_source_name', { length: 50 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});
