import { pgTable, varchar, serial, integer, timestamp, text, decimal , pgEnum} from 'drizzle-orm/pg-core';


export const planStatusEnum = pgEnum('plan_status', ['active', 'inactive']);

export const plans = pgTable('plans', {
  pid: serial('pid').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  duration: integer('duration').notNull(),
  status: planStatusEnum('status').default('active'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});
