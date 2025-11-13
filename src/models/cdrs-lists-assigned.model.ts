import { pgTable, bigserial, bigint , timestamp} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.model';

export const cdrsListsAssigned = pgTable('cdrs_lists_assigned', {
  cdr_list_assigned_id: bigserial('cdr_list_assigned_id', { mode: 'number' }).primaryKey(),
  cdrs_list_id: bigint('cdrs_list_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});

export const cdrsListsAssignedRelations = relations(cdrsListsAssigned, ({ one }) => ({
  user: one(users, {
    fields: [cdrsListsAssigned.user_id],
    references: [users.user_id]
  })
}));
