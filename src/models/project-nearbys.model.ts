import { pgTable, bigserial, bigint, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { projects } from './projects.model';

export const projectNearbys = pgTable('project_nearbys', {
  project_nearby_id: bigserial('project_nearby_id', { mode: 'number' }).primaryKey(),
  project_id: bigint('project_id', { mode: 'number' }),
  nearby_project_id: bigint('nearby_project_id', { mode: 'number' }),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt')
});

export const projectNearbysRelations = relations(projectNearbys, ({ one }) => ({
  project: one(projects, {
    fields: [projectNearbys.project_id],
    references: [projects.project_id]
  }),
  nearbyProject: one(projects, {
    fields: [projectNearbys.nearby_project_id],
    references: [projects.project_id]
  })
}));
