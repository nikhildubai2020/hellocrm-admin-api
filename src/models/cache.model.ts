import { pgTable, varchar, integer, timestamp, text } from 'drizzle-orm/pg-core';


export const cache = pgTable('cache', {
  key: varchar('key', { length: 255 }).primaryKey(),
  value: text('value').notNull(),
  expiration: integer('expiration').notNull()
});

export const cacheLocks = pgTable('cache_locks', {
  key: varchar('key', { length: 255 }).primaryKey(),
  owner: varchar('owner', { length: 255 }).notNull(),
  expiration: integer('expiration').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});
