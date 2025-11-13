import { os } from '@orpc/server';
import { db } from '../db';
import { xPropertiesTransactions } from '../models/x-properties.model';
import { eq, asc, desc, ilike, count } from 'drizzle-orm';
import { status } from 'elysia';

export const getxPropertyTransactions = os
  .handler(async ({ input = {} }) => {
    try {
      const page = Number(input.page) || 1;
      const limit = Number(input.limit) || 10;
      const sortBy = input.sortBy || 'property_transaction_id';
      const sortOrder = input.sortOrder || 'desc';
      const searchName = input.searchName || "";
      let searchStatus = input.searchStatus;
      if (searchStatus === 'true') searchStatus = true;
      else if (searchStatus === 'false') searchStatus = false;

      const offset = (page - 1) * limit;

      let query = db.select({
        property_transaction_id: xPropertiesTransactions.property_transaction_id,
        property_transaction_type: xPropertiesTransactions.property_transaction_type,
        status: xPropertiesTransactions.status,
        createdAt: xPropertiesTransactions.createdAt,
      }).from(xPropertiesTransactions).$dynamic();
      
      let countQuery = db.select({ count: count(xPropertiesTransactions.property_transaction_id) }).from(xPropertiesTransactions).$dynamic();

      if (searchName && searchName.trim() !== "") {
        query = query.where(ilike(xPropertiesTransactions.property_transaction_type, `%${searchName.trim()}%`));
        countQuery = countQuery.where(ilike(xPropertiesTransactions.property_transaction_type, `%${searchName.trim()}%`));
      }
      
      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xPropertiesTransactions.status, searchStatus));
        countQuery = countQuery.where(eq(xPropertiesTransactions.status, searchStatus));
      }

      const sortField = xPropertiesTransactions[sortBy] || xPropertiesTransactions.property_transaction_id;
      const data = await query
        .limit(limit)
        .offset(offset)
        .orderBy(sortOrder === 'asc' ? asc(sortField) : desc(sortField));

      const totalRecordsResult = await countQuery;
      const totalRecords = totalRecordsResult[0].count;
      const totalPages = Math.ceil(totalRecords / limit);

      return {
        data,
        currentPage: page,
        totalPages,
        totalRecords,
      };
    } catch (error) {
      console.error('Error fetching property transactions:', error);
      throw error;
    }
  });

export const createxPropertyTransaction = os.handler(async ({ input = {} }) => {
  const [result] = await db.insert(xPropertiesTransactions).values({
    property_transaction_type: input.property_transaction_type,
    status: input.status !== undefined ? input.status : true
  }).returning();
  return result;
});

export const updatexPropertyTransaction = os.handler(async ({ input = {} }) => {
  const [result] = await db.update(xPropertiesTransactions).set(input).where(eq(xPropertiesTransactions.property_transaction_id, input.property_transaction_id)).returning();
  return result;
});

export const deletexPropertyTransaction = os.handler(async ({ input = {} }) => {
  await db.delete(xPropertiesTransactions).where(eq(xPropertiesTransactions.property_transaction_id, input.property_transaction_id));
  return { success: true };
});

export const getxPropertyTransactionById = os.handler(async ({ input = {} }) => {
  const [result] = await db.select({
    property_transaction_id: xPropertiesTransactions.property_transaction_id,
    property_transaction_type: xPropertiesTransactions.property_transaction_type,
    status: xPropertiesTransactions.status,
    createdAt: xPropertiesTransactions.createdAt
  }).from(xPropertiesTransactions).where(eq(xPropertiesTransactions.property_transaction_id, input.property_transaction_id));
  return result;
});

export const updatexPropertyTransactionStatus = os
    .handler(async ({ input = {} }) => {
    try {
      const { property_transaction_id, status } = input;
      
      if (!property_transaction_id) {
        throw new Error('property_transaction_id is required');
      }
      if (status === undefined) {
        throw new Error('status is required');
      }
      
      const [result] = await db.update(xPropertiesTransactions).set({ status }).where(eq(xPropertiesTransactions.property_transaction_id, property_transaction_id)).returning();
      return result;
    } catch (error) {
      console.error('Update status error:', error);
      throw new Error(`Failed to update status: ${error.message}`);
    }
  });