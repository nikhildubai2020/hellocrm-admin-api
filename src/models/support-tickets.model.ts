import { pgTable, varchar, bigserial, bigint, timestamp, text,pgEnum } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { users } from './users.model';

export const ticketStatusEnum = pgEnum('ticket_status', ['open', 'in_progress', 'resolved', 'closed']);
export const ticketPriorityEnum = pgEnum('ticket_priority', ['low', 'medium', 'high']);

export const supportTickets = pgTable('support_tickets', {
  support_ticket_id: bigserial('support_ticket_id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  subject: varchar('subject', { length: 150 }).notNull(),
  message: text('message').notNull(),
  status: ticketStatusEnum('status').default('open'),
  priority: ticketPriorityEnum('priority').default('medium'),
  assigned_to: bigint('assigned_to', { mode: 'number' }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow()
});

export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  user: one(users, {
    fields: [supportTickets.user_id],
    references: [users.user_id]
  }),
  assignedTo: one(users, {
    fields: [supportTickets.assigned_to],
    references: [users.user_id]
  })
}));
