import { os } from '@orpc/server';
import { db } from '../db';
import { xAmenitiesTypes } from '../models/x-amenities-types.model';
import { eq, asc, desc, ilike, count, and } from 'drizzle-orm';

export const getxAmenitiesTypes = os
  .handler(async ({ input = {} }) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        searchName = "",
        status = "all"
      } = input;
      const offset = (page - 1) * limit;

      const whereConditions = [];

      if (searchName && searchName.trim() !== "") {
        whereConditions.push(ilike(xAmenitiesTypes.amenity_type_name, `%${searchName.trim()}%`));
      }

      if (status !== "all") {
        const statusValue = status === "true" || status === true;
        whereConditions.push(eq(xAmenitiesTypes.status, statusValue));
      }

      const query = db.select().from(xAmenitiesTypes)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

      const countQuery = db.select({ count: count(xAmenitiesTypes.amenity_type_id) }).from(xAmenitiesTypes)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

      const sortField = xAmenitiesTypes[sortBy] || xAmenitiesTypes.createdAt;
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
      console.error('Error fetching amenity types:', error);
      throw error;
    }
  });

export const createxAmenityType = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xAmenitiesTypes).values({
        user_id: input.user_id || 0,
        business_id: input.business_id || 0,
        amenity_type_name: input.amenity_type_name,
        order: input.order,
        status: input.status,
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating amenity type:', error);
      throw error;
    }
  });

export const updatexAmenityType = os
  .handler(async ({ input = {} }) => {
    try {
      const { amenity_type_id, ...updateData } = input;

      if (updateData.hasOwnProperty('user_id')) {
        updateData.user_id = updateData.user_id || 0;
      }
      if (updateData.hasOwnProperty('business_id')) {
        updateData.business_id = updateData.business_id || 0;
      }

      const [result] = await db.update(xAmenitiesTypes)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(xAmenitiesTypes.amenity_type_id, amenity_type_id))
        .returning();
      return result;
    } catch (error) {
      console.error(`Error updating amenity type with ID ${input.amenity_type_id}:`, error);
      throw error;
    }
  });

export const deletexAmenityType = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xAmenitiesTypes).where(eq(xAmenitiesTypes.amenity_type_id, input.amenity_type_id));
      return { success: true };
    } catch (error) {
      console.error(`Error deleting amenity type with ID ${input.amenity_type_id}:`, error);
      throw error;
    }
  });

export const getxAmenityTypeById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select().from(xAmenitiesTypes).where(eq(xAmenitiesTypes.amenity_type_id, input.amenity_type_id));
      return result;
    } catch (error) {
      console.error(`Error fetching amenity type by ID ${input.amenity_type_id}:`, error);
      throw error;
    }
  });

export const updatexAmenityTypeStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.update(xAmenitiesTypes)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(xAmenitiesTypes.amenity_type_id, input.amenity_type_id))
        .returning();
      return result;
    } catch (error) {
      console.error(`Error updating amenity type status for ID ${input.amenity_type_id}:`, error);
      throw error;
    }
  });

export const getAllxAmenitiesTypes = os
  .handler(async () => {
    try {
      const data = await db.select({
        amenity_type_id: xAmenitiesTypes.amenity_type_id,
        amenity_type_name: xAmenitiesTypes.amenity_type_name
      }).from(xAmenitiesTypes)
      .where(eq(xAmenitiesTypes.status, true))
      .orderBy(asc(xAmenitiesTypes.amenity_type_name));
      return data;
    } catch (error) {
      console.error('Error fetching all amenity types:', error);
      throw error;
    }
  });