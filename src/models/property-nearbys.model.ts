import { pgTable, serial, integer, timestamp } from 'drizzle-orm/pg-core';


export const propertyNearbys = pgTable('property_nearbys', {
  pnid: serial('pnid').primaryKey(),
  pid: integer('pid'),
  anid: integer('anid'),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt')
});
