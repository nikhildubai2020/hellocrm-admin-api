import { z } from 'zod';
import { os } from '@orpc/server';
import { db } from '../db';
import { xProjectsTypes} from '../models/x-projects-types.model';
import { eq, asc, desc, ilike, count, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {createxprojectTypesSchema, updatexprojectTypesSchema, getxprojectTypesSchema } from '../schema/xprojecttypeScema'
 
export const getxprojectTypes = os
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
 
      const parentProjectType = alias(xProjectsTypes, 'parent');
 
      let query = db.select({
        project_type_id: xProjectsTypes.project_type_id,
        project_type_name: xProjectsTypes.project_type_name,
        project_type_parent_id: xProjectsTypes.project_type_parent_id,
        description: xProjectsTypes.description,
        status: xProjectsTypes.status,
        createdAt: xProjectsTypes.createdAt,
        parent_project_type_name: sql<string>`COALESCE(${parentProjectType.project_type_name}, 'Root')`
      }).from(xProjectsTypes)
      .leftJoin(parentProjectType, eq(xProjectsTypes.project_type_parent_id, parentProjectType.project_type_id))
      .$dynamic();
 
      let countQuery = db.select({ count: count(xProjectsTypes.project_type_id) }).from(xProjectsTypes).$dynamic();
 
      if (searchName) {
        query = query.where(ilike(xProjectsTypes.project_type_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xProjectsTypes.project_type_name, `%${searchName}%`));
      }
 
      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xProjectsTypes.status, searchStatus));
        countQuery = countQuery.where(eq(xProjectsTypes.status, searchStatus));
      }
     
    const [data, totalRecordsResult] = await Promise.all([
      query
        .limit(limit)
        .offset(offset)
        .orderBy(sortOrder === 'asc' ? asc(xProjectsTypes[sortBy as keyof typeof xProjectsTypes]) : desc(xProjectsTypes[sortBy as keyof typeof xProjectsTypes])),
      countQuery
    ]);
    const totalRecords = totalRecordsResult[0].count;
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data,
      currentPage: page,
      totalPages,
      totalRecords,
    };
    } catch (error) {
      console.error('Error fetching project types:', error);
      throw error;
    }
  }); 

export const createxprojectType = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xProjectsTypes).values({
        project_type_name: input.project_type_name,
        project_type_parent_id: input.project_type_parent_id,
        description: input.description,
        status: input.status
      }).returning();
      return result;
    } catch (error) {
      console.error('Create project type error:', error);
      throw new Error(`Failed to create project type: ${error.message}`);
    }
  });

export const updatexProjectTypes = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.update(xProjectsTypes).set({
        project_type_name: input.project_type_name,
        project_type_parent_id: input.project_type_parent_id,
        description: input.description,
        status: input.status
      }).where(eq(xProjectsTypes.project_type_id, input.project_type_id)).returning();
      return result;
    } catch (error) {
      console.error('Update project type error:', error);
      throw new Error(`Failed to update project type: ${error.message}`);
    }
  });

export const getAllParentxproject = os
  .handler(async () => {  
    try {
      const data = await db.select({
        project_type_id: xProjectsTypes.project_type_id,
        project_type_name: xProjectsTypes.project_type_name,
      }).from(xProjectsTypes).where(eq(xProjectsTypes.project_type_parent_id, 0));
      return data;
    } catch (error) {
      console.error('Error fetching all parent project types:', error);
      throw error;
    }
  });
  
  
export const deletexProjectTypes = os
  .input(z.object({ project_type_id: z.number() }))
  .handler(async ({ input }) => {
    try {
    await db.delete(xProjectsTypes).where(eq(xProjectsTypes.project_type_id, input.project_type_id));
    return { success: true };
    } catch (error) {
      console.error(`Error deleting project type with ID ${input.project_type_id}:`, error);
      throw error;
    }
  });

export const updatexProjectTypesStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const { project_type_id, status } = input;
      if (!input.project_type_id) {
        throw new Error('project_type_id is required');
      }
      if (input.status === undefined) {
        throw new Error('status is required');
      }
      await db.update(xProjectsTypes).set({ status }).where(eq(xProjectsTypes.project_type_id, project_type_id));

      const parentProjectType = alias(xProjectsTypes, 'parent');
      const [result] = await db.select({
        project_type_id: xProjectsTypes.project_type_id,
        project_type_name: xProjectsTypes.project_type_name,
        project_type_parent_id: xProjectsTypes.project_type_parent_id,
        description: xProjectsTypes.description,
        status: xProjectsTypes.status,
        createdAt: xProjectsTypes.createdAt,
        parent_project_type_name: sql`COALESCE(${parentProjectType.project_type_name}, 'Root')`
      })
      .from(xProjectsTypes)
      .leftJoin(parentProjectType, eq(xProjectsTypes.project_type_parent_id, parentProjectType.project_type_id))
      .where(eq(xProjectsTypes.project_type_id, project_type_id));
      return result;
    } catch (error) {
      console.error('Update status error:', error);
      throw new Error(`Failed to update status: ${error.message}`);
    }
  });