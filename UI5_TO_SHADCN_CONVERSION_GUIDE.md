# UI5 to shadcn-ui5 Component Conversion Guide

## The Modern AI-Ready Component Conversion Methodology

This guide documents the comprehensive process for converting UI5 Web Components into modern, AI-ready shadcn-ui5 React components. The goal is to demonstrate how modern component architecture with Tailwind CSS and React provides superior flexibility, theming, and AI integration capabilities compared to traditional web components, while maintaining full enterprise feature parity.

---

## Table of Contents

1. [Philosophy & Goals](#philosophy--goals)
2. [Pre-Conversion Analysis](#pre-conversion-analysis)
3. [Component Architecture Design](#component-architecture-design)
4. [Conversion Process](#conversion-process)
5. [AI-Ready Features](#ai-ready-features)
6. [Testing Strategy](#testing-strategy)
7. [Quality Assurance with Ralph Wiggum](#quality-assurance-with-ralph-wiggum)
8. [Documentation & Examples](#documentation--examples)
9. [Performance Optimization](#performance-optimization)
10. [Checklist for Future Conversions](#checklist-for-future-conversions)

---

## Philosophy & Goals

### Core Principles

1. **AI-First Design**: Components should be easily understood, generated, and modified by AI
2. **Composability Over Configuration**: Prefer composition patterns over complex props
3. **Tailwind-Native**: Use Tailwind utilities for all styling (no CSS-in-JS or CSS modules)
4. **Type-Safe**: Full TypeScript coverage with comprehensive types
5. **Accessible by Default**: WCAG 2.1 AA compliance minimum
6. **Enterprise-Ready**: Feature parity with UI5 enterprise capabilities
7. **Performance-First**: Optimized for large datasets and complex interactions
8. **Theme Flexibility**: Easy theming via Tailwind config and CSS variables

### Why Modern React > Web Components

**Advantages we're showcasing:**
- **Better DX**: TypeScript autocomplete, better tooling, easier debugging
- **Composition**: Slot-based architecture vs. React composition
- **Styling Flexibility**: Tailwind utilities vs. Shadow DOM CSS limitations
- **AI Generation**: Easier for AI to understand and generate React + Tailwind code
- **Performance**: Better optimization opportunities (React.memo, useMemo, virtualization)
- **Testing**: Simpler unit testing without Shadow DOM complexity
- **State Management**: Direct integration with React state, context, and stores
- **Bundle Size**: Tree-shaking and code-splitting advantages

---

## Pre-Conversion Analysis

### Step 1: Component Discovery

For each component you want to convert (e.g., Table):

```bash
# Find all related component files
find packages/main/src -name "*Table*"
find packages/fiori/src -name "*Table*"

# Find test files
find packages/main/cypress/specs -name "*Table*"
find packages/main/test/pages -name "*Table*"

# Find documentation samples
find packages/website/docs/_samples -name "*Table*"
```

### Step 2: Feature Extraction

Create a comprehensive feature document by analyzing:

**A. Props & Attributes**
- Read the main component TypeScript file
- Extract all `@property()` decorators
- Document default values, types, and descriptions
- Note deprecated props

**B. Events**
- Extract all `@event()` decorators
- Document event detail structure
- Note event timing and cancelability

**C. Slots & Child Components**
- Identify all `@slot()` decorators
- Map component hierarchies
- Document slot relationships

**D. Accessibility Features**
- Extract ARIA attributes from templates
- Document keyboard navigation from navigation handlers
- List all i18n keys used
- Document screen reader announcements

**E. Enterprise Features**
- Selection modes (single, multi, none)
- Sorting capabilities
- Filtering support
- Grouping logic
- Virtualization implementation
- Lazy loading / growing features
- Drag-and-drop support
- Export capabilities

**F. States**
- Component states (loading, empty, error, disabled)
- Row/cell states
- Interactive states
- Visual states

**G. Theming**
- Extract CSS variables from theme files
- Document Fiori design tokens used
- Note theme-specific behaviors

**H. Test Coverage**
- Review test files for edge cases
- Document test scenarios
- Note accessibility tests

### Step 3: Documentation Template

Create a feature document (see example below):

```markdown
# [Component Name] - Feature Analysis

## 1. Props/Attributes
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| ... | ... | ... | ... |

## 2. Events
| Event | Detail | Description |
|-------|--------|-------------|
| ... | ... | ... |

## 3. Child Components
- Component hierarchy tree
- Slot relationships

## 4. Accessibility
- ARIA attributes
- Keyboard navigation map
- i18n keys
- Screen reader behavior

## 5. Enterprise Features
- Feature list with descriptions

## 6. States
- All component states

## 7. Theming
- CSS variables
- Theme tokens

## 8. Test Scenarios
- Key test cases to replicate
```

---

## Component Architecture Design

### Step 4: Design the React Architecture

**Key Decisions:**

1. **Component Hierarchy**
   - Break down into logical sub-components
   - Follow React composition patterns
   - Avoid prop drilling with context where appropriate

2. **State Management**
   - Local state for component-specific data
   - Context for shared state (selection, virtualization)
   - Controlled vs. uncontrolled patterns

3. **Styling Strategy**
   - Tailwind utilities for all styling
   - CSS variables for theme values
   - `cn()` utility for conditional classes
   - Variants via `class-variance-authority` (cva)

4. **Type System**
   - Strong TypeScript types
   - Generic types for data
   - Discriminated unions for variants
   - Exported types for consumers

5. **Accessibility Architecture**
   - ARIA attributes via props
   - Keyboard navigation via hooks
   - Focus management
   - Screen reader announcements

### Step 5: Create Component Structure

**File Organization:**

```
packages/shadcn-ui5/src/components/table/
├── index.ts                      # Public exports
├── table.tsx                     # Main Table component
├── table-header.tsx              # Header component
├── table-body.tsx                # Body component
├── table-row.tsx                 # Row component
├── table-cell.tsx                # Cell component
├── table-head.tsx                # Header cell component
├── hooks/
│   ├── use-table-state.ts        # Main state hook
│   ├── use-selection.ts          # Selection logic
│   ├── use-virtualization.ts     # Virtual scrolling
│   ├── use-keyboard-navigation.ts # Keyboard handling
│   ├── use-sorting.ts            # Sort logic
│   └── use-accessibility.ts      # A11y helpers
├── context/
│   └── table-context.tsx         # Shared table state
├── types.ts                      # TypeScript types
└── utils.ts                      # Utility functions
```

**Example Component Structure:**

```typescript
// table.tsx
export interface TableProps<TData> {
  // Props mirror UI5 attributes but follow React conventions
  data: TData[]
  columns: ColumnDef<TData>[]
  onRowClick?: (row: TData) => void
  loading?: boolean
  loadingDelay?: number
  noDataText?: string
  alternateRowColors?: boolean
  // ...enterprise features
  selection?: 'single' | 'multi' | 'none'
  virtualization?: boolean
  sortable?: boolean
  // ...accessibility
  ariaLabel?: string
  ariaLabelledBy?: string
  // ...styling (Tailwind-first)
  className?: string
  // ...AI-ready features
  aiContext?: TableAIContext
}

export function Table<TData>({ ... }: TableProps<TData>) {
  // Implementation
}

// Child components follow similar pattern
Table.Header = TableHeader
Table.Body = TableBody
Table.Row = TableRow
Table.Cell = TableCell
Table.Head = TableHead
```

---

## Conversion Process

### Step 6: Implement Core Component

**A. Base Component**

1. Create the main component file
2. Define comprehensive TypeScript interfaces
3. Implement component skeleton with all props
4. Add className support with `cn()` utility
5. Wire up ref forwarding

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TableProps<TData>
  extends React.HTMLAttributes<HTMLTableElement> {
  // ... (as designed in Step 5)
}

const Table = React.forwardRef<HTMLTableElement, TableProps<any>>(
  <TData,>({ className, ...props }: TableProps<TData>, ref) => {
    return (
      <div className={cn("relative w-full overflow-auto", className)}>
        <table
          ref={ref}
          className={cn(
            "w-full caption-bottom text-sm",
            props.className
          )}
          {...props}
        />
      </div>
    )
  }
) as <TData>(
  props: TableProps<TData> & { ref?: React.Ref<HTMLTableElement> }
) => React.ReactElement

Table.displayName = "Table"

export { Table }
```

**B. Child Components**

Create all child components following the same pattern:
- TableHeader
- TableBody
- TableRow
- TableCell
- TableHead

Each should:
- Forward refs
- Accept className
- Use Tailwind utilities
- Support variants via `cva` if needed

### Step 7: Implement Enterprise Features

**A. Selection**

```typescript
// hooks/use-selection.ts
export function useSelection<TData>({
  mode,
  data,
  onSelectionChange,
}: UseSelectionOptions<TData>) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  const toggleSelection = (id: string) => {
    if (mode === 'single') {
      setSelected(new Set([id]))
    } else if (mode === 'multi') {
      const newSelected = new Set(selected)
      if (newSelected.has(id)) {
        newSelected.delete(id)
      } else {
        newSelected.add(id)
      }
      setSelected(newSelected)
    }
    onSelectionChange?.(Array.from(selected))
  }

  const selectAll = () => {
    if (mode === 'multi') {
      setSelected(new Set(data.map((_, i) => String(i))))
    }
  }

  const clearSelection = () => setSelected(new Set())

  return {
    selected,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected: (id: string) => selected.has(id),
  }
}
```

**B. Sorting**

```typescript
// hooks/use-sorting.ts
export function useSorting<TData>({
  data,
  columns,
}: UseSortingOptions<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const sortedData = React.useMemo(() => {
    if (!sorting.length) return data

    return [...data].sort((a, b) => {
      for (const sort of sorting) {
        const column = columns.find(c => c.id === sort.id)
        if (!column?.sortingFn) continue

        const result = column.sortingFn(a, b)
        if (result !== 0) {
          return sort.desc ? -result : result
        }
      }
      return 0
    })
  }, [data, sorting, columns])

  const toggleSort = (columnId: string) => {
    setSorting(prev => {
      const existing = prev.find(s => s.id === columnId)
      if (!existing) return [{ id: columnId, desc: false }]
      if (!existing.desc) return [{ id: columnId, desc: true }]
      return []
    })
  }

  return { sortedData, sorting, toggleSort }
}
```

**C. Virtualization**

```typescript
// hooks/use-virtualization.ts
import { useVirtualizer } from '@tanstack/react-virtual'

export function useVirtualization<TData>({
  data,
  parentRef,
  rowHeight = 48,
  overscan = 5,
}: UseVirtualizationOptions<TData>) {
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  })

  return {
    virtualItems: virtualizer.getVirtualItems(),
    totalSize: virtualizer.getTotalSize(),
    scrollToIndex: virtualizer.scrollToIndex,
  }
}
```

**D. Growing/Lazy Loading**

```typescript
// hooks/use-growing.ts
export function useGrowing<TData>({
  data,
  pageSize = 20,
  mode = 'button',
  onLoadMore,
}: UseGrowingOptions<TData>) {
  const [displayedCount, setDisplayedCount] = React.useState(pageSize)

  const visibleData = React.useMemo(
    () => data.slice(0, displayedCount),
    [data, displayedCount]
  )

  const loadMore = () => {
    const newCount = Math.min(displayedCount + pageSize, data.length)
    setDisplayedCount(newCount)
    onLoadMore?.(newCount)
  }

  const hasMore = displayedCount < data.length

  // Auto-load on scroll if mode is 'scroll'
  React.useEffect(() => {
    if (mode === 'scroll' && hasMore) {
      // Implement intersection observer for auto-loading
    }
  }, [mode, hasMore])

  return { visibleData, loadMore, hasMore }
}
```

### Step 8: Implement Accessibility

**A. Keyboard Navigation**

```typescript
// hooks/use-keyboard-navigation.ts
export function useKeyboardNavigation({
  rowCount,
  columnCount,
  onNavigate,
}: UseKeyboardNavigationOptions) {
  const [focusedCell, setFocusedCell] = React.useState({ row: 0, col: 0 })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const { row, col } = focusedCell

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        setFocusedCell({ row: Math.max(0, row - 1), col })
        break
      case 'ArrowDown':
        e.preventDefault()
        setFocusedCell({ row: Math.min(rowCount - 1, row + 1), col })
        break
      case 'ArrowLeft':
        e.preventDefault()
        setFocusedCell({ row, col: Math.max(0, col - 1) })
        break
      case 'ArrowRight':
        e.preventDefault()
        setFocusedCell({ row, col: Math.min(columnCount - 1, col + 1) })
        break
      case 'Home':
        e.preventDefault()
        setFocusedCell({ row: e.ctrlKey ? 0 : row, col: 0 })
        break
      case 'End':
        e.preventDefault()
        setFocusedCell({
          row: e.ctrlKey ? rowCount - 1 : row,
          col: columnCount - 1
        })
        break
      case 'PageUp':
        e.preventDefault()
        setFocusedCell({ row: Math.max(0, row - 10), col })
        break
      case 'PageDown':
        e.preventDefault()
        setFocusedCell({ row: Math.min(rowCount - 1, row + 10), col })
        break
      case ' ':
        if (e.target === e.currentTarget) {
          e.preventDefault()
          // Handle selection toggle
        }
        break
    }

    onNavigate?.(focusedCell)
  }

  return { focusedCell, handleKeyDown }
}
```

**B. ARIA Attributes**

```typescript
// hooks/use-accessibility.ts
export function useAccessibility<TData>({
  selection,
  sorting,
  rowCount,
  columnCount,
}: UseAccessibilityOptions<TData>) {
  const tableProps = {
    role: 'grid',
    'aria-rowcount': rowCount,
    'aria-colcount': columnCount,
    'aria-multiselectable': selection === 'multi' ? true : undefined,
  }

  const getRowProps = (index: number, selected: boolean) => ({
    role: 'row',
    'aria-rowindex': index + 1,
    'aria-selected': selected ? true : undefined,
  })

  const getCellProps = (rowIndex: number, colIndex: number) => ({
    role: 'gridcell',
    'aria-rowindex': rowIndex + 1,
    'aria-colindex': colIndex + 1,
  })

  const getHeaderProps = (colIndex: number, sortDirection?: 'asc' | 'desc') => ({
    role: 'columnheader',
    'aria-colindex': colIndex + 1,
    'aria-sort': sortDirection
      ? sortDirection === 'asc' ? 'ascending' : 'descending'
      : undefined,
  })

  return { tableProps, getRowProps, getCellProps, getHeaderProps }
}
```

**C. Screen Reader Announcements**

```typescript
// utils/announcements.ts
export function useScreenReaderAnnouncement() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }

  return { announce }
}
```

### Step 9: Implement Internationalization

**A. i18n Hook**

```typescript
// hooks/use-i18n.ts
import { useTranslation } from 'react-i18next'

export function useTableI18n() {
  const { t } = useTranslation('table')

  return {
    noData: t('noData', 'No data'),
    loading: t('loading', 'Loading...'),
    selectAll: t('selectAll', 'Select all'),
    deselectAll: t('deselectAll', 'Deselect all'),
    rowSelected: t('rowSelected', 'Row selected'),
    rowsSelected: (count: number) => t('rowsSelected', `${count} rows selected`, { count }),
    sortAscending: t('sortAscending', 'Sort ascending'),
    sortDescending: t('sortDescending', 'Sort descending'),
    clearSort: t('clearSort', 'Clear sort'),
    loadMore: t('loadMore', 'Load more'),
    // ...all other i18n keys from UI5
  }
}
```

**B. RTL Support**

```typescript
// hooks/use-direction.ts
export function useDirection() {
  const dir = document.documentElement.dir || 'ltr'
  const isRTL = dir === 'rtl'

  return { dir, isRTL }
}

// Use in components:
const { isRTL } = useDirection()
<div className={cn("flex", isRTL ? "flex-row-reverse" : "flex-row")}>
```

### Step 10: Implement Theming

**A. CSS Variables**

```css
/* styles/table.css */
@layer base {
  :root {
    --table-cell-padding-x: 0.5rem;
    --table-cell-padding-y: 0.25rem;
    --table-cell-valign: center;
    --table-row-hover-bg: hsl(var(--muted) / 0.5);
    --table-row-selected-bg: hsl(var(--primary) / 0.1);
    --table-header-bg: hsl(var(--muted));
    --table-border-color: hsl(var(--border));
    /* ...more theme variables */
  }
}
```

**B. Tailwind Configuration**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        'table-cell-x': 'var(--table-cell-padding-x)',
        'table-cell-y': 'var(--table-cell-padding-y)',
      },
      colors: {
        'table-hover': 'var(--table-row-hover-bg)',
        'table-selected': 'var(--table-row-selected-bg)',
      },
    },
  },
}
```

**C. Variants with CVA**

```typescript
// table.tsx
import { cva } from "class-variance-authority"

const tableVariants = cva(
  "w-full caption-bottom text-sm",
  {
    variants: {
      alternateRows: {
        true: "[&_tbody_tr:nth-child(even)]:bg-muted/50",
        false: "",
      },
      bordered: {
        true: "border border-border",
        false: "",
      },
      compact: {
        true: "[&_td]:py-1 [&_th]:py-1",
        false: "[&_td]:py-2 [&_th]:py-2",
      },
    },
    defaultVariants: {
      alternateRows: false,
      bordered: false,
      compact: false,
    },
  }
)
```

---

## AI-Ready Features

### Step 11: Design for AI Generation

**A. AI Context Interface**

```typescript
// types.ts
export interface TableAIContext {
  // Natural language intent
  intent?: 'display' | 'edit' | 'select' | 'analyze'

  // Suggested actions
  suggestedActions?: Array<{
    label: string
    action: () => void
    icon?: string
  }>

  // Data insights
  insights?: Array<{
    type: 'trend' | 'anomaly' | 'summary'
    message: string
    affectedRows?: number[]
  }>

  // AI-powered features
  enableAISort?: boolean
  enableAIFilter?: boolean
  enableAIGrouping?: boolean

  // Conversational interface
  onAIQuery?: (query: string) => Promise<void>
}
```

**B. AI-Powered Sorting**

```typescript
// features/ai-sort.ts
export function useAISort<TData>({
  data,
  columns,
  onAIQuery,
}: UseAISortOptions<TData>) {
  const [aiSortQuery, setAISortQuery] = React.useState<string>('')

  const handleAISort = async (query: string) => {
    // Example: "sort by relevance to sustainability"
    // Call AI API to determine sort logic
    const sortLogic = await onAIQuery?.(query)

    // Apply AI-determined sort
    return sortByAI(data, sortLogic)
  }

  return { handleAISort, aiSortQuery, setAISortQuery }
}
```

**C. Natural Language Filtering**

```typescript
// features/ai-filter.ts
export function useAIFilter<TData>({
  data,
  onAIQuery,
}: UseAIFilterOptions<TData>) {
  const handleNaturalLanguageFilter = async (query: string) => {
    // Example: "show me products with high ratings and low prices"
    const filterFn = await parseNaturalLanguageQuery(query, onAIQuery)
    return data.filter(filterFn)
  }

  return { handleNaturalLanguageFilter }
}
```

**D. AI Insights**

```typescript
// features/ai-insights.ts
export function useAIInsights<TData>({
  data,
  columns,
}: UseAIInsightsOptions<TData>) {
  const [insights, setInsights] = React.useState<Insight[]>([])

  React.useEffect(() => {
    // Automatically detect patterns, anomalies, trends
    analyzeData(data, columns).then(setInsights)
  }, [data, columns])

  return { insights }
}
```

**E. Conversational Interface**

```tsx
// components/table-ai-chat.tsx
export function TableAIChat<TData>({
  table,
  onQuery,
}: TableAIChatProps<TData>) {
  const [query, setQuery] = React.useState('')
  const [response, setResponse] = React.useState<string>('')

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await onQuery(query, {
      data: table.data,
      columns: table.columns,
      selection: table.selectedRows,
    })

    setResponse(result)

    // Apply actions based on AI response
    if (result.action === 'sort') {
      table.setSorting(result.sorting)
    } else if (result.action === 'filter') {
      table.setFilters(result.filters)
    }
  }

  return (
    <div className="flex gap-2 p-2 border-t">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask AI about your data..."
        className="flex-1"
      />
      <Button onClick={handleQuery}>Ask</Button>
      {response && <div className="text-sm">{response}</div>}
    </div>
  )
}
```

### Step 12: Optimize for AI Code Generation

**A. Clear Component API**

```typescript
// Make props descriptive and discoverable
export interface TableProps<TData> {
  /**
   * Array of data items to display in the table.
   * Each item will be rendered as a row.
   *
   * @example
   * const data = [
   *   { id: 1, name: 'John', age: 30 },
   *   { id: 2, name: 'Jane', age: 25 },
   * ]
   */
  data: TData[]

  /**
   * Column definitions for the table.
   * Each column specifies how to render and interact with data.
   *
   * @example
   * const columns = [
   *   { id: 'name', header: 'Name', accessorKey: 'name' },
   *   { id: 'age', header: 'Age', accessorKey: 'age' },
   * ]
   */
  columns: ColumnDef<TData>[]

  // ...more well-documented props
}
```

**B. Composable Examples**

```tsx
// Provide clear usage examples that AI can learn from

// Example 1: Basic table
<Table data={data} columns={columns} />

// Example 2: With selection
<Table
  data={data}
  columns={columns}
  selection="multi"
  onSelectionChange={(rows) => console.log(rows)}
/>

// Example 3: With sorting
<Table
  data={data}
  columns={columns}
  sortable
  onSortChange={(sorting) => console.log(sorting)}
/>

// Example 4: With virtualization (large datasets)
<Table
  data={largeDataset}
  columns={columns}
  virtualization
  rowHeight={48}
/>

// Example 5: AI-powered table
<Table
  data={data}
  columns={columns}
  aiContext={{
    intent: 'analyze',
    onAIQuery: handleAIQuery,
    enableAISort: true,
    enableAIFilter: true,
  }}
/>
```

**C. Helper Functions**

```typescript
// Provide utility functions that AI can use

/**
 * Creates column definitions from data shape
 * Useful for quick prototyping or AI-generated code
 */
export function createColumnsFromData<TData>(
  data: TData[],
  options?: CreateColumnsOptions
): ColumnDef<TData>[] {
  if (!data.length) return []

  const firstItem = data[0]
  return Object.keys(firstItem).map(key => ({
    id: key,
    header: key.charAt(0).toUpperCase() + key.slice(1),
    accessorKey: key,
    ...options?.[key],
  }))
}

/**
 * Creates a basic table configuration from minimal input
 */
export function createQuickTable<TData>(
  data: TData[],
  options?: QuickTableOptions
) {
  return {
    data,
    columns: createColumnsFromData(data, options?.columnOptions),
    ...options,
  }
}

// AI can generate code like:
// const table = createQuickTable(myData, { selection: 'multi' })
```

---

## Testing Strategy

### Step 13: Comprehensive Testing

**A. Unit Tests**

```typescript
// __tests__/table.test.tsx
import { render, screen } from '@testing-library/react'
import { Table } from '../table'

describe('Table', () => {
  const mockData = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 },
  ]

  const mockColumns = [
    { id: 'name', header: 'Name', accessorKey: 'name' },
    { id: 'age', header: 'Age', accessorKey: 'age' },
  ]

  it('renders table with data', () => {
    render(<Table data={mockData} columns={mockColumns} />)
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Jane')).toBeInTheDocument()
  })

  it('shows no data message when empty', () => {
    render(<Table data={[]} columns={mockColumns} noDataText="No data" />)
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<Table data={mockData} columns={mockColumns} loading />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  // ...more tests
})
```

**B. Accessibility Tests**

```typescript
// __tests__/table.a11y.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe'
import { render } from '@testing-library/react'

expect.extend(toHaveNoViolations)

describe('Table Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <Table data={mockData} columns={mockColumns} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has correct ARIA attributes', () => {
    render(<Table data={mockData} columns={mockColumns} />)
    const table = screen.getByRole('grid')
    expect(table).toHaveAttribute('aria-rowcount')
    expect(table).toHaveAttribute('aria-colcount')
  })

  // ...more a11y tests
})
```

**C. Keyboard Navigation Tests**

```typescript
// __tests__/table.keyboard.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Table Keyboard Navigation', () => {
  it('navigates rows with arrow keys', async () => {
    render(<Table data={mockData} columns={mockColumns} />)

    const firstRow = screen.getAllByRole('row')[1]
    firstRow.focus()

    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getAllByRole('row')[2]).toHaveFocus()
  })

  it('toggles selection with Space', async () => {
    const onSelectionChange = jest.fn()
    render(
      <Table
        data={mockData}
        columns={mockColumns}
        selection="multi"
        onSelectionChange={onSelectionChange}
      />
    )

    const firstRow = screen.getAllByRole('row')[1]
    firstRow.focus()

    await userEvent.keyboard(' ')
    expect(onSelectionChange).toHaveBeenCalled()
  })

  // ...more keyboard tests
})
```

**D. Performance Tests**

```typescript
// __tests__/table.performance.test.tsx
import { render } from '@testing-library/react'
import { measureRender } from '@/test-utils/performance'

describe('Table Performance', () => {
  it('renders large dataset efficiently', () => {
    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Name ${i}`,
      value: Math.random(),
    }))

    const { duration } = measureRender(
      <Table data={largeDataset} columns={mockColumns} virtualization />
    )

    expect(duration).toBeLessThan(100) // 100ms max
  })

  it('virtualizes rows efficiently', () => {
    // Test that only visible rows are rendered
    const { container } = render(
      <Table data={largeDataset} columns={mockColumns} virtualization />
    )

    const rows = container.querySelectorAll('[role="row"]')
    expect(rows.length).toBeLessThan(100) // Not all 10000 rows
  })
})
```

**E. Visual Regression Tests**

```typescript
// __tests__/table.visual.test.tsx
import { expect, test } from '@playwright/experimental-ct-react'
import { Table } from '../table'

test('matches screenshot', async ({ mount }) => {
  const component = await mount(
    <Table data={mockData} columns={mockColumns} />
  )

  await expect(component).toHaveScreenshot()
})

test('matches screenshot with selection', async ({ mount }) => {
  const component = await mount(
    <Table
      data={mockData}
      columns={mockColumns}
      selection="multi"
      defaultSelected={['1']}
    />
  )

  await expect(component).toHaveScreenshot()
})
```

---

## Quality Assurance with Ralph Wiggum

### Step 14: Use Ralph Wiggum for Iterative QA

**What is Ralph Wiggum?**

Ralph Wiggum is a skill that implements Geoffrey Huntley's spec-driven development methodology. It runs an autonomous iterative loop where the agent:
1. Works through specs one at a time
2. Tests each feature
3. Only outputs completion signal when 100% of acceptance criteria are met
4. Self-corrects issues before moving on

**How to Use:**

1. Create a comprehensive spec file
2. Invoke Ralph Wiggum skill
3. Let it iteratively implement and test
4. Review completion signal

**Example Spec File:**

```markdown
# Table Component Conversion Spec

## Spec 1: Core Rendering
- [ ] Table renders with data prop
- [ ] Table renders with columns prop
- [ ] Table shows header row
- [ ] Table shows data rows
- [ ] Table applies className correctly
- [ ] Table forwards ref
- [ ] Empty table shows noDataText

**Acceptance Criteria:**
- Unit tests pass
- Visual regression tests pass
- No console errors
- TypeScript compiles without errors

## Spec 2: Selection (Single)
- [ ] Single selection mode enabled with selection="single"
- [ ] Row click selects row
- [ ] Previously selected row deselects
- [ ] onSelectionChange callback fires
- [ ] Selected row has visual indicator
- [ ] Selected row has aria-selected="true"
- [ ] Keyboard Space toggles selection

**Acceptance Criteria:**
- Unit tests pass
- Keyboard navigation tests pass
- A11y tests pass
- Selection state managed correctly

## Spec 3: Selection (Multi)
- [ ] Multi selection mode enabled with selection="multi"
- [ ] Checkbox column appears
- [ ] Row click selects row
- [ ] Multiple rows can be selected
- [ ] Header checkbox selects all
- [ ] Ctrl/Cmd+A selects all (keyboard)
- [ ] onSelectionChange callback fires with array
- [ ] Selected rows have aria-selected="true"
- [ ] aria-multiselectable on table

**Acceptance Criteria:**
- Unit tests pass
- Multi-selection tests pass
- A11y tests pass
- Select all functionality works

## Spec 4: Sorting
- [ ] sortable prop enables sorting
- [ ] Header cells show sort indicators
- [ ] Click header toggles sort (none -> asc -> desc -> none)
- [ ] onSortChange callback fires
- [ ] Sorted column has aria-sort attribute
- [ ] Data re-renders in sorted order
- [ ] Custom sorting functions supported

**Acceptance Criteria:**
- Sorting tests pass
- A11y tests pass (aria-sort)
- Performance acceptable on large datasets

## Spec 5: Virtualization
- [ ] virtualization prop enables virtual scrolling
- [ ] Only visible rows rendered
- [ ] Smooth scrolling
- [ ] rowHeight prop controls row size
- [ ] Large datasets (10000+ rows) perform well
- [ ] onRangeChange callback fires
- [ ] Total size calculated correctly

**Acceptance Criteria:**
- Performance tests pass (<100ms render)
- Virtual rows render correctly
- No visual jank on scroll
- Memory usage acceptable

## Spec 6: Keyboard Navigation
- [ ] Arrow keys navigate (up/down/left/right)
- [ ] Home/End keys work
- [ ] Page Up/Down work
- [ ] Tab/Shift+Tab work
- [ ] Space toggles selection
- [ ] Ctrl/Cmd+A selects all
- [ ] Focus visible
- [ ] Focus trap works correctly

**Acceptance Criteria:**
- All keyboard tests pass
- A11y tests pass
- Focus management correct
- No keyboard traps

## Spec 7: Accessibility (ARIA)
- [ ] role="grid" on table
- [ ] role="row" on rows
- [ ] role="columnheader" on headers
- [ ] role="gridcell" on cells
- [ ] aria-rowcount set
- [ ] aria-colcount set
- [ ] aria-rowindex on rows
- [ ] aria-colindex on cells
- [ ] aria-label or aria-labelledby
- [ ] aria-selected on selected rows
- [ ] aria-sort on sorted columns

**Acceptance Criteria:**
- Axe accessibility tests pass (0 violations)
- Screen reader announces correctly
- ARIA attributes correct
- WCAG 2.1 AA compliant

## Spec 8: Internationalization
- [ ] All text externalized to i18n
- [ ] useTableI18n hook works
- [ ] RTL support (dir="rtl")
- [ ] All UI5 i18n keys covered
- [ ] Locale changes reflected

**Acceptance Criteria:**
- i18n tests pass
- RTL visual tests pass
- No hardcoded strings
- Locale switching works

## Spec 9: Theming
- [ ] CSS variables defined
- [ ] Tailwind config extended
- [ ] className override works
- [ ] alternateRowColors prop works
- [ ] Theme tokens used correctly
- [ ] Dark mode support

**Acceptance Criteria:**
- Visual regression tests pass
- Theme switching works
- CSS variables applied
- No hardcoded colors

## Spec 10: Loading State
- [ ] loading prop shows spinner
- [ ] loadingDelay prop honored
- [ ] Table disabled during loading
- [ ] Loading has proper ARIA (role="status")
- [ ] Loading accessible to screen readers

**Acceptance Criteria:**
- Loading tests pass
- A11y tests pass
- Visual matches design
- Timing correct

## Spec 11: Growing/Lazy Loading
- [ ] growing prop enables feature
- [ ] "Load More" button appears
- [ ] Button click loads more data
- [ ] growingMode="scroll" auto-loads
- [ ] onLoadMore callback fires
- [ ] hasMore prop controls button visibility

**Acceptance Criteria:**
- Growing tests pass
- Auto-load on scroll works
- Performance acceptable
- UX smooth

## Spec 12: AI Features
- [ ] aiContext prop accepted
- [ ] AI sort enabled
- [ ] AI filter enabled
- [ ] AI insights displayed
- [ ] onAIQuery callback fires
- [ ] AI chat interface works

**Acceptance Criteria:**
- AI feature tests pass
- Integration works
- UX intuitive
- Performance acceptable

## Spec 13: Performance
- [ ] Large datasets (<100ms render with virtualization)
- [ ] Smooth scrolling (60fps)
- [ ] Memory usage acceptable
- [ ] Bundle size reasonable
- [ ] Tree-shaking works
- [ ] No unnecessary re-renders

**Acceptance Criteria:**
- Performance benchmarks pass
- Lighthouse score >90
- React DevTools Profiler clean
- No performance warnings

## Spec 14: Documentation
- [ ] README with examples
- [ ] Storybook stories
- [ ] API documentation
- [ ] Migration guide from UI5
- [ ] Accessibility guide
- [ ] Performance tips

**Acceptance Criteria:**
- Docs complete
- Examples runnable
- Clear and comprehensive
- Migration path clear

## Spec 15: Enterprise Features Parity
- [ ] All UI5 Table props covered
- [ ] All UI5 Table events covered
- [ ] All UI5 accessibility features
- [ ] All UI5 keyboard shortcuts
- [ ] All UI5 i18n keys
- [ ] Feature comparison doc

**Acceptance Criteria:**
- Feature parity checklist 100% complete
- No regressions from UI5
- Enterprise requirements met
- Comparison doc published
```

**Invoke Ralph Wiggum:**

```bash
# In Claude Code CLI
/ralph-wiggum --spec table-conversion-spec.md
```

Ralph Wiggum will:
1. Read the spec
2. Implement each spec item
3. Run tests
4. Fix issues
5. Move to next spec only when current is 100% done
6. Output completion signal when all specs are met

---

## Documentation & Examples

### Step 15: Create Comprehensive Documentation

**A. Component README**

```markdown
# Table

A modern, AI-ready data table component built with React and Tailwind CSS.

## Features

- ✅ Full enterprise feature parity with UI5 Web Components
- 🎨 Flexible theming with Tailwind CSS
- ♿ WCAG 2.1 AA accessible by default
- 🌍 Full internationalization (i18n) and RTL support
- ⚡ High performance with virtualization for large datasets
- 🤖 AI-powered sorting, filtering, and insights
- ⌨️ Complete keyboard navigation
- 📱 Responsive with mobile support
- 🎯 Type-safe with full TypeScript support

## Installation

\`\`\`bash
npm install @shadcn-ui5/table
\`\`\`

## Basic Usage

\`\`\`tsx
import { Table } from "@shadcn-ui5/table"

const data = [
  { id: 1, name: "John Doe", age: 30, role: "Developer" },
  { id: 2, name: "Jane Smith", age: 25, role: "Designer" },
]

const columns = [
  { id: "name", header: "Name", accessorKey: "name" },
  { id: "age", header: "Age", accessorKey: "age" },
  { id: "role", header: "Role", accessorKey: "role" },
]

export function MyTable() {
  return <Table data={data} columns={columns} />
}
\`\`\`

## API Reference

[Full API documentation with all props, events, types...]

## Examples

[Link to comprehensive examples...]

## Migration from UI5 Web Components

[Step-by-step migration guide...]

## Accessibility

[Accessibility features and keyboard shortcuts...]

## Performance

[Performance tips and optimization strategies...]
```

**B. Storybook Stories**

```typescript
// table.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Table } from './table'

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Table>

export const Basic: Story = {
  args: {
    data: mockData,
    columns: mockColumns,
  },
}

export const WithSelection: Story = {
  args: {
    data: mockData,
    columns: mockColumns,
    selection: 'multi',
  },
}

export const Sortable: Story = {
  args: {
    data: mockData,
    columns: mockColumns,
    sortable: true,
  },
}

export const Virtualized: Story = {
  args: {
    data: largeDataset,
    columns: mockColumns,
    virtualization: true,
  },
}

export const AIEnabled: Story = {
  args: {
    data: mockData,
    columns: mockColumns,
    aiContext: {
      intent: 'analyze',
      enableAISort: true,
      enableAIFilter: true,
    },
  },
}

// ...more stories
```

**C. Usage Examples**

Create example files for common use cases:
- Basic table
- With selection
- With sorting
- With filtering
- With pagination
- Virtualized (large dataset)
- With custom cells
- With row actions
- With expanding rows
- With grouping
- AI-powered
- Editable cells
- Export to CSV/Excel
- Responsive (mobile)

**D. Migration Guide**

```markdown
# Migrating from UI5 Web Components Table to shadcn-ui5 Table

## Why Migrate?

- **Better theming**: Tailwind CSS offers superior flexibility
- **Better DX**: TypeScript autocomplete, easier debugging
- **Better performance**: React optimization opportunities
- **AI-ready**: Built-in AI features for modern apps
- **Better composition**: React composition > slot-based
- **Smaller bundle**: Tree-shaking and better code-splitting

## Feature Comparison

| Feature | UI5 WC | shadcn-ui5 | Notes |
|---------|--------|------------|-------|
| Selection (single/multi) | ✅ | ✅ | Same API |
| Sorting | ✅ | ✅ | Enhanced with AI |
| Virtualization | ✅ | ✅ | Better performance |
| Keyboard nav | ✅ | ✅ | Full parity |
| Accessibility | ✅ | ✅ | WCAG 2.1 AA |
| i18n | ✅ | ✅ | All keys covered |
| RTL | ✅ | ✅ | Native support |
| Theming | ⚠️ | ✅✅ | Much more flexible |
| AI features | ❌ | ✅ | AI sort/filter/insights |
| TypeScript | ⚠️ | ✅✅ | Full type safety |

## Migration Steps

### Step 1: Update imports

**Before (UI5 WC):**
\`\`\`javascript
import "@ui5/webcomponents/dist/Table.js"
import "@ui5/webcomponents/dist/TableRow.js"
import "@ui5/webcomponents/dist/TableCell.js"
\`\`\`

**After (shadcn-ui5):**
\`\`\`typescript
import { Table } from "@shadcn-ui5/table"
\`\`\`

### Step 2: Convert markup

**Before (UI5 WC):**
\`\`\`html
<ui5-table id="myTable">
  <ui5-table-header-row slot="headerRow">
    <ui5-table-header-cell>Name</ui5-table-header-cell>
    <ui5-table-header-cell>Age</ui5-table-header-cell>
  </ui5-table-header-row>

  <ui5-table-row>
    <ui5-table-cell>John</ui5-table-cell>
    <ui5-table-cell>30</ui5-table-cell>
  </ui5-table-row>
</ui5-table>
\`\`\`

**After (shadcn-ui5):**
\`\`\`tsx
<Table
  data={[{ name: "John", age: 30 }]}
  columns={[
    { id: "name", header: "Name", accessorKey: "name" },
    { id: "age", header: "Age", accessorKey: "age" },
  ]}
/>
\`\`\`

### Step 3: Convert props

[Detailed prop mapping table...]

### Step 4: Convert events

[Detailed event mapping table...]

## Full Example Migration

[Side-by-side before/after example...]
```

---

## Performance Optimization

### Step 16: Optimize for Performance

**A. React.memo**

```typescript
// Memoize sub-components
export const TableRow = React.memo(function TableRow({ ... }) {
  // ...
}, (prev, next) => {
  // Custom equality check
  return prev.id === next.id && prev.selected === next.selected
})
```

**B. useMemo for expensive computations**

```typescript
const sortedData = React.useMemo(() => {
  // Expensive sort operation
  return applySorting(data, sorting)
}, [data, sorting])

const filteredData = React.useMemo(() => {
  // Expensive filter operation
  return applyFilters(sortedData, filters)
}, [sortedData, filters])
```

**C. useCallback for event handlers**

```typescript
const handleRowClick = React.useCallback((row: TData) => {
  onRowClick?.(row)
}, [onRowClick])

const handleSelectionChange = React.useCallback((selected: string[]) => {
  onSelectionChange?.(selected)
}, [onSelectionChange])
```

**D. Virtualization**

Use `@tanstack/react-virtual` for large datasets:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

const virtualizer = useVirtualizer({
  count: data.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 48, // row height
  overscan: 5,
})

// Render only visible rows
{virtualizer.getVirtualItems().map(virtualRow => (
  <TableRow
    key={virtualRow.index}
    data={data[virtualRow.index]}
    style={{
      height: `${virtualRow.size}px`,
      transform: `translateY(${virtualRow.start}px)`,
    }}
  />
))}
```

**E. Code Splitting**

```typescript
// Lazy load AI features
const TableAIChat = React.lazy(() => import('./table-ai-chat'))

// Lazy load drag-and-drop
const DragDropTable = React.lazy(() => import('./drag-drop-table'))
```

**F. Bundle Size Optimization**

```typescript
// Only import what you need
import { Table } from '@shadcn-ui5/table' // Not the entire lib

// Tree-shakeable exports
export { Table } from './table'
export { TableRow } from './table-row'
export type { TableProps } from './types'
```

---

## Checklist for Future Conversions

### Step 17: Reusable Conversion Checklist

Use this checklist for converting ANY UI5 Web Component:

#### Phase 1: Discovery & Analysis
- [ ] Find all related source files (component + sub-components)
- [ ] Find all test files
- [ ] Find all documentation/samples
- [ ] Extract all props/attributes
- [ ] Extract all events
- [ ] Extract all slots/child components
- [ ] Document accessibility features
- [ ] Document keyboard navigation
- [ ] Extract i18n keys
- [ ] Document enterprise features
- [ ] Document all states
- [ ] Extract theming variables
- [ ] Create feature comparison document

#### Phase 2: Architecture Design
- [ ] Design React component hierarchy
- [ ] Design state management strategy
- [ ] Design prop interface
- [ ] Design type system
- [ ] Design styling approach (Tailwind utilities)
- [ ] Design accessibility architecture
- [ ] Design internationalization approach
- [ ] Design AI integration points
- [ ] Create file structure

#### Phase 3: Implementation
- [ ] Create base component with TypeScript types
- [ ] Implement child components
- [ ] Implement core rendering
- [ ] Implement enterprise features (selection, sort, etc.)
- [ ] Implement keyboard navigation
- [ ] Implement accessibility (ARIA)
- [ ] Implement internationalization
- [ ] Implement theming (CSS vars + Tailwind)
- [ ] Implement AI features
- [ ] Implement performance optimizations

#### Phase 4: Testing
- [ ] Write unit tests (component rendering)
- [ ] Write interaction tests (events, callbacks)
- [ ] Write accessibility tests (axe, ARIA)
- [ ] Write keyboard navigation tests
- [ ] Write performance tests
- [ ] Write visual regression tests
- [ ] Test i18n (multiple locales)
- [ ] Test RTL support
- [ ] Test theming (light/dark mode)
- [ ] Test responsive behavior
- [ ] Test AI features

#### Phase 5: Quality Assurance
- [ ] Run Ralph Wiggum with comprehensive spec
- [ ] Fix all failing specs
- [ ] Verify 100% feature parity
- [ ] Performance benchmarks pass
- [ ] Accessibility audit (0 violations)
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Code review

#### Phase 6: Documentation
- [ ] Write component README
- [ ] Create Storybook stories
- [ ] Write API documentation
- [ ] Create usage examples
- [ ] Write migration guide from UI5
- [ ] Document accessibility features
- [ ] Document performance tips
- [ ] Create comparison table (UI5 vs shadcn-ui5)
- [ ] Record video demo
- [ ] Update main documentation site

#### Phase 7: Polish & Release
- [ ] Code cleanup
- [ ] Remove console.logs
- [ ] Optimize bundle size
- [ ] Add JSDoc comments
- [ ] Update package.json
- [ ] Update CHANGELOG
- [ ] Create release notes
- [ ] Publish to npm
- [ ] Announce release

---

## Example: Table Component Conversion Summary

### What We're Converting

**UI5 Web Component:** `ui5-table`
**Location:** `/Users/d049979/SAPDevelop/webcomponents/packages/main/src/Table.ts`

### Key Features to Implement

1. **Core**
   - Data rendering
   - Column definitions
   - Header row
   - Body rows
   - Cells

2. **Selection**
   - Single selection
   - Multi selection
   - Selection behaviors (RowSelector, RowOnly)
   - Header select all

3. **Sorting**
   - Column sort indicators
   - Sort direction (asc, desc, none)
   - Custom sort functions

4. **Virtualization**
   - Virtual scrolling for large datasets
   - Configurable row height
   - Range change events

5. **Growing/Pagination**
   - Load more button
   - Auto-load on scroll
   - Lazy loading

6. **Keyboard Navigation**
   - Arrow keys (all directions)
   - Home/End
   - Page Up/Down
   - Tab navigation
   - Space (selection toggle)
   - Ctrl+A (select all)

7. **Accessibility**
   - role="grid"
   - ARIA attributes (rowcount, colcount, rowindex, colindex)
   - aria-selected
   - aria-sort
   - aria-label/aria-labelledby
   - Screen reader announcements

8. **Internationalization**
   - 20+ i18n keys
   - RTL support
   - Locale-aware formatting

9. **Theming**
   - CSS variables
   - Tailwind config
   - Light/dark mode
   - Custom themes

10. **AI Features** (NEW!)
    - AI-powered sorting
    - Natural language filtering
    - Data insights
    - Conversational interface

### Implementation Steps

1. **Setup**: Create component structure, files, and types
2. **Core**: Implement basic table rendering
3. **Selection**: Add single and multi-selection
4. **Sorting**: Implement column sorting
5. **Virtualization**: Add virtual scrolling
6. **Keyboard**: Implement full keyboard navigation
7. **Accessibility**: Add all ARIA attributes
8. **i18n**: Internationalize all text
9. **Theming**: Style with Tailwind and CSS variables
10. **AI**: Add AI-powered features
11. **Testing**: Comprehensive test suite
12. **QA**: Ralph Wiggum iterative loop
13. **Docs**: Complete documentation
14. **Polish**: Final cleanup and optimization

### Success Metrics

- ✅ 100% feature parity with UI5 Table
- ✅ 0 accessibility violations (axe)
- ✅ <100ms render time for 10,000 rows (virtualized)
- ✅ <50KB bundle size (gzipped)
- ✅ 100% TypeScript coverage
- ✅ >90% test coverage
- ✅ All Ralph Wiggum specs pass
- ✅ Positive AI code generation results

---

## Conclusion

This methodology ensures:

1. **Complete Feature Parity**: Nothing is missed from the UI5 component
2. **Superior Developer Experience**: Better tooling, types, and APIs
3. **Enhanced Flexibility**: Tailwind theming > Shadow DOM CSS
4. **AI-Ready Architecture**: Easy for AI to understand and generate
5. **Enterprise-Grade Quality**: Accessibility, i18n, performance
6. **Future-Proof**: Modern React patterns and best practices

By following this guide, you can systematically convert any UI5 Web Component into a modern, AI-ready shadcn-ui5 component that showcases the advantages of modern component architecture while maintaining full enterprise capabilities.

---

## Next Components to Convert

Suggested priority order:

1. ✅ **Table** (complex, high-value)
2. **Form** (common, demonstrates patterns)
3. **Dialog** (common, portal/overlay patterns)
4. **Select** (common, combobox patterns)
5. **DatePicker** (complex, calendar logic)
6. **Tree** (hierarchical data)
7. **Upload** (file handling)
8. **Charts** (data visualization)

Each conversion will further refine this methodology and build the shadcn-ui5 component library!
