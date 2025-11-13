import { os } from '@orpc/server';
import { db } from '../db';
import { xCdrsStatus } from '../models/x-lookup-tables.model';
import { eq, count } from 'drizzle-orm';

export const getxCdrsStatus = os.handler(async ({ input = {} }) => {
  const { page = 1, limit = 10 } = input;
  const offset = (page - 1) * limit;
  const data = await db.select().from(xCdrsStatus).limit(limit).offset(offset);
  const totalRecordsResult = await db.select({ count: count(xCdrsStatus.id) }).from(xCdrsStatus);
  const totalRecords = totalRecordsResult[0].count;
  return { data, currentPage: page, totalPages: Math.ceil(totalRecords / limit), totalRecords };
});

export const createxCdrsStatus = os.handler(async ({ input = {} }) => {
  const [result] = await db.insert(xCdrsStatus).values(input).returning();
  return result;
});

export const updatexCdrsStatus = os.handler(async ({ input = {} }) => {
  const { id, ...updateData } = input;
  const [result] = await db.update(xCdrsStatus).set(updateData).where(eq(xCdrsStatus.id, id)).returning();
  return result;
});

export const deletexCdrsStatus = os.handler(async ({ input = {} }) => {
  await db.update(xCdrsStatus).set({ isDeleted: true }).where(eq(xCdrsStatus.id, input.id));
  return { success: true };
});