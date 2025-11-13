import { os } from '@orpc/server';
import { db } from '../db';
import { xPlanAddOns } from '../models/x-plan-addons.model';
import { eq, asc, desc, ilike, count, and } from 'drizzle-orm';

export const getxPlanAddons = os
    .handler(async ({ input = {} }) => {
        try {
            const {
                page = 1,
                limit = 10,
                sortBy = 'plan_addons_id',
                sortOrder = 'desc',
                searchName = '',
                status = 'all'
            } = input as any;
            const offset = (page - 1) * limit;

            const whereConditions = [];

            if (searchName && searchName.trim() !== "") {
                whereConditions.push(ilike(xPlanAddOns.plan_addons_name, `%${searchName.trim()}%`));
            }

            if (status !== "all") {
                const statusValue = status === "true" || status === true;
                whereConditions.push(eq(xPlanAddOns.is_active, statusValue));
            }

            const query = db.select().from(xPlanAddOns)
                .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

            const countQuery = db.select({ count: count(xPlanAddOns.plan_addons_id) }).from(xPlanAddOns)
                .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

            // Map sortBy string to actual Drizzle column object
            const sortableColumns = {
                plan_addons_id: xPlanAddOns.plan_addons_id,
                plan_addons_name: xPlanAddOns.plan_addons_name,
                plan_addons_value: xPlanAddOns.plan_addons_value,
                plan_addons_price: xPlanAddOns.plan_addons_price,
                plan_addons_channel: xPlanAddOns.plan_addons_channel,
                unit: xPlanAddOns.unit,
                is_active: xPlanAddOns.is_active,
                createdAt: xPlanAddOns.createdAt,
                updatedAt: xPlanAddOns.updatedAt,
            };
            const sortField = sortableColumns[sortBy];

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
            console.error('Error fetching x plan addons:', error);
            throw error;
        }
    });

export const createxPlanAddon = os
    .handler(async ({ input = {} }) => {
        try {
            const {
                plan_addons_name,
                plan_addons_value,
                plan_addons_price,
                plan_addons_channel,
                unit = 'message',
                is_active = true
            } = input as any;

            if (!plan_addons_name) throw new Error("Name is required");
            if (typeof plan_addons_value !== 'number' || plan_addons_value <= 0) throw new Error("Value must be a positive number");
            if (typeof plan_addons_price !== 'number' || plan_addons_price <= 0) throw new Error("Price must be a positive number");
            if (!plan_addons_channel) throw new Error("Channel is required");

            const [result] = await db.insert(xPlanAddOns).values({
                plan_addons_name, plan_addons_value, plan_addons_price, plan_addons_channel, unit, is_active,
                createdAt: new Date(),
            }).returning();
            return result;
        } catch (error) {
            console.error('Error creating x plan addon:', error);
            throw error;
        }
    });

export const updatexPlanAddon = os.handler(async ({ input = {} }) => {
    try {
        const { plan_addons_id, ...updateData } = input as any;
        if (!plan_addons_id || typeof plan_addons_id !== 'number') {
            throw new Error("A valid plan_addons_id is required");
        }
        const [result] = await db.update(xPlanAddOns)
            .set({ ...updateData, updatedAt: new Date() })
            .where(eq(xPlanAddOns.plan_addons_id, plan_addons_id))
            .returning();
        return result;
    } catch (error) {
        console.error('Error updating x plan addon:', error);
        throw error;
    }
});

export const deletexPlanAddon = os.handler(async ({ input = {} }) => {
    try {
        const { plan_addons_id } = input as any;
        if (!plan_addons_id || typeof plan_addons_id !== 'number') {
            throw new Error("A valid ID is required");
        }
        await db.delete(xPlanAddOns).where(eq(xPlanAddOns.plan_addons_id, plan_addons_id));
        return { success: true };
    } catch (error) {
        console.error('Error deleting x plan addon:', error);
        throw error;
    }
});

export const getxPlanAddonById = os.handler(async ({ input = {} }) => {
    try {
        const { plan_addons_id } = input as any;
        if (!plan_addons_id || typeof plan_addons_id !== 'number') {
            throw new Error("A valid ID is required");
        }
        const [result] = await db.select().from(xPlanAddOns).where(eq(xPlanAddOns.plan_addons_id, plan_addons_id));
        return result;
    } catch (error) {
        console.error('Error fetching x plan addon by ID:', error);
        throw error;
    }
});

export const updatexPlanAddonStatus = os.handler(async ({ input = {} }) => {
    try {
        const { plan_addons_id, status } = input as any;
        if (!plan_addons_id || typeof plan_addons_id !== 'number') {
            throw new Error("A valid plan_addons_id is required");
        }
        if (typeof status !== 'boolean') {
            throw new Error("Status must be a boolean value (true or false)");
        }
        const [result] = await db.update(xPlanAddOns)
            .set({ is_active: status, updatedAt: new Date() })
            .where(eq(xPlanAddOns.plan_addons_id, plan_addons_id))
            .returning();
        return result;
    } catch (error) {
        console.error('Error updating x plan addon status:', error);
        throw error;
    }
});

export const getAllxPlanAddons = os.handler(async ({ input = {} }) => {
    try {
        const data = await db.select({
            plan_addons_id: xPlanAddOns.plan_addons_id,
            plan_addons_name: xPlanAddOns.plan_addons_name
        }).from(xPlanAddOns)
            .where(eq(xPlanAddOns.is_active, true));

        return data;
    } catch (error) {
        console.error('Error fetching all x plan addons:', error);
        throw error;
    }
});