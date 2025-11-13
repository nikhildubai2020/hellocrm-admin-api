import { z } from 'zod';
import { os } from '@orpc/server';
import { db } from '../db';
import { xCdrsStatus } from '../models/x-cdrs-status.model';
import { eq, count, like } from 'drizzle-orm';

const createxCdrsStatusSchema = z.object({
  name: z.string(),
  status: z.boolean().optional(),
});

const updatexCdrsStatusSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  status: z.boolean().optional(),
});

export const getxCdrsStatus = os.handler(async ({ input = {} }) => {
  const { 
    page = 1, 
    limit = 10, 
    searchName = "", 
    searchStatus = "all" 
  } = input;
  const offset = (page - 1) * limit;
  
  let query = db.select().from(xCdrsStatus).$dynamic();
  let countQuery = db.select({ count: count(xCdrsStatus.id) }).from(xCdrsStatus).$dynamic();
  
  if (searchName && searchName.trim() !== "") {
    query = query.where(like(xCdrsStatus.name, `%${searchName.trim()}%`));
    countQuery = countQuery.where(like(xCdrsStatus.name, `%${searchName.trim()}%`));
  }
  
  if (searchStatus !== "all" && searchStatus !== "") {
    const statusValue = searchStatus === "true" || searchStatus === true;
    query = query.where(eq(xCdrsStatus.status, statusValue));
    countQuery = countQuery.where(eq(xCdrsStatus.status, statusValue));
  }
  
  const data = await query.limit(limit).offset(offset);
  const totalRecordsResult = await countQuery;
  const totalRecords = totalRecordsResult[0].count;
  return { data, currentPage: page, totalPages: Math.ceil(totalRecords / limit), totalRecords };
});

export const createxCdrsStatus = os
  .input(createxCdrsStatusSchema)
  .handler(async ({ input }) => {
    const [result] = await db.insert(xCdrsStatus).values(input).returning();
    return result;
  });

export const updatexCdrsStatus = os
  .input(updatexCdrsStatusSchema)
  .handler(async ({ input }) => {
    const { id, ...updateData } = input;
    const [result] = await db.update(xCdrsStatus).set(updateData).where(eq(xCdrsStatus.id, id)).returning();
    return result;
  });

export const deletexCdrsStatus = os
  .input(z.object({ id: z.number() }))
  .handler(async ({ input }) => {
    await db.update(xCdrsStatus).set({ isDeleted: true }).where(eq(xCdrsStatus.id, input.id));
    return { success: true };
  });

export const updatexCdrsStatusStatus = os.input(z.object({ id: z.number(), status: z.boolean() })).handler(async ({ input }) => {
  const { id, status } = input;
  const [result] = await db.update(xCdrsStatus).set({ status }).where(eq(xCdrsStatus.id, id)).returning();
  return result;
});