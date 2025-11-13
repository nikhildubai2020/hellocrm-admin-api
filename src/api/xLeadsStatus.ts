import { os } from '@orpc/server';
import { db } from '../db';
import { xLeadsStatus } from '../models/x-leads-status.model';
import { eq, count, asc, desc, ilike } from 'drizzle-orm';

export const getxLeadsStatus = os
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
        lead_status_id: xLeadsStatus.lead_status_id,
        lead_status_name: xLeadsStatus.lead_status_name,
        status: xLeadsStatus.status,
        createdAt: xLeadsStatus.createdAt,
        updatedAt: xLeadsStatus.updatedAt
      }).from(xLeadsStatus).$dynamic();
      let countQuery = db.select({ count: count(xLeadsStatus.lead_status_id) }).from(xLeadsStatus).$dynamic();

      if (searchName) {
        query = query.where(ilike(xLeadsStatus.lead_status_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xLeadsStatus.lead_status_name, `%${searchName}%`));
      }

      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xLeadsStatus.status, searchStatus));
        countQuery = countQuery.where(eq(xLeadsStatus.status, searchStatus));
      }

      const sortField = xLeadsStatus[sortBy] || xLeadsStatus.createdAt;
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
      console.error('Error fetching lead statuses:', error);
      throw error;
    }
  });

export const createxLeadsStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xLeadsStatus).values({
        lead_status_name: input.lead_status_name
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating lead status:', error);
      throw error;
    }
  });

export const updatexLeadsStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const { lead_status_id, ...updateData } = input;
      const [result] = await db.update(xLeadsStatus)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(xLeadsStatus.lead_status_id, lead_status_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw error;
    }
  });

export const deletexLeadsStatus = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xLeadsStatus).where(eq(xLeadsStatus.lead_status_id, input.lead_status_id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting lead status:', error);
      throw error;
    }
  });

export const updatexLeadsStatusStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.update(xLeadsStatus)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(xLeadsStatus.lead_status_id, input.lead_status_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating lead status status:', error);
      throw error;
    }
  });

export const getxLeadsStatusById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select({
        lead_status_id: xLeadsStatus.lead_status_id,
        lead_status_name: xLeadsStatus.lead_status_name,
        status: xLeadsStatus.status,
        createdAt: xLeadsStatus.createdAt,
        updatedAt: xLeadsStatus.updatedAt
      }).from(xLeadsStatus).where(eq(xLeadsStatus.lead_status_id, input.lead_status_id));
      return result;
    } catch (error) {
      console.error('Error fetching lead status by ID:', error);
      throw error;
    }
  });