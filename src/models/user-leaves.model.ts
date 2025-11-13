import { pgTable, varchar, bigserial, integer, bigint, timestamp, date , pgEnum} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';

export const leaveApprovedEnum = pgEnum('leave_approved', ['Yes', 'No']);
export const leaveStatusEnum = pgEnum('leave_status', ['Applied', 'Rejected']);

export const userLeaves = pgTable('user_leaves', {
  user_leave_id: bigserial('user_leave_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  leave_type_id: integer('leave_type_id').notNull(),
  leave_reason: varchar('leave_reason', { length: 100 }),
  no_days: integer('no_days').notNull(),
  date_start: date('date_start').notNull(),
  date_end: date('date_end').notNull(),
  leave_approved: leaveApprovedEnum('leave_approved'),
  approved_by: bigint('approved_by', { mode: 'number' }).notNull(),
  status: leaveStatusEnum('status').notNull().default('Applied'),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});

export const userLeavesRelations = relations(userLeaves, ({ one }) => ({
  user: one(users, {
    fields: [userLeaves.user_id],
    references: [users.user_id]
  })
}));
