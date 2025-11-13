import { os } from '@orpc/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { db } from '../db';
import { users } from '../models/users.model';
import { eq, asc, desc, like, count, and, not } from 'drizzle-orm';


export const getUsers = os
  .handler(async ({ input = {} }) => {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search = "" } = input;
      const offset = (page - 1) * limit;
      
      const whereConditions = [not(eq(users.isDeleted, true))];

      if (search) {
        whereConditions.push(like(users.first_name, `%${search}%`));
      }

      const query = db.select().from(users).where(and(...whereConditions));
      const countQuery = db.select({ count: count(users.user_id) }).from(users).where(and(...whereConditions));

      const sortField = users[sortBy];
      const [data, totalRecordsResult] = await Promise.all([
        query.limit(limit).offset(offset).orderBy(sortOrder === 'asc' ? asc(sortField) : desc(sortField)),
        countQuery
      ]);
      const totalRecords = totalRecordsResult[0].count;

      return { data, currentPage: page, totalPages: Math.ceil(totalRecords / limit), totalRecords };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  });

   export const fetchAllUsers = os
    .handler(async () => {
      try {
        const data = await db.select({user_id: users.user_id, first_name: users.first_name,last_name: users.last_name})
          .from(users)
           return { data };
      } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
      }
    });


export const createUsers = os
  .input(z.any())
  .handler(async ({ input={} }) => {
    try {
      const schema = z.object({
        business_id: z.number( "Business ID is required" ),
        user_role: z.number("User role is required" ).min(1, "Invalid User Role"),
        first_name: z.string("First name is required" ).min(2, "First name must be at least 2 characters").max(100, "First name cannot exceed 100 characters"),
        last_name: z.string("Last name is required").max(100, "Last name cannot exceed 100 characters").optional(),
        mobile_1: z.string( "Mobile number is required" ).min(10, "Mobile number must be at least 10 digits").max(15, "Mobile number cannot exceed 15 digits"),
        email: z.string().email("Invalid email address").optional(),
        password: z.string( "Password is required" ).min(6, "Password must be at least 6 characters").max(100, "Password cannot exceed 100 characters"),
        add_by: z.number( "Creator ID is required" ),
      });

      const validation = schema.safeParse(input);
      if (!validation.success) {
        return { success: false, errors: validation.error.message };
      }

      const { business_id, first_name, last_name, mobile_1, password, add_by, user_role, email } = validation.data;

      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = {
        business_id,
        user_role,
        first_name,
        last_name,
        mobile_1,
        password: hashedPassword,
        add_by,
        email,
        broker_id: (validation.data as any).broker_id,
      };
      const [result] = await db.insert(users).values(userData).returning();
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  });

export const updateUsers = os
  .input(z.any())
  .handler(async ({ input }) => { // Added zod validation
    try {
      const { user_id, ...updateData } = input;
      const errors: string[] = [];

      if (!user_id || typeof user_id !== 'number' || user_id < 1) {
        errors.push('A valid user_id is required.');
      }
      if (updateData.mobile_1 && (typeof updateData.mobile_1 !== 'string' || updateData.mobile_1.length < 10)) {
        errors.push('mobile_1 must be at least 10 digits.');
      }
      if (updateData.email && (typeof updateData.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email))) {
        errors.push('A valid email is required.');
      }

      if (errors.length > 0) {
        return { success: false, errors };
      }

      const updatePayload = { ...updateData };
      if (updatePayload.password) {
        if (typeof updatePayload.password !== 'string' || updatePayload.password.length < 6) {
          errors.push('password must be at least 6 characters.');
        } else {
          updatePayload.password = await bcrypt.hash(updatePayload.password, 10);
        }
      }

      if (errors.length > 0) return { success: false, errors };
      const [result] = await db.update(users).set(updatePayload).where(eq(users.user_id, user_id)).returning();
      return result;
    } catch (error) {
      console.error(`Error updating user with ID ${input.user_id}:`, error);
      throw error;
    }
  });

export const deleteUsers = os
  .input(z.any())
  .handler(async ({ input }) => { // Added zod validation
    try {
      const { user_id } = input;
      if (!user_id || typeof user_id !== 'number' || user_id < 1) {
        return { success: false, errors: ['A valid user_id is required.'] };
      }

      await db.update(users).set({ isDeleted: true }).where(eq(users.user_id, user_id));
      return { success: true };
    } catch (error) {
      console.error(`Error deleting user with ID ${input.user_id}:`, error);
      throw error;
    }
  });