import { os } from '@orpc/server';
import { db } from '../db';
import { xProjectsAuthorities } from '../models/x-projects-authorities.model';
import { eq, asc, desc, ilike, count } from 'drizzle-orm';

export const getxProjectAuthorities = os
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
        project_authority_id: xProjectsAuthorities.project_authority_id,
        project_authority_name: xProjectsAuthorities.project_authority_name,
        description: xProjectsAuthorities.description,
        status: xProjectsAuthorities.status,
        createdAt: xProjectsAuthorities.createdAt,
        updatedAt: xProjectsAuthorities.updatedAt
      }).from(xProjectsAuthorities).$dynamic();
      let countQuery = db.select({ count: count(xProjectsAuthorities.project_authority_id) }).from(xProjectsAuthorities).$dynamic();
 
      if (searchName) {
        query = query.where(ilike(xProjectsAuthorities.project_authority_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xProjectsAuthorities.project_authority_name, `%${searchName}%`));
      }
    
      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xProjectsAuthorities.status, searchStatus));
        countQuery = countQuery.where(eq(xProjectsAuthorities.status, searchStatus));
      }
 
      const sortField = xProjectsAuthorities[sortBy] || xProjectsAuthorities.createdAt;
      const data = await query.limit(limit).offset(offset).orderBy(sortOrder === 'asc' ? asc(sortField) : desc(sortField));
      const totalRecordsResult = await countQuery;
      const totalRecords = totalRecordsResult[0].count;

      return { data, currentPage: page, totalPages: Math.ceil(totalRecords / limit), totalRecords };
    } catch (error) {
      console.error('Error fetching project authorities:', error);
      throw error;
    }
  });

export const createxProjectAuthorities = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xProjectsAuthorities).values({
        project_authority_name: input.project_authority_name,
        description: input.description,
        status: input.status
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating project authority:', error);
      throw error;
    }
  });

export const updatexProjectAuthorities = os
  .handler(async ({ input = {} }) => {
    try {
      const { project_authority_id, ...updateData } = input;
      const [result] = await db.update(xProjectsAuthorities).set({ ...updateData, updatedAt: new Date() })
        .where(eq(xProjectsAuthorities.project_authority_id, input.project_authority_id))
        .returning();
      return result;
    } catch (error) {
      console.error(`Error updating project authority with ID ${input.project_authority_id}:`, error);
      throw error;
    }
  });

export const deletexProjectAuthorities = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xProjectsAuthorities).where(eq(xProjectsAuthorities.project_authority_id, input.project_authority_id));
      return { success: true };
    } catch (error) {
      console.error(`Error deleting project authority with ID ${input.project_authority_id}:`, error);
      throw error;
    }
  });

export const getxProjectAuthoritiesById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select({
        project_authority_id: xProjectsAuthorities.project_authority_id,
        project_authority_name: xProjectsAuthorities.project_authority_name,
        description: xProjectsAuthorities.description,
        status: xProjectsAuthorities.status,
        createdAt: xProjectsAuthorities.createdAt,
        updatedAt: xProjectsAuthorities.updatedAt
      }).from(xProjectsAuthorities).where(eq(xProjectsAuthorities.project_authority_id, input.project_authority_id));
      return result;
    } catch (error) {
      console.error(`Error fetching project authority by ID ${input.project_authority_id}:`, error);
      throw error;
    }
  });
