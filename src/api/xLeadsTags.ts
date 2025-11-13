import { os } from '@orpc/server';
import { db } from '../db';
import { xLeadsTags } from '../models/x-leads-tags.model';
import { users } from '../models/users.model';
import { business } from '../models/business.model';
import { eq, count, asc, desc, ilike } from 'drizzle-orm';

export const getxLeadsTags = os
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
        lead_tag_id: xLeadsTags.lead_tag_id,
        lead_tag_name: xLeadsTags.lead_tag_name,
        status: xLeadsTags.status,
        createdAt: xLeadsTags.createdAt,
        user_id: xLeadsTags.user_id,
        business_id: xLeadsTags.business_id,
        user_name: users.userName,
        business_name: business.business_name,
      }).from(xLeadsTags)
      .leftJoin(users, eq(xLeadsTags.user_id, users.user_id))
      .leftJoin(business, eq(xLeadsTags.business_id, business.business_id)).$dynamic();
      let countQuery = db.select({ count: count(xLeadsTags.lead_tag_id) }).from(xLeadsTags).$dynamic();

      if (searchName) {
        query = query.where(ilike(xLeadsTags.lead_tag_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xLeadsTags.lead_tag_name, `%${searchName}%`));
      }

      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xLeadsTags.status, searchStatus));
        countQuery = countQuery.where(eq(xLeadsTags.status, searchStatus));
      }

      const sortField = xLeadsTags[sortBy] || xLeadsTags.createdAt;
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
      console.error('Error fetching lead tags:', error);
      throw error;
    }
  });

export const createxLeadTag = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xLeadsTags).values({
        lead_tag_name: input.lead_tag_name,
        business_id: input.business_id,
        user_id: input.user_id || 0,
        status: input.status !== undefined ? input.status : true
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating lead tag:', error);
      throw error;
    }
  });

export const updatexLeadTag = os
  .handler(async ({ input = {} }) => {
    try {
      const { lead_tag_id, ...updateData } = input;
      const [result] = await db.update(xLeadsTags)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(xLeadsTags.lead_tag_id, lead_tag_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating lead tag:', error);
      throw error;
    }
  });

export const deletexLeadTag = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xLeadsTags).where(eq(xLeadsTags.lead_tag_id, input.lead_tag_id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting lead tag:', error);
      throw error;
    }
  });

export const getxLeadTagById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select({
        lead_tag_id: xLeadsTags.lead_tag_id,
        lead_tag_name: xLeadsTags.lead_tag_name,
        status: xLeadsTags.status,
        createdAt: xLeadsTags.createdAt,
        user_id: xLeadsTags.user_id,
        business_id: xLeadsTags.business_id,
        user_name: users.userName,
        business_name: business.business_name,
      }).from(xLeadsTags).where(eq(xLeadsTags.lead_tag_id, input.lead_tag_id));
      return result;
    } catch (error) {
      console.error('Error fetching lead tag by ID:', error);
      throw error;
    }
  });

export const updatexLeadTagStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.update(xLeadsTags)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(xLeadsTags.lead_tag_id, input.lead_tag_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating lead tag status:', error);
      throw error;
    }
  });