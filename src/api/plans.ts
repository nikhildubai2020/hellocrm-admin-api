import { os } from '@orpc/server';
import { db } from '../db';
import { plans } from '../models/plans.model';
import { eq, asc, desc, count, and, ilike } from 'drizzle-orm';

export const getPlans = os
  .handler(async ({ input = {} }) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'pid',
        sortOrder = 'desc',
        searchName = "",
        status = "all"
      } = input;
      const offset = (page - 1) * limit;

      const whereConditions = [];

      if (searchName && searchName.trim() !== "") {
        whereConditions.push(ilike(plans.name, `%${searchName.trim()}%`));
      }

      if (status !== "all") {
        const statusValue = status === "active" ? "active" : "inactive";
        whereConditions.push(eq(plans.status, statusValue));
      }

      const query = db.select().from(plans)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);
      
      const countQuery = db.select({ count: count(plans.pid) }).from(plans)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

      const sortField = plans[sortBy] || plans.pid;
      const data = await query
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
      console.error('Error fetching plans:', error);
      throw error;
    }
  });

export const createPlan = os.handler(async ({ input = {} }) => {
  try {
    if (!input.name) throw new Error('name is required');
    if (!input.price) throw new Error('price is required');
    if (!input.duration) throw new Error('duration is required');
    
    const [result] = await db.insert(plans).values(input).returning();
    return result;
  } catch (error) {
    console.error('Error creating plan:', error);
    throw error;
  }
});

export const updatePlan = os.handler(async ({ input = {} }) => {
  try {
    const { pid, ...updateData } = input;
    const [result] = await db.update(plans)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(plans.pid, pid))
      .returning();
    return result;
  } catch (error) {
    console.error('Error updating plan:', error);
    throw error;
  }
});

export const deletePlan = os.handler(async ({ input = {} }) => {
  try {
    await db.delete(plans).where(eq(plans.pid, input.pid));
    return { success: true };
  } catch (error) {
    console.error('Error deleting plan:', error);
    throw error;
  }
});

export const getPlanById = os.handler(async ({ input = {} }) => {
  try {
    const [result] = await db.select().from(plans).where(eq(plans.pid, input.pid));
    return result;
  } catch (error) {
    console.error('Error fetching plan by ID:', error);
    throw error;
  }
});

export const updatePlanStatus = os.handler(async ({ input = {} }) => {
  try {
    const [result] = await db.update(plans)
      .set({ status: input.status, updatedAt: new Date() })
      .where(eq(plans.pid, input.pid))
      .returning();
    return result;
  } catch (error) {
    console.error('Error updating plan status:', error);
    throw error;
  }
});

export const getAllPlans = os.handler(async ({ input = {} }) => {
  try {
    const data = await db.select({
      pid: plans.pid,
      name: plans.name
    }).from(plans)
    .where(eq(plans.status, 'active'));
    
    return data;
  } catch (error) {
    console.error('Error fetching all plans:', error);
    throw error;
  }
});