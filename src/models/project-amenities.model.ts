import { pgTable, bigint, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { projects } from './projects.model';

export const projectAmenities = pgTable('project_amenities', {
  project_id: bigint('project_id', { mode: 'number' }).notNull(),
  ameneties_id: bigint('ameneties_id', { mode: 'number' }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const projectAmenitiesRelations = relations(projectAmenities, ({ one }) => ({
  project: one(projects, {
    fields: [projectAmenities.project_id],
    references: [projects.project_id]
  })
}));
