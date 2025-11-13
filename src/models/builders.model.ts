import { pgTable, varchar, serial, integer, bigint, timestamp, text, boolean } from 'drizzle-orm/pg-core';


export const builders = pgTable('builders', {
  builder_id: serial('builder_id').primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).default(0),
  builder_name: varchar('builder_name', { length: 100 }).notNull(),
  description: text('description'),
  logo_image: varchar('logo_image', { length: 50 }),
  logo_path: varchar('logo_path', { length: 150 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});
