import { pgTable, varchar, serial, bigint, boolean, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';
import { business } from './business.model';

export const xPropertiesDeposits = pgTable('x_properties_deposits', {
  property_deposit_id: serial('property_deposit_id').primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  property_deposit_name: varchar('property_deposit_name', { length: 50 }).notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const xPropertiesDepositsRelations = relations(xPropertiesDeposits, ({ one }) => ({
  user: one(users, {
    fields: [xPropertiesDeposits.user_id],
    references: [users.user_id]
  }),
  business: one(business, {
    fields: [xPropertiesDeposits.business_id],
    references: [business.business_id]
  })
}));
