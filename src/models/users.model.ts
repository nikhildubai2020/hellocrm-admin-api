import { pgTable, varchar, bigserial, integer, bigint, timestamp, text, date ,pgEnum} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { business } from './business.model';
import { boolean } from 'drizzle-orm/pg-core';



export const users = pgTable('users', {
  user_id: bigserial('user_id', { mode: 'number' }).primaryKey(),
  business_id: bigint('business_id', { mode: 'number' }).references(() => business.business_id),
  user_role: bigint('user_role', { mode: 'number' }),
  broker_id: bigint('broker_id', { mode: 'number' }),
  userName: varchar('user_name', { length: 50 }),
  first_name: varchar('first_name', { length: 50 }).notNull(),
  last_name: varchar('last_name', { length: 50 }).notNull(),
  mobile_1: varchar('mobile_1', { length: 10 }).notNull(),
  mobile_2: varchar('mobile_2', { length: 10 }),
  email: varchar('email', { length: 50 }),
  password: text('password').notNull(),
  gender: integer('gender'),
  joining: date('joining'),
  pancard: varchar('pancard', { length: 20 }),
  aadhar: varchar('aadhar', { length: 20 }),
  driving_license: varchar('driving_license', { length: 20 }),
  last_login: timestamp('last_login'),
  status: boolean('status').default(false),
  profile_pic: text('profile_pic'),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  otp: varchar('otp', { length: 4 }),
  add_by: bigint('add_by', { mode: 'number' }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow()
});

export const usersRelations = relations(users, ({ one }) => ({
  business: one(business, {
    fields: [users.business_id],
    references: [business.business_id]
  })
}));
