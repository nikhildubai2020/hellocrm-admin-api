import { pgTable, varchar, bigserial, bigint, timestamp, text,pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.model';

export const auditActionEnum = pgEnum('audit_action', ['created', 'updated', 'deleted']);

export const auditLogs = pgTable('audit_logs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).notNull(),
  entity_type: varchar('entity_type', { length: 100 }).notNull(),
  entity_id: bigint('entity_id', { mode: 'number' }).notNull(),
  action: auditActionEnum('action').notNull(),
  before_data: text('before_data'),
  after_data: text('after_data'),
  ip_address: varchar('ip_address', { length: 50 }),
  user_agent: text('user_agent'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt')
});

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.user_id],
    references: [users.user_id]
  })
}));
