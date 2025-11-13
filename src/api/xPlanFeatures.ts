import { os } from '@orpc/server';
import { z } from 'zod';
import { db } from '../db';
import { xPlanFeatures } from '../models/x-plan-features.model';
import { eq, asc, desc, ilike, count, and } from 'drizzle-orm';

export const getxPlanFeatures = os
  .handler(async ({ input = {} }) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'plan_feature_id',
        sortOrder = 'desc',
        searchName = "",
      } = input;
      const offset = (page - 1) * limit;

      const whereConditions = [];

      if (searchName && searchName.trim() !== "") {
        whereConditions.push(ilike(xPlanFeatures.plan_feature_name, `%${searchName.trim()}%`));
      }

      const query = db.select({
        plan_feature_id: xPlanFeatures.plan_feature_id,
        plan_feature_name: xPlanFeatures.plan_feature_name,
        description: xPlanFeatures.description,
        status: xPlanFeatures.status,
        createdAt: xPlanFeatures.createdAt,
      }).from(xPlanFeatures)
      .where(and(...whereConditions));
      
      const countQuery = db.select({ count: count(xPlanFeatures.plan_feature_id) }).from(xPlanFeatures).where(and(...whereConditions));

      const sortField = xPlanFeatures[sortBy] || xPlanFeatures.plan_feature_id;
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
      console.error('Error fetching plan features:', error);
      throw error;
    }
  });

const createxPlanFeatureSchema = z.object({
  plan_feature_name: z.string().min(1, 'Plan feature name is required'),
  description: z.string().optional(),
  status: z.boolean().optional(),
});

export const createxPlanFeature = os
  .input(createxPlanFeatureSchema)
  .handler(async ({ input }) => {
    try {
      const [result] = await db.insert(xPlanFeatures).values({
        plan_feature_name: input.plan_feature_name,
        description: input.description,
        status: input.status,
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating plan feature:', error);
      throw error;
    }
  });

export const updatexPlanFeature = os.handler(async ({ input = {} }) => {
  const { plan_feature_id, ...updateData } = input;
  const [result] = await db.update(xPlanFeatures).set(updateData).where(eq(xPlanFeatures.plan_feature_id, plan_feature_id)).returning();
  return result;
});

export const deletexPlanFeature = os.handler(async ({ input = {} }) => {
  await db.delete(xPlanFeatures).where(eq(xPlanFeatures.plan_feature_id, input.plan_feature_id));
  return { success: true };
});

export const getxPlanFeatureById = os.handler(async ({ input = {} }) => {
  const [result] = await db.select().from(xPlanFeatures).where(eq(xPlanFeatures.plan_feature_id, input.plan_feature_id));
  return result;
});

export const getAllxPlanFeatures = os.handler(async ({ input = {} }) => {
  try {
    const data = await db.select({
      plan_feature_id: xPlanFeatures.plan_feature_id,
      plan_feature_name: xPlanFeatures.plan_feature_name
    }).from(xPlanFeatures)
    .where(eq(xPlanFeatures.status, true));
    
    return data;
  } catch (error) {
    console.error('Error fetching all x plan features:', error);
    throw error;
  }
});