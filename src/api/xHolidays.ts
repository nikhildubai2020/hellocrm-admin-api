import { os } from '@orpc/server';
import { db } from '../db';
import { xHolidays } from '../models/x-holidays.model';
import { users } from '../models/users.model';
import { business } from '../models/business.model';
import { eq, asc, desc, ilike, count } from 'drizzle-orm';

export const getxHolidays = os
  .handler(async ({ input = {} }) => {
    try {
      const page = Number(input.page) || 1;
      const limit = Number(input.limit) || 10;
      const sortBy = input.sortBy || 'createdAt';
      const sortOrder = input.sortOrder || 'desc';
      const searchName = input.searchName || "";

      const offset = (page - 1) * limit;

      let query = db.select({
        holiday_id: xHolidays.holiday_id,
        holiday_name: xHolidays.holiday_name,
        holiday_date: xHolidays.holiday_date,
        user_id: xHolidays.user_id,
        business_id: xHolidays.business_id,
        createdAt: xHolidays.createdAt,
        updatedAt: xHolidays.updatedAt,
        user_name: users.userName,
        business_name: business.business_name
      }).from(xHolidays)
      .leftJoin(users, eq(xHolidays.user_id, users.user_id))
      .leftJoin(business, eq(xHolidays.business_id, business.business_id))
      .$dynamic();

      let countQuery = db.select({ count: count(xHolidays.holiday_id) }).from(xHolidays).$dynamic();

      if (searchName) {
        query = query.where(ilike(xHolidays.holiday_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xHolidays.holiday_name, `%${searchName}%`));
      }

      const sortField = xHolidays[sortBy] || xHolidays.createdAt;
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
      console.error('Error fetching holidays:', error);
      throw error;
    }
  });

export const createxHoliday = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xHolidays).values({
        holiday_name: input.holiday_name,
        holiday_date: input.holiday_date,
        business_id: input.business_id,
        user_id: input.user_id
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating holiday:', error);
      throw error;
    }
  });

export const updatexHoliday = os
  .handler(async ({ input = {} }) => {
    try {
      const { holiday_id, ...updateData } = input;
      const [result] = await db.update(xHolidays)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(xHolidays.holiday_id, holiday_id)).returning();
      return result;
    } catch (error) {
      console.error('Error updating holiday:', error);
      throw error;
    }
  });

export const deletexHoliday = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xHolidays).where(eq(xHolidays.holiday_id, input.holiday_id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting holiday:', error);
      throw error;
    }
  });

export const getxHolidayById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select({
        holiday_id: xHolidays.holiday_id,
        holiday_name: xHolidays.holiday_name,
        holiday_date: xHolidays.holiday_date,
        user_id: xHolidays.user_id,
        business_id: xHolidays.business_id,
        createdAt: xHolidays.createdAt,
        updatedAt: xHolidays.updatedAt,
        user_name: users.userName,
        business_name: business.business_name
      }).from(xHolidays)
      .leftJoin(users, eq(xHolidays.user_id, users.user_id))
      .leftJoin(business, eq(xHolidays.business_id, business.business_id))
      .where(eq(xHolidays.holiday_id, input.holiday_id));
      return result;
    } catch (error) {
      console.error('Error fetching holiday by ID:', error);
      throw error;
    }
  });