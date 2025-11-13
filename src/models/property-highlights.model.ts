import { pgTable, bigserial, integer, bigint, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { properties } from './properties.model';

export const propertyHighlights = pgTable('property_highlights', {
  property_highlight_id: bigserial('property_highlight_id', { mode: 'number' }).primaryKey(),
  property_id: bigint('property_id', { mode: 'number' }).notNull(),
  highlight_id: integer('highlight_id').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});

export const propertyHighlightsRelations = relations(propertyHighlights, ({ one }) => ({
  property: one(properties, {
    fields: [propertyHighlights.property_id],
    references: [properties.property_id]
  })
}));
