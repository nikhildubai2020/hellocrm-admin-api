import { os } from '@orpc/server';
import { z } from 'zod';
import { db } from '../db';
import { business } from '../models/business.model';
import { eq, asc, desc, like, count, and, not } from 'drizzle-orm';

const getSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.enum(['createdAt', 'business_name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  searchField: z.enum(['business_name']).optional(),
  search: z.string().optional()
});

const createSchema = z.object({
  business_name: z.string().min(1).max(255),
  business_type: z.string().max(100).optional(),
  business_gst: z.string().max(20).optional(),
  address_line_1: z.string().max(255).optional(),
  address_line_2: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.number().optional(),
  zip: z.string().max(10).optional(),
  owner_name: z.string().max(100).optional(),
  contact_number: z.string().max(20).optional(),
  email_address: z.string().email().max(100).optional(),
  website_url: z.string().url().max(255).optional(),
  timezone: z.string().max(50).optional()
});

const updateSchema = z.object({
  business_id: z.number().min(1),
  business_name: z.string().min(1).max(255).optional(),
  business_type: z.string().max(100).optional(),
  business_gst: z.string().max(20).optional(),
  address_line_1: z.string().max(255).optional(),
  address_line_2: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.number().optional(),
  zip: z.string().max(10).optional(),
  owner_name: z.string().max(100).optional(),
  contact_number: z.string().max(20).optional(),
  email_address: z.string().email().max(100).optional(),
  website_url: z.string().url().max(255).optional(),
  timezone: z.string().max(50).optional()
});

const deleteSchema = z.object({
  business_id: z.number().min(1)
});

export const getBusiness = os
  .handler(async ({ input = {} }) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'business_id',
        sortOrder = 'desc',
        searchName = "",
        searchStatus = true,
      } = input;
      const offset = (page - 1) * limit;

      const whereConditions = [not(eq(business.isDeleted, true))];

      if (searchName && searchName.trim() !== "") {
        whereConditions.push(like(business.business_name, `%${searchName.trim()}%`));
      }

      if (searchStatus !== undefined && typeof searchStatus === 'boolean') {
        whereConditions.push(eq(business.status, searchStatus));
      }

      const query = db.select().from(business).where(and(...whereConditions));
      const countQuery = db.select({ count: count(business.business_id) }).from(business).where(and(...whereConditions));

      const sortField = business[sortBy] || business.business_id;
      const [data, totalRecordsResult] = await Promise.all([
        query.limit(limit).offset(offset).orderBy(sortOrder === 'asc' ? asc(sortField) : desc(sortField)),
        countQuery
      ]);
      const totalRecords = totalRecordsResult[0].count;
      const totalPages = Math.ceil(totalRecords / limit);

      return { data, currentPage: page, totalPages, totalRecords };
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw error;
    }
  });

  export const fetchAllBusiness = os
  .handler(async () => {
    try {
      const data = await db.select({business_id: business.business_id, business_name: business.business_name})
        .from(business)
         return { data };
    } catch (error) {
      console.error('Error fetching all businesses:', error);
      throw error;
    }
  });

export const createBusiness = os
  .input(createSchema)
  .output(z.object({
    business_id: z.number(),
    business_name: z.string(),
    business_type: z.string().optional(),
    createdAt: z.string()
  }))
  .handler(async ({ input }) => {
    try {
      const [result] = await db.insert(business).values(input).returning();
      return result;
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  });

export const updateBusiness = os
  .input(updateSchema)
  .output(z.object({
    business_id: z.number(),
    business_name: z.string().optional(),
    updatedAt: z.string().optional()
  }))
  .handler(async ({ input }) => {
    try {
      const { business_id, ...updateData } = input;
      const [result] = await db.update(business).set(updateData).where(eq(business.business_id, business_id)).returning();
      return result;
    } catch (error) {
      console.error(`Error updating business with ID ${input.business_id}:`, error);
      throw error;
    }
  });

export const deleteBusiness = os
  .input(deleteSchema)
  .output(z.object({
    success: z.boolean()
  }))
  .handler(async ({ input }) => {
    try {
      await db.update(business).set({ isDeleted: true, status: false }).where(eq(business.business_id, input.business_id));
      return { success: true };
    } catch (error) {
      console.error(`Error deleting business with ID ${input.business_id}:`, error);
      throw error;
    }
  });