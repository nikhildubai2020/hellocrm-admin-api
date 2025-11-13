import { pgTable, varchar, bigserial, integer, bigint, boolean, timestamp, text } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { projects } from './projects.model';

export const projectDocuments = pgTable('project_documents', {
  project_document_id: bigserial('project_document_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  project_id: bigint('project_id', { mode: 'number' }).notNull(),
  document_type: integer('document_type').notNull(),
  document_name: varchar('document_name', { length: 50 }),
  document_description: text('document_description'),
  file_name: varchar('file_name', { length: 50 }),
  file_path: varchar('file_path', { length: 250 }),
  status: boolean('status').default(true),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull()
});

export const projectDocumentsRelations = relations(projectDocuments, ({ one }) => ({
  user: one(users, {
    fields: [projectDocuments.user_id],
    references: [users.user_id]
  }),
  project: one(projects, {
    fields: [projectDocuments.project_id],
    references: [projects.project_id]
  })
}));
