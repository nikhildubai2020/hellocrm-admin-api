import { z } from 'zod';
import { os } from '@orpc/server';
import { db } from '../db';
import { xAddStates } from '../models/x-add-states.model';
import { eq, count } from 'drizzle-orm';

const createxAddStatesSchema = z.object({
  name: z.string(),
  status: z.boolean().optional(),
});

const updatexAddStatesSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  status: z.boolean().optional(),
});

export const getxAddStates = os.handler(async ({ input = {} }) => {
  const { 
    page = 1, 
    limit = 10, 
    searchName = "", 
    searchStatus = "all" 
  } = input;
  const offset = (page - 1) * limit;
  
  let query = db.select().from(xAddStates).$dynamic();
  let countQuery = db.select({ count: count(xAddStates.id) }).from(xAddStates).$dynamic();
  
  if (searchName && searchName.trim() !== "") {
    query = query.where(like(xAddStates.name, `%${searchName.trim()}%`));
    countQuery = countQuery.where(like(xAddStates.name, `%${searchName.trim()}%`));
  }
  
  if (searchStatus !== "all" && searchStatus !== "") {
    const statusValue = searchStatus === "true" || searchStatus === true;
    query = query.where(eq(xAddStates.status, statusValue));
    countQuery = countQuery.where(eq(xAddStates.status, statusValue));
  }
  
  const data = await query.limit(limit).offset(offset);
  const totalRecordsResult = await countQuery;
  const totalRecords = totalRecordsResult[0].count;
  return { data, currentPage: page, totalPages: Math.ceil(totalRecords / limit), totalRecords };
});

export const createxAddStates = os
  .input(createxAddStatesSchema)
  .handler(async ({ input }) => {
    const [result] = await db.insert(xAddStates).values(input).returning();
    return result;
  });

export const updatexAddStates = os
  .input(updatexAddStatesSchema)
  .handler(async ({ input }) => {
    const { id, ...updateData } = input;
    const [result] = await db.update(xAddStates).set(updateData).where(eq(xAddStates.id, id)).returning();
    return result;
  });

export const deletexAddStates = os.input(z.object({ id: z.number() })).handler(async ({ input }) => {
  await db.update(xAddStates).set({ isDeleted: true }).where(eq(xAddStates.id, input.id));
  return { success: true };
});

export const updatexAddStatesStatus = os
  .input(z.object({ id: z.number(), status: z.boolean() }))
  .handler(async ({ input }) => {
    const { id, status } = input;
    const [result] = await db.update(xAddStates).set({ status }).where(eq(xAddStates.id, id)).returning();
    return result;
  });