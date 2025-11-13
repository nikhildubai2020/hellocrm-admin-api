import { pgTable, bigserial, bigint, timestamp, text } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { supportTickets } from './support-tickets.model';
import { users } from './users.model';

export const supportTicketAttachments = pgTable('support_ticket_attachments', {
  support_ticket_attachment_id: bigserial('support_ticket_attachment_id', { mode: 'number' }).primaryKey(),
  ticket_id: bigint('ticket_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  file_path: text('file_path').notNull(),
  createdAt: timestamp('createdAt').defaultNow()
});

export const supportTicketComments = pgTable('support_ticket_comments', {
  support_ticket_comment_id: bigserial('support_ticket_comment_id', { mode: 'number' }).primaryKey(),
  ticket_id: bigint('ticket_id', { mode: 'number' }).notNull(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  comment: text('comment').notNull(),
  createdAt: timestamp('createdAt').defaultNow()
});

export const supportTicketAttachmentsRelations = relations(supportTicketAttachments, ({ one }) => ({
  ticket: one(supportTickets, {
    fields: [supportTicketAttachments.ticket_id],
    references: [supportTickets.support_ticket_id]
  }),
  user: one(users, {
    fields: [supportTicketAttachments.user_id],
    references: [users.user_id]
  })
}));
