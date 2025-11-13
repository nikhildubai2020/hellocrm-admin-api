import { pgTable, varchar, serial, boolean, timestamp } from 'drizzle-orm/pg-core';


export const xUsersRoles = pgTable('x_users_roles', {
  user_role_id: serial('user_role_id').primaryKey(),
  user_role_name: varchar('user_role_name', { length: 30 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});
