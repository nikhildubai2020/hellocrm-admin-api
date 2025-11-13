import { pgTable, bigserial, bigint, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { projects } from './projects.model';
import { users } from './users.model';

export const projectUsers = pgTable('project_users', {
  project_users_id: bigserial('project_users_id', { mode: 'number' }).primaryKey(),
  project_id: bigint('project_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  role_id: bigint('role_id', { mode: 'number' }).notNull(),
  add_by_user: bigint('add_by_user', { mode: 'number' }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const projectUsersRelations = relations(projectUsers, ({ one }) => ({
  project: one(projects, {
    fields: [projectUsers.project_id],
    references: [projects.project_id]
  }),
  user: one(users, {
    fields: [projectUsers.user_id],
    references: [users.user_id]
  })
}));
