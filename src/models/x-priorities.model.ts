import { pgTable, serial, varchar, integer , timestamp, boolean} from 'drizzle-orm/pg-core';
import { status } from 'elysia';

export const xPriorities = pgTable('x_priorities', {
  priority_id: serial('priority_id').primaryKey(),
  priority_name: varchar('priority_name', { length: 20 }).notNull().unique(),
  weight: integer('weight').default(0),
  color: varchar('color', { length: 20 }),
  status: boolean('status').default(true),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});
