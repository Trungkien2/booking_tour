# 09. Feature Toggle Matrix

> Manages feature on/off states based on environment, version, or role. Controls feature releases without requiring code redeployment.

---

## Document Information

| Item | Value |
|------|-------|
| Project Name | `{{PROJECT_NAME}}` |
| Version | 1.0 |
| Date | `{{DATE}}` |

---

## 1. Feature Flag Definitions

⭐ **List of features controlled by flags.**

```yaml
feature_flags:
  - id: "FT-USER-01"
    name: "Bulk User Import"
    description: "Allow bulk user import from Excel file"
    status:
      development: true          # Enabled in dev environment
      staging: true
      production: false          # Disabled in production (pending testing)
    logic:
      allowed_roles: ["admin"]   # Only Admin can see this feature
      ui_behavior: "hide"        # hide | disable | show_upgrade_modal
    
  - id: "FT-DASH-02"
    name: "Advanced Analytics"
    description: "Advanced analytics charts for Managers"
    status:
      all_environments: true
    logic:
      enabled_for_plan: "Enterprise" # Only for Enterprise plan
      ui_behavior: "disable"
      disabled_tooltip: "Upgrade to Enterprise plan to use this feature"
  
  - id: "FT-AI-GEN"
    name: "AI Report Generator"
    description: "AI-powered report generation"
    status:
      all_environments: false    # Completely disabled (out of scope)
    logic:
      ui_behavior: "hide"
  
  - id: "FT-EXPORT-PDF"
    name: "PDF Export"
    description: "Export reports to PDF format"
    status:
      development: true
      staging: true
      production: true
    logic:
      allowed_roles: ["admin", "manager"]
      ui_behavior: "show"
  
  - id: "FT-DARK-MODE"
    name: "Dark Mode"
    description: "Dark theme support"
    status:
      all_environments: true
    logic:
      ui_behavior: "show"
```

---

## 2. Implementation Pattern

⭐ **Implementation rules for consistent AI execution.**

```yaml
patterns:
  # Use Hook to check flag in logic
  hook: "useFeatureFlag(flagId: string)"
  
  # Use Component Wrapper to wrap UI
  component: |
    <FeatureGate flagId="FT-USER-01" fallback={<DisabledUI />}>
      <BulkImportButton />
    </FeatureGate>

  # Flag data source
  data_source:
    primary: "Environment Variables (.env)"
    secondary: "Remote Config API (if available)"
    fallback: "Static configuration file"
```

---

## 3. Implementation Code

### 3.1 Feature Flag Configuration

```typescript
// lib/constants/features.ts
export const FEATURE_FLAGS = {
  BULK_USER_IMPORT: 'FT-USER-01',
  ADVANCED_ANALYTICS: 'FT-DASH-02',
  AI_REPORT_GENERATOR: 'FT-AI-GEN',
  PDF_EXPORT: 'FT-EXPORT-PDF',
  DARK_MODE: 'FT-DARK-MODE',
} as const;

export type FeatureFlagId = typeof FEATURE_FLAGS[keyof typeof FEATURE_FLAGS];

interface FeatureConfig {
  id: FeatureFlagId;
  name: string;
  description: string;
  enabled: boolean;
  allowedRoles?: string[];
  enabledForPlan?: string;
  uiBehavior: 'show' | 'hide' | 'disable' | 'show_upgrade_modal';
  disabledTooltip?: string;
}

export const FEATURE_CONFIG: Record<FeatureFlagId, FeatureConfig> = {
  'FT-USER-01': {
    id: 'FT-USER-01',
    name: 'Bulk User Import',
    description: 'Allow bulk user import from Excel file',
    enabled: process.env.NEXT_PUBLIC_FEATURE_BULK_IMPORT === 'true',
    allowedRoles: ['admin'],
    uiBehavior: 'hide',
  },
  'FT-DASH-02': {
    id: 'FT-DASH-02',
    name: 'Advanced Analytics',
    description: 'Advanced analytics charts for Managers',
    enabled: true,
    enabledForPlan: 'Enterprise',
    uiBehavior: 'disable',
    disabledTooltip: 'Upgrade to Enterprise plan to use this feature',
  },
  'FT-AI-GEN': {
    id: 'FT-AI-GEN',
    name: 'AI Report Generator',
    description: 'AI-powered report generation',
    enabled: false,
    uiBehavior: 'hide',
  },
  'FT-EXPORT-PDF': {
    id: 'FT-EXPORT-PDF',
    name: 'PDF Export',
    description: 'Export reports to PDF format',
    enabled: true,
    allowedRoles: ['admin', 'manager'],
    uiBehavior: 'show',
  },
  'FT-DARK-MODE': {
    id: 'FT-DARK-MODE',
    name: 'Dark Mode',
    description: 'Dark theme support',
    enabled: true,
    uiBehavior: 'show',
  },
};
```

### 3.2 useFeatureFlag Hook

```typescript
// hooks/useFeatureFlag.ts
import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { FEATURE_CONFIG, FeatureFlagId } from '@/lib/constants/features';

export function useFeatureFlag(flagId: FeatureFlagId) {
  const { user } = useAuthStore();

  const isEnabled = useCallback(() => {
    const config = FEATURE_CONFIG[flagId];
    
    if (!config) {
      console.warn(`Feature flag ${flagId} not found`);
      return false;
    }

    // Check if feature is globally disabled
    if (!config.enabled) {
      return false;
    }

    // Check role-based access
    if (config.allowedRoles && user) {
      if (!config.allowedRoles.includes(user.role)) {
        return false;
      }
    }

    // Check plan-based access
    if (config.enabledForPlan && user) {
      // TODO: Implement plan checking logic
      // if (user.plan !== config.enabledForPlan) {
      //   return false;
      // }
    }

    return true;
  }, [flagId, user]);

  const getConfig = useCallback(() => {
    return FEATURE_CONFIG[flagId];
  }, [flagId]);

  return {
    isEnabled: isEnabled(),
    config: getConfig(),
  };
}
```

### 3.3 FeatureGate Component

```typescript
// components/FeatureGate.tsx
'use client';

import { ReactNode } from 'react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { FeatureFlagId } from '@/lib/constants/features';

interface FeatureGateProps {
  flagId: FeatureFlagId;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradeModal?: boolean;
}

export function FeatureGate({
  flagId,
  children,
  fallback = null,
  showUpgradeModal = false,
}: FeatureGateProps) {
  const { isEnabled, config } = useFeatureFlag(flagId);

  // Hide feature completely
  if (config.uiBehavior === 'hide' && !isEnabled) {
    return null;
  }

  // Show disabled state
  if (config.uiBehavior === 'disable' && !isEnabled) {
    return (
      <div className="relative">
        <div className="pointer-events-none opacity-50">{children}</div>
        {config.disabledTooltip && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-gray-500">
              {config.disabledTooltip}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Show upgrade modal
  if (config.uiBehavior === 'show_upgrade_modal' && !isEnabled) {
    return (
      <div onClick={() => showUpgradeModal && console.log('Show upgrade modal')}>
        {children}
      </div>
    );
  }

  // Feature is enabled, show normally
  if (isEnabled) {
    return <>{children}</>;
  }

  // Fallback
  return <>{fallback}</>;
}
```

### 3.4 Usage Examples

```typescript
// Example 1: Using Hook in Logic
function UserManagementPage() {
  const { isEnabled: canBulkImport } = useFeatureFlag('FT-USER-01');

  const handleImport = () => {
    if (!canBulkImport) {
      toast.error('Bulk import is not available');
      return;
    }
    // Proceed with import
  };

  return (
    <div>
      {canBulkImport && <BulkImportButton onClick={handleImport} />}
    </div>
  );
}

// Example 2: Using FeatureGate Component
function DashboardPage() {
  return (
    <div>
      <FeatureGate flagId="FT-DASH-02" fallback={<BasicAnalytics />}>
        <AdvancedAnalytics />
      </FeatureGate>

      <FeatureGate flagId="FT-EXPORT-PDF">
        <ExportPDFButton />
      </FeatureGate>
    </div>
  );
}

// Example 3: Conditional Rendering
function ReportPage() {
  const { isEnabled: hasAIGenerator } = useFeatureFlag('FT-AI-GEN');
  const { isEnabled: canExportPDF } = useFeatureFlag('FT-EXPORT-PDF');

  return (
    <div>
      <h1>Reports</h1>
      
      <div className="actions">
        {hasAIGenerator && <AIGenerateButton />}
        {canExportPDF && <ExportPDFButton />}
      </div>
    </div>
  );
}
```

---

## 4. Environment Configuration

### 4.1 Environment Variables

```bash
# .env.local (Development)
NEXT_PUBLIC_FEATURE_BULK_IMPORT=true
NEXT_PUBLIC_FEATURE_ADVANCED_ANALYTICS=true
NEXT_PUBLIC_FEATURE_AI_GENERATOR=false
NEXT_PUBLIC_FEATURE_PDF_EXPORT=true
NEXT_PUBLIC_FEATURE_DARK_MODE=true

# .env.production (Production)
NEXT_PUBLIC_FEATURE_BULK_IMPORT=false
NEXT_PUBLIC_FEATURE_ADVANCED_ANALYTICS=true
NEXT_PUBLIC_FEATURE_AI_GENERATOR=false
NEXT_PUBLIC_FEATURE_PDF_EXPORT=true
NEXT_PUBLIC_FEATURE_DARK_MODE=true
```

### 4.2 Remote Config (Optional)

```typescript
// lib/api/featureFlags.ts
export async function fetchRemoteFeatureFlags() {
  try {
    const response = await apiClient.get('/config/feature-flags');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch remote feature flags:', error);
    return null;
  }
}

// Use in app initialization
export function initializeFeatureFlags() {
  const remoteFlags = await fetchRemoteFeatureFlags();
  if (remoteFlags) {
    // Merge with local config
    Object.assign(FEATURE_CONFIG, remoteFlags);
  }
}
```

---

## 5. Best Practices

### 5.1 Naming Conventions
- ✅ **Use** descriptive flag IDs (e.g., `FT-USER-01`, `FT-DASH-02`)
- ✅ **Prefix** with feature area for organization
- ✅ **Document** each flag with clear description

### 5.2 Flag Lifecycle
- ✅ **Create** flags for new features in development
- ✅ **Test** in staging before production
- ✅ **Remove** flags after feature is stable (avoid flag debt)
- ✅ **Archive** old flags for historical reference

### 5.3 UI Behavior
- ✅ **Hide**: Completely remove UI element (best for beta features)
- ✅ **Disable**: Show but make non-interactive (good for premium features)
- ✅ **Show Upgrade Modal**: Encourage users to upgrade (monetization)

### 5.4 Testing
- ✅ **Test** both enabled and disabled states
- ✅ **Verify** role-based access works correctly
- ✅ **Check** fallback UI renders properly

### 5.5 Performance
- ✅ **Cache** feature flag checks when possible
- ✅ **Avoid** checking flags in tight loops
- ✅ **Use** memoization for expensive checks

---

## 6. Feature Flag Matrix

| Flag ID | Feature Name | Dev | Staging | Prod | Roles | Plan | UI Behavior |
|---------|-------------|-----|---------|------|-------|------|-------------|
| FT-USER-01 | Bulk User Import | ✅ | ✅ | ❌ | admin | - | hide |
| FT-DASH-02 | Advanced Analytics | ✅ | ✅ | ✅ | - | Enterprise | disable |
| FT-AI-GEN | AI Report Generator | ❌ | ❌ | ❌ | - | - | hide |
| FT-EXPORT-PDF | PDF Export | ✅ | ✅ | ✅ | admin, manager | - | show |
| FT-DARK-MODE | Dark Mode | ✅ | ✅ | ✅ | - | - | show |

---

## Checklist

- [ ] Feature flags defined with clear IDs
- [ ] Environment-specific configurations set
- [ ] Role-based access rules defined
- [ ] UI behavior specified for each flag
- [ ] `useFeatureFlag` hook implemented
- [ ] `FeatureGate` component created
- [ ] Environment variables configured
- [ ] Documentation updated
- [ ] Tests written for flag logic
- [ ] Flag cleanup process established
