import { pgTable, varchar, serial, boolean, timestamp } from 'drizzle-orm/pg-core';


export const xAddStates = pgTable('x_add_states', {
  state_id: serial('state_id').primaryKey(),
  state_name: varchar('state_name', { length: 50 }).notNull(),
  status: boolean('status').notNull().default(true),
createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});
