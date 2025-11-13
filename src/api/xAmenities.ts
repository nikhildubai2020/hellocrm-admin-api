import { os } from '@orpc/server';
import { db } from '../db';
import { xAmenities } from '../models/x-amenities.model';
import { users } from '../models/users.model';
import { xAmenitiesTypes } from '../models/x-amenity-types';
import { business } from '../models/business.model';
import { eq, asc, desc, ilike, count } from 'drizzle-orm';

export const getxAmenities = os
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
        amenity_id: xAmenities.amenity_id,
        amenity_name: xAmenities.amenity_name,
        amenity_type_id: xAmenities.amenity_type_id,
        business_id: xAmenities.business_id,
        user_id: xAmenities.user_id,
        order: xAmenities.order,
        status: xAmenities.status,
        createdAt: xAmenities.createdAt,
        updatedAt: xAmenities.updatedAt,
        amenity_type_name: xAmenitiesTypes.amenity_type_name,
        user_name: users.userName,
        business_name: business.business_name
      }).from(xAmenities)
      .leftJoin(users, eq(xAmenities.user_id, users.user_id))
      .leftJoin(xAmenitiesTypes, eq(xAmenities.amenity_type_id, xAmenitiesTypes.amenity_type_id))
      .leftJoin(business, eq(xAmenities.business_id, business.business_id))
      .$dynamic();
      let countQuery = db.select({ count: count(xAmenities.amenity_id) }).from(xAmenities).$dynamic();

      if (searchName) {
        query = query.where(ilike(xAmenities.amenity_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xAmenities.amenity_name, `%${searchName}%`));
      }

      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xAmenities.status, searchStatus));
        countQuery = countQuery.where(eq(xAmenities.status, searchStatus));
      }

      const sortField = xAmenities[sortBy] || xAmenities.createdAt;
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
      console.error('Error fetching amenities:', error);
      throw error;
    }
  });

export const createxAmenity = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xAmenities).values({
        amenity_name: input.amenity_name,
        amenity_type_id: input.amenity_type_id,
        business_id: input.business_id,
        user_id: input.user_id || 0,
        order: input.order,
        status: input.status !== undefined ? input.status : true
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating amenity:', error);
      throw error;
    }
  });

export const updatexAmenity = os
  .handler(async ({ input = {} }) => {
    try {
      const { amenity_id, ...updateData } = input;
      const [result] = await db.update(xAmenities)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(xAmenities.amenity_id, amenity_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating amenity:', error);
      throw error;
    }
  });

export const deletexAmenity = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xAmenities).where(eq(xAmenities.amenity_id, input.amenity_id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting amenity:', error);
      throw error;
    }
  });

export const getxAmenityById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select({
        amenity_id: xAmenities.amenity_id,
        amenity_name: xAmenities.amenity_name,
        amenity_type_id: xAmenities.amenity_type_id,
        business_id: xAmenities.business_id,
        user_id: xAmenities.user_id,
        order: xAmenities.order,
        status: xAmenities.status,
        createdAt: xAmenities.createdAt,
        updatedAt: xAmenities.updatedAt,
        amenity_type_name: xAmenitiesTypes.amenity_type_name,
        user_name: users.userName,
        business_name: business.business_name
      }).from(xAmenities)
      .leftJoin(users, eq(xAmenities.user_id, users.user_id))
      .leftJoin(xAmenitiesTypes, eq(xAmenities.amenity_type_id, xAmenitiesTypes.amenity_type_id))
      .leftJoin(business, eq(xAmenities.business_id, business.business_id))
      .where(eq(xAmenities.amenity_id, input.amenity_id));
      return result;
    } catch (error) {
      console.error('Error fetching amenity by ID:', error);
      throw error;
    }
  });

export const updatexAmenityStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.update(xAmenities)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(xAmenities.amenity_id, input.amenity_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating amenity status:', error);
      throw error;
    }
  });