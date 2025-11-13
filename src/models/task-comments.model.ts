import { pgTable, bigserial, bigint, timestamp, text } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { tasks } from './tasks.model';

export const taskComments = pgTable('task_comments', {
  task_comment_id: bigserial('task_comment_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  task_id: bigint('task_id', { mode: 'number' }).notNull(),
  comment: text('comment').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const taskCommentsAttachments = pgTable('task_comments_attachments', {
  task_comment_id: bigserial('task_comment_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  task_id: bigint('task_id', { mode: 'number' }).notNull(),
  file_name: text('file_name').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});

export const taskCommentsRelations = relations(taskComments, ({ one }) => ({
  user: one(users, {
    fields: [taskComments.user_id],
    references: [users.user_id]
  }),
  task: one(tasks, {
    fields: [taskComments.task_id],
    references: [tasks.task_id]
  })
}));
