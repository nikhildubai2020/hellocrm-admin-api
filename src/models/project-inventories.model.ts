import { pgTable, varchar, bigserial, integer, bigint, timestamp, decimal, boolean } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { projects } from './projects.model';

export const projectInventories = pgTable('project_inventories', {
  project_inventory_id: bigserial('project_inventory_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  project_id: bigint('project_id', { mode: 'number' }).notNull(),
  config_id: integer('config_id'),
  building: varchar('building', { length: 10 }),
  floor: varchar('floor', { length: 10 }),
  unit_number: varchar('unit_number', { length: 10 }),
  carpet_area: varchar('carpet_area', { length: 10 }),
  sellable_area: varchar('sellable_area', { length: 10 }),
  price_expected: decimal('price_expected', { precision: 12, scale: 2 }),
  price_psf: decimal('price_psf', { precision: 12, scale: 2 }),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const projectInventoriesRelations = relations(projectInventories, ({ one }) => ({
  user: one(users, {
    fields: [projectInventories.user_id],
    references: [users.user_id]
  }),
  project: one(projects, {
    fields: [projectInventories.project_id],
    references: [projects.project_id]
  })
}));
