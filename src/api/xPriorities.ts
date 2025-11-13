import { os } from '@orpc/server';
import { db } from '../db';
import { xPriorities } from '../models/x-priorities.model';
import { eq, asc, desc, ilike, count } from 'drizzle-orm';

export const getxPriorities = os
  .handler(async ({ input = {} }) => {
    try {
      const page = Number(input.page) || 1;
      const limit = Number(input.limit) || 10;
      const sortBy = input.sortBy || 'createdAt';
      const sortOrder = input.sortOrder || 'desc';
      const searchName = input.searchName || "";
      let searchStatus = input.searchStatus;
      if (searchStatus === 'true') searchStatus = true;
      else if (searchStatus === 'false') searchStatus = false;

      const offset = (page - 1) * limit;

      let query = db.select({
        priority_id: xPriorities.priority_id,
        priority_name: xPriorities.priority_name,
        weight: xPriorities.weight,
        color: xPriorities.color,
        status: xPriorities.status,
        createdAt: xPriorities.createdAt
      }).from(xPriorities).$dynamic();
      let countQuery = db.select({ count: count(xPriorities.priority_id) }).from(xPriorities).$dynamic();

      if (searchName) {
        query = query.where(ilike(xPriorities.priority_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xPriorities.priority_name, `%${searchName}%`));
      }

      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xPriorities.status, searchStatus));
        countQuery = countQuery.where(eq(xPriorities.status, searchStatus));
      }

      const sortField = xPriorities[sortBy] || xPriorities.createdAt;
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
      console.error('Error fetching priorities:', error);
      throw error;
    }
  });

export const createxPriorities = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xPriorities).values({
        priority_name: input.priority_name,
        weight: input.weight,
        color: input.color,
        status: input.status
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating priority:', error);
      throw error;
    }
  });

export const updatexPrioritiesStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const { priority_id, status } = input;
      const [result] = await db.update(xPriorities)
        .set({ status: status, updatedAt: new Date() })
        .where(eq(xPriorities.priority_id, priority_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating priority status:', error);
      throw error;
    }
  });

export const updatexPriorities = os
  .handler(async ({ input = {} }) => {
    try {
      const { priority_id, ...updateData } = input;
      const [result] = await db.update(xPriorities)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(xPriorities.priority_id, priority_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating priority:', error);
      throw error;
    }
  });

export const deletexPriorities = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xPriorities).where(eq(xPriorities.priority_id, input.priority_id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting priority:', error);
      throw error;
    }
  });

export const getxPrioritiesById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select({
        priority_id: xPriorities.priority_id,
        priority_name: xPriorities.priority_name,
        weight: xPriorities.weight,
        color: xPriorities.color,
        status: xPriorities.status,
        createdAt: xPriorities.createdAt,
        updatedAt: xPriorities.updatedAt
      }).from(xPriorities).where(eq(xPriorities.priority_id, input.priority_id));
      return result;
    } catch (error) {
      console.error('Error fetching priority by ID:', error);
      throw error;
    }
  });