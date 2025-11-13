import { pgTable, varchar, serial, boolean, timestamp,text,index } from 'drizzle-orm/pg-core';


export const xBuildingType = pgTable('x_building_type', {
  project_building_type_id: serial('project_building_type_id').primaryKey(),
  project_building_type_name: varchar('project_building_type_name', { length: 100 }).notNull(),
  description: text('description'),
  status: boolean('status').notNull().default(true),
createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
}, (table) => ({
  nameIdx: index('x_projects_building_type_name_idx').on(table.project_building_type_name),
  statusIdx: index('x_projects_building_type_status_idx').on(table.status)
}));
