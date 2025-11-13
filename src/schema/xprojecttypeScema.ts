 import * as z from 'zod';
 
 export const createxprojectTypesSchema = z.object({
  body: z.object({
    project_type_parent_id: z.number().default(0).optional(),
    project_type_name: z.string().max(50),
    project_type_description: z.string(),
    status: z.boolean().default(true).optional(),
  }),
 });

export const updatexprojectTypesSchema = z.object({
  project_type_id: z.number(),
  project_type_parent_id: z.number().optional(),
  project_type_name: z.string().max(50).optional(),
  project_type_description: z.string().optional(),
  status: z.boolean().optional(),
});

export const getxprojectTypesSchema = z.object({
  page: z.number().default(1).optional(),
  limit: z.number().default(10).optional(),
  sortBy: z.enum(['project_type_id', 'project_type_name', 'project_type_parent_id', 'status', 'createdAt', 'updatedAt']).default('createdAt').optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
  searchField: z.enum(['project_type_name']).optional(),
  search: z.string().optional(),
  project_type_parent_id: z.number().optional(),
  status: z.boolean().optional(),
}).optional();