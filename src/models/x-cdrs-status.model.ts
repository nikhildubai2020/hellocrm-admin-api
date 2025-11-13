import { pgTable, varchar, serial, integer, timestamp, boolean } from 'drizzle-orm/pg-core';


export const xCdrsStatus = pgTable('x_cdrs_status', {
  cdr_status_id: serial('cdr_status_id').primaryKey(),
  cdr_status_name: varchar('cdr_status_name', { length: 30 }).notNull(),
  status: boolean('status').notNull().default(true),
createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});
