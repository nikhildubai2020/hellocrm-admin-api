import { pgTable, varchar, bigserial, integer, bigint, boolean, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { properties } from './properties.model';

export const propertyMedias = pgTable('property_medias', {
  property_media_id: bigserial('property_media_id', { mode: 'number' }).primaryKey(),
  property_id: bigint('property_id', { mode: 'number' }).notNull(),
  media_type_id: integer('media_type_id').notNull(),
  media_name: varchar('media_name', { length: 50 }),
  description: varchar('description', { length: 100 }),
  file_name: varchar('file_name', { length: 50 }).notNull(),
  file_path: varchar('file_path', { length: 100 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const propertyMediasRelations = relations(propertyMedias, ({ one }) => ({
  property: one(properties, {
    fields: [propertyMedias.property_id],
    references: [properties.property_id]
  })
}));
