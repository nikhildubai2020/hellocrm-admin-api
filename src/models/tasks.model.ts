import { pgTable, varchar, bigserial, integer, bigint, timestamp, text, date, pgEnum, boolean } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { contacts } from './contacts.model';
import { users } from './users.model';

export const priorityEnum = pgEnum('priority', ['Low', 'Medium', 'High']);

export const tasks = pgTable('tasks', {
  task_id: bigserial('task_id', { mode: 'number' }).primaryKey(),
  contact_id: bigint('contact_id', { mode: 'number' }),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  task_type: integer('task_type').notNull(),
  task_title: varchar('task_title', { length: 50 }).notNull(),
  task_details: text('task_details').notNull(),
  piority: priorityEnum('piority').notNull().default('Low'),
  start_date: date('start_date'),
  due_date: date('due_date'),
  complete_Date: date('complete_Date'),
  status: boolean('status').notNull().default(true),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  contact: one(contacts, {
    fields: [tasks.contact_id],
    references: [contacts.contact_id]
  }),
  user: one(users, {
    fields: [tasks.user_id],
    references: [users.user_id]
  })
}));
