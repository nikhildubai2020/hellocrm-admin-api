import { os } from '@orpc/server';
import { db } from '../db';
import { xPropertiesConfigs } from '../models/x-properties-configs.model';
import { eq, asc, desc, ilike, count, and } from 'drizzle-orm';

export const getxPropertyConfigs = os
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
        whereConditions.push(ilike(xPropertiesConfigs.property_config_name, `%${searchName.trim()}%`));
      }

      if (status !== "all") {
        const statusValue = status === "true" || status === true;
        whereConditions.push(eq(xPropertiesConfigs.status, statusValue));
      }

      const query = db.select().from(xPropertiesConfigs)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

      const countQuery = db.select({ count: count(xPropertiesConfigs.property_config_id) }).from(xPropertiesConfigs)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

      const sortField = xPropertiesConfigs[sortBy] || xPropertiesConfigs.createdAt;
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
      console.error('Error fetching property configs:', error);
      throw error;
    }
  });

export const createxPropertyConfigs = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xPropertiesConfigs).values({
        property_config_name: input.property_config_name,
        description: input.description || null,
        status: input.status
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating property config:', error);
      throw error;
    }
  });

export const updatexPropertyConfigs = os
  .handler(async ({ input = {} }) => {
    try {
      const { property_config_id, ...updateData } = input;
      const [result] = await db.update(xPropertiesConfigs)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(xPropertiesConfigs.property_config_id, property_config_id))
        .returning();
      return result;
    } catch (error) {
      console.error(`Error updating property config with ID ${input.property_config_id}:`, error);
      throw error;
    }
  });

export const deletexPropertyConfigs = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xPropertiesConfigs).where(eq(xPropertiesConfigs.property_config_id, input.property_config_id));
      return { success: true };
    } catch (error) {
      console.error(`Error deleting property config with ID ${input.property_config_id}:`, error);
      throw error;
    }
  });

export const getxPropertyConfigsById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select().from(xPropertiesConfigs).where(eq(xPropertiesConfigs.property_config_id, input.property_config_id));
      return result;
    } catch (error) {
      console.error(`Error fetching property config by ID ${input.property_config_id}:`, error);
      throw error;
    }
  });

export const updatexPropertyConfigsStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.update(xPropertiesConfigs)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(xPropertiesConfigs.property_config_id, input.property_config_id))
        .returning();
      return result;
    } catch (error) {
      console.error(`Error updating property config status for ID ${input.property_config_id}:`, error);
      throw error;
    }
  });