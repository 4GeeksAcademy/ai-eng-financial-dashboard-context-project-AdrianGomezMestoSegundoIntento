/**
 * Query Parameter Types
 *
 * Type definitions for query parameters sent to API endpoints
 * used by the three main features
 */

import type { OperationType, BusinessType, GroupBy } from "./api-types";

// ============================================================================
// FUNCIONALIDAD 1: Date Range Filter
// ============================================================================

/**
 * DateRangeFilter
 *
 * Query parameters for filtering data by date range
 *
 * Used in:
 * - GET /api/metrics/summary?start_date=...&end_date=...
 * - GET /api/metrics/alerts?start_date=...&end_date=...
 * - GET /api/metrics/categories/top?start_date=...&end_date=...
 *
 * Properties:
 * - Both start_date and end_date are optional
 * - Format: ISO 8601 (YYYY-MM-DD)
 * - Examples: "2026-01-01", "2026-12-31"
 * - Valid range: Use FacetsResponse.min_date and max_date to validate
 *
 * When both are undefined/null: API returns all available data
 */
export interface DateRangeFilter {
  /** Start date for filtering (optional, format: YYYY-MM-DD) */
  start_date?: string | null;

  /** End date for filtering (optional, format: YYYY-MM-DD) */
  end_date?: string | null;
}

/**
 * SummaryParams
 *
 * Query parameters for GET /api/metrics/summary endpoint
 *
 * Full parameter set including date range and additional filters
 */
export interface SummaryParams extends DateRangeFilter {
  /** How to group metrics by time (default: "month") */
  group_by?: GroupBy;

  /** Filter by specific operation type (optional) */
  operation_type?: OperationType | null;

  /** Filter by specific business type (optional) */
  business_type?: BusinessType | null;
}

// ============================================================================
// FUNCIONALIDAD 2: Anomaly Alerts
// ============================================================================

/**
 * AlertsParams
 *
 * Query parameters for GET /api/metrics/alerts endpoint
 *
 * Properties:
 * - threshold: Configurable by user, range [0, ∞), default 0.3 (30%)
 *   An anomaly is detected when: increase_ratio > threshold
 * - Date range: Both optional, filters the alerts shown
 * - group_by: Optional, default "month"
 * - business_type: Optional, can filter by B2B or B2C
 *
 * Example threshold values:
 * - 0.1 = 10% threshold (more sensitive, more alerts)
 * - 0.3 = 30% threshold (default, balanced)
 * - 0.5 = 50% threshold (less sensitive, fewer alerts)
 * - 1.0 = 100% threshold (very strict, very few alerts)
 */
export interface AlertsParams extends DateRangeFilter {
  /** Threshold ratio for anomaly detection
   * - Type: number >= 0
   * - Default: 0.3
   * - Formula: anomaly if (increase_ratio > threshold)
   * - User-configurable via slider/input
   */
  threshold?: number;

  /** How to group metrics by time (default: "month") */
  group_by?: GroupBy;

  /** Filter by specific business type (optional) */
  business_type?: BusinessType | null;
}

// ============================================================================
// FUNCIONALIDAD 3: B2B vs B2C Comparison
// ============================================================================

/**
 * TopCategoriesParams
 *
 * Query parameters for GET /api/metrics/categories/top endpoint
 *
 * Properties:
 * - operation_type: "income" for revenue categories (required for Funcionalidad 3)
 * - business_type: "B2B" or "B2C" (required - filter by line of business)
 * - limit: Number of top categories (default 5, range 1-20)
 * - Date range: Optional, filters the data included in the calculation
 *
 * Usage:
 * - Call twice: once with business_type="B2B", once with business_type="B2C"
 * - Displays top 5 categories side-by-side in comparison view
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /** Type of operation to get top categories for
   * - "income" for revenue categories
   * - "outcome" for expense categories
   * Default: "outcome"
   */
  operation_type?: OperationType;

  /** Business type to filter by
   * - "B2B" for Business to Business
   * - "B2C" for Business to Consumer
   * - Required for Funcionalidad 3
   */
  business_type?: BusinessType | null;

  /** Number of top categories to return
   * - Type: integer
   * - Range: 1-20
   * - Default: 5
   * - For Funcionalidad 3: use limit=5
   */
  limit?: number;
}

/**
 * ComparisonSummaryParams
 *
 * Query parameters for GET /api/metrics/summary endpoint when used in comparison view
 *
 * Used to get total net values for B2B vs B2C graphing
 */
export interface ComparisonSummaryParams extends DateRangeFilter {
  /** Business type for the comparison (B2B or B2C) */
  business_type: BusinessType;

  /** How to group by time for the comparison chart
   * - Default: "month"
   */
  group_by?: GroupBy;
}

// ============================================================================
// API Call Helper Types
// ============================================================================

/**
 * ApiQueryParams
 *
 * Union type for all possible query parameters
 *
 * Useful for generic API client functions that handle different endpoint types
 */
export type ApiQueryParams =
  | DateRangeFilter
  | SummaryParams
  | AlertsParams
  | TopCategoriesParams
  | ComparisonSummaryParams;

/**
 * QueryParamKeys
 *
 * Valid query parameter keys across all endpoints
 */
export type QueryParamKey =
  | "start_date"
  | "end_date"
  | "threshold"
  | "group_by"
  | "operation_type"
  | "business_type"
  | "limit";

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * validateDateFormat
 *
 * Validates if a string is in YYYY-MM-DD format
 *
 * @param dateStr - String to validate
 * @returns true if valid ISO 8601 date format
 */
export function validateDateFormat(dateStr: string | null | undefined): boolean {
  if (!dateStr) return true; // Null/undefined is valid (optional parameter)
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  // Check if it's a valid date
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * validateDateRange
 *
 * Validates that start_date <= end_date if both are provided
 *
 * @param startDate - Start date string (YYYY-MM-DD)
 * @param endDate - End date string (YYYY-MM-DD)
 * @returns true if range is valid
 */
export function validateDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined
): boolean {
  if (!startDate || !endDate) return true; // At least one must be provided for validation

  return new Date(startDate) <= new Date(endDate);
}

/**
 * validateThreshold
 *
 * Validates that threshold is a valid number >= 0
 *
 * @param threshold - Threshold value to validate
 * @returns true if threshold is valid
 */
export function validateThreshold(threshold: number | undefined): boolean {
  if (threshold === undefined) return true; // Default value is valid
  return typeof threshold === "number" && threshold >= 0;
}

/**
 * validateLimit
 *
 * Validates that limit is in valid range [1, 20]
 *
 * @param limit - Limit value to validate
 * @returns true if limit is valid
 */
export function validateLimit(limit: number | undefined): boolean {
  if (limit === undefined) return true; // Default value is valid
  return typeof limit === "number" && limit >= 1 && limit <= 20;
}

/**
 * buildQueryString
 *
 * Converts a params object to a URL query string
 *
 * @param params - Query parameters object
 * @returns Query string (without leading ?) or empty string
 *
 * Example:
 * buildQueryString({ start_date: "2026-01-01", threshold: 0.3 })
 * => "start_date=2026-01-01&threshold=0.3"
 */
export function buildQueryString(params: Record<string, any>): string {
  const entries = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return entries.join("&");
}
