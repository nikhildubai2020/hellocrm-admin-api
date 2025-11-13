import { pgTable, varchar, serial, bigint, boolean, timestamp } from 'drizzle-orm/pg-core';


// Properties Configs
export const xPropertiesConfigs = pgTable('x_properties_configs', {
  property_config_id: serial('property_config_id').primaryKey(),
  property_config_name: varchar('property_config_name', { length: 50 }).notNull(),
  status: boolean('status').notNull().default(true)
});

// Properties Deposits
export const xPropertiesDeposits = pgTable('x_properties_deposits', {
  property_deposit_id: serial('property_deposit_id').primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  property_deposit_name: varchar('property_deposit_name', { length: 50 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

// Properties Furnishs
export const xPropertiesFurnishs = pgTable('x_properties_furnishs', {
  property_furnish_id: serial('property_furnish_id').primaryKey(),
  property_furnish_type: varchar('property_furnish_type', { length: 50 }).notNull(),
  status: boolean('status').notNull().default(true)
});

// Properties Transactions
export const xPropertiesTransactions = pgTable('x_properties_transactions', {
  property_transaction_id: serial('property_transaction_id').primaryKey(),
  property_transaction_type: varchar('property_transaction_type', { length: 50 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});

// Property Measurement
export const xPropertyMeasurement = pgTable('x_property_measurement', {
  property_measurement_id: serial('property_measurement_id').primaryKey(),
  property_measurement_name: varchar('property_measurement_name', { length: 100 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});
