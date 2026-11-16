# Frontend Type Specifications

TypeScript type definitions for all API responses and query parameters used by the three main features of the financial dashboard.

## Files

### `api-types.ts`
Type definitions for API responses:
- **FacetsResponse** — Date range reference and available metadata
- **MetricsSummaryItem**, **MetricsSummaryResponse** — Aggregated financial metrics
- **AlertEntry**, **AlertsResponse** — Anomaly alert data
- **CategoryEntry**, **TopCategoriesResponse** — Top categories by business type
- Combined types for feature implementation

### `param-types.ts`
Type definitions for query parameters:
- **DateRangeFilter** — Date range filtering (start_date, end_date)
- **SummaryParams** — Parameters for /api/metrics/summary
- **AlertsParams** — Parameters for /api/metrics/alerts
- **TopCategoriesParams** — Parameters for /api/metrics/categories/top
- **ComparisonSummaryParams** — Parameters for comparison view
- Validation functions and utilities

### `index.ts`
Re-exports all types and utilities for convenient importing

## Usage

### Basic Import
```typescript
import type { 
  FacetsResponse, 
  AlertsResponse, 
  TopCategoriesResponse 
} from "@/specs";
```

### In Components
```typescript
import { useFetch } from "@/hooks";
import type { AlertsParams } from "@/specs";
import { validateThreshold } from "@/specs";

// Define parameters
const params: AlertsParams = {
  threshold: 0.3,
  start_date: "2026-01-01",
  end_date: "2026-06-30",
};

// Validate before API call
if (validateThreshold(params.threshold)) {
  const response = await useFetch("/api/metrics/alerts", { params });
  // response is typed as AlertsResponse
}
```

## Type Hierarchy

```
DateRangeFilter (base)
├── SummaryParams
├── AlertsParams
├── TopCategoriesParams
└── ComparisonSummaryParams

API Responses
├── FacetsResponse
├── MetricsSummaryResponse
├── AlertsResponse
└── TopCategoriesResponse

Combined Types
├── DateRangeData
├── AnomalyAlertsData
└── B2BvsB2CComparisonData
```

## Key Formats

### Date Format
- Format: ISO 8601 (YYYY-MM-DD)
- Example: `"2026-01-15"`
- Validation: Use `validateDateFormat()`

### Monetary Values
- Format: Decimal with 2 positions
- Example: `1500.50`
- No currency symbol in API response

### Threshold Values
- Range: [0, ∞)
- Default: 0.3 (30%)
- Example: 0.1 (10%), 0.5 (50%)

### Limit Values
- Range: 1-20
- Default: 5
- Validation: Use `validateLimit()`

## Validation Functions

All validation functions are exported for use in components:

```typescript
import { 
  validateDateFormat,
  validateDateRange,
  validateThreshold,
  validateLimit,
  buildQueryString
} from "@/specs";

// Date validation
validateDateFormat("2026-01-15"); // true
validateDateFormat("01-15-2026"); // false

// Range validation
validateDateRange("2026-01-01", "2026-06-30"); // true
validateDateRange("2026-06-30", "2026-01-01"); // false

// Threshold validation
validateThreshold(0.3); // true
validateThreshold(-0.5); // false

// Limit validation
validateLimit(5); // true
validateLimit(25); // false

// Query string builder
buildQueryString({ start_date: "2026-01-01", threshold: 0.3 });
// => "start_date=2026-01-01&threshold=0.3"
```

## Feature Integration

### Funcionalidad 1: Date Range Filter
- Uses: `DateRangeFilter`, `SummaryParams`, `FacetsResponse`, `MetricsSummaryResponse`
- Validation: `validateDateFormat()`, `validateDateRange()`
- Params: `start_date`, `end_date` (both optional)

### Funcionalidad 2: Anomaly Alerts
- Uses: `AlertsParams`, `AlertsResponse`
- Validation: `validateThreshold()`, `validateDateFormat()`
- Params: `threshold` (default 0.3), `start_date`, `end_date`

### Funcionalidad 3: B2B vs B2C Comparison
- Uses: `TopCategoriesParams`, `TopCategoriesResponse`, `ComparisonSummaryParams`, `B2BvsB2CComparisonData`
- Validation: `validateDateRange()`, `validateLimit()`
- Params: `business_type` (B2B/B2C), `operation_type` (income), `limit` (default 5)

## Example: Building API Endpoints

```typescript
import { buildQueryString } from "@/specs";
import type { AlertsParams } from "@/specs";

const params: AlertsParams = {
  threshold: 0.25,
  group_by: "month",
  start_date: "2026-01-01",
  end_date: "2026-12-31",
};

const url = `/api/metrics/alerts?${buildQueryString(params)}`;
// => "/api/metrics/alerts?threshold=0.25&group_by=month&start_date=2026-01-01&end_date=2026-12-31"

const response = await fetch(url);
// response typed as AlertsResponse
```

## Notes

- All date parameters follow ISO 8601 format (YYYY-MM-DD)
- All monetary values are decimal numbers with 2 positions
- Optional parameters should be `null` or `undefined` when not provided
- API responses may return empty arrays `[]` for no data scenarios
- Use validation functions before making API calls
