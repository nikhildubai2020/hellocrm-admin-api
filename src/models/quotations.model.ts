import { pgTable, serial, integer, bigint, timestamp, text, date, decimal , pgEnum} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { business } from './business.model';
import { contacts } from './contacts.model';
import { properties } from './properties.model';
import { projects } from './projects.model';
import { brokers } from './brokers.model';

export const quotationStatusEnum = pgEnum('quotation_status', ['draft', 'sent', 'accepted', 'rejected']);

export const quotations = pgTable('quotations', {
  id: serial('id').primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  broker_id: bigint('broker_id', { mode: 'number' }),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  contact_id: bigint('contact_id', { mode: 'number' }).notNull(),
  property_id: bigint('property_id', { mode: 'number' }),
  project_id: bigint('project_id', { mode: 'number' }),
  property_area: integer('property_area').notNull(),
  basic_rate: decimal('basic_rate', { precision: 12, scale: 2 }),
  development_rate: decimal('development_rate', { precision: 12, scale: 2 }),
  floorrise_rate: decimal('floorrise_rate', { precision: 12, scale: 2 }),
  gst_rate: integer('gst_rate'),
  basic_amount: decimal('basic_amount', { precision: 12, scale: 2 }),
  development_amount: decimal('development_amount', { precision: 12, scale: 2 }),
  parking_amount: decimal('parking_amount', { precision: 12, scale: 2 }),
  floorrise_amount: decimal('floorrise_amount', { precision: 12, scale: 2 }),
  beforetax_amount: decimal('beforetax_amount', { precision: 12, scale: 2 }).notNull(),
  stamp_amount: decimal('stamp_amount', { precision: 12, scale: 2 }).default('0.00'),
  registration_amount: decimal('registration_amount', { precision: 12, scale: 2 }),
  gst_amount: decimal('gst_amount', { precision: 12, scale: 2 }),
  other_amount: decimal('other_amount', { precision: 12, scale: 2 }),
  discount_amount: decimal('discount_amount', { precision: 12, scale: 2 }).default('0.00'),
  total_amount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  fld_description: text('fld_description'),
  valid_until: date('valid_until'),
  status: quotationStatusEnum('status').default('draft'),
  createdAt: timestamp('createdAt').defaultNow()
});

export const quotationsRelations = relations(quotations, ({ one }) => ({
  user: one(users, {
    fields: [quotations.user_id],
    references: [users.user_id]
  }),
  broker: one(brokers, {
    fields: [quotations.broker_id],
    references: [brokers.broker_id]
  }),
  business: one(business, {
    fields: [quotations.business_id],
    references: [business.business_id]
  }),
  contact: one(contacts, {
    fields: [quotations.contact_id],
    references: [contacts.contact_id]
  }),
  property: one(properties, {
    fields: [quotations.property_id],
    references: [properties.property_id]
  }),
  project: one(projects, {
    fields: [quotations.project_id],
    references: [projects.project_id]
  })
}));
