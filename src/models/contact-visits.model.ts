import { pgTable, varchar, serial, integer, bigint, boolean, timestamp, text, time , pgEnum} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { contacts } from './contacts.model';
import { users } from './users.model';
import { projects } from './projects.model';
import { brokers } from './brokers.model';
import { properties } from './properties.model';

export const familyVisitEnum = pgEnum('family_visit', ['Yes', 'No']);
export const visitDoneEnum = pgEnum('visit_done', ['Yes', 'No']);
export const visitPostponedEnum = pgEnum('visit_postponed', ['Yes', 'No']);

export const contactVisits = pgTable('contact_visits', {
  contacts_visits_id: serial('contacts_visits_id').primaryKey(),
  contact_id: bigint('contact_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }),
  caller_id: bigint('caller_id', { mode: 'number' }),
  attendee_id: bigint('attendee_id', { mode: 'number' }),
  project_id: bigint('project_id', { mode: 'number' }),
  broker_id: bigint('broker_id', { mode: 'number' }),
  property_id: bigint('property_id', { mode: 'number' }),
  driver_id: bigint('driver_id', { mode: 'number' }),
  visit_date: timestamp('visit_date'),
  pickup_time: time('pickup_time'),
  pickup_location: varchar('pickup_location', { length: 50 }),
  family_vist: familyVisitEnum('family_vist').default('No'),
  group_booking: boolean('group_booking'),
  budget: varchar('budget', { length: 20 }),
  decision_time: varchar('decision_time', { length: 20 }),
  remark: text('remark'),
  rating: integer('rating'),
  interested: boolean('interested'),
  loan_required: boolean('loan_required'),
  visit_done: visitDoneEnum('visit_done'),
  visit_postponed: visitPostponedEnum('visit_postponed'),
  updated: timestamp('updated'),
  update_by: bigint('update_by', { mode: 'number' }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const contactVisitsRelations = relations(contactVisits, ({ one }) => ({
  contact: one(contacts, {
    fields: [contactVisits.contact_id],
    references: [contacts.contact_id]
  }),
  user: one(users, {
    fields: [contactVisits.user_id],
    references: [users.user_id]
  }),
  project: one(projects, {
    fields: [contactVisits.project_id],
    references: [projects.project_id]
  }),
  broker: one(brokers, {
    fields: [contactVisits.broker_id],
    references: [brokers.broker_id]
  }),
  property: one(properties, {
    fields: [contactVisits.property_id],
    references: [properties.property_id]
  })
}));
