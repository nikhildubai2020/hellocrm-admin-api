import { pgTable, varchar, bigserial, integer, bigint, boolean, timestamp, text, decimal } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';

export const properties = pgTable('properties', {
  property_id: bigserial('property_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  property_type_id: integer('property_type_id').notNull(),
  property_config_id: integer('property_config_id'),
  property_building_type_id: integer('property_building_type_id'),
  property_transaction_id: integer('property_transaction_id'),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  project_name: varchar('project_name', { length: 50 }),
  project_builder: varchar('project_builder', { length: 50 }),
  address: text('address'),
  pincode: varchar('pincode', { length: 10 }),
  locality: integer('locality'),
  city: integer('city'),
  state: integer('state'),
  property_furnish_id: integer('property_furnish_id'),
  availability: integer('availability'),
  area_carpet: integer('area_carpet'),
  area_built_up: integer('area_built_up'),
  area_super: integer('area_super'),
  floors: integer('floors'),
  floors_number: integer('floors_number'),
  parking: boolean('parking'),
  bathrooms: integer('bathrooms'),
  balcony: integer('balcony'),
  terrace: integer('terrace'),
  poojaroom: boolean('poojaroom'),
  servant: boolean('servant'),
  garden: boolean('garden'),
  pantry: boolean('pantry'),
  pet_friendly: boolean('pet_friendly'),
  power_backup: boolean('power_backup'),
  front_open: boolean('front_open'),
  roadfacing: boolean('roadfacing'),
  corner_property: boolean('corner_property'),
  boundary_wall: boolean('boundary_wall'),
  wire_fencing: boolean('wire_fencing'),
  open_sides: boolean('open_sides'),
  direction: varchar('direction', { length: 10 }),
  price: decimal('price', { precision: 12, scale: 2 }),
  deposit: decimal('deposit', { precision: 12, scale: 2 }),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const propertiesRelations = relations(properties, ({ one }) => ({
  user: one(users, {
    fields: [properties.user_id],
    references: [users.user_id]
  })
}));
