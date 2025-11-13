import { os } from '@orpc/server';
import { db } from '../db';
import { xOffersTags } from '../models/x-offers-tags.model';
import { users } from '../models/users.model';
import { business } from '../models/business.model';
import { eq, asc, desc, ilike, count } from 'drizzle-orm';

export const getxOffersTags = os
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

      let query = db.select({
        property_tag_id: xOffersTags.property_tag_id,
        property_tag_name: xOffersTags.property_tag_name,
        user_id: xOffersTags.user_id,
        business_id: xOffersTags.business_id,
        status: xOffersTags.status,
        createdAt: xOffersTags.createdAt,
        updatedAt: xOffersTags.updatedAt,
        user_name: users.userName,
        business_name: business.business_name
      }).from(xOffersTags)
      .leftJoin(users, eq(xOffersTags.user_id, users.user_id))
      .leftJoin(business, eq(xOffersTags.business_id, business.business_id))
      .$dynamic();
      let countQuery = db.select({ count: count(xOffersTags.property_tag_id) }).from(xOffersTags).$dynamic();

      if (searchName) {
        query = query.where(ilike(xOffersTags.property_tag_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xOffersTags.property_tag_name, `%${searchName}%`));
      }

      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xOffersTags.status, searchStatus));
        countQuery = countQuery.where(eq(xOffersTags.status, searchStatus));
      }

      const sortField = xOffersTags[sortBy] || xOffersTags.createdAt;
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
      console.error('Error fetching offer tags:', error);
      throw error;
    }
  });

export const createxOffersTags = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xOffersTags).values({
        property_tag_name: input.property_tag_name,
        business_id: input.business_id,
        user_id: input.user_id || 0,
        status: input.status !== undefined ? input.status : true
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating offer tag:', error);
      throw error;
    }
  });

export const updatexOffersTags = os
  .handler(async ({ input = {} }) => {
    try {
      console.log(input);
      const { property_tag_id, property_tag_name, status, user_id, business_id } = input;
      if (!property_tag_id) {
        throw new Error('property_tag_id is required for an update');
      }

      const updateData: { [key: string]: any } = { updatedAt: new Date() };

      if (property_tag_name !== undefined)
        updateData.property_tag_name = property_tag_name;
      if (status !== undefined)
        updateData.status = status;
      if (user_id !== undefined)
        updateData.user_id = user_id;
      if (business_id !== undefined)
        updateData.business_id = business_id;

      const [result] = await db.update(xOffersTags)
        .set(updateData)
        .where(eq(xOffersTags.property_tag_id, property_tag_id))
        .returning();

      return result;
    } catch (error) {
      console.error('Error updating offer tag:', error);
      throw error;
    }
  });

export const deletexOffersTags = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xOffersTags).where(eq(xOffersTags.property_tag_id, input.property_tag_id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting offer tag:', error);
      throw error;
    }
  });

export const getxOffersTagsById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select({
        property_tag_id: xOffersTags.property_tag_id,
        property_tag_name: xOffersTags.property_tag_name,
        user_id: xOffersTags.user_id,
        business_id: xOffersTags.business_id,
        status: xOffersTags.status,
        createdAt: xOffersTags.createdAt,
        updatedAt: xOffersTags.updatedAt,
        user_name: users.userName,
        business_name: business.business_name
      }).from(xOffersTags)
      .leftJoin(users, eq(xOffersTags.user_id, users.user_id))
      .leftJoin(business, eq(xOffersTags.business_id, business.business_id))
      .where(eq(xOffersTags.property_tag_id, input.property_tag_id));
      return result;
    } catch (error) {
      console.error('Error fetching offer tag by ID:', error);
      throw error;
    }
  });

export const updatexOffersTagsStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const { property_tag_id, status } = input;
      if (!property_tag_id) {
        throw new Error('property_tag_id is required');
      }
      if (status === undefined) {
        throw new Error('status is required');
      }
      const [result] = await db.update(xOffersTags)
        .set({ status: status, updatedAt: new Date() })
        .where(eq(xOffersTags.property_tag_id, property_tag_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating offer tag status:', error);
      throw error;
    }
  });