import { pgTable, varchar, serial, integer, timestamp, text, boolean } from 'drizzle-orm/pg-core';


export const xDbBackups = pgTable('x_db_backups', {
  dbid: serial('dbid').primaryKey(),
  file_name: varchar('file_name', { length: 100 }).notNull(),
  file_path: text('file_path').notNull(),
  add_by: integer('add_by').notNull(),
  createdAt: timestamp('created').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});
