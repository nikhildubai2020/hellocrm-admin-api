import { pgTable, varchar, bigserial, integer, bigint, timestamp, pgEnum } from 'drizzle-orm/pg-core';


export const isLeadEnum = pgEnum('is_lead', ['Yes', 'No']);
export const bulkImportEnum = pgEnum('bulk_import', ['Yes', 'No']);

export const contacts = pgTable('contacts', {
  contact_id: bigserial('contact_id', { mode: 'number' }).primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  project_id: bigint('project_id', { mode: 'number' }),
  broker_id: bigint('broker_id', { mode: 'number' }),
  name: varchar('name', { length: 50 }),
  phone_wa: integer('phone_wa').notNull().unique(),
  phone_alternate: integer('phone_alternate').default(0),
  email: varchar('email', { length: 50 }),
  budget: integer('budget').default(0),
  source: integer('source'),
  is_lead: isLeadEnum('is_lead').notNull().default('No'),
  bulk_import: bulkImportEnum('bulk_import'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});
