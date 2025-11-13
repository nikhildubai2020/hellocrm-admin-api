import { os } from '@orpc/server';
import { db } from '../db';
import { plansAddons } from '../models/plans-addons.model';
import { eq, asc, desc, count } from 'drizzle-orm';

export const getPlansAddons = os.handler(async ({ input = {} }) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'plans_addon_id',
      sortOrder = 'desc'
    } = input as any;
    const offset = (page - 1) * limit;

    const data = await db.select().from(plansAddons)
      .limit(limit)
      .offset(offset)
      .orderBy(sortOrder === 'asc' ? asc(plansAddons.plans_addon_id) : desc(plansAddons.plans_addon_id));

    const totalRecordsResult = await db.select({ count: count(plansAddons.plans_addon_id) }).from(plansAddons);
    const totalRecords = totalRecordsResult[0].count;
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data,
      currentPage: page,
      totalPages,
      totalRecords,
    };
  } catch (error) {
    console.error('Error fetching plans addons:', error);
    throw error;
  }
});

export const createPlansAddon = os.handler(async ({ input = {} }) => {
  try {
    const {
      paid,
      value,
      description,
      price,
      duration,
      status = true
    } = input as any;

    if (typeof paid !== 'boolean') throw new Error("'paid' is required and must be a boolean");
    if (!value || typeof value !== 'string') throw new Error("Value is required");
    if (typeof price !== 'number' || price <= 0) throw new Error("Price must be a positive number");
    if (typeof duration !== 'number' || !Number.isInteger(duration) || duration <= 0) {
      throw new Error("Duration must be a positive integer");
    }

    const [result] = await db.insert(plansAddons).values({
      paid, value, description, price, duration, status,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return result;
  } catch (error) {
    console.error('Error creating plans addon:', error);
    throw error;
  }
});

export const updatePlansAddon = os.handler(async ({ input = {} }) => {
  try {
    const { plans_addon_id, ...updateData } = input as any;
    if (!plans_addon_id || typeof plans_addon_id !== 'number') {
      throw new Error("A valid plans_addon_id is required");
    }

    const [result] = await db.update(plansAddons)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(plansAddons.plans_addon_id, plans_addon_id))
      .returning();
    return result;
  } catch (error) {
    console.error('Error updating plans addon:', error);
    throw error;
  }
});

export const deletePlansAddon = os.handler(async ({ input = {} }) => {
  try {
    const { plans_addon_id } = input as any;
    if (!plans_addon_id || typeof plans_addon_id !== 'number') {
      throw new Error("A valid ID is required");
    }

    await db.delete(plansAddons).where(eq(plansAddons.plans_addon_id, plans_addon_id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting plans addon:', error);
    throw error;
  }
});

export const getPlansAddonById = os.handler(async ({ input = {} }) => {
  try {
    const { plans_addon_id } = input as any;
    if (!plans_addon_id || typeof plans_addon_id !== 'number') {
      throw new Error("A valid ID is required");
    }

    const [result] = await db.select().from(plansAddons).where(eq(plansAddons.plans_addon_id, plans_addon_id));
    return result;
  } catch (error) {
    console.error('Error fetching plans addon by ID:', error);
    throw error;
  }
});

export const updatePlansAddonStatus = os.handler(async ({ input = {} }) => {
  try {
    const { plans_addon_id, status } = input as any;
    if (!plans_addon_id || typeof plans_addon_id !== 'number') {
      throw new Error("A valid plans_addon_id is required");
    }
    if (typeof status !== 'boolean') {
      throw new Error("Status must be a boolean value (true or false)");
    }

    const [result] = await db.update(plansAddons)
      .set({ status: status, updatedAt: new Date() })
      .where(eq(plansAddons.plans_addon_id, plans_addon_id))
      .returning();
    return result;
  } catch (error) {
    console.error('Error updating plans addon status:', error);
    throw error;
  }
});

export const getAllPlansAddons = os.handler(async ({ input = {} }) => {
  try {
    const data = await db.select({
      plans_addon_id: plansAddons.plans_addon_id,
      paid: plansAddons.paid,
      value: plansAddons.value,
      description: plansAddons.description,
      price: plansAddons.price,
      duration: plansAddons.duration
    }).from(plansAddons)
    .where(eq(plansAddons.status, true));
    
    return data;
  } catch (error) {
    console.error('Error fetching all plans addons:', error);
    throw error;
  }
});