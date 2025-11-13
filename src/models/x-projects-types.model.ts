import { pgTable, varchar, serial, integer, boolean, timestamp, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';


export const xProjectsTypes = pgTable('x_projects_types', {
  project_type_id: serial('project_type_id').primaryKey(),
  project_type_parent_id: integer('project_type_parent_id').default(0),
  project_type_name: varchar('project_type_name', { length: 50 }).notNull(),
  description: text('description'),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const xProjectsTypesRelations = relations(xProjectsTypes, ({ one, many }) => ({
  parent: one(xProjectsTypes, {
    fields: [xProjectsTypes.project_type_parent_id],
    references: [xProjectsTypes.project_type_id]
  }),
  children: many(xProjectsTypes)
}));
