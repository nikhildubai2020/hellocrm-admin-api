import { z } from 'zod';
import { os } from '@orpc/server';
import { db } from '../db';
import { xBuildingType } from '../models/x-projects-building-type.model';
import { eq, asc, desc, ilike, count, sql } from 'drizzle-orm';

export const getxProjectBuildingTypes = os
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

      let query = db.select().from(xBuildingType).$dynamic();
      let countQuery = db.select({ count: count(xBuildingType.project_building_type_id) }).from(xBuildingType).$dynamic();

      if (searchName) {
        query = query.where(ilike(xBuildingType.project_building_type_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xBuildingType.project_building_type_name, `%${searchName}%`));
      }

      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xBuildingType.status, searchStatus));
        countQuery = countQuery.where(eq(xBuildingType.status, searchStatus));
      }

      const sortField = xBuildingType[sortBy] || xBuildingType.createdAt;
      const data = await query
        .limit(limit)
        .offset(offset)
        .orderBy(sortOrder === 'asc' ? asc(sortField) : desc(sortField));

      const totalRecordsResult = await countQuery;
      const totalRecords = totalRecordsResult[0].count;

      return { data, currentPage: page, totalPages: Math.ceil(totalRecords / limit), totalRecords };
    } catch (error) {
      console.error('Error fetching project building types:', error);
      throw error;
    }
  });

export const getxProjectBuildingType = os
  .handler(async ({ input = {} }) => {
    try {
    const [result] = await db.select({
      project_building_type_id: xBuildingType.project_building_type_id,
      project_building_type_name: xBuildingType.project_building_type_name,
      description: xBuildingType.description,
      status: xBuildingType.status,
      createdAt: xBuildingType.createdAt,
    })
    .from(xBuildingType)
    .where(eq(xBuildingType.project_building_type_id, input.project_building_type_id));
    return result;
    } catch (error) {
      console.error(`Error fetching project building type with ID ${input.project_building_type_id}:`, error);
      throw error;
    }
  });

export const createxProjectBuildingType = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xBuildingType).values({
        project_building_type_name: input.project_building_type_name,
        description: input.description,
        status: input.status !== undefined ? input.status : true,

      }).returning();
      return result;
    } catch (error) {
      console.error('Create project building type error:', error);
      throw new Error(`Failed to create project building type: ${error.message}`);
    }
  });

export const updatexProjectBuildingType = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.update(xBuildingType).set({
        project_building_type_name: input.project_building_type_name,
        description: input.description,
        status: input.status !== undefined ? input.status : true,
        updatedAt: new Date(),
      }).where(eq(xBuildingType.project_building_type_id, input.project_building_type_id)).returning();
      return result;
    } catch (error) {
      console.error('Update project building type error:', error);
      throw new Error(`Failed to update project building type: ${error.message}`);
    }
  });

export const getAllxProjectBuildingTypes = os
  .handler(async () => {
    try {
    const data = await db.select({
      project_building_type_id: xBuildingType.project_building_type_id,
      project_building_type_name: xBuildingType.project_building_type_name,
      description: xBuildingType.description,
      status: xBuildingType.status,
    })
    .from(xBuildingType);
    return data;
    } catch (error) {
      console.error('Error fetching all project building types:', error);
      throw error;
    }
  });

export const deletexProjectBuildingType = os
  .handler(async ({ input = {} }) => {
    try {
      if (!input.project_building_type_id) {
        throw new Error('project_building_type_id is required');
      }
      await db.delete(xBuildingType).where(eq(xBuildingType.project_building_type_id, input.project_building_type_id));
      return { success: true };
    } catch (error) {
      console.error('Delete project building type error:', error);
      throw new Error(`Failed to delete project building type: ${error.message}`);
    }
  });

export const updatexProjectBuildingTypeStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const { project_building_type_id, status } = input;
      if (!project_building_type_id) {
        throw new Error('project_building_type_id is required');
      }
      if (status === undefined) {
        throw new Error('status is required');
      }
      const [result] = await db.update(xBuildingType).set({ status }).where(eq(xBuildingType.project_building_type_id, project_building_type_id)).returning();
      return result;
    } catch (error) {
      console.error('Update status error:', error);
      throw new Error(`Failed to update status: ${error.message}`);
    }
  });