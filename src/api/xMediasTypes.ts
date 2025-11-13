import { os } from '@orpc/server';
import { db } from '../db';
import { xMediasTypes } from '../models/x-medias-types.model';
import { eq, asc, desc, ilike, count, and } from 'drizzle-orm';

export const getxMediasTypes = os
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

      const whereConditions = [];

      if (searchName && searchName.trim() !== "") {
        whereConditions.push(ilike(xMediasTypes.media_type_name, `%${searchName.trim()}%`));
      }

      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        whereConditions.push(eq(xMediasTypes.status, searchStatus));
      }

      const query = db.select().from(xMediasTypes)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

      const countQuery = db.select({ count: count(xMediasTypes.media_type_id) }).from(xMediasTypes)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

      const sortField = xMediasTypes[sortBy] || xMediasTypes.createdAt;
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
      console.error('Error fetching media types:', error);
      throw error;
    }
  });

export const createxMediaType = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xMediasTypes).values({
        media_type_name: input.media_type_name,
        media_type_parent_id: input.media_type_parent_id || 0,
        status: input.status !== undefined ? input.status : true
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating media type:', error);
      throw error;
    }
  });

export const updatexMediaType = os
  .handler(async ({ input = {} }) => {
    try {
      const { media_type_id, ...updateData } = input;
      const [result] = await db.update(xMediasTypes)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(xMediasTypes.media_type_id, media_type_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating media type:', error);
      throw error;
    }
  });

export const deletexMediaType = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xMediasTypes).where(eq(xMediasTypes.media_type_id, input.media_type_id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting media type:', error);
      throw error;
    }
  });

export const getxMediaTypeById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select({
        media_type_id: xMediasTypes.media_type_id,
        media_type_name: xMediasTypes.media_type_name,
        media_type_parent_id: xMediasTypes.media_type_parent_id,
        status: xMediasTypes.status,
        createdAt: xMediasTypes.createdAt,
        updatedAt: xMediasTypes.updatedAt
      }).from(xMediasTypes).where(eq(xMediasTypes.media_type_id, input.media_type_id));
      return result;
    } catch (error) {
      console.error('Error fetching media type by ID:', error);
      throw error;
    }
  });

export const updatexMediaTypeStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.update(xMediasTypes)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(xMediasTypes.media_type_id, input.media_type_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating media type status:', error);
      throw error;
    }
  });