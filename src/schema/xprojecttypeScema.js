"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getxprojectTypesSchema = exports.updatexprojectTypesSchema = exports.createxprojectTypesSchema = void 0;
const z = __importStar(require("zod"));
exports.createxprojectTypesSchema = z.object({
    body: z.object({
        project_type_parent_id: z.number().default(0).optional(),
        project_type_name: z.string().max(50),
        project_type_description: z.string(),
        status: z.boolean().default(true).optional(),
    }),
});
exports.updatexprojectTypesSchema = z.object({
    project_type_id: z.number(),
    project_type_parent_id: z.number().optional(),
    project_type_name: z.string().max(50).optional(),
    project_type_description: z.string().optional(),
    status: z.boolean().optional(),
});
exports.getxprojectTypesSchema = z.object({
    page: z.number().default(1).optional(),
    limit: z.number().default(10).optional(),
    sortBy: z.enum(['project_type_id', 'project_type_name', 'project_type_parent_id', 'status', 'createdAt', 'updatedAt']).default('createdAt').optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
    searchField: z.enum(['project_type_name']).optional(),
    search: z.string().optional(),
    project_type_parent_id: z.number().optional(),
    status: z.boolean().optional(),
}).optional();
