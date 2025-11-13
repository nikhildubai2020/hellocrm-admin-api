import { pgTable, varchar, bigserial, integer, bigint, timestamp, text, date, decimal , pgEnum} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { business } from './business.model';
import { quotations } from './quotations.model';

export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'partial', 'paid']);

export const bookings = pgTable('bookings', {
  booking_id: bigserial('booking_id', { mode: 'number' }).primaryKey(),
  brodker_id: bigint('brodker_id', { mode: 'number' }),
  business_id: bigint('business_id', { mode: 'number' }).notNull(),
  quotation_id: integer('quotation_id').notNull(),
  booking_date: date('booking_date').notNull(),
  booking_amount: decimal('booking_amount', { precision: 12, scale: 2 }).notNull(),
  payment_status: paymentStatusEnum('payment_status').default('pending'),
  payment_method: varchar('payment_method', { length: 50 }),
  remarks: text('remarks'),
  booked_by: integer('booked_by'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt')
});

export const bookingsRelations = relations(bookings, ({ one }) => ({
  business: one(business, {
    fields: [bookings.business_id],
    references: [business.business_id]
  }),
  quotation: one(quotations, {
    fields: [bookings.quotation_id],
    references: [quotations.id]
  })
}));
