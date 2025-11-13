import { getxprojectTypes, createxprojectType, updatexProjectTypes, deletexProjectTypes, updatexProjectTypesStatus, getAllParentxproject } from './xProjectTypes';
import { getxAddCities, createxAddCities, updatexAddCities, deletexAddCities, updatexAddCitiesStatus } from './xAddCities';
import { getxAddLocalities, createxAddLocalities, updatexAddLocalities, deletexAddLocalities, updatexAddLocalitiesStatus } from './xAddLocalities';
import { getxAddNearbys, createxAddNearbys, updatexAddNearbys, deletexAddNearbys, updatexAddNearbysStatus } from './xAddNearbys';
import { getxAddStates, createxAddStates, updatexAddStates, deletexAddStates, updatexAddStatesStatus } from './xAddStates';
import { getxAmenities, createxAmenity, updatexAmenity, deletexAmenity, updatexAmenityStatus } from './xAmenities';
import { getxCdrsStatus, createxCdrsStatus, updatexCdrsStatus, deletexCdrsStatus, updatexCdrsStatusStatus } from './xCdrsStatus';
import { getxDbBackups, createxDbBackup, updatexDbBackup, deletexDbBackup, getxDbBackupById } from './xDbBackups';
import { getxHolidays, createxHoliday, updatexHoliday, deletexHoliday, getxHolidayById } from './xHolidays';
import { getxLeadsSource, createxLeadsSource, updatexLeadsSource, deletexLeadsSource, updatexLeadsSourceStatus, getxLeadsSourceById } from './xLeadsSource';
import { getxLeadsStatus, createxLeadsStatus, updatexLeadsStatus, deletexLeadsStatus, updatexLeadsStatusStatus, getxLeadsStatusById } from './xLeadsStatus';
import { getxLeadsTags, createxLeadTag, updatexLeadTag, deletexLeadTag, getxLeadTagById, updatexLeadTagStatus } from './xLeadsTags';
import { getxMediasTypes, createxMediaType, updatexMediaType, deletexMediaType, updatexMediaTypeStatus, getxMediaTypeById } from './xMediasTypes';
import { getxNotesTypes, createxNoteType, updatexNoteType, deletexNoteType, getxNoteTypeById, updatexNoteTypeStatus } from './xNotesTypes';
import { getxOffersTags, createxOffersTags, updatexOffersTags, deletexOffersTags, getxOffersTagsById, updatexOffersTagsStatus } from './xOffersTags';
import { getxPlanAddons, createxPlanAddon, updatexPlanAddon, deletexPlanAddon, getxPlanAddonById, updatexPlanAddonStatus, getAllxPlanAddons } from './xPlanAddons';
import { getxPriorities, createxPriorities, updatexPriorities, deletexPriorities, updatexPrioritiesStatus, getxPrioritiesById } from './xPriorities';
import { getxPropertyMeasurement, createxPropertyMeasurement, updatexPropertyMeasurement, deletexPropertyMeasurement, updatexPropertyMeasurementStatus, getxPropertyMeasurementById } from './xPropertyMeasurement';
import { getxSettings, createxSettings, updatexSettings, deletexSettings, updatexSettingsStatus, getxSettingsById } from './xSettings';
import { getxUsersRoles, createxUserRole, updatexUserRole, deletexUserRole, getxUserRoleById, updatexUserRoleStatus } from './xUsersRoles';
import { getxProjectBuildingTypes, getxProjectBuildingType, createxProjectBuildingType, updatexProjectBuildingType, getAllxProjectBuildingTypes, deletexProjectBuildingType, updatexProjectBuildingTypeStatus } from './xProjectBuildingTypes';
import { getxProjectHighlights, createxProjectHighlights, updatexProjectHighlights, deletexProjectHighlights } from './xProjectHighlights';
import { getxProjectAuthorities, createxProjectAuthorities, updatexProjectAuthorities, deletexProjectAuthorities, getxProjectAuthoritiesById } from './xProjectAuthorities';
import { getxPropertyConfigs, createxPropertyConfigs, updatexPropertyConfigs, deletexPropertyConfigs, getxPropertyConfigsById, updatexPropertyConfigsStatus } from './xPropertiesConfigs';
import { getxPropertyTransactions, createxPropertyTransaction, updatexPropertyTransaction, deletexPropertyTransaction } from './xPropertyTransactions';
import { getxPropertyDeposits, createxPropertyDeposit, updatexPropertyDeposit, deletexPropertyDeposit } from './xPropertyDeposits';
import { getxFurnishingTypes, createxFurnishingType, updatexFurnishingType, deletexFurnishingType,updatexFurnishingTypeStatus } from './xFurnishingTypes';
import { getxMeasurementUnits, createxMeasurementUnit, updatexMeasurementUnit, deletexMeasurementUnit } from './xMeasurementUnits';
import { getBusiness, createBusiness, updateBusiness, deleteBusiness, fetchAllBusiness } from './business';
import { getUsers, createUsers, updateUsers, deleteUsers, fetchAllUsers } from './users';
import { getxTaskTypeById, getxTaskTypes, createxTaskType, updatexTaskType, deletexTaskType, updatexTaskTypeStatus } from './xTaskTypes'
import { getxAmenitiesTypes, createxAmenityType, updatexAmenityType, deletexAmenityType, getxAmenityTypeById, updatexAmenityTypeStatus, getAllxAmenitiesTypes } from './xAmenitiesTypes'
import { getxStorageCreditPlans, createxStorageCreditPlan, updatexStorageCreditPlan, deletexStorageCreditPlan, getxStorageCreditPlanById, updatexStorageCreditPlanStatus } from './xStorageCreditPlans'
import { getxPlanFeatures, createxPlanFeature, updatexPlanFeature, deletexPlanFeature, getxPlanFeatureById, getAllxPlanFeatures } from './xPlanFeatures'
import { getPlans, createPlan, updatePlan, deletePlan, getPlanById, updatePlanStatus, getAllPlans } from './plans'
import { getPlanFeatures, createPlanFeature, updatePlanFeature, deletePlanFeature, getPlanFeatureById, getAllPlanFeatures } from './planFeatures'
import { login, verifyToken } from './auth'
import { getxPlanAddons,createxPlanAddon,updatexPlanAddon,deletexPlanAddon,getxPlanAddonById,getAllxPlanAddons} from './xPlanAddons'
import { xPlanAddons } from '../models';


export const appRouter = {
  xprojectTypes: { get: getxprojectTypes, create: createxprojectType, update: updatexProjectTypes, delete: deletexProjectTypes, updateStatus: updatexProjectTypesStatus, getParentprojects: getAllParentxproject },
  xAddCities: { get: getxAddCities, create: createxAddCities, update: updatexAddCities, delete: deletexAddCities, updateStatus: updatexAddCitiesStatus },
  xAddLocalities: { get: getxAddLocalities, create: createxAddLocalities, update: updatexAddLocalities, delete: deletexAddLocalities, updateStatus: updatexAddLocalitiesStatus },
  xAddNearbys: { get: getxAddNearbys, create: createxAddNearbys, update: updatexAddNearbys, delete: deletexAddNearbys, updateStatus: updatexAddNearbysStatus },
  xAddStates: { get: getxAddStates, create: createxAddStates, update: updatexAddStates, delete: deletexAddStates, updateStatus: updatexAddStatesStatus },
  xAmenities: { get: getxAmenities, create: createxAmenity, update: updatexAmenity, delete: deletexAmenity, updateStatus: updatexAmenityStatus },
  xCdrsStatus: { get: getxCdrsStatus, create: createxCdrsStatus, update: updatexCdrsStatus, delete: deletexCdrsStatus, updateStatus: updatexCdrsStatusStatus },
  xDbBackups: { get: getxDbBackups, create: createxDbBackup, update: updatexDbBackup, delete: deletexDbBackup, getById: getxDbBackupById },
  xHolidays: { get: getxHolidays, create: createxHoliday, update: updatexHoliday, delete: deletexHoliday, getById: getxHolidayById },
  xLeadsSource: { get: getxLeadsSource, create: createxLeadsSource, update: updatexLeadsSource, delete: deletexLeadsSource, changeStatus: updatexLeadsSourceStatus, getById: getxLeadsSourceById },
  xLeadsStatus: { get: getxLeadsStatus, create: createxLeadsStatus, update: updatexLeadsStatus, delete: deletexLeadsStatus, updateStatus: updatexLeadsStatusStatus, getById: getxLeadsStatusById },
  xLeadsTags: { get: getxLeadsTags, create: createxLeadTag, update: updatexLeadTag, delete: deletexLeadTag, getById: getxLeadTagById, updateStatus: updatexLeadTagStatus },
  xMediasTypes: { get: getxMediasTypes, create: createxMediaType, update: updatexMediaType, delete: deletexMediaType, updateStatus: updatexMediaTypeStatus, getById: getxMediaTypeById },
  xNotesTypes: { get: getxNotesTypes, create: createxNoteType, update: updatexNoteType, delete: deletexNoteType, getById: getxNoteTypeById, updateStatus: updatexNoteTypeStatus },
  xOffersTags: { get: getxOffersTags, create: createxOffersTags, update: updatexOffersTags, delete: deletexOffersTags, getById: getxOffersTagsById, updateStatus: updatexOffersTagsStatus },
  xPriorities: { get: getxPriorities, create: createxPriorities, update: updatexPriorities, delete: deletexPriorities, getById: getxPrioritiesById, updateStatus: updatexPrioritiesStatus },
  xPropertyMeasurement: { get: getxPropertyMeasurement, create: createxPropertyMeasurement, update: updatexPropertyMeasurement, delete: deletexPropertyMeasurement, changeStatus: updatexPropertyMeasurementStatus, getById: getxPropertyMeasurementById },
  xSettings: { get: getxSettings, create: createxSettings, update: updatexSettings, delete: deletexSettings, updateStatus: updatexSettingsStatus, getById: getxSettingsById },
  xTaskTypes: { get: getxTaskTypes, create: createxTaskType, update: updatexTaskType, delete: deletexTaskType, getById: getxTaskTypeById, updateStatus: updatexTaskTypeStatus },
  xUsersRoles: { get: getxUsersRoles, create: createxUserRole, update: updatexUserRole, delete: deletexUserRole, getById: getxUserRoleById, updateStatus: updatexUserRoleStatus },
  xProjectBuildingTypes: { get: getxProjectBuildingTypes, getById: getxProjectBuildingType, create: createxProjectBuildingType, update: updatexProjectBuildingType, getAll: getAllxProjectBuildingTypes, delete: deletexProjectBuildingType, updateStatus: updatexProjectBuildingTypeStatus },
  xProjectHighlights: { get: getxProjectHighlights, create: createxProjectHighlights, update: updatexProjectHighlights, delete: deletexProjectHighlights },
  xProjectAuthorities: { get: getxProjectAuthorities, create: createxProjectAuthorities, update: updatexProjectAuthorities, delete: deletexProjectAuthorities, getById: getxProjectAuthoritiesById },
  xPropertiesConfigs: { get: getxPropertyConfigs, create: createxPropertyConfigs, update: updatexPropertyConfigs, delete: deletexPropertyConfigs, getById: getxPropertyConfigsById, updateStatus: updatexPropertyConfigsStatus },
  xPropertyTransactions: { get: getxPropertyTransactions, create: createxPropertyTransaction, update: updatexPropertyTransaction, delete: deletexPropertyTransaction },
  xPropertyDeposits: { get: getxPropertyDeposits, create: createxPropertyDeposit, update: updatexPropertyDeposit, delete: deletexPropertyDeposit },
  xFurnishingTypes: { get: getxFurnishingTypes,updateStatus: updatexFurnishingTypeStatus, create: createxFurnishingType, update: updatexFurnishingType, delete: deletexFurnishingType },
  xMeasurementUnits: { get: getxMeasurementUnits, create: createxMeasurementUnit, update: updatexMeasurementUnit, delete: deletexMeasurementUnit },
  business: { get: getBusiness, getAll: fetchAllBusiness, create: createBusiness, update: updateBusiness, delete: deleteBusiness },
  users: { get: getUsers, getAll: fetchAllUsers, create: createUsers, update: updateUsers, delete: deleteUsers },
  xUserRoles: { get: getxUsersRoles, create: createxUserRole, update: updatexUserRole, delete: deletexUserRole, getById: getxUserRoleById, updateStatus: updatexUserRoleStatus },
  xAmenitiesTypes: { get: getxAmenitiesTypes, getAll: getAllxAmenitiesTypes, create: createxAmenityType, update: updatexAmenityType, delete: deletexAmenityType, getById: getxAmenityTypeById, updateStatus: updatexAmenityTypeStatus },
  xStorageCreditPlans: { get: getxStorageCreditPlans, create: createxStorageCreditPlan, update: updatexStorageCreditPlan, delete: deletexStorageCreditPlan, getById: getxStorageCreditPlanById, updateStatus: updatexStorageCreditPlanStatus },
  xPlanFeatures: { get: getxPlanFeatures, getAll: getAllxPlanFeatures, create: createxPlanFeature, update: updatexPlanFeature, delete: deletexPlanFeature, getById: getxPlanFeatureById },
  plans: { get: getPlans, getall: getAllPlans, create: createPlan, update: updatePlan, delete: deletePlan, getById: getPlanById, updateStatus: updatePlanStatus },
  planFeatures: { get: getPlanFeatures, getAll: getAllPlanFeatures, create: createPlanFeature, update: updatePlanFeature, delete: deletePlanFeature, getById: getPlanFeatureById },
  xPlanAddons:{get: getxPlanAddons,create: createxPlanAddon,update: updatexPlanAddon,delete: deletexPlanAddon,getAll: getAllxPlanAddons, getById: getxPlanAddonById},
  auth: { login: login, verify: verifyToken }
};