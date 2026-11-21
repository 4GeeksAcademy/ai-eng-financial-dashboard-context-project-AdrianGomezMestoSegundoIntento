/**
 * API Response types for the Financial Dashboard
 * Extracted from backend /docs schema (routes.py models)
 */

/**
 * Represents the available facets and date range in the dataset
 * Used by: GET /api/metrics/facets
 */
export interface FacetsResponse {
  /** All distinct operation types available in the dataset */
  operation_types: Array<"income" | "outcome">;

  /** All distinct business types available in the dataset */
  business_types: Array<"B2B" | "B2C">;

  /** All distinct expense categories available in the dataset */
  categories: Array<"suppliers" | "sales" | "operational" | "administrative" | "others">;

  /** The earliest date in the dataset, format: YYYY-MM-DD */
  min_date: string;

  /** The latest date in the dataset, format: YYYY-MM-DD */
  max_date: string;
}

/**
 * Represents a single anomaly alert for outcome anomalies
 * Used by: GET /api/metrics/alerts
 */
export interface AlertEntry {
  /** Period identifier (format depends on group_by param: YYYY-MM-DD for day, YYYY-WNN for week, YYYY-MM for month) */
  period: string;

  /** Total outcome amount for the period */
  outcome_total: number;

  /** Moving average of the 3 previous periods' outcomes (baseline) */
  baseline_average: number;

  /** Percentage increase ratio: (outcome_total - baseline_average) / baseline_average. Ranges from 0.01 to 1.0 or higher */
  increase_ratio: number;
}

/**
 * Response body for the alerts endpoint
 * Used by: GET /api/metrics/alerts
 */
export type AlertsResponse = AlertEntry[];

/**
 * Represents a top category item for income or outcome comparison
 * Used by: GET /api/metrics/categories/top
 */
export interface CategoryEntry {
  /** Category name */
  category: "suppliers" | "sales" | "operational" | "administrative" | "others";

  /** Operation type (income or outcome) */
  operation_type: "income" | "outcome";

  /** Total amount for this category and operation type */
  total_amount: number;
}

/**
 * Response body for top categories endpoint
 * Used by: GET /api/metrics/categories/top
 */
export type TopCategoriesResponse = CategoryEntry[];

/**
 * Summary item showing aggregated metrics for a time period
 * Used internally for metrics summary calculations
 */
export interface MetricsSummaryItem {
  /** Period identifier (format depends on group_by param: YYYY-MM-DD for day, YYYY-WNN for week, YYYY-MM for month) */
  period: string;

  /** Total income for the period */
  income: number;

  /** Total outcome for the period */
  outcome: number;

  /** Net value (income - outcome) for the period */
  net: number;
}

/**
 * Comparison metrics between two periods
 * Used by: GET /api/metrics/comparison
 */
export interface MetricsComparison {
  /** Net value for the current period */
  current_period: number;

  /** Net value for the previous period */
  previous_period: number;

  /** Absolute difference (current - previous) */
  delta_abs: number;

  /** Percentage difference. Nullable if previous_period is 0 (division by zero) */
  delta_pct: number | null;
}
