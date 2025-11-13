import { os } from '@orpc/server';
import { db } from '../db';
import { xPropertiesFurnishs } from '../models/x-properties-furnishs.model';
import { eq, asc, desc, ilike, count, and } from 'drizzle-orm';

export const getxFurnishingTypes = os
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
        whereConditions.push(ilike(xPropertiesFurnishs.property_furnish_type, `%${searchName.trim()}%`));
      }

      if (status !== "all") {
        const statusValue = status === "true" || status === true;
        whereConditions.push(eq(xPropertiesFurnishs.status, statusValue));
      }

      const query = db.select().from(xPropertiesFurnishs)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

      const countQuery = db.select({ count: count(xPropertiesFurnishs.property_furnish_id) }).from(xPropertiesFurnishs)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

      const sortField = xPropertiesFurnishs[sortBy] || xPropertiesFurnishs.createdAt;
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
      console.error('Error fetching property furnishing types:', error);
      throw error;
    }
  });

export const createxFurnishingType = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xPropertiesFurnishs).values({
        property_furnish_type: input.property_furnish_type,
        description: input.description,
        status: input.status
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating property furnishing type:', error);
      throw error;
    }
  });

export const updatexFurnishingType = os
  .handler(async ({ input = {} }) => {
    try {
      const { property_furnish_id, ...updateData } = input;
      const [result] = await db.update(xPropertiesFurnishs)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(xPropertiesFurnishs.property_furnish_id, property_furnish_id))
        .returning();
      return result;
    } catch (error) {
      console.error(`Error updating property furnishing type with ID ${input.property_furnish_id}:`, error);
      throw error;
    }
  });

export const deletexFurnishingType = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xPropertiesFurnishs).where(eq(xPropertiesFurnishs.property_furnish_id, input.property_furnish_id));
      return { success: true };
    } catch (error) {
      console.error(`Error deleting property furnishing type with ID ${input.property_furnish_id}:`, error);
      throw error;
    }
  });

export const getxFurnishingTypeById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select().from(xPropertiesFurnishs).where(eq(xPropertiesFurnishs.property_furnish_id, input.property_furnish_id));
      return result;
    } catch (error) {
      console.error(`Error fetching property furnishing type by ID ${input.property_furnish_id}:`, error);
      throw error;
    }
  });

export const updatexFurnishingTypeStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.update(xPropertiesFurnishs)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(xPropertiesFurnishs.property_furnish_id, input.property_furnish_id))
        .returning();
      return result;
    } catch (error) {
      console.error(`Error updating property furnishing type status for ID ${input.property_furnish_id}:`, error);
      throw error;
    }
  });