import { pgTable, varchar, serial, integer, bigint, boolean, timestamp, text, decimal } from 'drizzle-orm/pg-core';


// Plan Addons
export const xPlanAddons = pgTable('x_plan_addons', {
  plan_addon_id: serial('plan_addon_id').primaryKey(),
  plan_addon_name: varchar('plan_addon_name', { length: 50 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});

// Plan Features
export const xPlanFeatures = pgTable('x_plan_features', {
  plan_feature_id: serial('plan_feature_id').primaryKey(),
  plan_feature_name: varchar('plan_feature_name', { length: 100 }).notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});

// Priorities
export const xPriorities = pgTable('x_priorities', {
  priority_id: serial('priority_id').primaryKey(),
  priority_name: varchar('priority_name', { length: 20 }).notNull().unique(),
  weight: integer('weight').default(0),
  color: varchar('color', { length: 20 }),
  status: boolean('status').default(true).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

// Settings
export const xSettings = pgTable('x_settings', {
  sid: serial('sid').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  value: text('value'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

// Storage Credit Plan
export const xStorageCreditPlan = pgTable('x_storage_credit_plan', {
  plan_id: serial('plan_id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  storage_quota_mb: integer('storage_quota_mb').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('INR'),
  duration_days: integer('duration_days').default(30),
  is_active: boolean('is_active').default(true),
  createdAt: timestamp('createdAt').defaultNow()
});

// Task Types
export const xTaskTypes = pgTable('x_task_types', {
  task_type_id: serial('task_type_id').primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  task_type_name: varchar('task_type_name', { length: 30 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

// Message Credit Type
export const xMessageCreditType = pgTable('x_message_credit_type', {
  credit_type_id: serial('credit_type_id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  channel: varchar('channel', { length: 30 }),
  unit: varchar('unit', { length: 20 }).default('message'),
  is_active: boolean('is_active').default(true)
});

// Message Credit Pricing
export const xMessageCreditPricing = pgTable('x_message_credit_pricing', {
  pricing_id: serial('pricing_id').primaryKey(),
  credit_type_id: integer('credit_type_id').notNull(),
  price_per_unit: decimal('price_per_unit', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('INR'),
  min_units: integer('min_units').default(1),
  createdAt: timestamp('createdAt').defaultNow()
});
