/**
 * API Response Types
 *
 * Type definitions for all API responses used by the three main features:
 * 1. Date Range Filter (Funcionalidad 1)
 * 2. Anomaly Alerts Table (Funcionalidad 2)
 * 3. B2B vs B2C Comparison (Funcionalidad 3)
 */

/**
 * Operation types available in the system
 * - "income": Revenue/ingresos
 * - "outcome": Expenses/gastos
 */
export type OperationType = "income" | "outcome";

/**
 * Business types available in the system
 * - "B2B": Business to Business
 * - "B2C": Business to Consumer
 */
export type BusinessType = "B2B" | "B2C";

/**
 * Expense categories available in the system
 */
export type Category =
  | "suppliers"
  | "sales"
  | "operational"
  | "administrative"
  | "others";

/**
 * Time grouping options for metrics
 */
export type GroupBy = "day" | "week" | "month";

// ============================================================================
// FUNCIONALIDAD 1: Date Range Filter
// ============================================================================

/**
 * FacetsResponse
 *
 * Response from GET /api/metrics/facets
 *
 * Provides reference information about available data:
 * - Date range (min_date, max_date) for validation
 * - Available categories, operation types, and business types
 *
 * Usage: Display date range reference near filter inputs in Funcionalidad 1
 */
export interface FacetsResponse {
  /** Earliest date available in the dataset (ISO 8601 format: YYYY-MM-DD) */
  min_date: string;

  /** Latest date available in the dataset (ISO 8601 format: YYYY-MM-DD) */
  max_date: string;

  /** All operation types present in the dataset */
  operation_types: OperationType[];

  /** All business types present in the dataset */
  business_types: BusinessType[];

  /** All expense categories present in the dataset */
  categories: Category[];
}

/**
 * MetricsSummaryItem
 *
 * Single period in a metrics summary response
 *
 * Represents aggregated financial data for a time period (day, week, or month)
 */
export interface MetricsSummaryItem {
  /** Period identifier (format depends on group_by: "2026-01", "2026-W01", or "2026-01-15") */
  period: string;

  /** Total income for the period */
  income: number;

  /** Total outcome (expenses) for the period */
  outcome: number;

  /** Net value = income - outcome */
  net: number;
}

/**
 * MetricsSummaryResponse
 *
 * Response from GET /api/metrics/summary
 *
 * Array of aggregated financial data filtered by date range and other parameters
 *
 * Usage: Display dashboard charts and summary tables (Funcionalidad 1)
 */
export type MetricsSummaryResponse = MetricsSummaryItem[];

// ============================================================================
// FUNCIONALIDAD 2: Anomaly Alerts Table
// ============================================================================

/**
 * AlertEntry
 *
 * Single row in the anomaly alerts table
 *
 * Represents a detected spending anomaly where the outcome exceeded the
 * baseline (average of previous 3 periods) by more than the threshold
 */
export interface AlertEntry {
  /** Time period when the anomaly was detected (e.g., "2026-03", "2026-W12") */
  period: string;

  /** Actual spending amount in the anomalous period */
  outcome_total: number;

  /** Average spending of the 3 previous periods (baseline) */
  baseline_average: number;

  /** Ratio of increase relative to baseline
   * - Formula: (outcome_total - baseline_average) / baseline_average
   * - Example: 0.3889 means 38.89% increase
   * - Anomalies detected: increase_ratio > threshold (default 0.3)
   */
  increase_ratio: number;
}

/**
 * AlertsResponse
 *
 * Response from GET /api/metrics/alerts
 *
 * Array of detected spending anomalies filtered by threshold and date range
 *
 * Empty array [] means no anomalies detected → show "No anomalies detected" message
 *
 * Usage: Display alerts table in Funcionalidad 2
 */
export type AlertsResponse = AlertEntry[];

// ============================================================================
// FUNCIONALIDAD 3: B2B vs B2C Comparison
// ============================================================================

/**
 * CategoryEntry
 *
 * Single category entry in top categories response
 *
 * Represents the aggregated amount for a specific category across all transactions
 * in the specified business type and date range
 */
export interface CategoryEntry {
  /** Expense category (e.g., "sales", "suppliers", "operational") */
  category: Category;

  /** Type of operation for this category */
  operation_type: OperationType;

  /** Total amount for this category in the specified period */
  total_amount: number;
}

/**
 * TopCategoriesResponse
 *
 * Response from GET /api/metrics/categories/top
 *
 * Top N categories ordered by total_amount (descending)
 *
 * Usage: Display parallel tables in B2B vs B2C comparison (Funcionalidad 3)
 * Calculations:
 * - Total for group: sum(all entries.total_amount)
 * - Percentage: (entry.total_amount / group_total) * 100
 */
export type TopCategoriesResponse = CategoryEntry[];

// ============================================================================
// Combined Types for Feature Implementation
// ============================================================================

/**
 * DateRangeData
 * Combined type for date range filtering across features
 */
export interface DateRangeData {
  facets: FacetsResponse;
  summary: MetricsSummaryResponse;
}

/**
 * AnomalyAlertsData
 * Combined type for anomaly alerts feature
 */
export interface AnomalyAlertsData {
  alerts: AlertsResponse;
}

/**
 * B2BvsB2CComparisonData
 * Combined type for B2B vs B2C comparison feature
 *
 * Includes:
 * - Top categories for B2B and B2C
 * - Summary data for graphing totals
 */
export interface B2BvsB2CComparisonData {
  b2b: {
    categories: TopCategoriesResponse;
    summary: MetricsSummaryResponse;
  };
  b2c: {
    categories: TopCategoriesResponse;
    summary: MetricsSummaryResponse;
  };
}
