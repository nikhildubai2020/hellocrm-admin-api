import { z } from 'zod';
import { os } from '@orpc/server';
import { db } from '../db';
import { xAddLocalities } from '../models/x-add-localities.model';
import { eq, count, like } from 'drizzle-orm';

const createxAddLocalitiesSchema = z.object({
  city_id: z.number(),
  name: z.string(),
  status: z.boolean().optional(),
});

const updatexAddLocalitiesSchema = z.object({
  id: z.number(),
  city_id: z.number().optional(),
  name: z.string().optional(),
  status: z.boolean().optional(),
});

export const getxAddLocalities = os.handler(async ({ input = {} }) => {
  const { 
    page = 1, 
    limit = 10, 
    searchName = "", 
    searchStatus = "all" 
  } = input;
  const offset = (page - 1) * limit;
  
  let query = db.select().from(xAddLocalities).$dynamic();
  let countQuery = db.select({ count: count(xAddLocalities.id) }).from(xAddLocalities).$dynamic();
  
  if (searchName && searchName.trim() !== "") {
    query = query.where(like(xAddLocalities.name, `%${searchName.trim()}%`));
    countQuery = countQuery.where(like(xAddLocalities.name, `%${searchName.trim()}%`));
  }
  
  if (searchStatus !== "all" && searchStatus !== "") {
    const statusValue = searchStatus === "true" || searchStatus === true;
    query = query.where(eq(xAddLocalities.status, statusValue));
    countQuery = countQuery.where(eq(xAddLocalities.status, statusValue));
  }
  
  const data = await query.limit(limit).offset(offset);
  const totalRecordsResult = await countQuery;
  const totalRecords = totalRecordsResult[0].count;
  return { data, currentPage: page, totalPages: Math.ceil(totalRecords / limit), totalRecords };
});

export const createxAddLocalities = os
  .input(createxAddLocalitiesSchema)
  .handler(async ({ input }) => {
    const [result] = await db.insert(xAddLocalities).values(input).returning();
    return result;
  });

export const updatexAddLocalities = os
  .input(updatexAddLocalitiesSchema)
  .handler(async ({ input }) => {
    const { id, ...updateData } = input;
    const [result] = await db.update(xAddLocalities).set(updateData).where(eq(xAddLocalities.id, id)).returning();
    return result;
  });

export const deletexAddLocalities = os.input(z.object({ id: z.number() })).handler(async ({ input }) => {
  await db.update(xAddLocalities).set({ isDeleted: true }).where(eq(xAddLocalities.id, input.id));
  return { success: true };
});

export const updatexAddLocalitiesStatus = os
  .input(z.object({ id: z.number(), status: z.boolean() }))
  .handler(async ({ input }) => {
    const { id, status } = input;
    const [result] = await db.update(xAddLocalities).set({ status }).where(eq(xAddLocalities.id, id)).returning();
    return result;
  });