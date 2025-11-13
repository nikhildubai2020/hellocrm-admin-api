import { os } from '@orpc/server';
import { db } from '../db';
import { xUsersRoles } from '../models/x-users-roles.model';
import { eq, asc, desc, ilike, count } from 'drizzle-orm';

export const getxUsersRoles = os
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
        user_role_id: xUsersRoles.user_role_id,
        user_role_name: xUsersRoles.user_role_name,
        status: xUsersRoles.status,
        createdAt: xUsersRoles.createdAt,
        updatedAt: xUsersRoles.updatedAt
      }).from(xUsersRoles).$dynamic();
      let countQuery = db.select({ count: count(xUsersRoles.user_role_id) }).from(xUsersRoles).$dynamic();

      if (searchName) {
        query = query.where(ilike(xUsersRoles.user_role_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xUsersRoles.user_role_name, `%${searchName}%`));
      }

      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xUsersRoles.status, searchStatus));
        countQuery = countQuery.where(eq(xUsersRoles.status, searchStatus));
      }

      const sortField = xUsersRoles[sortBy] || xUsersRoles.createdAt;
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
      console.error('Error fetching user roles:', error);
      throw error;
    }
  });

export const createxUserRole = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xUsersRoles).values({
        user_role_name: input.user_role_name,
        status: input.status !== undefined ? input.status : true
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating user role:', error);
      throw error;
    }
  });

export const updatexUserRole = os
  .handler(async ({ input = {} }) => {
    try {
      const { user_role_id, ...updateData } = input;
      const [result] = await db.update(xUsersRoles)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(xUsersRoles.user_role_id, user_role_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  });

export const deletexUserRole = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xUsersRoles).where(eq(xUsersRoles.user_role_id, input.user_role_id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting user role:', error);
      throw error;
    }
  });

export const getxUserRoleById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select({
        user_role_id: xUsersRoles.user_role_id,
        user_role_name: xUsersRoles.user_role_name,
        status: xUsersRoles.status,
        createdAt: xUsersRoles.createdAt,
        updatedAt: xUsersRoles.updatedAt
      }).from(xUsersRoles).where(eq(xUsersRoles.user_role_id, input.user_role_id));
      return result;
    } catch (error) {
      console.error('Error fetching user role by ID:', error);
      throw error;
    }
  });

export const updatexUserRoleStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.update(xUsersRoles)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(xUsersRoles.user_role_id, input.user_role_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating user role status:', error);
      throw error;
    }
  });