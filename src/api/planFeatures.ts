import { os } from '@orpc/server';
import { db } from '../db';
import { planFeatures } from '../models/plan-features.model';
import { xPlanFeatures } from '../models/x-plan-features.model';
import { plans } from '../models/plans.model';
import { eq, asc, desc, count, and } from 'drizzle-orm';

export const getPlanFeatures = os
  .handler(async ({ input = {} }) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'pfid',
        sortOrder = 'desc',
        plan_id
      } = input;
      const offset = (page - 1) * limit;

      const whereConditions = [];

      if (plan_id) {
        whereConditions.push(eq(planFeatures.plan_id, plan_id));
      }

      const query = db.select({
        pfid: planFeatures.pfid,
        plan_id: planFeatures.plan_id,
        feature_id: planFeatures.feature_id,
        feature_value: planFeatures.feature_value,
        description: planFeatures.description,
        plan_name: plans.name,
        plan_feature_name: xPlanFeatures.plan_feature_name,
        createdAt: planFeatures.createdAt,
        updatedAt: planFeatures.updatedAt
      }).from(planFeatures)
        .leftJoin(plans, eq(planFeatures.plan_id, plans.pid))
        .leftJoin(xPlanFeatures, eq(planFeatures.feature_id, xPlanFeatures.plan_feature_id))
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);
      
      const countQuery = db.select({ count: count(planFeatures.pfid) }).from(planFeatures)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

      const sortField = planFeatures[sortBy] || planFeatures.pfid;
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

export const createPlanFeature = os.handler(async ({ input = {} }) => {
  try {
    if (!input.plan_id) throw new Error('plan_id is required');
    if (!input.feature_id) throw new Error('feature_id is required');
    if (!input.feature_value) throw new Error('feature_value is required');
    if (!input.description) throw new Error('description is required');
    
    const [result] = await db.insert(planFeatures).values(input).returning();
    return result;
  } catch (error) {
    console.error('Error creating plan feature:', error);
    throw error;
  }
});

export const updatePlanFeature = os.handler(async ({ input = {} }) => {
  try {
    if (!input.pfid) throw new Error('pfid is required');
    
    const { pfid, ...updateData } = input;
    const [result] = await db.update(planFeatures)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(planFeatures.pfid, pfid))
      .returning();
    return result;
  } catch (error) {
    console.error('Error updating plan feature:', error);
    throw error;
  }
});

export const deletePlanFeature = os.handler(async ({ input = {} }) => {
  try {
    if (!input.pfid) throw new Error('pfid is required');
    
    await db.delete(planFeatures).where(eq(planFeatures.pfid, input.pfid));
    return { success: true };
  } catch (error) {
    console.error('Error deleting plan feature:', error);
    throw error;
  }
});

export const getPlanFeatureById = os.handler(async ({ input = {} }) => {
  try {
    const [result] = await db.select({
      pfid: planFeatures.pfid,
      plan_id: planFeatures.plan_id,
      feature_id: planFeatures.feature_id,
      feature_value: planFeatures.feature_value,
      description: planFeatures.description,
      plan_name: plans.name,
      plan_feature_name: xPlanFeatures.plan_feature_name,
      createdAt: planFeatures.createdAt,
      updatedAt: planFeatures.updatedAt
    }).from(planFeatures)
    .leftJoin(plans, eq(planFeatures.plan_id, plans.pid))
    .leftJoin(xPlanFeatures, eq(planFeatures.feature_id, xPlanFeatures.plan_feature_id))
    .where(eq(planFeatures.pfid, input.pfid));
    return result;
  } catch (error) {
    console.error('Error fetching plan feature by ID:', error);
    throw error;
  }
});

export const getAllPlanFeatures = os.handler(async ({ input = {} }) => {
  try {
    const data = await db.select({
      pfid: planFeatures.pfid,
      plan_id: planFeatures.plan_id,
      feature_id: planFeatures.feature_id,
      description: planFeatures.description
    }).from(planFeatures);
    
    return data;
  } catch (error) {
    console.error('Error fetching all plan features:', error);
    throw error;
  }
});