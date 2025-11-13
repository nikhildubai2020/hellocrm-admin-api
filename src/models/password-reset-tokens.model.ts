import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';


export const passwordResetTokens = pgTable('password_reset_tokens', {
  email: varchar('email', { length: 255 }).primaryKey(),
  token: varchar('token', { length: 255 }).notNull(),
  createdAt: timestamp('createdAt')
});
