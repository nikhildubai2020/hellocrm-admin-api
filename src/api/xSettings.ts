import { os } from '@orpc/server';
import { db } from '../db';
import { xSettings } from '../models/x-system.model';
import { eq, asc, desc, ilike, count } from 'drizzle-orm';

export const getxSettings = os
  .handler(async ({ input = {} }) => {
    try {
      const page = Number(input.page) || 1;
      const limit = Number(input.limit) || 10;
      const sortBy = input.sortBy || 'createdAt';
      const sortOrder = input.sortOrder || 'desc';
      const searchName = input.searchName || "";

      const offset = (page - 1) * limit;

      let query = db.select({
        sid: xSettings.sid,
        name: xSettings.name,
        value: xSettings.value,
        createdAt: xSettings.createdAt,
        updatedAt: xSettings.updatedAt
      }).from(xSettings).$dynamic();
      let countQuery = db.select({ count: count(xSettings.sid) }).from(xSettings).$dynamic();

      if (searchName) {
        query = query.where(ilike(xSettings.name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xSettings.name, `%${searchName}%`));
      }

      const sortField = xSettings[sortBy] || xSettings.createdAt;
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
      console.error('Error fetching settings:', error);
      throw error;
    }
  });

export const createxSettings = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xSettings).values(input).returning();
      return result;
    } catch (error) {
      console.error('Error creating setting:', error);
      throw error;
    }
  });

export const updatexSettings = os
  .handler(async ({ input = {} }) => {
    try {
      const { sid, ...updateData } = input;
      const [result] = await db.update(xSettings).set(updateData).where(eq(xSettings.sid, sid)).returning();
      return result;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  });

export const deletexSettings = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xSettings).where(eq(xSettings.sid, input.sid));
      return { success: true };
    } catch (error) {
      console.error('Error deleting setting:', error);
      throw error;
    }
  });

export const getxSettingsById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select({
        sid: xSettings.sid,
        name: xSettings.name,
        value: xSettings.value,
        createdAt: xSettings.createdAt,
        updatedAt: xSettings.updatedAt
      }).from(xSettings).where(eq(xSettings.sid, input.sid));
      return result;
    } catch (error) {
      console.error('Error fetching setting by ID:', error);
      throw error;
    }
  });

export const updatexSettingsStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.update(xSettings)
        .set({ value: input.value, updatedAt: new Date() })
        .where(eq(xSettings.sid, input.sid))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating setting status:', error);
      throw error;
    }
  });