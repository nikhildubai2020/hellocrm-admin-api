import { pgTable, bigserial, bigint, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { properties } from './properties.model';

export const propertyLocalities = pgTable('property_localities', {
  property_locality_id: bigserial('property_locality_id', { mode: 'number' }).primaryKey(),
  property_id: bigint('property_id', { mode: 'number' }),
  locality_id: bigint('locality_id', { mode: 'number' }),
  createdAt: timestamp('createdAt')
});

export const propertyLocalitiesRelations = relations(propertyLocalities, ({ one }) => ({
  property: one(properties, {
    fields: [propertyLocalities.property_id],
    references: [properties.property_id]
  })
}));
