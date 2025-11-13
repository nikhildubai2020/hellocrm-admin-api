import { pgTable, bigserial, bigint, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { projects } from './projects.model';

export const projectLocalities = pgTable('project_localities', {
  project_locality_id: bigserial('project_locality_id', { mode: 'number' }).primaryKey(),
  project_id: bigint('project_id', { mode: 'number' }),
  x_add_localities_id: bigint('x_add_localities_id', { mode: 'number' }),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt')
});

export const projectLocalitiesRelations = relations(projectLocalities, ({ one }) => ({
  project: one(projects, {
    fields: [projectLocalities.project_id],
    references: [projects.project_id]
  })
}));
