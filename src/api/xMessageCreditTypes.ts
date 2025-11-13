import { os } from '@orpc/server';
import { z } from 'zod';
import { db } from '../db';
import { xMessageCreditType } from '../models/x-plan-addons.model';
import { eq, asc, desc, ilike, count } from 'drizzle-orm';

export const getxMessageCreditTypes = os
  .input(z.object({
    page: z.number().min(1).optional().default(1),
    limit: z.number().min(1).max(100).optional().default(10),
    sortBy: z.string().optional().default('createdAt'),
    sortOrder: z.string().optional().default('desc'),
    search: z.string().optional().default(''),
    status: z.string().optional().default("all")
  }).optional())
  .handler(async ({ input = {} }) => {
    try {
      const { page, limit, sortBy, sortOrder, search, status = "all" } = input;
      const offset = (page - 1) * limit;

      let query = db.select().from(xMessageCreditType).$dynamic();
      let countQuery = db.select({ count: count(xMessageCreditType.credit_type_id) }).from(xMessageCreditType).$dynamic();

      if (search) {
        query = query.where(ilike(xMessageCreditType.name, `%${search}%`));
        countQuery = countQuery.where(ilike(xMessageCreditType.name, `%${search}%`));
      }

      if (status !== "all") {
        const statusValue = status === "true" || status === true;
        query = query.where(eq(xMessageCreditType.is_active, statusValue));
        countQuery = countQuery.where(eq(xMessageCreditType.is_active, statusValue));
      }

      const sortField = xMessageCreditType[sortBy] || xMessageCreditType.createdAt;
      const data = await query
        .limit(limit)
        .offset(offset)
        .orderBy(sortOrder === 'asc' ? asc(sortField) : desc(sortField));

      const totalRecordsResult = await countQuery;
      const totalRecords = totalRecordsResult[0].count;

      return {
        data,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords
      };
    } catch (error) {
      console.error('Error fetching message credit types:', error);
      throw error;
    }
  });

export const createxMessageCreditType = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xMessageCreditType).values({
        name: input.name,
        channel: input.channel,
        unit: input.unit || 'message',
        is_active: input.is_active !== undefined ? input.is_active : true
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating message credit type:', error);
      throw error;
    }
  });

export const updatexMessageCreditType = os
  .handler(async ({ input = {} }) => {
    try {
      const { credit_type_id, ...updateData } = input;
      const [result] = await db.update(xMessageCreditType)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(xMessageCreditType.credit_type_id, credit_type_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating message credit type:', error);
      throw error;
    }
  });

export const deletexMessageCreditType = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xMessageCreditType).where(eq(xMessageCreditType.credit_type_id, input.credit_type_id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting message credit type:', error);
      throw error;
    }
  });

export const getxMessageCreditTypeById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select().from(xMessageCreditType).where(eq(xMessageCreditType.credit_type_id, input.credit_type_id));
      return result;
    } catch (error) {
      console.error('Error fetching message credit type by ID:', error);
      throw error;
    }
  });

export const updatexMessageCreditTypeStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.update(xMessageCreditType)
        .set({ is_active: input.status, updatedAt: new Date() })
        .where(eq(xMessageCreditType.credit_type_id, input.credit_type_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating message credit type status:', error);
      throw error;
    }
  });

export const getAllxMessageCreditTypes = os
  .handler(async ({ input = {} }) => {
    try {
      const data = await db.select({
        credit_type_id: xMessageCreditType.credit_type_id,
        name: xMessageCreditType.name
      }).from(xMessageCreditType)
      .where(eq(xMessageCreditType.is_active, true));
      
      return data;
    } catch (error) {
      console.error('Error fetching all message credit types:', error);
      throw error;
    }
  });