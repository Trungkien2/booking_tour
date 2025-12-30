# 08. Data Mapper Spec

> Defines data transformation rules between API (Backend) and UI (Frontend). Ensures consistency when handling formatting, naming conventions, and null values.

---

## 1. Global Transformation Rules

⭐ **Rules applied system-wide for AI to automatically execute.**

```yaml
transformation_rules:
  naming_convention:
    from: "snake_case"           # Backend standard
    to: "camelCase"              # Frontend standard (per Architecture)
  
  date_format:
    api: "ISO 8601 (2025-12-22T10:00:00Z)"
    ui: "YYYY-MM-DD HH:mm"       # Default display format
    
  null_handling:
    # Handle when API returns null
    default_action: "convert_to_empty_display"
    rule: "Based on 'empty_display' value in Screen Spec (e.g., '-')"

  numeric_format:
    decimal_separator: "."
    thousand_separator: ","
    default_precision: 2         # Example: 1,234.56
```

---

## 2. Resource Mappings (Example)

⭐ **Detailed mapping for specific Resources.**

```yaml
resource_mappings:
  # === User Resource ===
  user:
    fields:
      - api_field: "user_id"
        ui_field: "id"
        type: "string"
      
      - api_field: "user_name"
        ui_field: "username"
        type: "string"
      
      - api_field: "status"
        ui_field: "status"
        mapping: "status_badge_mapping in Design System"
      
      - api_field: "meta.last_login"
        ui_field: "lastLogin"
        transform: "formatDate"

  # === Project Resource ===
  project:
    fields:
      - api_field: "project_name"
        ui_field: "name"
      
      - api_field: "budget_amount"
        ui_field: "displayBudget"
        transform: "currency_format('USD')"
```

---

## 3. Transformation Functions

### 3.1 Date Transformations

```typescript
// formatDate: ISO 8601 → Display format
function formatDate(isoDate: string): string {
  // "2025-12-22T10:00:00Z" → "2025-12-22 10:00"
  return format(parseISO(isoDate), 'yyyy-MM-dd HH:mm');
}

// formatDateShort: ISO 8601 → Short format
function formatDateShort(isoDate: string): string {
  // "2025-12-22T10:00:00Z" → "2025-12-22"
  return format(parseISO(isoDate), 'yyyy-MM-dd');
}
```

### 3.2 Numeric Transformations

```typescript
// currency_format: Number → Currency string
function currencyFormat(amount: number, currency = 'USD'): string {
  // 1234.56 → "$1,234.56"
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// number_format: Number → Formatted string
function numberFormat(value: number, precision = 2): string {
  // 1234.567 → "1,234.57"
  return value.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}
```

### 3.3 Null Handling

```typescript
// handleNull: Convert null to display value
function handleNull(value: any, emptyDisplay = '-'): string {
  return value ?? emptyDisplay;
}
```

---

## 4. Implementation Guidelines

### 4.1 API Response Mapper

```typescript
// lib/api/mappers/userMapper.ts
import { User } from '@/types/models';

export function mapUserFromAPI(apiData: any): User {
  return {
    id: apiData.user_id,
    username: apiData.user_name,
    email: apiData.email,
    status: apiData.status,
    lastLogin: apiData.meta?.last_login 
      ? formatDate(apiData.meta.last_login) 
      : '-',
    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at,
  };
}
```

### 4.2 Auto-mapping with Generic Function

```typescript
// lib/api/mappers/autoMapper.ts
export function autoMapFromAPI<T>(
  apiData: any,
  fieldMappings: FieldMapping[]
): T {
  const result: any = {};
  
  fieldMappings.forEach(({ api_field, ui_field, transform }) => {
    let value = getNestedValue(apiData, api_field);
    
    if (transform) {
      value = applyTransform(value, transform);
    }
    
    result[ui_field] = value;
  });
  
  return result as T;
}
```

---

## 5. Best Practices

### 5.1 Naming Conventions
- ✅ **Always** convert `snake_case` (API) to `camelCase` (UI)
- ✅ **Never** expose backend field names directly to UI
- ✅ **Use** semantic names that match domain language

### 5.2 Date Handling
- ✅ **Always** store dates in ISO 8601 format
- ✅ **Transform** to display format only in UI layer
- ✅ **Use** date-fns or similar library for consistency

### 5.3 Null Safety
- ✅ **Always** handle null/undefined values
- ✅ **Use** empty_display from Screen Spec
- ✅ **Provide** sensible defaults

### 5.4 Type Safety
- ✅ **Define** TypeScript interfaces for all mapped types
- ✅ **Validate** with Zod schemas when needed
- ✅ **Document** transformation logic

---

## Checklist

- [ ] Global transformation rules defined
- [ ] Resource mappings documented
- [ ] Transformation functions implemented
- [ ] Null handling strategy defined
- [ ] Type definitions created
- [ ] Mapper functions tested