import { pgTable, serial, bigint, timestamp, text, decimal , pgEnum} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { business } from './business.model';
import { bookings } from './bookings.model';
import { brokers } from './brokers.model';

export const commissionStatusEnum = pgEnum('commission_status', ['pending', 'approved', 'paid']);

export const brokerCommissions = pgTable('broker_commissions', {
  broker_commission_id: serial('broker_commission_id').primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  booking_id: bigint('booking_id', { mode: 'number' }).notNull(),
  broker_id: bigint('broker_id', { mode: 'number' }).notNull(),
  commission_amount: decimal('commission_amount', { precision: 12, scale: 2 }).notNull(),
  commission_percentage: decimal('commission_percentage', { precision: 5, scale: 2 }),
  status: commissionStatusEnum('status').default('pending'),
  remarks: text('remarks'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow()
});

export const brokerCommissionsRelations = relations(brokerCommissions, ({ one }) => ({
  business: one(business, {
    fields: [brokerCommissions.business_id],
    references: [business.business_id]
  }),
  booking: one(bookings, {
    fields: [brokerCommissions.booking_id],
    references: [bookings.booking_id]
  }),
  broker: one(brokers, {
    fields: [brokerCommissions.broker_id],
    references: [brokers.broker_id]
  })
}));
