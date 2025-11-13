import { pgTable, varchar, serial, integer, bigint, boolean, timestamp, text } from 'drizzle-orm/pg-core';


// Projects Authorities
export const xProjectsAuthorities = pgTable('x_projects_authorities', {
  project_authority_id: serial('project_authority_id').primaryKey(),
  project_authority_name: varchar('project_authority_name', { length: 100 }).notNull(),
  description: text('description'),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

// Projects Building Type
export const xProjectsBuildingType = pgTable('x_projects_building_type', {
  project_building_type_id: serial('project_building_type_id').primaryKey(),
  project_building_type_name: varchar('project_building_type_name', { length: 100 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});

// Projects Highlights
export const xProjectsHighlights = pgTable('x_projects_highlights', {
  project_highlight_id: serial('project_highlight_id').primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull().default(0),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  project_highlight_name: varchar('project_highlight_name', { length: 100 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});

// Projects Types
export const xProjectsTypes = pgTable('x_projects_types', {
  project_type_id: serial('project_type_id').primaryKey(),
  project_type_parent_id: integer('project_type_parent_id').default(0),
  project_type_name: varchar('project_type_name', { length: 50 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});