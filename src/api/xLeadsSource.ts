import { os } from '@orpc/server';
import { db } from '../db';
import { xLeadsSource } from '../models/x-leads-source.model';
import { eq, asc, desc, ilike, count } from 'drizzle-orm';

export const getxLeadsSource = os
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
        lead_source_id: xLeadsSource.lead_source_id,
        lead_source_name: xLeadsSource.lead_source_name,
        status: xLeadsSource.status,
        createdAt: xLeadsSource.createdAt,
        updatedAt: xLeadsSource.updatedAt
      }).from(xLeadsSource).$dynamic();
      let countQuery = db.select({ count: count(xLeadsSource.lead_source_id) }).from(xLeadsSource).$dynamic();

      if (searchName) {
        query = query.where(ilike(xLeadsSource.lead_source_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xLeadsSource.lead_source_name, `%${searchName}%`));
      }

      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xLeadsSource.status, searchStatus));
        countQuery = countQuery.where(eq(xLeadsSource.status, searchStatus));
      }

      const sortField = xLeadsSource[sortBy] || xLeadsSource.createdAt;
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
      console.error('Error fetching lead sources:', error);
      throw error;
    }
  });

export const createxLeadsSource = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xLeadsSource).values({
        lead_source_name: input.lead_source_name
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating lead source:', error);
      throw error;
    }
  });

export const updatexLeadsSource = os
  .handler(async ({ input = {} }) => {
    try {
      const { lead_source_id, ...updateData } = input;
      const [result] = await db.update(xLeadsSource)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(xLeadsSource.lead_source_id, lead_source_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating lead source:', error);
      throw error;
    }
  });

export const deletexLeadsSource = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xLeadsSource).where(eq(xLeadsSource.lead_source_id, input.lead_source_id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting lead source:', error);
      throw error;
    }
  });

export const getxLeadsSourceById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select({
        lead_source_id: xLeadsSource.lead_source_id,
        lead_source_name: xLeadsSource.lead_source_name,
        status: xLeadsSource.status,
        createdAt: xLeadsSource.createdAt,
        updatedAt: xLeadsSource.updatedAt
      }).from(xLeadsSource).where(eq(xLeadsSource.lead_source_id, input.lead_source_id));
      return result;
    } catch (error) {
      console.error('Error fetching lead source by ID:', error);
      throw error;
    }
  });

export const updatexLeadsSourceStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.update(xLeadsSource)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(xLeadsSource.lead_source_id, input.lead_source_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating lead source status:', error);
      throw error;
    }
  });