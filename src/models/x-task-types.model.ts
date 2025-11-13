import { pgTable, varchar, serial, bigint, boolean, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { business } from './business.model';

export const xTaskTypes = pgTable('x_task_types', {
  task_type_id: serial('task_type_id').primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  task_type_name: varchar('task_type_name', { length: 30 }).notNull(),
  status: boolean('status').notNull().default(true),
createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const xTaskTypesRelations = relations(xTaskTypes, ({ one }) => ({
  user: one(users, {
    fields: [xTaskTypes.user_id],
    references: [users.user_id]
  }),
  business: one(business, {
    fields: [xTaskTypes.business_id],
    references: [business.business_id]
  })
}));
