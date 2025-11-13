import { pgTable, varchar, serial, bigserial, integer, bigint, boolean, timestamp, text, date } from 'drizzle-orm/pg-core';


// CDR Status
export const xCdrsStatus = pgTable('x_cdrs_status', {
  cdr_status_id: serial('cdr_status_id').primaryKey(),
  cdr_status_name: varchar('cdr_status_name', { length: 30 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

// DB Backups
export const xDbBackups = pgTable('x_db_backups', {
  dbid: serial('dbid').primaryKey(),
  file_name: varchar('file_name', { length: 100 }).notNull(),
  file_path: text('file_path').notNull(),
  add_by: integer('add_by').notNull(),
  created: timestamp('created').defaultNow().notNull()
});

// Holidays
export const xHolidays = pgTable('x_holidays', {
  holiday_id: bigserial('holiday_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  holiday_name: varchar('holiday_name', { length: 50 }).notNull(),
  holiday_date: date('holiday_date').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

// Leads Source
export const xLeadsSource = pgTable('x_leads_source', {
  lead_source_id: serial('lead_source_id').primaryKey(),
  lead_source_name: varchar('lead_source_name', { length: 50 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});

// Leads Status
export const xLeadsStatus = pgTable('x_leads_status', {
  lead_status_id: serial('lead_status_id').primaryKey(),
  lead_status_name: varchar('lead_status_name', { length: 30 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});

// Leads Tags
export const xLeadsTags = pgTable('x_leads_tags', {
  lead_tag_id: bigserial('lead_tag_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).default(0),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  lead_tag_name: varchar('lead_tag_name', { length: 100 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});

// Media Types
export const xMediasTypes = pgTable('x_medias_types', {
  media_type_id: serial('media_type_id').primaryKey(),
  media_type_parent_id: integer('media_type_parent_id').default(0),
  media_type_name: varchar('media_type_name', { length: 50 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});

// Notes Types
export const xNotesTypes = pgTable('x_notes_types', {
  note_type_id: serial('note_type_id').primaryKey(),
  note_type_name: varchar('note_type_name', { length: 30 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});

// Offers Tags
export const xOffersTags = pgTable('x_offers_tags', {
  property_tag_id: bigserial('property_tag_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).default(0),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  property_tag_name: varchar('property_tag_name', { length: 100 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});
