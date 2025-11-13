import { pgTable, varchar, serial, timestamp, text, boolean } from 'drizzle-orm/pg-core';


export const xSettings = pgTable('x_settings', {
  sid: serial('sid').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  value: text('value'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});
