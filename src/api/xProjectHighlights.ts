import { os } from '@orpc/server';
import { db } from '../db';
import { xProjectsHighlights } from '../models/x-projects.model';
import { users } from '../models/users.model';
import { business } from '../models/business.model';import { eq, asc, desc, ilike, count } from 'drizzle-orm';

export const getxProjectHighlights = os
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
        project_highlight_id: xProjectsHighlights.project_highlight_id,
        project_highlight_name: xProjectsHighlights.project_highlight_name,
        status: xProjectsHighlights.status,
        createdAt: xProjectsHighlights.createdAt,
        user_id: xProjectsHighlights.user_id,
        business_id: xProjectsHighlights.business_id,
        user_first_name: users.first_name,
        user_last_name: users.last_name,
        business_name: business.business_name ,
      })
      .from(xProjectsHighlights)
      .leftJoin(users, eq(xProjectsHighlights.user_id, users.user_id))
      .leftJoin(business, eq(xProjectsHighlights.business_id, business.business_id))
      .$dynamic();
      let countQuery = db.select({ count: count(xProjectsHighlights.project_highlight_id) }).from(xProjectsHighlights).$dynamic();
   
      if (searchName) {
        query = query.where(ilike(xProjectsHighlights.project_highlight_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xProjectsHighlights.project_highlight_name, `%${searchName}%`));
      }
      
      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xProjectsHighlights.status, searchStatus));
        countQuery = countQuery.where(eq(xProjectsHighlights.status, searchStatus));
      }
   
      const sortField = xProjectsHighlights[sortBy] || xProjectsHighlights.createdAt;
      const data = await query.limit(limit).offset(offset).orderBy(sortOrder === 'asc' ? asc(sortField) : desc(sortField));
      const totalRecordsResult = await countQuery;
      const totalRecords = totalRecordsResult[0].count;

      return { data, currentPage: page, totalPages: Math.ceil(totalRecords / limit), totalRecords };
    } catch (error) {
      console.error('Error in getxProjectHighlights:', error);
      throw error;
    }
  });

export const createxProjectHighlights = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xProjectsHighlights).values({
        business_id: input.business_id,
        project_highlight_name: input.project_highlight_name
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating project highlight:', error);
      throw error;
    }
  });

export const updatexProjectHighlights = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.update(xProjectsHighlights).set(input).where(eq(xProjectsHighlights.project_highlight_id, input.project_highlight_id)).returning();
      return result;
    } catch (error) {
      console.error(`Error updating project highlight with ID ${input.project_highlight_id}:`, error);
      throw error;
    }
  });

export const deletexProjectHighlights = os
  .handler(async ({ input }) => {
    try {
      await db.delete(xProjectsHighlights).where(eq(xProjectsHighlights.project_highlight_id, input.project_highlight_id));
      return { success: true };
    } catch (error) {
      console.error(`Error deleting project highlight with ID ${input.project_highlight_id}:`, error);
      throw error;
    }
  });