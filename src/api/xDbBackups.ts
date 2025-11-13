import { os } from '@orpc/server';
import { db } from '../db';
import { xDbBackups } from '../models/x-db-backups.model';
import { eq, asc, desc, ilike, count } from 'drizzle-orm';

export const getxDbBackups = os
  .handler(async ({ input = {} }) => {
    try {
      const page = Number(input.page) || 1;
      const limit = Number(input.limit) || 10;
      const sortBy = input.sortBy || 'createdAt';
      const sortOrder = input.sortOrder || 'desc';
      const searchName = input.searchName || "";

      const offset = (page - 1) * limit;

      let query = db.select({
        dbid: xDbBackups.dbid,
        file_name: xDbBackups.file_name,
        add_by: xDbBackups.add_by,
        createdAt: xDbBackups.createdAt,
        updatedAt: xDbBackups.updatedAt
      }).from(xDbBackups).$dynamic();
      let countQuery = db.select({ count: count(xDbBackups.dbid) }).from(xDbBackups).$dynamic();

      if (searchName) {
        query = query.where(ilike(xDbBackups.file_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xDbBackups.file_name, `%${searchName}%`));
      }

      const sortField = xDbBackups[sortBy] || xDbBackups.createdAt;
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
      console.error('Error fetching DB backups:', error);
      throw error;
    }
  });

export const createxDbBackup = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xDbBackups).values({
        file_name: input.file_name,
        file_path: input.file_path,
        add_by: input.add_by
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating DB backup:', error);
      throw error;
    }
  });

export const updatexDbBackup = os
  .handler(async ({ input = {} }) => {
    try {
      const { dbid, ...updateData } = input;
      const [result] = await db.update(xDbBackups)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(xDbBackups.dbid, dbid)).returning();
      return result;
    } catch (error) {
      console.error('Error updating DB backup:', error);
      throw error;
    }
  });

export const deletexDbBackup = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xDbBackups).where(eq(xDbBackups.dbid, input.dbid));
      return { success: true };
    } catch (error) {
      console.error('Error deleting DB backup:', error);
      throw error;
    }
  });

export const getxDbBackupById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select({
        dbid: xDbBackups.dbid,
        file_name: xDbBackups.file_name,
        add_by: xDbBackups.add_by,
        createdAt: xDbBackups.createdAt,
        updatedAt: xDbBackups.updatedAt
      }).from(xDbBackups).where(eq(xDbBackups.dbid, input.dbid));
      return result;
    } catch (error) {
      console.error('Error fetching DB backup by ID:', error);
      throw error;
    }
  });