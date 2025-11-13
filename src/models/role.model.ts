import { pgTable, varchar, serial, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';

import { desc } from "drizzle-orm";
import { pgTable, uuid, varchar,serial,boolean,timestamp } from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: varchar("description", { length: 255  }),
  isActive: boolean("is_active").notNull().default(true),
createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow()
});
