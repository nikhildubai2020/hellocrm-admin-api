import { pgTable, varchar, bigserial, integer, timestamp } from 'drizzle-orm/pg-core';


export const business = pgTable('business', {
  business_id: bigserial('business_id', { mode: 'number' }).primaryKey(),
  business_name: varchar('business_name', { length: 255 }).notNull(),
  business_type: varchar('business_type', { length: 100 }),
  business_gst: varchar('business_gst', { length: 20 }),
  address_line_1: varchar('address_line_1', { length: 255 }),
  address_line_2: varchar('address_line_2', { length: 255 }),
  city: varchar('city', { length: 100 }),
  state: integer('state'),
  zip: varchar('zip', { length: 10 }),
  owner_name: varchar('owner_name', { length: 100 }),
  contact_number: varchar('contact_number', { length: 20 }),
  email_address: varchar('email_address', { length: 100 }),
  website_url: varchar('website_url', { length: 255 }),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});
