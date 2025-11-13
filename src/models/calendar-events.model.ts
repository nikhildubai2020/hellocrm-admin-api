import { pgTable, varchar, bigserial, integer, bigint, boolean, timestamp, text,pgEnum } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { business } from './business.model';
import { users } from './users.model';

export const eventTypeEnum = pgEnum('event_type', ['followup', 'visit', 'task']);
export const eventStatusEnum = pgEnum('event_status', ['pending', 'done', 'cancelled']);

export const calendarEvents = pgTable('calendar_events', {
  calendar_event_id: bigserial('calendar_event_id', { mode: 'number' }).primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  event_type: eventTypeEnum('event_type').notNull(),
  reference_id: integer('reference_id').notNull(),
  title: varchar('title', { length: 150 }).notNull(),
  description: text('description'),
  start_time: timestamp('start_time').notNull(),
  end_time: timestamp('end_time'),
  all_day: boolean('all_day').default(false),
  assigned_to: integer('assigned_to'),
  status: eventStatusEnum('status').default('pending'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow()
});

export const calendarEventsRelations = relations(calendarEvents, ({ one }) => ({
  business: one(business, {
    fields: [calendarEvents.business_id],
    references: [business.business_id]
  }),
  user: one(users, {
    fields: [calendarEvents.user_id],
    references: [users.user_id]
  })
}));
