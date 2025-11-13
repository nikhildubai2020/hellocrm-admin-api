import { os } from '@orpc/server';
import { db } from '../db';
import { xStorageCreditPlan } from '../models/x-storage-credit-plan.model';
import { eq, asc, desc, ilike, count, and } from 'drizzle-orm';

export const getxStorageCreditPlans = os
  .handler(async ({ input = {} }) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'plan_id',
        sortOrder = 'desc',
        searchName = "",
        searchStatus = "",
      } = input;
      const offset = (page - 1) * limit;

      const whereConditions = [];

      if (searchName && searchName.trim() !== "") {
        whereConditions.push(ilike(xStorageCreditPlan.name, `%${searchName.trim()}%`));
      }
      
      if (searchStatus !== "") {
        const statusValue = searchStatus === "true" || searchStatus === true;
        whereConditions.push(eq(xStorageCreditPlan.is_active, statusValue));
      }

      const query = db.select({
        plan_id: xStorageCreditPlan.plan_id,
        name: xStorageCreditPlan.name,
        storage_quota_mb: xStorageCreditPlan.storage_quota_mb,
        price: xStorageCreditPlan.price,
        currency: xStorageCreditPlan.currency,
        duration_days: xStorageCreditPlan.duration_days,
        is_active: xStorageCreditPlan.is_active,
        createdAt: xStorageCreditPlan.createdAt,
      }).from(xStorageCreditPlan)
      .where(and(...whereConditions));
      
      const countQuery = db.select({ count: count(xStorageCreditPlan.plan_id) }).from(xStorageCreditPlan).where(and(...whereConditions));

      const sortField = xStorageCreditPlan[sortBy] || xStorageCreditPlan.plan_id;
      const data= await query
        .limit(limit)
        .offset(offset)
        .orderBy(sortOrder === 'asc' ? asc(sortField) : desc(sortField));

      const totalRecordsResult = await countQuery;
      const totalRecords = totalRecordsResult[0].count;
      const totalPages = Math.ceil(totalRecords / limit);

      return {
        data,
        currentPage: page,
        totalPages,
        totalRecords,
      };
    } catch (error) {
      console.error('Error fetching storage credit plans:', error);
      throw error;
    }
  });

export const createxStorageCreditPlan = os.handler(async ({ input = {} }) => {
  const [result] = await db.insert(xStorageCreditPlan).values(input).returning();
  return result;
});

export const updatexStorageCreditPlan = os.handler(async ({ input = {} }) => {
  const { plan_id, ...updateData } = input;
  const [result] = await db.update(xStorageCreditPlan).set(updateData).where(eq(xStorageCreditPlan.plan_id, plan_id)).returning();
  return result;
});

export const deletexStorageCreditPlan = os.handler(async ({ input = {} }) => {
  await db.delete(xStorageCreditPlan).where(eq(xStorageCreditPlan.plan_id, input.plan_id));
  return { success: true };
});

export const getxStorageCreditPlanById = os.handler(async ({ input = {} }) => {
  const [result] = await db.select().from(xStorageCreditPlan).where(eq(xStorageCreditPlan.plan_id, input.plan_id));
  return result;
});

export const updatexStorageCreditPlanStatus = os
    .handler(async ({ input = {} }) => {
    try {
      const { plan_id, status } = input;
      if (!plan_id) throw new Error('plan_id is required');
      if (status === undefined) throw new Error('status is required');
      const [result] = await db.update(xStorageCreditPlan).set({ is_active: status }).where(eq(xStorageCreditPlan.plan_id, plan_id)).returning();
      return result;
    } catch (error) {
      console.error('Update status error:', error);
      throw new Error(`Failed to update status: ${error.message}`);
    }
  });