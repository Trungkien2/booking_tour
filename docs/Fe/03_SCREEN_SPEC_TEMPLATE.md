# 03. Screen Specification

> ⭐ **Core document with the greatest impact on AI auto-coding success rate**
> Mechanically and clearly defines all states, actions, and data for each screen.

---

## Document Information

| Item          | Value              |
| ------------- | ------------------ |
| Project Name  | `{{PROJECT_NAME}}` |
| Version       | 1.0                |
| Last Modified | `{{DATE}}`         |
| Author        | `{{AUTHOR}}`       |

---

## Screen Spec Writing Rules

### Required Section Checklist

All screens must include the following 7 sections:

- [ ] **1. Basic Information** (Meta)
- [ ] **2. Data Spec** (Data)
- [ ] **3. State Definitions** (States) ⭐ 5 required
- [ ] **4. User Actions** (Actions) ⭐ Result mapping required
- [ ] **5. Permission Rules** (Permissions)
- [ ] **6. Layout** (Layout)
- [ ] **7. Validation Rules** (Validation)

---

## Screen Spec Template

Copy the template below and write for each screen.

```yaml
# ============================================================
# Screen Spec: {{SCREEN_NAME}}
# ============================================================

screen:
  id: 'SCR-001' # Unique ID
  name: '{{Screen Name}}' # Example: "Indicator List"
  path: '/{{route}}' # Example: "/indicators"
  type: 'page' # page | modal | drawer | panel

# ------------------------------------------------------------
# 1. Basic Information (Meta)
# ------------------------------------------------------------
meta:
  purpose: |
    Describe the user problem this screen solves in 1-2 lines
    Example: "Users can view and manage company-wide ESG indicator input status at a glance"

  owner_roles: # Roles that can access this screen
    - J
    - C
    - M

  related_screens: # Related screen IDs
    - SCR-002
    - SCR-003

  figma_link: '{{FIGMA_URL}}' # Design link (optional)

  seo: # SEO metadata
    title: 'Indicator Status | {{Project Name}}'
    description: 'View ESG indicator data input status'

# ------------------------------------------------------------
# 2. Data Spec (Data)
# ------------------------------------------------------------
data:
  # API endpoints used in this screen
  endpoints:
    primary:
      method: 'GET'
      path: '/api/indicators'
      query_params:
        - name: projectId
          type: string
          required: true
        - name: status
          type: enum
          values: ['draft', 'confirmed', 'revision_requested']
          required: false
        - name: category
          type: string
          required: false
        - name: page
          type: number
          default: 1
        - name: limit
          type: number
          default: 20
          max: 100

    secondary: [] # List additional APIs if any

  # Data fields displayed on screen (API response → UI mapping)
  display_fields:
    - api_field: 'template.code'
      ui_label: 'Indicator Code'
      ui_type: 'text'
      sortable: true
      filterable: false
      width: '100px'

    - api_field: 'template.name'
      ui_label: 'Indicator Name'
      ui_type: 'text'
      sortable: true
      filterable: true
      width: 'auto'

    - api_field: 'value'
      ui_label: 'Input Value'
      ui_type: 'number'
      format: '#,##0.00' # Number format
      nullable: true # ⭐ nullable must be specified
      empty_display: '-' # Value to display when null
      sortable: true
      filterable: false
      width: '120px'

    - api_field: 'status'
      ui_label: 'Status'
      ui_type: 'badge'
      mapping: # enum → UI mapping
        draft:
          label: 'Draft'
          color: 'gray'
        confirmed:
          label: 'Confirmed'
          color: 'green'
        revision_requested:
          label: 'Revision Requested'
          color: 'amber'
      sortable: true
      filterable: true
      width: '100px'

    - api_field: 'assignee.name'
      ui_label: 'Assignee'
      ui_type: 'text'
      nullable: true
      empty_display: 'Unassigned'
      sortable: true
      filterable: true
      width: '100px'

    - api_field: 'updated_at'
      ui_label: 'Updated At'
      ui_type: 'date'
      format: 'YYYY-MM-DD HH:mm'
      sortable: true
      filterable: false
      width: '150px'

# ------------------------------------------------------------
# 3. State Definitions (States) ⭐ 5 required
# ------------------------------------------------------------
states:
  loading:
    trigger: 'Initial page load, filter change, pagination'
    ui:
      component: 'Skeleton'
      config:
        rows: 5
        show_header: true
    duration_hint: '< 500ms target'

  empty:
    trigger: 'API response data.length === 0'
    ui:
      component: 'EmptyState'
      config:
        icon: 'inbox'
        title: 'No indicators registered'
        description: 'Import indicators from Default Set'
        action_button:
          label: 'Import Indicators'
          action: 'navigate:/default/data-set'
          visible_roles: ['J', 'C'] # Roles that see this button

  error:
    trigger: 'API response 5xx, network error, timeout(30s)'
    ui:
      component: 'ErrorState'
      config:
        icon: 'error'
        title: 'Failed to load data'
        description: 'Please check your network connection and try again'
        action_button:
          label: 'Retry'
          action: 'retry'
    error_codes: # Error code messages (optional)
      NETWORK_ERROR: 'Please check your internet connection'
      TIMEOUT: 'Server response is delayed'
      GEN500: 'Server error occurred'

  permission_denied:
    trigger: 'API response 403'
    ui:
      component: 'PermissionDenied'
      config:
        icon: 'lock'
        title: 'Access denied'
        description: 'You do not have permission to view this page'
        action_button:
          label: 'Go to Dashboard'
          action: 'navigate:/dashboard'

  success:
    trigger: 'API response 200, data.length > 0'
    ui:
      component: 'DataTable'
      config:
        show_header: true
        show_pagination: true
        show_filter: true
        row_click_action: 'navigate:/indicators/{id}'
        virtualization:
          enabled: true
          threshold: 100 # Apply virtualization if 100+ items

  # (Optional) Partial success state
  partial_success:
    trigger: 'Only some data loaded, pagination failed mid-way'
    ui:
      component: 'DataTable'
      config:
        show_warning_banner: true
        warning_message: 'Failed to load some data'
        retry_button: true

# ------------------------------------------------------------
# 4. User Actions (Actions) ⭐ Result mapping required
# ------------------------------------------------------------
actions:
  # --- Table row click ---
  row_click:
    trigger: 'Table row click'
    enabled_condition: 'always'
    result:
      success:
        action: 'navigate'
        target: '/indicators/{row.id}'

  # --- Filter change ---
  filter_change:
    trigger: 'Filter dropdown/search term change'
    enabled_condition: 'always'
    debounce_ms: 300
    result:
      success:
        action: 'refetch'
        reset_pagination: true

  # --- Sort change ---
  sort_change:
    trigger: 'Table header click'
    enabled_condition: 'columns where sortable === true'
    result:
      success:
        action: 'refetch'
        reset_pagination: false

  # --- Page change ---
  page_change:
    trigger: 'Pagination click'
    enabled_condition: 'always'
    result:
      success:
        action: 'refetch'
        scroll_to_top: true

  # --- Delete button click ---
  delete_button_click:
    trigger: 'Delete button click'
    enabled_condition: "role in ['J', 'C']"
    confirmation:
      required: true
      title: 'Delete indicator?'
      description: 'Deleted indicators cannot be recovered.'
      confirm_label: 'Delete'
      cancel_label: 'Cancel'
      confirm_style: 'danger'
    api:
      method: 'DELETE'
      path: '/api/indicators/{id}'
    result:
      success:
        toast:
          type: 'success'
          message: 'Indicator deleted'
          duration_ms: 3000
        action: 'refetch'
      error:
        toast:
          type: 'error'
          message: '{error.message}' # Use API error message
          duration_ms: 5000
        action: 'none'
      validation_error:
        toast:
          type: 'warning'
          message: 'Confirmed indicators cannot be deleted'
          duration_ms: 5000
        action: 'none'

  # --- Assign button click ---
  assign_button_click:
    trigger: 'Assign button click'
    enabled_condition: "role in ['J', 'C', 'M', 'm']"
    ui:
      open_modal: 'AssigneeSelectModal'
      modal_config:
        title: 'Assign Assignee'
        size: 'md'
    api:
      method: 'PATCH'
      path: '/api/indicators/{id}/assign'
      body:
        assignee_id: '{selected_user_id}'
    result:
      success:
        toast:
          type: 'success'
          message: 'Assignee assigned'
          duration_ms: 3000
        action: 'close_modal'
        then: 'refetch'
      error:
        toast:
          type: 'error'
          message: '{error.message}'
          duration_ms: 5000
        action: 'none'

# ------------------------------------------------------------
# 5. Permission Rules (Permissions)
# ------------------------------------------------------------
permissions:
  page_access: # Page access permissions
    allowed_roles: ['J', 'C', 'M', 'm', 'S']
    denied_redirect: '/403'

  buttons: # Button visibility rules
    delete:
      visible_roles: ['J', 'C']
      disabled_condition: "status === 'confirmed'"
      disabled_tooltip: 'Confirmed indicators cannot be deleted'

    assign:
      visible_roles: ['J', 'C', 'M', 'm']
      disabled_condition: null

    export_excel:
      visible_roles: ['J', 'C', 'M']
      disabled_condition: null

    add_indicator:
      visible_roles: ['J', 'C']
      disabled_condition: null

  row_actions: # Row action permissions
    edit:
      condition: "role in ['J', 'C', 'M', 'm'] OR (role === 'S' AND row.assignee_id === current_user.id)"

    view_only:
      condition: "role === 'S' AND row.assignee_id !== current_user.id"

# ------------------------------------------------------------
# 6. Layout (Layout)
# ------------------------------------------------------------
layout:
  type: 'standard_list' # standard_list | dashboard | form | editor

  header:
    title: 'ESG Indicator Status'
    breadcrumbs:
      - label: 'Home'
        path: '/'
      - label: 'Indicator Management'
        path: '/indicators'
      - label: 'Indicator Status'
        path: null # Current page
    actions: # Header right-side buttons
      - id: 'add_indicator'
        label: 'Add Indicator'
        icon: 'add'
        variant: 'primary'
        action: 'navigate:/indicators/new'
      - id: 'export_excel'
        label: 'Download Excel'
        icon: 'download'
        variant: 'outline'
        action: 'download:/api/indicators/export?format=xlsx'

  filters:
    position: 'above_table' # above_table | sidebar
    fields:
      - name: 'status'
        type: 'select'
        label: 'Status'
        options_source: 'static'
        options:
          - value: ''
            label: 'All'
          - value: 'draft'
            label: 'Draft'
          - value: 'confirmed'
            label: 'Confirmed'
          - value: 'revision_requested'
            label: 'Revision Requested'

      - name: 'category'
        type: 'select'
        label: 'Category'
        options_source: 'api:/api/categories'
        option_value_field: 'id'
        option_label_field: 'name'

      - name: 'assignee_id'
        type: 'user_select'
        label: 'Assignee'
        options_source: 'api:/api/users'

      - name: 'search'
        type: 'text'
        label: 'Search'
        placeholder: 'Search by indicator name, code'
        debounce_ms: 300

  table:
    row_height: 52
    header_height: 48
    selectable: true # Checkbox selection
    multi_select: true
    row_hover: true
    stripe: false
    border: true

  pagination:
    position: 'bottom'
    type: 'numbered' # numbered | infinite_scroll | load_more
    page_sizes: [10, 20, 50, 100]
    default_page_size: 20
    show_total: true
    total_format: 'Total {total} items'

  responsive:
    breakpoints:
      desktop:
        min_width: 1024
        columns_visible: 'all'
      tablet:
        min_width: 768
        max_width: 1023
        columns_visible: ['code', 'name', 'status', 'assignee']
        hide_filters: false
      mobile:
        max_width: 767
        columns_visible: ['name', 'status']
        hide_filters: true
        stack_layout: true

# ------------------------------------------------------------
# 7. Validation Rules (Validation)
# ------------------------------------------------------------
validation:
  # If there are form inputs on this screen
  forms:
    filter_form:
      fields:
        search:
          max_length: 100
          pattern: null
        status:
          allowed_values: ['', 'draft', 'confirmed', 'revision_requested']

  # Real-time validation vs submit-time validation
  trigger: 'on_change' # on_change | on_blur | on_submit

  # Error display method
  error_display:
    type: 'inline' # inline | toast | modal
    position: 'below_field'

# ============================================================
# END OF SCREEN SPEC
# ============================================================
```

---

## Screen Spec Writing Example

Example screen spec from an actual project.

### Example 1: Login Page

```yaml
screen:
  id: 'SCR-AUTH-001'
  name: 'Login'
  path: '/login'
  type: 'page'

meta:
  purpose: 'Users authenticate to the system with email and password'
  owner_roles: ['*'] # All users (including unauthenticated)

data:
  endpoints:
    primary:
      method: 'POST'
      path: '/api/auth/login'
      body:
        email: { type: 'string', required: true }
        password: { type: 'string', required: true }

states:
  idle:
    trigger: 'Initial page load'
    ui:
      component: 'LoginForm'
      config:
        email_focused: true

  loading:
    trigger: 'After login button click, waiting for API response'
    ui:
      component: 'LoginForm'
      config:
        button_loading: true
        inputs_disabled: true

  error:
    trigger: 'API response 401, 403'
    ui:
      component: 'LoginForm'
      config:
        show_error_message: true
    error_codes:
      AUTH001: 'Email or password is incorrect'
      AUTH006: 'Account is locked. Please contact administrator'
      USER003: 'Account is deactivated'

actions:
  login_submit:
    trigger: 'Login button click or Enter key'
    enabled_condition: 'Both email && password entered'
    api:
      method: 'POST'
      path: '/api/auth/login'
    result:
      success:
        condition: 'password_changed === true'
        action: 'navigate'
        target_by_role:
          J: '/system/codes'
          C: '/default/data-set'
          M: '/dashboard'
          m: '/dashboard'
          S: '/indicators/entry'

      success_password_change_required:
        condition: 'password_changed === false'
        toast:
          type: 'info'
          message: 'Please change your initial password'
          duration_ms: 3000
        action: 'navigate'
        target: '/password-reset'

      error:
        toast:
          type: 'error'
          message: '{error.message}'
          duration_ms: 5000
        action: 'focus_password_field'
        clear_password: true

validation:
  forms:
    login_form:
      fields:
        email:
          required: true
          type: 'email'
          error_messages:
            required: 'Please enter email'
            type: 'Invalid email format'
        password:
          required: true
          min_length: 8
          error_messages:
            required: 'Please enter password'
            min_length: 'Password must be at least 8 characters'
  trigger: 'on_blur'
  error_display:
    type: 'inline'
    position: 'below_field'

layout:
  type: 'auth'
  container:
    max_width: 400
    center: true
    padding: 32
  background:
    type: 'gradient'
    colors: ['#f0fdf4', '#dcfce7']
  logo:
    position: 'above_form'
    height: 48
```

---

## Checklist

Check when screen spec is complete:

- [ ] All 5 states defined (loading/empty/error/permission/success)
- [ ] All button actions and results defined
- [ ] All API response fields mapped to UI fields
- [ ] empty_display defined for nullable fields
- [ ] Role-based button visibility rules defined
- [ ] Responsive breakpoints defined
- [ ] Error code messages defined
