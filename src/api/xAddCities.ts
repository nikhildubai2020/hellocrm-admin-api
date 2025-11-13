import { z } from 'zod';
import { os } from '@orpc/server';
import { db } from '../db';
import { xAddCities } from '../models/x-add-cities.model';
import { eq, asc, desc, like, count } from 'drizzle-orm';

const createxAddCitiesSchema = z.object({
  state_id: z.number(),
  name: z.string(),
  status: z.boolean().optional(),
});

const updatexAddCitiesSchema = z.object({
  id: z.number(),
  state_id: z.number().optional(),
  name: z.string().optional(),
  status: z.boolean().optional(),
});

export const getxAddCities = os
  .handler(async ({ input = {} }) => {
    const { 
      page = 1, 
      limit = 10, 
      searchName = "", 
      searchStatus = "all" 
    } = input;
    const offset = (page - 1) * limit;
    
    let query = db.select().from(xAddCities).$dynamic();
    let countQuery = db.select({ count: count(xAddCities.id) }).from(xAddCities).$dynamic();
    
    if (searchName && searchName.trim() !== "") {
      query = query.where(like(xAddCities.name, `%${searchName.trim()}%`));
      countQuery = countQuery.where(like(xAddCities.name, `%${searchName.trim()}%`));
    }
    
    if (searchStatus !== "all" && searchStatus !== "") {
      const statusValue = searchStatus === "true" || searchStatus === true;
      query = query.where(eq(xAddCities.status, statusValue));
      countQuery = countQuery.where(eq(xAddCities.status, statusValue));
    }
    
    const data = await query.limit(limit).offset(offset);
    const totalRecordsResult = await countQuery;
    const totalRecords = totalRecordsResult[0].count;
    
    return { data, currentPage: page, totalPages: Math.ceil(totalRecords / limit), totalRecords };
  });

export const createxAddCities = os
  .input(createxAddCitiesSchema)
  .handler(async ({ input }) => {
    const [result] = await db.insert(xAddCities).values(input).returning();
    return result;
  });

export const updatexAddCities = os
  .input(updatexAddCitiesSchema)
  .handler(async ({ input }) => {
    const { id, ...updateData } = input;
    const [result] = await db.update(xAddCities).set(updateData).where(eq(xAddCities.id, id)).returning();
    return result;
  });

export const deletexAddCities = os
  .input(z.object({ id: z.number() }))
  .handler(async ({ input }) => {
    await db.update(xAddCities).set({ isDeleted: true }).where(eq(xAddCities.id, input.id));
    return { success: true };
  });

export const updatexAddCitiesStatus = os
  .input(z.object({ id: z.number(), status: z.boolean() }))
  .handler(async ({ input }) => {
    const { id, status } = input;
    const [result] = await db.update(xAddCities).set({ status }).where(eq(xAddCities.id, id)).returning();
    return result;
  });