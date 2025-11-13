import { os } from '@orpc/server';
import { db } from '../db';
import { xNotesTypes } from '../models/x-notes-types.model';
import { eq, asc, desc, ilike, count } from 'drizzle-orm';

export const getxNotesTypes = os
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
        note_type_id: xNotesTypes.note_type_id,
        note_type_name: xNotesTypes.note_type_name,
        status: xNotesTypes.status,
        createdAt: xNotesTypes.createdAt,
        updatedAt: xNotesTypes.updatedAt
      }).from(xNotesTypes).$dynamic();
      let countQuery = db.select({ count: count(xNotesTypes.note_type_id) }).from(xNotesTypes).$dynamic();

      if (searchName) {
        query = query.where(ilike(xNotesTypes.note_type_name, `%${searchName}%`));
        countQuery = countQuery.where(ilike(xNotesTypes.note_type_name, `%${searchName}%`));
      }

      if (searchStatus !== undefined && searchStatus !== "" && typeof searchStatus === 'boolean') {
        query = query.where(eq(xNotesTypes.status, searchStatus));
        countQuery = countQuery.where(eq(xNotesTypes.status, searchStatus));
      }

      const sortField = xNotesTypes[sortBy] || xNotesTypes.createdAt;
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
      console.error('Error fetching note types:', error);
      throw error;
    }
  });

export const createxNoteType = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.insert(xNotesTypes).values({
        note_type_name: input.note_type_name,
        status: input.status !== undefined ? input.status : true
      }).returning();
      return result;
    } catch (error) {
      console.error('Error creating note type:', error);
      throw error;
    }
  });

export const updatexNoteType = os
  .handler(async ({ input = {} }) => {
    try {
      const { note_type_id, ...updateData } = input;
      const [result] = await db.update(xNotesTypes)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(xNotesTypes.note_type_id, note_type_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating note type:', error);
      throw error;
    }
  });

export const deletexNoteType = os
  .handler(async ({ input = {} }) => {
    try {
      await db.delete(xNotesTypes).where(eq(xNotesTypes.note_type_id, input.note_type_id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting note type:', error);
      throw error;
    }
  });

export const getxNoteTypeById = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.select({
        note_type_id: xNotesTypes.note_type_id,
        note_type_name: xNotesTypes.note_type_name,
        status: xNotesTypes.status,
        createdAt: xNotesTypes.createdAt,
        updatedAt: xNotesTypes.updatedAt
      }).from(xNotesTypes).where(eq(xNotesTypes.note_type_id, input.note_type_id));
      return result;
    } catch (error) {
      console.error('Error fetching note type by ID:', error);
      throw error;
    }
  });

export const updatexNoteTypeStatus = os
  .handler(async ({ input = {} }) => {
    try {
      const [result] = await db.update(xNotesTypes)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(xNotesTypes.note_type_id, input.note_type_id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error updating note type status:', error);
      throw error;
    }
  });