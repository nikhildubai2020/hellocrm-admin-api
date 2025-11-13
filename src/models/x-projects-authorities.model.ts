import { pgTable, varchar, serial, boolean, timestamp, text } from 'drizzle-orm/pg-core';

export const xProjectsAuthorities = pgTable('x_projects_authorities', {
  project_authority_id: serial('project_authority_id').primaryKey(),
  project_authority_name: varchar('project_authority_name', { length: 100 }).notNull(),
  description: text('description'),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});