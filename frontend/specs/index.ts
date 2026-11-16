/**
 * Frontend Specifications
 *
 * This module exports all TypeScript type definitions for:
 * - API responses (api-types.ts)
 * - Query parameters (param-types.ts)
 *
 * Usage in components:
 * import type { FacetsResponse, AlertEntry, AlertsParams } from "@/specs";
 */

// Re-export all types from api-types
export type {
  OperationType,
  BusinessType,
  Category,
  GroupBy,
  FacetsResponse,
  MetricsSummaryItem,
  MetricsSummaryResponse,
  AlertEntry,
  AlertsResponse,
  CategoryEntry,
  TopCategoriesResponse,
  DateRangeData,
  AnomalyAlertsData,
  B2BvsB2CComparisonData,
} from "./api-types";

// Re-export all types from param-types
export type {
  DateRangeFilter,
  SummaryParams,
  AlertsParams,
  TopCategoriesParams,
  ComparisonSummaryParams,
  ApiQueryParams,
  QueryParamKey,
} from "./param-types";

// Re-export utility functions from param-types
export {
  validateDateFormat,
  validateDateRange,
  validateThreshold,
  validateLimit,
  buildQueryString,
} from "./param-types";
