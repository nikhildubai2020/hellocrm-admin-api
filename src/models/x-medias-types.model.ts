import { pgTable, varchar, serial, integer, boolean, timestamp } from 'drizzle-orm/pg-core';


export const xMediasTypes = pgTable('x_medias_types', {
  media_type_id: serial('media_type_id').primaryKey(),
  media_type_parent_id: integer('media_type_parent_id').default(0),
  media_type_name: varchar('media_type_name', { length: 50 }).notNull(),
  status: boolean('status').notNull().default(true),
createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});
