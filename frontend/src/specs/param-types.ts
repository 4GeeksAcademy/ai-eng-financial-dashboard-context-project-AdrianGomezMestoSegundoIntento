/**
 * Query parameter types for the Financial Dashboard API
 * Extracted from backend /docs schema (routes.py Query parameters)
 */

/**
 * Date range filter parameters
 * Both dates are optional and in YYYY-MM-DD format
 * When both are undefined, all data is returned
 */
export interface DateRangeFilter {
  /**
   * Start date (inclusive) for filtering data
   * Format: YYYY-MM-DD
   * When undefined, includes all data from the beginning
   */
  start_date?: string;

  /**
   * End date (inclusive) for filtering data
   * Format: YYYY-MM-DD
   * When undefined, includes all data to the present
   */
  end_date?: string;
}

/**
 * Parameters for the GET /api/metrics/alerts endpoint
 * Detects and reports outcome anomalies based on a threshold
 */
export interface AlertsParams extends DateRangeFilter {
  /**
   * Anomaly detection threshold
   * When outcome increases by this ratio from the baseline, an alert is triggered
   * Valid range: 0.01 to 1.0 (or higher, though typically capped at 1.0)
   * Default: 0.3 (30% increase)
   * Example: 0.3 means alert if outcome > baseline * 1.3
   */
  threshold?: number;

  /**
   * Grouping level for period aggregation
   * Default: "month"
   * - "day": YYYY-MM-DD
   * - "week": YYYY-WNN (ISO week)
   * - "month": YYYY-MM
   */
  group_by?: "day" | "week" | "month";

  /**
   * Optional business type filter
   * When specified, only alerts for this business type are returned
   */
  business_type?: "B2B" | "B2C";
}

/**
 * Parameters for the GET /api/metrics/categories/top endpoint
 * Retrieves top N categories by total amount
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /**
   * Operation type to filter by
   * Required parameter
   * - "income": revenue categories (primarily "sales")
   * - "outcome": expense categories ("suppliers", "operational", "administrative", "others")
   */
  operation_type: "income" | "outcome";

  /**
   * Maximum number of top categories to return
   * Valid range: 1 to 20
   * Default: 5
   */
  limit?: number;

  /**
   * Optional business type filter
   * When specified, only categories from this business type are included
   */
  business_type?: "B2B" | "B2C";
}

/**
 * Parameters for the GET /api/metrics/summary endpoint
 * Retrieves aggregated financial metrics
 */
export interface SummaryParams extends DateRangeFilter {
  /**
   * Grouping level for period aggregation
   * Default: "month"
   * - "day": YYYY-MM-DD
   * - "week": YYYY-WNN (ISO week)
   * - "month": YYYY-MM
   */
  group_by?: "day" | "week" | "month";

  /**
   * Optional category filter
   * When specified, only movements in this category are included
   */
  category?: "suppliers" | "sales" | "operational" | "administrative" | "others";

  /**
   * Optional operation type filter
   * When specified, only movements of this type are included
   */
  operation_type?: "income" | "outcome";

  /**
   * Optional business type filter
   * When specified, only movements from this business type are included
   */
  business_type?: "B2B" | "B2C";
}

/**
 * Parameters for the GET /api/metrics/comparison endpoint
 * Compares metrics between two periods
 */
export interface ComparisonParams {
  /**
   * Start date (inclusive) of the current period for comparison
   * Format: YYYY-MM-DD
   * Required parameter
   */
  start_date: string;

  /**
   * End date (inclusive) of the current period for comparison
   * Format: YYYY-MM-DD
   * Required parameter
   */
  end_date: string;

  /**
   * Optional business type filter
   * When specified, only movements from this business type are included in the comparison
   */
  business_type?: "B2B" | "B2C";
}
