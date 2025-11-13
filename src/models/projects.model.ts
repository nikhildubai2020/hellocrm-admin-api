import { pgTable, varchar, bigserial, integer, bigint, timestamp, text, date, pgEnum, boolean } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { business } from './business.model';
import { users } from './users.model';
import { builders } from './builders.model';

export const reraEnum = pgEnum('rera', ['Yes', 'No']);

export const projects = pgTable('projects', {
  project_id: bigserial('project_id', { mode: 'number' }).primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  builder_id: bigint('builder_id', { mode: 'number' }).notNull(),
  project_name: varchar('project_name', { length: 100 }).notNull(),
  project_description: text('project_description'),
  project_highlight: text('project_highlight'),
  project_address: text('project_address'),
  pincode: integer('pincode'),
  state: integer('state'),
  city: integer('city'),
  rera: reraEnum('rera'),
  rera_1: varchar('rera_1', { length: 20 }),
  rera_2: varchar('rera_2', { length: 20 }),
  rera_3: varchar('rera_3', { length: 20 }),
  rera_4: varchar('rera_4', { length: 20 }),
  plot_area: varchar('plot_area', { length: 11 }),
  project_authority: integer('project_authority'),
  number_buildings: integer('number_buildings'),
  possession_date: date('possession_date'),
  fb: varchar('fb', { length: 100 }),
  instagram: varchar('instagram', { length: 100 }),
  map: text('map'),
  website: varchar('website', { length: 100 }),
  project_type: varchar('project_type', { length: 15 }),
  project_logo: text('project_logo'),
  project_image: text('project_image'),
  featured_image: text('featured_image'),
  no_of_building: integer('no_of_building').default(0),
  no_of_plots: integer('no_of_plots').default(0),
  og_title: varchar('og_title', { length: 255 }),
  og_description: text('og_description'),
  og_image: varchar('og_image', { length: 245 }),
  og_locale: varchar('og_locale', { length: 50 }),
  og_location: varchar('og_location', { length: 255 }),
  og_url: varchar('og_url', { length: 255 }),
  status: boolean('status').default(false),
  updated_by: bigint('updated_by', { mode: 'number' }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow()
});

export const projectsRelations = relations(projects, ({ one }) => ({
  business: one(business, {
    fields: [projects.business_id],
    references: [business.business_id]
  }),
  user: one(users, {
    fields: [projects.user_id],
    references: [users.user_id]
  }),
  builder: one(builders, {
    fields: [projects.builder_id],
    references: [builders.builder_id]
  })
}));
