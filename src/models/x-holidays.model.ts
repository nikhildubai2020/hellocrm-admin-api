import { pgTable, varchar, bigserial, bigint, timestamp, date, boolean } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { business } from './business.model';

export const xHolidays = pgTable('x_holidays', {
  holiday_id: bigserial('holiday_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  holiday_name: varchar('holiday_name', { length: 50 }).notNull(),
  holiday_date: date('holiday_date').notNull(),
createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const xHolidaysRelations = relations(xHolidays, ({ one }) => ({
  user: one(users, {
    fields: [xHolidays.user_id],
    references: [users.user_id]
  }),
  business: one(business, {
    fields: [xHolidays.business_id],
    references: [business.business_id]
  })
}));
