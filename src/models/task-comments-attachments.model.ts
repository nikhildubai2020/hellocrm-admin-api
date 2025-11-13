import { pgTable, bigserial, bigint, timestamp, text } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { tasks } from './tasks.model';

export const taskCommentsAttachments = pgTable('task_comments_attachments', {
  task_comment_id: bigserial('task_comment_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  task_id: bigint('task_id', { mode: 'number' }).notNull(),
  file_name: text('file_name').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const taskCommentsAttachmentsRelations = relations(taskCommentsAttachments, ({ one }) => ({
  user: one(users, {
    fields: [taskCommentsAttachments.user_id],
    references: [users.user_id]
  }),
  task: one(tasks, {
    fields: [taskCommentsAttachments.task_id],
    references: [tasks.task_id]
  })
}));
