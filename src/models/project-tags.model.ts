import { pgTable, bigserial, bigint, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { projects } from './projects.model';
import { properties } from './properties.model';

export const projectTags = pgTable('project_tags', {
  project_tag_id: bigserial('project_tag_id', { mode: 'number' }).primaryKey(),
  project_id: bigint('project_id', { mode: 'number' }).notNull(),
  property_id: bigint('property_id', { mode: 'number' }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});

export const projectTagsRelations = relations(projectTags, ({ one }) => ({
  project: one(projects, {
    fields: [projectTags.project_id],
    references: [projects.project_id]
  }),
  property: one(properties, {
    fields: [projectTags.property_id],
    references: [properties.property_id]
  })
}));
