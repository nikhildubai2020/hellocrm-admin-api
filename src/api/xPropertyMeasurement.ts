import { os } from '@orpc/server';
import { db } from '../db';
import { xPropertyMeasurement } from '../models/x-properties.model';
import { eq, count, asc, desc, ilike } from 'drizzle-orm';
import * as z from 'zod';

export const getxPropertyMeasurement = os
  .handler(async ({ input = {} }) => {
    try {
      console.log('input:', input);
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
         property_measurement_id: xPropertyMeasurement.property_measurement_id,
         property_measurement_name: xPropertyMeasurement.property_measurement_name,
         status: xPropertyMeasurement.status,
         createdAt: xPropertyMeasurement.createdAt,
    }).from(xPropertyMeasurement).$dynamic();
      let countQuery = db.select({ count: count(xPropertyMeasurement.property_measurement_id) }).from(xPropertyMeasurement).$dynamic();

      if (searchName) {
        query = query.where(ilike(xPropertyMeasurement.property_measurement_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xPropertyMeasurement.property_measurement_name, `%${searchName}%`));
      }

      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xPropertyMeasurement.status, searchStatus));
        countQuery = countQuery.where(eq(xPropertyMeasurement.status, searchStatus));
      }

      const sortField = xPropertyMeasurement[sortBy] || xPropertyMeasurement.createdAt;
      
      const [data, totalRecordsResult] = await Promise.all([
        query
          .limit(limit)
          .offset(offset)
          .orderBy(sortOrder === 'asc' ? asc(sortField) : desc(sortField)),
        countQuery
      ]);
      
      const totalRecords = totalRecordsResult[0].count;

      return { data, currentPage: page, totalPages: Math.ceil(totalRecords / limit), totalRecords };
    } catch (error) {
      console.error('Error fetching property measurements:', error);
      throw error;
    }
  });

export const createxPropertyMeasurement = os.handler(async ({ input = {} }) => {
  const [result] = await db.insert(xPropertyMeasurement).values({
    property_measurement_name: input.property_measurement_name
  }).returning();
  return result;
});

export const updatexPropertyMeasurement = os.handler(async ({ input = {} }) => {
  const [result] = await db.update(xPropertyMeasurement).set(input).where(eq(xPropertyMeasurement.property_measurement_id, input.property_measurement_id)).returning();
  return result;
});

export const deletexPropertyMeasurement = os.handler(async ({ input = {} }) => {
  await db.delete(xPropertyMeasurement).where(eq(xPropertyMeasurement.property_measurement_id, input.property_measurement_id));
  return { success: true };
});

export const getxPropertyMeasurementById = os.handler(async ({ input = {} }) => {
  const [result] = await db.select().from(xPropertyMeasurement).where(eq(xPropertyMeasurement.property_measurement_id, input.property_measurement_id));
  return result;
});

export const updatexPropertyMeasurementStatus = os
    .handler(async ({ input = {} }) => {
    try {
      const { property_measurement_id, status } = input;
      
      if (!property_measurement_id) {
        throw new Error('property_measurement_id is required');
      }
      if (status === undefined) {
        throw new Error('status is required');
      }
      
      const [result] = await db.update(xPropertyMeasurement).set({ status }).where(eq(xPropertyMeasurement.property_measurement_id, property_measurement_id)).returning();
      return result;
    } catch (error) {
      console.error('Update status error:', error);
      throw new Error(`Failed to update status: ${error.message}`);
    }
  });
