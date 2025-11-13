import { os } from '@orpc/server';
import { db } from '../db';
import { xMeasurementUnits } from '../models/x-measurement-units.model';
import { eq, asc, desc, ilike, count } from 'drizzle-orm';

export const getxMeasurementUnits = os
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

      let query = db.select().from(xMeasurementUnits).$dynamic();
      let countQuery = db.select({ count: count(xMeasurementUnits.measurement_unit_id) }).from(xMeasurementUnits).$dynamic();

      if (searchName) {
        query = query.where(ilike(xMeasurementUnits.measurement_unit_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xMeasurementUnits.measurement_unit_name, `%${searchName}%`));
      }

      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xMeasurementUnits.status, searchStatus));
        countQuery = countQuery.where(eq(xMeasurementUnits.status, searchStatus));
      }

      const sortField = xMeasurementUnits[sortBy] || xMeasurementUnits.createdAt;
      
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
      console.error('Error fetching measurement units:', error);
      throw error;
    }
  });

export const createxMeasurementUnit = os.handler(async ({ input = {} }) => {
  const [result] = await db.insert(xMeasurementUnits).values({
    measurement_unit_name: input.measurement_unit_name
  }).returning();
  return result;
});

export const updatexMeasurementUnit = os.handler(async ({ input = {} }) => {
  try {
    const { measurement_unit_id, measurement_unit_name, description, status } = input;
    if (!measurement_unit_id) {
      throw new Error('measurement_unit_id is required for an update');
    }

    const updateData: { [key: string]: any } = { updatedAt: new Date() };

    if (measurement_unit_name !== undefined) {
      updateData.measurement_unit_name = measurement_unit_name;
    }
    if (description !== undefined) {
      updateData.description = description;
    }
    if (status !== undefined) {
      updateData.status = status;
    }

    const [result] = await db.update(xMeasurementUnits).set(updateData).where(eq(xMeasurementUnits.measurement_unit_id, measurement_unit_id)).returning();
    return result;
  } catch (error) {
    console.error('Error updating measurement unit:', error);
    throw error;
  }
});

export const deletexMeasurementUnit = os.handler(async ({ input = {} }) => {
  await db.delete(xMeasurementUnits).where(eq(xMeasurementUnits.measurement_unit_id, input.measurement_unit_id));
  return { success: true };
});

export const getxMeasurementUnitById = os.handler(async ({ input = {} }) => {
  const [result] = await db.select({
    measurement_unit_id: xMeasurementUnits.measurement_unit_id,
    measurement_unit_name: xMeasurementUnits.measurement_unit_name,
    description: xMeasurementUnits.description,
    status: xMeasurementUnits.status,
    createdAt: xMeasurementUnits.createdAt
  }).from(xMeasurementUnits).where(eq(xMeasurementUnits.measurement_unit_id, input.measurement_unit_id));
  return result;
});

export const updatexMeasurementUnitStatus = os
    .handler(async ({ input = {} }) => {
    try {
      const { measurement_unit_id, status } = input;
      
      if (!measurement_unit_id) {
        throw new Error('measurement_unit_id is required');
      }
      if (status === undefined) {
        throw new Error('status is required');
      }
      
      const [result] = await db.update(xMeasurementUnits).set({ status }).where(eq(xMeasurementUnits.measurement_unit_id, measurement_unit_id)).returning();
      return result;
    } catch (error) {
      console.error('Update status error:', error);
      throw new Error(`Failed to update status: ${error.message}`);
    }
  });