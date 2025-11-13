import { os } from '@orpc/server';
import { db } from '../db';
import { xTaskTypes } from '../models/x-task-types.model';
import { users } from '../models/users.model';
import { business } from '../models/business.model';
import { eq, asc, desc, ilike, count } from 'drizzle-orm';

export const getxTaskTypes = os
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
        task_type_id: xTaskTypes.task_type_id,
        task_type_name: xTaskTypes.task_type_name,
        status: xTaskTypes.status,
        createdAt: xTaskTypes.createdAt,
        user_id: xTaskTypes.user_id,
        business_id: xTaskTypes.business_id,
        user_name: users.userName,
        business_name: business.business_name,
      }).from(xTaskTypes)
      .leftJoin(users, eq(xTaskTypes.user_id, users.user_id))
      .leftJoin(business, eq(xTaskTypes.business_id, business.business_id)).$dynamic();
      let countQuery = db.select({ count: count(xTaskTypes.task_type_id) }).from(xTaskTypes).$dynamic();

      if (searchName) {
        query = query.where(ilike(xTaskTypes.task_type_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xTaskTypes.task_type_name, `%${searchName}%`));
      }

      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xTaskTypes.status, searchStatus));
        countQuery = countQuery.where(eq(xTaskTypes.status, searchStatus));
      }

      const sortField = xTaskTypes[sortBy] || xTaskTypes.createdAt;
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
      console.error('Error fetching task types:', error);
      throw error;
    }
  });

export const createxTaskType = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xTaskTypes).values({
        task_type_name: input.task_type_name,
        business_id: input.business_id,
        user_id: input.user_id,
        status: input.status !== undefined ? input.status : true
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating task type:', error);
      throw error;
    }
  });

export const updatexTaskType = os
  .handler(async ({ input = {} }) => {
    try {
      const { task_type_id, ...updateData } = input;
      const [result] = await db.update(xTaskTypes)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(xTaskTypes.task_type_id, task_type_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating task type:', error);
      throw error;
    }
  });

export const deletexTaskType = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xTaskTypes).where(eq(xTaskTypes.task_type_id, input.task_type_id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting task type:', error);
      throw error;
    }
  });

export const getxTaskTypeById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select({
        task_type_id: xTaskTypes.task_type_id,
        task_type_name: xTaskTypes.task_type_name,
        status: xTaskTypes.status,
        createdAt: xTaskTypes.createdAt,
        user_id: xTaskTypes.user_id,
        business_id: xTaskTypes.business_id,
        user_first_name: users.first_name,
        user_last_name: users.last_name,
        business_name: business.business_name,
      }).from(xTaskTypes).where(eq(xTaskTypes.task_type_id, input.task_type_id));
      return result;
    } catch (error) {
      console.error('Error fetching task type by ID:', error);
      throw error;
    }
  });

export const updatexTaskTypeStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.update(xTaskTypes)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(xTaskTypes.task_type_id, input.task_type_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating task type status:', error);
      throw error;
    }
  });