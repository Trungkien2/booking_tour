# 04. Design System

> Defines colors, typography, spacing, and component specifications.
> Essential for AI to consistently implement "how it looks."

---

## Document Information

| Item              | Value                   |
| ----------------- | ----------------------- |
| Project Name      | `monkeyPlay-Tele-Admin` |
| Design Tool       | Cần xác định            |
| CSS Framework     | SCSS (Sass)             |
| Component Library | Ant Design (antd) 5.21.2 |
| Styling Method    | CSS Modules (.module.scss) |

---

## 1. Color System

### 1.1 Brand Colors

```yaml
brand:
  primary:
    DEFAULT: '#0C0F12' # Main background color
    usage: 'Primary page background'
    scss_var: '$body-bg (to be updated)'

  secondary:
    DEFAULT: '#171D26' # Section/card background
    usage: 'Section backgrounds, card backgrounds, sidebar'
    scss_var: '$main-bg-card, $section-bg (to be updated)'

  button:
    DEFAULT: '#FBBD23' # Primary button color
    usage: 'Primary buttons, active states, selected elements'
    scss_var: '$btn-primary (to be updated)'

  blue:
    DEFAULT: '#3C83F6' # Blue accent color
    usage: 'Links, info states, blue accents'
    scss_var: '$color-blue (to be updated)'

  accent:
    DEFAULT: '#FBBD23' # Same as button (primary accent)
    usage: 'Accent elements, highlights'
```

### 1.2 Semantic Colors

```yaml
semantic:
  success:
    DEFAULT: 'Cần xác định' # Success color to be determined
    usage: 'Success buttons, positive states'
    note: 'May use green variant or button color'

  warning:
    DEFAULT: 'Cần xác định' # Warning color to be determined
    usage: 'Warning states, alerts'
    note: 'May use Ant Design default warning colors or custom'

  error:
    DEFAULT: '#F43E5C' # Danger/error color
    text: '#F43E5C'
    usage: 'Error messages, delete actions, danger states'
    scss_class: '.text-red, .text-danger (to be updated)'

  info:
    DEFAULT: '#3C83F6' # Blue info color
    usage: 'Info messages, informational states'
    note: 'Uses brand blue color'
```

### 1.3 Neutral Colors

```yaml
neutral:
  white: '#fff'
  scss_var: '$text-white'
  usage: 'Primary text color, icons'

  gray:
    gray: '#bcbcbc'
    scss_var: '$text-gray'
    usage: 'Secondary text'
    
    gray2: '#acacac'
    scss_var: '$text-gray2'
    usage: 'Placeholder text, disabled text'
    
    gray3: '#acacac'
    scss_var: '$text-gray3'
    usage: 'Tertiary text'
    
    gray4: '#adadad'
    scss_var: '$text-gray4'
    usage: 'Quaternary text'

  background:
    primary: '#0C0F12' # Primary background
    scss_var: '$body-bg (to be updated)'
    usage: 'Main page background'
    
    section: '#171D26' # Section/card background
    scss_var: '$section-bg, $main-bg-card (to be updated)'
    usage: 'Section backgrounds, card backgrounds, sidebar'
    
    input: '#171D26' # Input field backgrounds (uses section color)
    usage: 'Input field backgrounds'
    
    menu: 'rgba(255, 255, 255, 0.06)' # Menu background
    scss_var: '$menu-bg (to be updated)'
    usage: 'Menu items, navigation backgrounds'

  border:
    stroke: '#7D5A03' # Stroke/border color
    scss_var: '$stroke-color, $border-color (to be updated)'
    usage: 'Default borders, stroke lines'
    
    default: 'rgba(255, 255, 255, 0.1)' # Semi-transparent white (fallback)
    scss_var: '$border-gray'
    usage: 'Subtle borders (if stroke not used)'

  text:
    title: '#7D5A03' # Title color
    scss_var: '$text-title (to be updated)'
    usage: 'Page titles, section titles, headings'
    
    content_title: '#D6C28F' # Content title color
    scss_var: '$text-content-title (to be updated)'
    usage: 'Content titles, card titles, subheadings'

  black: '#000000' # Not explicitly used, body-bg is very dark
```

### 1.4 Dark Mode Mapping

```yaml
dark_mode:
  note: 'System is dark mode only - no light mode variant'
  background:
    primary: '#0C0F12' # Primary background
    section: '#171D26' # Section/card background
    card: '#171D26' # Card backgrounds (uses section color)
    input: '#171D26' # Input field backgrounds
    menu: 'rgba(255, 255, 255, 0.06)' # Menu background

  surface:
    default: '#171D26' # Section background
    sidebar: '#171D26' # Sidebar background
    header: 'Cần xác định' # Header background

  text_primary:
    default: '#fff' # White text
    scss_var: '$text-white'
    title: '#7D5A03' # Title color
    content_title: '#D6C28F' # Content title color

  text_secondary:
    default: '#bcbcbc' # Gray text
    scss_var: '$text-gray'
    placeholder: '#acacac' # Placeholder text
    scss_var: '$text-gray2'

  border:
    stroke: '#7D5A03' # Stroke/border color
    default: 'rgba(255, 255, 255, 0.1)' # Semi-transparent white (fallback)
    scss_var: '$stroke-color, $border-gray'
```

### 1.5 SCSS Variables Configuration

```scss
// src/assets/styles/variables.scss
// Color variables (updated design system colors)

// Background colors
$body-bg: #0C0F12 !default; // Primary background
$section-bg: #171D26 !default; // Section/card background
$main-bg-card: #171D26 !default; // Card backgrounds (uses section)
$menu-bg: rgba(255, 255, 255, 0.06) !default; // Menu background

// Brand colors
$btn-primary: #FBBD23 !default; // Primary button color
$color-blue: #3C83F6 !default; // Blue accent color

// Semantic colors
$color-danger: #F43E5C !default; // Danger/error color

// Border/Stroke colors
$stroke-color: #7D5A03 !default; // Stroke/border color
$border-color: #7D5A03 !default; // Border color (uses stroke)
$border-gray: 1px solid rgba(255, 255, 255, 0.1) !default; // Fallback border

// Text colors
$text-white: #fff !default; // Primary text
$text-title: #7D5A03 !default; // Title color
$text-content-title: #D6C28F !default; // Content title color
$text-gray: #bcbcbc !default; // Secondary text
$text-gray2: #acacac !default; // Placeholder text
$text-gray3: #acacac !default; // Tertiary text
$text-gray4: #adadad !default; // Quaternary text
$text-danger: #F43E5C !default; // Error text

// Legacy variables (to be migrated)
// $text-linear-yellow: #0098ea !default; // Deprecated - use $btn-primary
// $bg-btn-linear-blue: #0098ea !default; // Deprecated - use $color-blue
// $bg-linear-green: #373328; // Deprecated - use $section-bg

// Usage in components:
@use '@/assets/styles/variables' as *;
.my-component {
  background: $section-bg;
  color: $text-white;
  border: 1px solid $stroke-color;
}

.title {
  color: $text-title;
}

.content-title {
  color: $text-content-title;
}

.button-primary {
  background: $btn-primary;
  color: $body-bg; // Dark text on light button
}
```

---

## 2. Typography

### 2.1 Font Family

```yaml
fonts:
  primary:
    family: 'Inter'
    weights: [400, 500, 700, 900]
    usage: 'Body text, UI elements, headings'
    files: 
      - 'inter-v18-latin-300.woff2 (400)'
      - 'Inter-Regular.woff2 (500)'
      - 'Inter-SemiBold.woff2 (700)'
      - 'Inter-Bold.woff2 (900)'
    default: 'font-family: Inter; font-weight: 500'

  secondary:
    family: 'Red Hat Display'
    weights: [400, 500, 700, 900]
    usage: 'Buttons, labels, UI elements'
    files:
      - 'red-hat-display-v19-latin-regular.woff2 (400)'
      - 'red-hat-display-v19-latin-500.woff2 (500)'
      - 'red-hat-display-v19-latin-700.woff2 (700)'
      - 'red-hat-display-v19-latin-900.woff2 (900)'

  tertiary:
    family: 'Roboto'
    weights: '100-900 (variable font)'
    usage: 'Input fields, form labels'
    file: 'Roboto-Regular.woff2'

  quaternary:
    family: 'Mulish'
    weights: [400]
    usage: 'Cần xác định'
    file: 'mulish-latin-regular.woff2'
```

### 2.2 Font Size Scale

```yaml
# ⭐ Actual font sizes from codebase
font_sizes:
  xs:
    size: '12px'
    line_height: '16px'
    usage: 'Small labels, captions'
    class: '.text-small-red-hat'
    responsive: '10px on mobile (max-width: 768px)'

  sm:
    size: '14px'
    line_height: '20px'
    usage: 'Secondary text, small buttons'
    example: 'Button outline variant'

  base:
    size: '16px'
    line_height: '20px'
    usage: 'Body text, input fields, default buttons'
    class: '.text-normal-red-hat, .text-adornment'
    font_family: 'Roboto (inputs), Red Hat Display (buttons)'

  lg:
    size: '18px'
    line_height: 'Cần xác định'
    usage: 'Buttons, subheadings'
    example: 'Button circle variant, green variant'
    font_weight: '500'

  xl:
    size: '20px'
    line_height: 'Cần xác định'
    usage: 'Section headings, large buttons'
    example: 'CommonCard footer buttons'

  2xl:
    size: '24px'
    line_height: 'normal'
    usage: 'Card headers, section titles'
    example: 'CommonCard header'
    font_weight: '500'

  # Note: Larger sizes may exist but not documented in variables
  # Check individual components for specific sizes
```

### 2.3 Font Weight

```yaml
font_weights:
  normal:
    value: 400
    tailwind: 'font-normal'
    usage: 'Body text'

  medium:
    value: 500
    tailwind: 'font-medium'
    usage: 'Emphasis, buttons'

  semibold:
    value: 600
    tailwind: 'font-semibold'
    usage: 'Subheading'

  bold:
    value: 700
    tailwind: 'font-bold'
    usage: 'Heading'
```

### 2.4 Text Style Presets

```yaml
text_styles:
  heading_1:
    size: 'text-3xl (30px)'
    weight: 'font-bold (700 or 900)'
    color: '#7D5A03' # Title color
    scss_var: '$text-title'
    usage: 'Page main title'
    font_family: 'Inter'

  heading_2:
    size: 'text-2xl (24px)'
    weight: 'font-semibold (600)'
    color: '#7D5A03' # Title color
    scss_var: '$text-title'
    usage: 'Section title'
    font_family: 'Inter'

  heading_3:
    size: 'text-xl (20px)'
    weight: 'font-semibold (600)'
    color: '#D6C28F' # Content title color
    scss_var: '$text-content-title'
    usage: 'Card/modal title, content titles'
    font_family: 'Inter'

  body:
    size: 'text-base (16px)'
    weight: 'font-normal (400 or 500)'
    color: '#fff' # White text
    scss_var: '$text-white'
    usage: 'General body text'
    font_family: 'Inter or Roboto'

  body_small:
    size: 'text-sm (14px)'
    weight: 'font-normal (400)'
    color: '#bcbcbc' # Gray text
    scss_var: '$text-gray'
    usage: 'Secondary description'
    font_family: 'Inter'

  caption:
    size: 'text-xs (12px)'
    weight: 'font-normal (400)'
    color: '#acacac' # Placeholder/gray text
    scss_var: '$text-gray2'
    usage: 'Date, meta information, captions'
    font_family: 'Inter or Red Hat Display'

  label:
    size: 'text-sm (14px)'
    weight: 'font-medium (500)'
    color: '#D6C28F' # Content title color
    scss_var: '$text-content-title'
    usage: 'Form label, input labels'
    font_family: 'Roboto or Inter'
```

---

## 3. Spacing System

### 3.1 Base Spacing (Spacing Scale)

```yaml
# ⭐ 4px-based scale
spacing:
  0: '0px'
  1: '4px' # Between icon and text
  2: '8px' # Between inline elements
  3: '12px' # Small card padding
  4: '16px' # Base padding, between form fields
  5: '20px'
  6: '24px' # Internal section padding
  8: '32px' # Between sections
  10: '40px'
  12: '48px' # Page margin
  16: '64px' # Large section divider
  20: '80px'
  24: '96px' # Page top/bottom margin
```

### 3.2 Component Spacing Rules

```yaml
component_spacing:
  button:
    padding_x:
      sm: '12px'
      md: '16px'
      lg: '24px'
    padding_y:
      sm: '8px'
      md: '10px'
      lg: '12px'
    gap: '8px' # Icon-text spacing

  input:
    padding_x: '12px'
    padding_y: '10px'
    label_gap: '6px' # Between label and input
    helper_gap: '4px' # Between input and helper text

  card:
    padding: '24px'
    gap: '16px' # Between card elements
    border_radius: '8px'

  modal:
    padding: '24px'
    header_gap: '16px'
    footer_gap: '24px'

  table:
    cell_padding_x: '16px'
    cell_padding_y: '12px'
    header_padding_y: '14px'

  form:
    field_gap: '24px' # Between form fields
    section_gap: '32px' # Between form sections
```

### 3.3 Layout Spacing

```yaml
layout_spacing:
  page:
    padding_x:
      mobile: '16px'
      tablet: '24px'
      desktop: '32px'
    padding_y:
      mobile: '16px'
      tablet: '24px'
      desktop: '32px'
    max_width: '1440px'

  sidebar:
    width_collapsed: '64px'
    width_expanded: '256px'

  header:
    height: '64px'

  content:
    max_width: '1200px'
    gap: '24px'
```

---

## 4. Component Specifications

### 4.1 Button

```yaml
button:
  component: 'src/components/Ui/Button/index.tsx'
  variants:
    - name: 'primary'
      padding: '8px 16px (varies)'
      font_family: 'Red Hat Display'
      font_size: '14px-18px (responsive)'
      font_weight: '500'
      background: '#FBBD23' # Primary button color
      border: '1px solid #7D5A03' # Stroke color
      border_radius: '8px or 100px (varies)'
      color: '#0C0F12' # Dark text on light button
      scss_var: '$btn-primary'
      usage: 'Primary actions, main CTAs'

    - name: 'outline'
      padding: '8px'
      font_family: 'Red Hat Display'
      font_size: '14px (12px on mobile)'
      background: '#171D26' # Section background
      border: '1px solid #7D5A03' # Stroke color
      border_radius: '8px'
      color: '$text-white'
      width: 'max-content'

    - name: 'circle'
      padding: '8px 16px (desktop), 14px 30px (some cases)'
      font_size: '18px (15px on mobile)'
      font_weight: '500'
      background: '#171D26' # Section background
      border: '1px solid #7D5A03' # Stroke color
      border_radius: '100px'
      color: '$text-gray3'

    - name: 'danger'
      background: '#F43E5C' # Danger color
      border: '1px solid #F43E5C'
      color: '$text-white'
      scss_var: '$color-danger'
      usage: 'Delete actions, destructive operations'

    - name: 'blue'
      background: '#3C83F6' # Blue color
      border: '1px solid #3C83F6'
      color: '$text-white'
      scss_var: '$color-blue'
      usage: 'Info actions, secondary CTAs'

    - name: 'green'
      padding: '16px 24px'
      font_size: '18px (12px on mobile)'
      font_weight: '500'
      background: 'Cần xác định' # Success color to be determined
      border: '1px solid (to be determined)'
      border_radius: '100px'
      color: '$text-white'
      usage: 'Success actions (legacy - may use primary button)'

    - name: 'modal'
      usage: 'Modal footer buttons'
      # Styles: Cần xác định - likely uses primary or outline variant

    - name: 'modalBlue'
      usage: 'Primary modal action'
      background: '#FBBD23' # Uses primary button color
      color: '#0C0F12'

    - name: 'modalRed'
      usage: 'Danger modal action'
      background: '#F43E5C' # Uses danger color
      color: '$text-white'

    - name: 'success'
      usage: 'Success actions'
      # Styles: Cần xác định - may use primary button or custom success color

    - name: 'warning'
      usage: 'Warning actions'
      # Styles: Cần xác định

  states:
    active:
      variant: 'outlineActive'
      background: '#FBBD23' # Primary button color when active
      color: '#0C0F12'
      border: '1px solid #7D5A03'

    hover:
      primary: 'Lighter shade of #FBBD23 or opacity change'
      outline: 'Background change or border highlight'
      # Styles: Cần xác định

    disabled:
      opacity: '0.5 or 0.6'
      cursor: 'not-allowed'
      # Styles: Cần xác định
      note: 'Check Button component for disabled styles'

    loading:
      # Implementation: Cần xác định
      note: 'May use Ant Design Button loading prop'
```

### 4.2 Input

```yaml
input:
  component: 'src/components/Ui/Input/InputField.tsx, InputSearchHeader.tsx'
  base_style:
    background: '#171D26' # Section background
    border: '1px solid #7D5A03' # Stroke color
    border_radius: '12px (InputField), 100px (InputSearchHeader)'
    padding: '8px 14px'
    font_family: 'Roboto'
    font_size: '16px (12px on mobile)'
    line_height: '20px'
    color: '$text-white'
    placeholder_color: '$text-gray2 (#acacac)'
    scss_var: '$section-bg, $stroke-color'

  variants:
    - name: 'default'
      class: '.inputFiled'
      background: '#171D26' # Section background
      border: '1px solid #7D5A03' # Stroke color

    - name: 'blue'
      class: '.inputFiled.blue'
      background: '#0C0F12' # Primary background
      border: '1px solid #7D5A03' # Stroke color
      font_size: '14px'

    - name: 'search'
      class: '.InputSearchHeader'
      background: '#171D26' # Section background (updated from legacy)
      border: '1px solid #7D5A03' # Stroke color
      border_radius: '100px'
      height: '46px'

    - name: 'adornment'
      class: '.inputFiled.adornment'
      padding: '0'
      icon_padding: '8px 8px 8px 14px'
      icon_border: '1px solid #7D5A03' # Stroke color (right border)

  states:
    disabled:
      background: 'rgba(255, 255, 255, 0.06)' # Menu background color
      opacity: '0.5'
      cursor: 'not-allowed'
      class: '.disabled'

    focus:
      border: '1px solid #FBBD23' # Primary button color on focus
      outline: 'none'
      # Styles: Cần xác định
      note: 'May use Ant Design Input focus styles'

    error:
      border: '1px solid #F43E5C' # Danger color
      color: '#F43E5C' # Error text color
      # Styles: Cần xác định
      note: 'Error handling via Ant Design Form.Item'

  helper_text:
    default: 'color: $text-gray2'
    error: 'color: #F43E5C' # Danger color
    # Implementation: Cần xác định
    note: 'May use Ant Design Form.Item help/error messages'

  label:
    color: '$text-content-title (#D6C28F)' # Content title color
    # Implementation: Cần xác định
    note: 'May use Ant Design Form.Item label'
```

### 4.3 Select / Dropdown

```yaml
select:
  trigger:
    style: 'Same as Input'
    icon: 'ChevronDown positioned right'

  dropdown:
    bg: 'bg-white dark:bg-gray-800'
    border: 'border border-gray-200 dark:border-gray-700'
    shadow: 'shadow-lg'
    border_radius: 'rounded-md'
    max_height: '320px' # Scroll

  option:
    padding: 'px-3 py-2'
    hover: 'bg-gray-100 dark:bg-gray-700'
    selected: 'bg-primary/10 text-primary'
    disabled: 'text-gray-400 cursor-not-allowed'

  search: # Searchable select
    input_style: 'sticky top-0 p-2 border-b'
```

### 4.4 Modal / Dialog

```yaml
modal:
  overlay:
    bg: 'bg-black/50'
    animation: 'fade-in 150ms'

  container:
    bg: 'bg-white dark:bg-gray-800'
    border_radius: 'rounded-lg'
    shadow: 'shadow-xl'
    max_height: '90vh'
    animation: 'slide-up 200ms'

  sizes:
    sm: 'max-w-md' # 400px
    md: 'max-w-lg' # 512px
    lg: 'max-w-2xl' # 672px
    xl: 'max-w-4xl' # 896px
    full: 'max-w-[90vw]'

  structure:
    header:
      padding: 'px-6 py-4'
      border: 'border-b border-gray-200'
      title: 'text-lg font-semibold'
      close_button: 'absolute right-4 top-4'

    body:
      padding: 'px-6 py-4'
      overflow: 'overflow-y-auto'

    footer:
      padding: 'px-6 py-4'
      border: 'border-t border-gray-200'
      layout: 'flex justify-end gap-3'
```

### 4.5 Table

```yaml
table:
  container:
    border: 'border border-gray-200 rounded-lg'
    overflow: 'overflow-hidden'

  header:
    bg: 'bg-gray-50 dark:bg-gray-800'
    text: 'text-sm font-semibold text-gray-700'
    padding: 'px-4 py-3'
    border: 'border-b border-gray-200'
    sort_icon: 'ml-1 text-gray-400'

  body:
    row:
      border: 'border-b border-gray-100'
      hover: 'hover:bg-gray-50'
      selected: 'bg-primary/5'

    cell:
      text: 'text-sm text-gray-600'
      padding: 'px-4 py-3'
      truncate: 'truncate max-w-[200px]'

  empty_state:
    padding: 'py-12'
    icon: 'text-gray-300 w-12 h-12'
    text: 'text-gray-500'

  loading:
    skeleton_rows: 5
    skeleton_style: 'animate-pulse bg-gray-200 rounded'

  pagination:
    position: 'border-t border-gray-200 px-4 py-3'
    layout: 'flex justify-between items-center'
```

### 4.6 Toast / Notification

```yaml
toast:
  position: 'top-right' # or bottom-right
  offset: '24px'
  gap: '12px' # Spacing between toasts
  max_visible: 5
  auto_dismiss: '5000ms'

  variants:
    success:
      bg: 'bg-success-bg'
      border: 'border border-success'
      icon: 'CheckCircle text-success'
      text: 'text-success-text'

    error:
      bg: 'bg-error-bg'
      border: 'border border-error'
      icon: 'XCircle text-error'
      text: 'text-error-text'

    warning:
      bg: 'bg-warning-bg'
      border: 'border border-warning'
      icon: 'AlertTriangle text-warning'
      text: 'text-warning-text'

    info:
      bg: 'bg-info-bg'
      border: 'border border-info'
      icon: 'Info text-info'
      text: 'text-info-text'

  structure:
    padding: 'p-4'
    border_radius: 'rounded-lg'
    shadow: 'shadow-md'
    width: 'min-w-[320px] max-w-[420px]'
    close_button: 'absolute top-2 right-2'
```

### 4.7 Badge / Tag

```yaml
badge:
  base:
    padding: 'px-2.5 py-0.5'
    border_radius: 'rounded-full'
    text: 'text-xs font-medium'

  variants:
    - name: 'default'
      bg: 'bg-gray-100'
      text: 'text-gray-700'

    - name: 'primary'
      bg: 'bg-primary/10'
      text: 'text-primary'

    - name: 'success'
      bg: 'bg-success-bg'
      text: 'text-success-text'

    - name: 'warning'
      bg: 'bg-warning-bg'
      text: 'text-warning-text'

    - name: 'error'
      bg: 'bg-error-bg'
      text: 'text-error-text'

# Status badge mapping example
status_badge_mapping:
  draft: 'default'
  pending: 'warning'
  approved: 'success'
  rejected: 'error'
```

---

## 5. Icon System

### 5.1 Icon Library

```yaml
icon_library: 'lucide-react'
icon_sizes:
  xs: '12px' # Inside Badge
  sm: '16px' # Button small
  md: '20px' # Button default, input
  lg: '24px' # Button large, navigation
  xl: '32px' # Empty state, emphasis
  2xl: '48px' # Illustration
```

### 5.2 Common Icon Mapping

```yaml
icon_mapping:
  # Actions
  add: 'Plus'
  edit: 'Pencil'
  delete: 'Trash2'
  save: 'Check'
  cancel: 'X'
  search: 'Search'
  filter: 'Filter'
  sort: 'ArrowUpDown'
  download: 'Download'
  upload: 'Upload'
  refresh: 'RefreshCw'
  settings: 'Settings'

  # Status
  success: 'CheckCircle'
  error: 'XCircle'
  warning: 'AlertTriangle'
  info: 'Info'
  loading: 'Loader2' # animate-spin

  # Navigation
  menu: 'Menu'
  close: 'X'
  back: 'ArrowLeft'
  forward: 'ArrowRight'
  expand: 'ChevronDown'
  collapse: 'ChevronUp'
  external: 'ExternalLink'

  # UI
  user: 'User'
  logout: 'LogOut'
  notification: 'Bell'
  help: 'HelpCircle'
  more: 'MoreHorizontal'
  visibility_on: 'Eye'
  visibility_off: 'EyeOff'
```

---

## 6. Animations & Transitions

### 6.1 Transition Duration

```yaml
transition_duration:
  fast: '150ms' # Hover, focus
  normal: '200ms' # Modal, dropdown
  slow: '300ms' # Page transition
  slower: '500ms' # Complex animation
```

### 6.2 Common Animations

```yaml
animations:
  fade_in:
    from: 'opacity-0'
    to: 'opacity-100'
    duration: '200ms'

  slide_up:
    from: 'opacity-0 translate-y-4'
    to: 'opacity-100 translate-y-0'
    duration: '200ms'

  slide_down:
    from: 'opacity-0 -translate-y-4'
    to: 'opacity-100 translate-y-0'
    duration: '200ms'

  scale_in:
    from: 'opacity-0 scale-95'
    to: 'opacity-100 scale-100'
    duration: '150ms'

  spin:
    animation: 'animate-spin'
    duration: '1000ms'
    timing: 'linear'
```

---

## 7. Accessibility (A11y)

### 7.1 Color Contrast

```yaml
contrast_requirements:
  normal_text: '4.5:1' # WCAG AA
  large_text: '3:1' # 18px+ or 14px+ bold
  ui_components: '3:1' # Buttons, icons
```

### 7.2 Focus Style

```yaml
focus_style:
  ring: 'ring-2 ring-primary/50 ring-offset-2'
  outline: 'outline-none'
  visible: 'focus-visible:' # Keyboard navigation only
```

### 7.3 Required ARIA Attributes

```yaml
aria_requirements:
  button:
    - 'aria-label (when icon only)'
    - 'aria-disabled'
    - 'aria-pressed (toggle)'

  input:
    - 'aria-label or aria-labelledby'
    - 'aria-invalid'
    - 'aria-describedby (error message)'
    - 'aria-required'

  modal:
    - "role='dialog'"
    - "aria-modal='true'"
    - 'aria-labelledby (title)'
    - 'aria-describedby (description)'

  table:
    - "role='table'"
    - "scope='col' (header)"
    - 'aria-sort (sorting)'
```

---

## 8. Available UI Components

### 8.1 Component List (src/components/Ui/)

```yaml
components:
  - Back/                    # Back button/navigation
  - Badge/                   # Badge component
  - Button/                  # Button component (multiple variants)
  - CardItem/                # Card item component
  - CardItemWithViewMore/    # Card with view more functionality
  - CashFlowChart/           # Cash flow chart (amcharts)
  - Checkbox/                # Checkbox component
  - ColorPicker/             # Color picker
  - ColumnChart/             # Column chart
  - ColumnChart3D/           # 3D column chart
  - CommonCard/              # Common card wrapper
  - DateNotRangePicker/      # Date picker (single date)
  - DatePicker/              # Date range picker
  - DonutChart3D/            # 3D donut chart
  - DragAndDropFile/         # File drag and drop
  - DrawerMenu/              # Drawer menu
  - Dropdown/                # Dropdown component
  - Flex/                    # Flex layout component
  - IconButton/              # Icon button
  - Image/                   # Image component
  - Input/                   # Input component (InputField, InputSearchHeader)
  - InputEdit/               # Editable input
  - ListAndShow/             # List with show more
  - MailBoxChat/             # Mailbox chat component
  - MainCard/                # Main card component
  - MyDropdown/              # Custom dropdown
  - MyEditor/                # Rich text editor (TipTap)
  - OrganizationChart/       # Organization chart
  - Overview/                # Overview component
  - PDFView/                 # PDF viewer
  - PieChart/               # Pie chart
  - PopularChart/            # Popular chart
  - Radio/                   # Radio button
  - SegmentSelect/           # Segment selector
  - Select/                  # Select component
  - SelectDate/              # Date selector
  - SwitchOnOff/             # Toggle switch
  - TableData/               # Data table
  - TableReposts/            # Reports table
  - TableTotal/              # Table with totals
  - TabsFillDay/             # Day tabs
  - Tag/                     # Tag component
  - TextArea/                # Textarea component
  - ToolBarChat/             # Chat toolbar
  - TransactionStatusCell/   # Transaction status cell
  - Upload/                  # File upload
  - WalletItem/              # Wallet item display
  - WhitelistIpsDisplay/     # Whitelist IPs display
  - WrapperButtonGradient/  # Gradient button wrapper

note: 'All components use CSS Modules (.module.scss) for styling'
```

### 8.2 Modal Components (src/components/Modal/)

```yaml
modals:
  count: '138 modal components'
  structure:
    - body/                  # Modal body content (domain-specific)
      - AccountSetting/      # Account setting modals
      - CreateUser/          # User creation modal
      - EditUser/            # User editing modal
      - ... (many more)
    - layout/                # Modal layout components
      - ModalHeader.tsx
      - ModalBody.tsx
      - ModalFooter.tsx
    - index.tsx              # RootModal wrapper

note: 'Modals use centralized RootModal system'
```

## Checklist

Check when Design System is complete:

- [x] Brand color HEX values specified
- [x] Semantic colors (success/warning/error/info) defined
- [x] Typography scale defined
- [ ] Spacing system defined (Cần xác định - check components)
- [x] Major component specifications defined
- [ ] State-specific styles (hover/active/disabled/error) specified (Partial - Cần xác định)
- [x] Dark mode mapping defined (Dark mode only)
- [ ] Accessibility requirements specified (Cần xác định)
- [x] Available UI components documented
