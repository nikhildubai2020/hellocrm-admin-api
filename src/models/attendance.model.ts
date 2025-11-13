import { pgTable, varchar, bigserial, integer, bigint, boolean, timestamp, decimal, time } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { business } from './business.model';

export const attendance = pgTable('attendance', {
  attendance_id: bigserial('attendance_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  partner_id: bigint('partner_id', { mode: 'number' }),
  in_time: timestamp('in_time').notNull(),
  in_lat: decimal('in_lat', { precision: 10, scale: 6 }),
  in_long: decimal('in_long', { precision: 10, scale: 6 }),
  in_photo: varchar('in_photo', { length: 100 }),
  in_ipaddress: varchar('in_ipaddress', { length: 100 }),
  out_time: timestamp('out_time'),
  out_lat: decimal('out_lat', { precision: 10, scale: 6 }),
  out_long: decimal('out_long', { precision: 10, scale: 6 }),
  out_photo: varchar('out_photo', { length: 100 }),
  out_ipaddress: varchar('out_ipaddress', { length: 100 }),
  halfday: boolean('halfday'),
  late: boolean('late'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const attendanceRelations = relations(attendance, ({ one }) => ({
  user: one(users, {
    fields: [attendance.user_id],
    references: [users.user_id]
  }),
  business: one(business, {
    fields: [attendance.business_id],
    references: [business.business_id]
  })
}));
