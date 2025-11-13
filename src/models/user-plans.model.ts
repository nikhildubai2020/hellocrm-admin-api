import { pgTable, bigserial, integer, bigint, boolean, timestamp , pgEnum} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { plans } from './plans.model';

export const userPlanStatusEnum = pgEnum('user_plan_status', ['active', 'inactive', 'cancelled', 'expired']);

export const userPlans = pgTable('user_plans', {
  upid: bigserial('upid', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  plan_id: integer('plan_id').notNull(),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date'),
  status: userPlanStatusEnum('status').notNull(),
  auto_renew: boolean('auto_renew').default(true),
  last_payment_date: timestamp('last_payment_date'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const userPlansRelations = relations(userPlans, ({ one }) => ({
  user: one(users, {
    fields: [userPlans.user_id],
    references: [users.user_id]
  }),
  plan: one(plans, {
    fields: [userPlans.plan_id],
    references: [plans.pid]
  })
}));
