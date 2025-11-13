import { z } from 'zod';
import { os } from '@orpc/server';
import { db } from '../db';
import { xAddNearbys } from '../models/x-add-nearbys.model';
import { eq, count, like } from 'drizzle-orm';

const createxAddNearbysSchema = z.object({
  name: z.string(),
  status: z.boolean().optional(),
});

const updatexAddNearbysSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  status: z.boolean().optional(),
});

export const getxAddNearbys = os.handler(async ({ input = {} }) => {
  const { 
    page = 1, 
    limit = 10, 
    searchName = "", 
    searchStatus = "all" 
  } = input;
  const offset = (page - 1) * limit;
  
  let query = db.select().from(xAddNearbys).$dynamic();
  let countQuery = db.select({ count: count(xAddNearbys.id) }).from(xAddNearbys).$dynamic();
  
  if (searchName && searchName.trim() !== "") {
    query = query.where(like(xAddNearbys.name, `%${searchName.trim()}%`));
    countQuery = countQuery.where(like(xAddNearbys.name, `%${searchName.trim()}%`));
  }
  
  if (searchStatus !== "all" && searchStatus !== "") {
    const statusValue = searchStatus === "true" || searchStatus === true;
    query = query.where(eq(xAddNearbys.status, statusValue));
    countQuery = countQuery.where(eq(xAddNearbys.status, statusValue));
  }
  
  const data = await query.limit(limit).offset(offset);
  const totalRecordsResult = await countQuery;
  const totalRecords = totalRecordsResult[0].count;
  return { data, currentPage: page, totalPages: Math.ceil(totalRecords / limit), totalRecords };
});

export const createxAddNearbys = os
  .input(createxAddNearbysSchema)
  .handler(async ({ input }) => {
    const [result] = await db.insert(xAddNearbys).values(input).returning();
    return result;
  });

export const updatexAddNearbys = os
  .input(updatexAddNearbysSchema)
  .handler(async ({ input }) => {
    const { id, ...updateData } = input;
    const [result] = await db.update(xAddNearbys).set(updateData).where(eq(xAddNearbys.id, id)).returning();
    return result;
  });

export const deletexAddNearbys = os.input(z.object({ id: z.number() })).handler(async ({ input }) => {
  await db.update(xAddNearbys).set({ isDeleted: true }).where(eq(xAddNearbys.id, input.id));
  return { success: true };
});

export const updatexAddNearbysStatus = os
  .input(z.object({ id: z.number(), status: z.boolean() }))
  .handler(async ({ input }) => {
    const { id, status } = input;
    const [result] = await db.update(xAddNearbys).set({ status }).where(eq(xAddNearbys.id, id)).returning();
    return result;
  });