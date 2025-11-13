import { pgTable, varchar, bigserial, integer, bigint, boolean, timestamp, text } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { projects } from './projects.model';

export const projectMedias = pgTable('project_medias', {
  project_media_id: bigserial('project_media_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  project_id: bigint('project_id', { mode: 'number' }).notNull(),
  media_type: integer('media_type').notNull(),
  name: varchar('name', { length: 50 }),
  description: text('description'),
  file_name: varchar('file_name', { length: 250 }).notNull(),
  file_path: varchar('file_path', { length: 250 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const projectMediasRelations = relations(projectMedias, ({ one }) => ({
  user: one(users, {
    fields: [projectMedias.user_id],
    references: [users.user_id]
  }),
  project: one(projects, {
    fields: [projectMedias.project_id],
    references: [projects.project_id]
  })
}));
