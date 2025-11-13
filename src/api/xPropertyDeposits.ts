import { os } from '@orpc/server';
import { db } from '../db';
import { xPropertiesDeposits } from '../models/x-properties.model';
import { business } from '../models/business.model';
import { users } from '../models/users.model';
import { eq, asc, desc, ilike, count } from 'drizzle-orm';

export const getxPropertyDeposits = os
  .handler(async ({ input = {} }) => {
    try {
      const page = Number(input.page) || 1;
      const limit = Number(input.limit) || 10;
      const sortBy = input.sortBy || 'property_deposit_id';
      const sortOrder = input.sortOrder || 'desc';
      const searchName = input.searchName || "";
      let searchStatus = input.searchStatus;
      if (searchStatus === 'true') searchStatus = true;
      else if (searchStatus === 'false') searchStatus = false;

      const offset = (page - 1) * limit;

      let query = db.select({
        property_deposit_id: xPropertiesDeposits.property_deposit_id,
        property_deposit_name: xPropertiesDeposits.property_deposit_name,
        business_id: xPropertiesDeposits.business_id,
        user_id: xPropertiesDeposits.user_id,
        business_name: business.business_name,
        user_name: users.userName,
        status: xPropertiesDeposits.status,
        createdAt: xPropertiesDeposits.createdAt,
      }).from(xPropertiesDeposits)
      .leftJoin(business, eq(xPropertiesDeposits.business_id, business.business_id))
      .leftJoin(users, eq(xPropertiesDeposits.user_id, users.user_id)).$dynamic();
      
      let countQuery = db.select({ count: count(xPropertiesDeposits.property_deposit_id) }).from(xPropertiesDeposits).$dynamic();

      if (searchName && searchName.trim() !== "") {
        query = query.where(ilike(xPropertiesDeposits.property_deposit_name, `%${searchName.trim()}%`));
        countQuery = countQuery.where(ilike(xPropertiesDeposits.property_deposit_name, `%${searchName.trim()}%`));
      }
      
      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xPropertiesDeposits.status, searchStatus));
        countQuery = countQuery.where(eq(xPropertiesDeposits.status, searchStatus));
      }

      const sortField = xPropertiesDeposits[sortBy] || xPropertiesDeposits.property_deposit_id;
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
      console.error('Error fetching property deposits:', error);
      throw error;
    }
  });

export const createxPropertyDeposit = os.handler(async ({ input = {} }) => {
  const [result] = await db.insert(xPropertiesDeposits).values({
    business_id: input.business_id,
    property_deposit_name: input.property_deposit_name
  }).returning();
  return result;
});

export const updatexPropertyDeposit = os.handler(async ({ input = {} }) => {
  const [result] = await db.update(xPropertiesDeposits).set(input).where(eq(xPropertiesDeposits.property_deposit_id, input.property_deposit_id)).returning();
  return result;
});

export const deletexPropertyDeposit = os.handler(async ({ input = {} }) => {
  await db.delete(xPropertiesDeposits).where(eq(xPropertiesDeposits.property_deposit_id, input.property_deposit_id));
  return { success: true };
});

export const getxPropertyDepositById = os.handler(async ({ input = {} }) => {
  const [result] = await db.select({
    property_deposit_id: xPropertiesDeposits.property_deposit_id,
    property_deposit_name: xPropertiesDeposits.property_deposit_name,
    business_id: xPropertiesDeposits.business_id,
    user_id: xPropertiesDeposits.user_id,
    business_name: business.business_name,
    user_name: users.userName,
    status: xPropertiesDeposits.status,
    createdAt: xPropertiesDeposits.createdAt,
    updatedAt: xPropertiesDeposits.updatedAt
  }).from(xPropertiesDeposits)
  .leftJoin(business, eq(xPropertiesDeposits.business_id, business.business_id))
  .leftJoin(users, eq(xPropertiesDeposits.user_id, users.user_id))
  .where(eq(xPropertiesDeposits.property_deposit_id, input.property_deposit_id));
  return result;
});

export const updatexPropertyDepositStatus = os
    .handler(async ({ input = {} }) => {
    try {
      const { property_deposit_id, status } = input;
      
      if (!property_deposit_id) {
        throw new Error('property_deposit_id is required');
      }
      if (status === undefined) {
        throw new Error('status is required');
      }
      
      const [result] = await db.update(xPropertiesDeposits).set({ status }).where(eq(xPropertiesDeposits.property_deposit_id, property_deposit_id)).returning();
      return result;
    } catch (error) {
      console.error('Update status error:', error);
      throw new Error(`Failed to update status: ${error.message}`);
    }
  });