import { pgTable, varchar, integer, timestamp,time , bigint,serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { business } from './business.model';

export const attendanceSettings = pgTable('attendance_settings', {
  attendance_setting_id: serial('attendance_setting_id').primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  office_start_time: time('office_start_time').notNull(),
  office_end_time: time('office_end_time').notNull(),
  halfday_mark_time: time('halfday_mark_time').notNull(),
  late_mark_duration: time('late_mark_duration'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});

export const attendanceSettingsRelations = relations(attendanceSettings, ({ one }) => ({
  business: one(business, {
    fields: [attendanceSettings.business_id],
    references: [business.business_id]
  })
}));
