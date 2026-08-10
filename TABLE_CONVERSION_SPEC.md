# Table Component Conversion Specification

**Component:** UI5 Table → shadcn-ui5 Table
**Priority:** High
**Complexity:** High
**Enterprise Features:** Full Parity Required

---

## Overview

Convert the UI5 Web Components Table (ui5-table) into a modern shadcn-ui5 React component with full feature parity, enhanced AI capabilities, and superior theming flexibility using Tailwind CSS.

**Source:** `/Users/d049979/SAPDevelop/webcomponents/packages/main/src/Table.ts`
**Target:** `/Users/d049979/SAPDevelop/webcomponents/packages/shadcn-ui5/src/components/table/`

---

## Spec 1: Core Rendering & Structure

### Requirements
- [ ] Create base Table component with TypeScript
- [ ] Implement TableHeader component
- [ ] Implement TableBody component
- [ ] Implement TableRow component
- [ ] Implement TableCell component
- [ ] Implement TableHead (header cell) component
- [ ] Support generic data type: `Table<TData>`
- [ ] Support column definitions with `ColumnDef<TData>` interface
- [ ] Render table with semantic HTML (table, thead, tbody, tr, th, td)
- [ ] Apply className prop for custom styling
- [ ] Forward refs on all components
- [ ] Support React.memo for performance

### Props
```typescript
interface TableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  className?: string
  ariaLabel?: string
  ariaLabelledBy?: string
}

interface ColumnDef<TData> {
  id: string
  header: string | ((column: ColumnDef<TData>) => React.ReactNode)
  accessorKey?: keyof TData
  accessorFn?: (row: TData) => any
  cell?: (info: CellContext<TData>) => React.ReactNode
  footer?: string | ((column: ColumnDef<TData>) => React.ReactNode)
}
```

### Styling (Tailwind)
- Table wrapper: `relative w-full overflow-auto`
- Table: `w-full caption-bottom text-sm`
- Header row: `border-b bg-muted/50`
- Header cell: `h-12 px-4 text-left align-middle font-medium text-muted-foreground`
- Body row: `border-b transition-colors hover:bg-muted/50`
- Body cell: `p-4 align-middle`

### Acceptance Criteria
- [ ] Table renders with data and columns
- [ ] Header row displays all column headers
- [ ] Body rows display all data rows
- [ ] Cells display correct data
- [ ] className override works
- [ ] Refs are forwarded
- [ ] TypeScript compiles without errors
- [ ] No console warnings or errors
- [ ] Unit tests pass

### Tests
```typescript
it('renders table with data', () => {
  render(<Table data={mockData} columns={mockColumns} />)
  expect(screen.getByRole('table')).toBeInTheDocument()
})

it('renders header row', () => {
  render(<Table data={mockData} columns={mockColumns} />)
  expect(screen.getByText('Name')).toBeInTheDocument()
})

it('renders data rows', () => {
  render(<Table data={mockData} columns={mockColumns} />)
  expect(screen.getByText('John')).toBeInTheDocument()
})
```

---

## Spec 2: Empty State & No Data

### Requirements
- [ ] Show custom message when data is empty
- [ ] Support `noDataText` prop
- [ ] Support `noDataSlot` for custom empty state
- [ ] Default empty message: "No data"
- [ ] Use i18n for empty message
- [ ] Proper ARIA attributes on empty state

### Props
```typescript
interface TableProps<TData> {
  // ...existing props
  noDataText?: string
  noDataSlot?: React.ReactNode
}
```

### Styling
- Empty state wrapper: `flex h-24 items-center justify-center text-center`
- Empty text: `text-muted-foreground`

### Acceptance Criteria
- [ ] Empty table shows noDataText
- [ ] Custom noDataSlot renders
- [ ] Default message uses i18n
- [ ] Proper styling applied
- [ ] Tests pass

### Tests
```typescript
it('shows no data message when empty', () => {
  render(<Table data={[]} columns={mockColumns} noDataText="No data" />)
  expect(screen.getByText('No data')).toBeInTheDocument()
})

it('renders custom noDataSlot', () => {
  render(
    <Table
      data={[]}
      columns={mockColumns}
      noDataSlot={<div>Custom empty state</div>}
    />
  )
  expect(screen.getByText('Custom empty state')).toBeInTheDocument()
})
```

---

## Spec 3: Loading State

### Requirements
- [ ] Support `loading` prop to show loading indicator
- [ ] Support `loadingDelay` prop (default: 1000ms)
- [ ] Show spinner with delay to prevent flashing
- [ ] Disable interaction during loading
- [ ] Proper ARIA attributes (role="status", aria-busy)
- [ ] Loading overlay dims table content
- [ ] Screen reader announces loading state

### Props
```typescript
interface TableProps<TData> {
  // ...existing props
  loading?: boolean
  loadingDelay?: number
}
```

### Styling
- Loading overlay: `absolute inset-0 bg-background/50 backdrop-blur-sm`
- Spinner: Use existing UI5 Spinner or create simple spinner
- Center spinner: `flex items-center justify-center`

### Acceptance Criteria
- [ ] Loading prop shows spinner
- [ ] LoadingDelay prevents immediate flash
- [ ] Table interaction disabled during loading
- [ ] ARIA attributes correct
- [ ] Screen reader announces loading
- [ ] Tests pass

### Tests
```typescript
it('shows loading indicator', () => {
  render(<Table data={mockData} columns={mockColumns} loading />)
  expect(screen.getByRole('status')).toBeInTheDocument()
})

it('respects loading delay', async () => {
  render(<Table data={mockData} columns={mockColumns} loading loadingDelay={500} />)
  expect(screen.queryByRole('status')).not.toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByRole('status')).toBeInTheDocument()
  }, { timeout: 600 })
})
```

---

## Spec 4: Selection (Single Mode)

### Requirements
- [ ] Support `selection="single"` prop
- [ ] Single row can be selected
- [ ] Previously selected row deselects
- [ ] Support controlled selection with `selected` prop
- [ ] Support uncontrolled selection with `defaultSelected` prop
- [ ] Fire `onSelectionChange` callback with selected row key
- [ ] Support `rowKey` to identify rows (default: 'id')
- [ ] Visual indicator for selected row (background color)
- [ ] Selected row has `aria-selected="true"`
- [ ] Keyboard Space key toggles selection
- [ ] Click row to select (if behavior is "row-only")
- [ ] Support `selectionBehavior` prop: "row-selector" (default) or "row-only"

### Props
```typescript
interface TableProps<TData> {
  // ...existing props
  selection?: 'none' | 'single' | 'multi'
  selected?: string[]
  defaultSelected?: string[]
  onSelectionChange?: (selected: string[]) => void
  rowKey?: keyof TData | ((row: TData) => string)
  selectionBehavior?: 'row-selector' | 'row-only'
}
```

### Hook
```typescript
// hooks/use-selection.ts
function useSelection<TData>({
  mode,
  data,
  rowKey,
  controlled,
  defaultSelected,
  onSelectionChange,
}: UseSelectionOptions<TData>) {
  // Implementation
}
```

### Styling
- Selected row: `bg-accent`
- Row hover: `hover:bg-muted/50`
- Row selector column (radio): `w-12`

### Acceptance Criteria
- [ ] Single selection works
- [ ] Only one row selected at a time
- [ ] onSelectionChange fires correctly
- [ ] Visual indicator applied
- [ ] aria-selected attribute correct
- [ ] Keyboard Space toggles selection
- [ ] Controlled mode works
- [ ] Uncontrolled mode works
- [ ] Tests pass

### Tests
```typescript
it('selects single row', async () => {
  const onSelectionChange = jest.fn()
  render(
    <Table
      data={mockData}
      columns={mockColumns}
      selection="single"
      onSelectionChange={onSelectionChange}
    />
  )

  const row = screen.getAllByRole('row')[1]
  await userEvent.click(row)

  expect(onSelectionChange).toHaveBeenCalledWith(['1'])
  expect(row).toHaveAttribute('aria-selected', 'true')
})

it('deselects previous row when selecting new row', async () => {
  render(<Table data={mockData} columns={mockColumns} selection="single" />)

  const rows = screen.getAllByRole('row')
  await userEvent.click(rows[1])
  expect(rows[1]).toHaveAttribute('aria-selected', 'true')

  await userEvent.click(rows[2])
  expect(rows[1]).not.toHaveAttribute('aria-selected', 'true')
  expect(rows[2]).toHaveAttribute('aria-selected', 'true')
})
```

---

## Spec 5: Selection (Multi Mode)

### Requirements
- [ ] Support `selection="multi"` prop
- [ ] Multiple rows can be selected
- [ ] Checkbox column appears on the left
- [ ] Header checkbox for "select all" / "deselect all"
- [ ] Row click selects row (if behavior is "row-only")
- [ ] Checkbox click selects row
- [ ] Support shift-click for range selection
- [ ] Keyboard Ctrl/Cmd+A selects all rows
- [ ] Keyboard Space toggles row selection
- [ ] Selected rows have `aria-selected="true"`
- [ ] Table has `aria-multiselectable="true"`
- [ ] Fire `onSelectionChange` with array of selected row keys
- [ ] Support `headerSelector` prop: "select-all" (default) or "clear-all"

### Props
```typescript
interface TableProps<TData> {
  // ...existing props
  headerSelector?: 'select-all' | 'clear-all'
}
```

### Styling
- Checkbox column: `w-12`
- Checkbox alignment: `flex items-center`
- Selected rows: `bg-accent`

### Acceptance Criteria
- [ ] Multi selection works
- [ ] Multiple rows can be selected
- [ ] Checkbox column renders
- [ ] Header checkbox works (select all / clear all)
- [ ] Shift-click range selection works
- [ ] Keyboard Ctrl/Cmd+A works
- [ ] onSelectionChange fires with array
- [ ] ARIA attributes correct
- [ ] Tests pass

### Tests
```typescript
it('selects multiple rows', async () => {
  const onSelectionChange = jest.fn()
  render(
    <Table
      data={mockData}
      columns={mockColumns}
      selection="multi"
      onSelectionChange={onSelectionChange}
    />
  )

  const checkboxes = screen.getAllByRole('checkbox')
  await userEvent.click(checkboxes[1])
  await userEvent.click(checkboxes[2])

  expect(onSelectionChange).toHaveBeenLastCalledWith(['1', '2'])
})

it('selects all rows with header checkbox', async () => {
  render(<Table data={mockData} columns={mockColumns} selection="multi" />)

  const headerCheckbox = screen.getAllByRole('checkbox')[0]
  await userEvent.click(headerCheckbox)

  const rows = screen.getAllByRole('row').slice(1)
  rows.forEach(row => {
    expect(row).toHaveAttribute('aria-selected', 'true')
  })
})

it('selects range with shift-click', async () => {
  render(<Table data={mockData} columns={mockColumns} selection="multi" />)

  const rows = screen.getAllByRole('row')
  await userEvent.click(rows[1])
  await userEvent.click(rows[4], { shiftKey: true })

  expect(rows[1]).toHaveAttribute('aria-selected', 'true')
  expect(rows[2]).toHaveAttribute('aria-selected', 'true')
  expect(rows[3]).toHaveAttribute('aria-selected', 'true')
  expect(rows[4]).toHaveAttribute('aria-selected', 'true')
})
```

---

## Spec 6: Sorting

### Requirements
- [ ] Support `sortable` prop to enable sorting
- [ ] Click header cell to toggle sort
- [ ] Sort states: none → ascending → descending → none
- [ ] Show sort indicator icon on header cell
- [ ] Fire `onSortChange` callback
- [ ] Support controlled sorting with `sorting` prop
- [ ] Support uncontrolled sorting with `defaultSorting` prop
- [ ] Support custom sort functions per column
- [ ] Header cell has `aria-sort` attribute
- [ ] Keyboard Enter on header cell toggles sort
- [ ] Support multi-column sorting (optional, advanced)

### Props
```typescript
interface TableProps<TData> {
  // ...existing props
  sortable?: boolean
  sorting?: SortingState
  defaultSorting?: SortingState
  onSortChange?: (sorting: SortingState) => void
}

interface ColumnDef<TData> {
  // ...existing props
  sortable?: boolean
  sortingFn?: (rowA: TData, rowB: TData) => number
}

type SortingState = Array<{
  id: string
  desc: boolean
}>
```

### Hook
```typescript
// hooks/use-sorting.ts
function useSorting<TData>({
  data,
  columns,
  controlled,
  defaultSorting,
  onSortChange,
}: UseSortingOptions<TData>) {
  // Implementation
}
```

### Styling
- Sortable header: `cursor-pointer select-none`
- Sort icon: Chevron up (asc), chevron down (desc), none
- Sort icon position: `inline-flex items-center gap-1`

### Acceptance Criteria
- [ ] Sorting enabled with sortable prop
- [ ] Header click toggles sort
- [ ] Sort indicator shows correctly
- [ ] Data re-renders in sorted order
- [ ] aria-sort attribute correct
- [ ] onSortChange fires
- [ ] Controlled mode works
- [ ] Uncontrolled mode works
- [ ] Custom sort functions work
- [ ] Tests pass

### Tests
```typescript
it('sorts column on header click', async () => {
  render(<Table data={mockData} columns={mockColumns} sortable />)

  const nameHeader = screen.getByText('Name')
  await userEvent.click(nameHeader)

  const cells = screen.getAllByRole('gridcell')
  expect(cells[0]).toHaveTextContent('Alice')

  await userEvent.click(nameHeader)
  expect(cells[0]).toHaveTextContent('Zoe')
})

it('shows sort indicator', async () => {
  render(<Table data={mockData} columns={mockColumns} sortable />)

  const nameHeader = screen.getByText('Name').closest('th')
  expect(nameHeader).toHaveAttribute('aria-sort', 'none')

  await userEvent.click(nameHeader!)
  expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')

  await userEvent.click(nameHeader!)
  expect(nameHeader).toHaveAttribute('aria-sort', 'descending')
})
```

---

## Spec 7: Keyboard Navigation (Row-Based)

### Requirements
- [ ] Arrow Down: Navigate to next row
- [ ] Arrow Up: Navigate to previous row
- [ ] Home: Navigate to first row
- [ ] End: Navigate to last row
- [ ] Page Down: Navigate 10 rows down
- [ ] Page Up: Navigate 10 rows up
- [ ] Space: Toggle row selection (if selection enabled)
- [ ] Ctrl/Cmd+A: Select all rows (if multi-selection)
- [ ] Tab: Move focus outside table
- [ ] Shift+Tab: Move focus outside table (reverse)
- [ ] Focus visible on current row
- [ ] Initial focus on first data row

### Hook
```typescript
// hooks/use-keyboard-navigation.ts
function useKeyboardNavigation({
  rowCount,
  columnCount,
  mode: 'row' | 'cell',
  onNavigate,
}: UseKeyboardNavigationOptions) {
  // Implementation
}
```

### Styling
- Focused row: `ring-2 ring-primary ring-inset`
- Focus visible class: `focus-visible:outline-none focus-visible:ring-2`

### Acceptance Criteria
- [ ] Arrow keys navigate rows
- [ ] Home/End work correctly
- [ ] Page Up/Down work correctly
- [ ] Space toggles selection
- [ ] Ctrl/Cmd+A selects all (multi)
- [ ] Tab/Shift+Tab exit focus
- [ ] Focus indicator visible
- [ ] Tests pass

### Tests
```typescript
it('navigates rows with arrow keys', async () => {
  render(<Table data={mockData} columns={mockColumns} />)

  const rows = screen.getAllByRole('row')
  rows[1].focus()

  await userEvent.keyboard('{ArrowDown}')
  expect(rows[2]).toHaveFocus()

  await userEvent.keyboard('{ArrowUp}')
  expect(rows[1]).toHaveFocus()
})

it('navigates to first/last row with Home/End', async () => {
  render(<Table data={mockData} columns={mockColumns} />)

  const rows = screen.getAllByRole('row')
  rows[2].focus()

  await userEvent.keyboard('{Home}')
  expect(rows[1]).toHaveFocus()

  await userEvent.keyboard('{End}')
  expect(rows[rows.length - 1]).toHaveFocus()
})
```

---

## Spec 8: Keyboard Navigation (Cell-Based)

### Requirements
- [ ] Arrow keys navigate cells (up/down/left/right)
- [ ] Home: First cell in row
- [ ] End: Last cell in row
- [ ] Ctrl/Cmd+Home: First cell in table
- [ ] Ctrl/Cmd+End: Last cell in table
- [ ] Tab: Next focusable cell
- [ ] Shift+Tab: Previous focusable cell
- [ ] Focus visible on current cell
- [ ] Support interactive content within cells

### Props
```typescript
interface TableProps<TData> {
  // ...existing props
  navigationMode?: 'row' | 'cell'
}
```

### Acceptance Criteria
- [ ] Arrow keys navigate cells
- [ ] Home/End work in rows
- [ ] Ctrl+Home/End work for table
- [ ] Tab navigation works
- [ ] Focus indicator visible
- [ ] Tests pass

### Tests
```typescript
it('navigates cells with arrow keys', async () => {
  render(<Table data={mockData} columns={mockColumns} navigationMode="cell" />)

  const cells = screen.getAllByRole('gridcell')
  cells[0].focus()

  await userEvent.keyboard('{ArrowRight}')
  expect(cells[1]).toHaveFocus()

  await userEvent.keyboard('{ArrowDown}')
  expect(cells[1 + mockColumns.length]).toHaveFocus()
})
```

---

## Spec 9: Accessibility (ARIA)

### Requirements
- [ ] Table has `role="grid"`
- [ ] Table has `aria-rowcount` (total rows + header)
- [ ] Table has `aria-colcount` (total columns)
- [ ] Table has `aria-label` or `aria-labelledby`
- [ ] Table has `aria-multiselectable` (if multi-selection)
- [ ] Header row has `role="row"`
- [ ] Header cells have `role="columnheader"`
- [ ] Header cells have `aria-colindex`
- [ ] Header cells have `aria-sort` (if sortable)
- [ ] Body rows have `role="row"`
- [ ] Body rows have `aria-rowindex`
- [ ] Body rows have `aria-selected` (if selected)
- [ ] Body cells have `role="gridcell"`
- [ ] Body cells have `aria-rowindex` and `aria-colindex`
- [ ] Zero axe accessibility violations

### Hook
```typescript
// hooks/use-accessibility.ts
function useAccessibility<TData>({
  selection,
  sorting,
  rowCount,
  columnCount,
  ariaLabel,
  ariaLabelledBy,
}: UseAccessibilityOptions<TData>) {
  // Implementation
}
```

### Acceptance Criteria
- [ ] All ARIA attributes present
- [ ] Axe tests pass (0 violations)
- [ ] Screen reader announces correctly
- [ ] WCAG 2.1 AA compliant
- [ ] Tests pass

### Tests
```typescript
it('has correct ARIA attributes', () => {
  render(<Table data={mockData} columns={mockColumns} ariaLabel="Data table" />)

  const table = screen.getByRole('grid')
  expect(table).toHaveAttribute('aria-label', 'Data table')
  expect(table).toHaveAttribute('aria-rowcount', String(mockData.length + 1))
  expect(table).toHaveAttribute('aria-colcount', String(mockColumns.length))
})

it('has no accessibility violations', async () => {
  const { container } = render(<Table data={mockData} columns={mockColumns} />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

## Spec 10: Internationalization (i18n)

### Requirements
- [ ] All user-facing text externalized
- [ ] Support i18n library (react-i18next)
- [ ] Create useTableI18n hook
- [ ] Cover all UI5 i18n keys:
  - TABLE_NO_DATA
  - TABLE_ROW
  - TABLE_ROW_INDEX
  - TABLE_ROW_SELECTED
  - TABLE_SELECT_ALL_ROWS
  - TABLE_DESELECT_ALL_ROWS
  - TABLE_MORE (for growing)
  - CHECKBOX_CHECKED / CHECKBOX_NOT_CHECKED
- [ ] Support RTL (right-to-left) layouts
- [ ] Test with multiple locales

### Hook
```typescript
// hooks/use-i18n.ts
function useTableI18n() {
  const { t } = useTranslation('table')
  return {
    noData: t('noData', 'No data'),
    loading: t('loading', 'Loading...'),
    selectAll: t('selectAll', 'Select all'),
    // ...more keys
  }
}

// hooks/use-direction.ts
function useDirection() {
  const dir = document.documentElement.dir || 'ltr'
  return { dir, isRTL: dir === 'rtl' }
}
```

### Acceptance Criteria
- [ ] No hardcoded strings
- [ ] All i18n keys covered
- [ ] Multiple locales work
- [ ] RTL layout works
- [ ] Tests pass

### Tests
```typescript
it('uses i18n for no data text', () => {
  render(<Table data={[]} columns={mockColumns} />, {
    wrapper: ({ children }) => (
      <I18nextProvider i18n={i18nInstance}>
        {children}
      </I18nextProvider>
    ),
  })

  expect(screen.getByText('No data')).toBeInTheDocument()
})

it('supports RTL layout', () => {
  document.documentElement.dir = 'rtl'
  render(<Table data={mockData} columns={mockColumns} />)

  const table = screen.getByRole('grid')
  expect(table).toHaveAttribute('dir', 'rtl')
})
```

---

## Spec 11: Theming with Tailwind & CSS Variables

### Requirements
- [ ] All styling uses Tailwind utilities
- [ ] CSS variables for theme values
- [ ] Support light and dark modes
- [ ] Support `alternateRowColors` prop
- [ ] Support custom className overrides
- [ ] Extend Tailwind config with table-specific utilities
- [ ] Create table.css with CSS variables
- [ ] Use `cn()` utility for conditional classes
- [ ] Use `cva` for component variants

### CSS Variables
```css
/* styles/table.css */
:root {
  --table-cell-padding-x: 1rem;
  --table-cell-padding-y: 0.5rem;
  --table-border-color: hsl(var(--border));
  --table-header-bg: hsl(var(--muted));
  --table-row-hover-bg: hsl(var(--muted) / 0.5);
  --table-row-selected-bg: hsl(var(--accent));
  --table-row-alternate-bg: hsl(var(--muted) / 0.25);
}
```

### Props
```typescript
interface TableProps<TData> {
  // ...existing props
  alternateRowColors?: boolean
}
```

### Variants (CVA)
```typescript
const tableVariants = cva("w-full caption-bottom text-sm", {
  variants: {
    alternateRows: {
      true: "[&_tbody_tr:nth-child(even)]:bg-muted/50",
      false: "",
    },
  },
})
```

### Acceptance Criteria
- [ ] All Tailwind utilities work
- [ ] CSS variables applied
- [ ] Light/dark mode toggle works
- [ ] alternateRowColors works
- [ ] className overrides work
- [ ] Visual regression tests pass
- [ ] Tests pass

### Tests
```typescript
it('applies alternating row colors', () => {
  render(<Table data={mockData} columns={mockColumns} alternateRowColors />)

  const rows = screen.getAllByRole('row').slice(1)
  expect(rows[1]).toHaveClass('bg-muted/50')
})

it('supports custom className', () => {
  render(<Table data={mockData} columns={mockColumns} className="custom-class" />)

  const table = screen.getByRole('grid')
  expect(table).toHaveClass('custom-class')
})
```

---

## Spec 12: Virtualization for Large Datasets

### Requirements
- [ ] Support `virtualization` prop
- [ ] Use @tanstack/react-virtual for implementation
- [ ] Support `rowHeight` prop (default: 48px)
- [ ] Support `overscan` prop (default: 5)
- [ ] Only render visible rows
- [ ] Fire `onRangeChange` callback when range changes
- [ ] Smooth scrolling (60fps)
- [ ] Total scroll height calculated correctly
- [ ] Performance: <100ms render for 10,000 rows

### Props
```typescript
interface TableProps<TData> {
  // ...existing props
  virtualization?: boolean
  rowHeight?: number
  overscan?: number
  onRangeChange?: (range: { first: number; last: number }) => void
}
```

### Hook
```typescript
// hooks/use-virtualization.ts
import { useVirtualizer } from '@tanstack/react-virtual'

function useVirtualization<TData>({
  data,
  parentRef,
  rowHeight,
  overscan,
  onRangeChange,
}: UseVirtualizationOptions<TData>) {
  // Implementation
}
```

### Acceptance Criteria
- [ ] Virtualization works
- [ ] Only visible rows rendered
- [ ] Smooth scrolling
- [ ] Performance benchmark passes (<100ms)
- [ ] onRangeChange fires correctly
- [ ] Tests pass

### Tests
```typescript
it('virtualizes large dataset', () => {
  const largeData = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Name ${i}`,
  }))

  const { container } = render(
    <Table data={largeData} columns={mockColumns} virtualization />
  )

  const rows = container.querySelectorAll('[role="row"]')
  expect(rows.length).toBeLessThan(100) // Not all 10000 rows
})

it('renders large dataset quickly', () => {
  const largeData = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Name ${i}`,
  }))

  const startTime = performance.now()
  render(<Table data={largeData} columns={mockColumns} virtualization />)
  const endTime = performance.now()

  expect(endTime - startTime).toBeLessThan(100)
})
```

---

## Spec 13: Growing / Lazy Loading

### Requirements
- [ ] Support `growing` prop
- [ ] Support `growingMode`: "button" or "scroll"
- [ ] Button mode: Show "Load More" button
- [ ] Scroll mode: Auto-load when scrolled to bottom
- [ ] Fire `onLoadMore` callback
- [ ] Support `growingThreshold` prop (default: 20)
- [ ] Support `hasMore` prop to control button visibility
- [ ] "Load More" button uses i18n
- [ ] Disable button during loading

### Props
```typescript
interface TableProps<TData> {
  // ...existing props
  growing?: boolean
  growingMode?: 'button' | 'scroll'
  growingThreshold?: number
  hasMore?: boolean
  onLoadMore?: () => void | Promise<void>
}
```

### Hook
```typescript
// hooks/use-growing.ts
function useGrowing<TData>({
  data,
  mode,
  threshold,
  hasMore,
  onLoadMore,
}: UseGrowingOptions<TData>) {
  // Implementation
}
```

### Acceptance Criteria
- [ ] Growing button mode works
- [ ] Growing scroll mode works
- [ ] onLoadMore callback fires
- [ ] Button uses i18n
- [ ] hasMore controls button visibility
- [ ] Tests pass

### Tests
```typescript
it('shows load more button', () => {
  render(
    <Table
      data={mockData}
      columns={mockColumns}
      growing
      growingMode="button"
      hasMore
    />
  )

  expect(screen.getByText('Load more')).toBeInTheDocument()
})

it('calls onLoadMore when button clicked', async () => {
  const onLoadMore = jest.fn()
  render(
    <Table
      data={mockData}
      columns={mockColumns}
      growing
      hasMore
      onLoadMore={onLoadMore}
    />
  )

  await userEvent.click(screen.getByText('Load more'))
  expect(onLoadMore).toHaveBeenCalled()
})

it('auto-loads on scroll', async () => {
  const onLoadMore = jest.fn()
  render(
    <Table
      data={mockData}
      columns={mockColumns}
      growing
      growingMode="scroll"
      hasMore
      onLoadMore={onLoadMore}
    />
  )

  // Scroll to bottom
  const table = screen.getByRole('grid')
  fireEvent.scroll(table, { target: { scrollTop: 1000 } })

  await waitFor(() => {
    expect(onLoadMore).toHaveBeenCalled()
  })
})
```

---

## Spec 14: AI-Powered Sorting

### Requirements
- [ ] Support `aiContext.enableAISort` prop
- [ ] Natural language sort queries
- [ ] Example: "sort by relevance to sustainability"
- [ ] Call AI API via `onAIQuery` callback
- [ ] Apply AI-determined sort logic
- [ ] Show AI sort indicator
- [ ] Allow clearing AI sort

### Props
```typescript
interface TableAIContext {
  enableAISort?: boolean
  enableAIFilter?: boolean
  enableAIGrouping?: boolean
  onAIQuery?: (query: string, context: TableContext) => Promise<AIQueryResult>
}

interface TableProps<TData> {
  // ...existing props
  aiContext?: TableAIContext
}
```

### Hook
```typescript
// features/ai-sort.ts
function useAISort<TData>({
  data,
  columns,
  onAIQuery,
}: UseAISortOptions<TData>) {
  // Implementation
}
```

### Acceptance Criteria
- [ ] AI sort enabled with prop
- [ ] Natural language queries work
- [ ] onAIQuery fires with context
- [ ] AI sort applied to data
- [ ] UI indicator shows AI sort active
- [ ] Tests pass

### Tests
```typescript
it('sorts data with AI query', async () => {
  const onAIQuery = jest.fn().mockResolvedValue({
    sortFn: (a, b) => b.relevance - a.relevance,
  })

  render(
    <Table
      data={mockData}
      columns={mockColumns}
      aiContext={{ enableAISort: true, onAIQuery }}
    />
  )

  const aiSortInput = screen.getByPlaceholderText('AI sort...')
  await userEvent.type(aiSortInput, 'sort by relevance{enter}')

  expect(onAIQuery).toHaveBeenCalledWith(
    'sort by relevance',
    expect.objectContaining({ data: mockData, columns: mockColumns })
  )
})
```

---

## Spec 15: AI-Powered Filtering

### Requirements
- [ ] Support `aiContext.enableAIFilter` prop
- [ ] Natural language filter queries
- [ ] Example: "show products with high ratings and low prices"
- [ ] Call AI API via `onAIQuery` callback
- [ ] Apply AI-determined filter
- [ ] Show active filter chips
- [ ] Allow clearing filters

### Hook
```typescript
// features/ai-filter.ts
function useAIFilter<TData>({
  data,
  columns,
  onAIQuery,
}: UseAIFilterOptions<TData>) {
  // Implementation
}
```

### Acceptance Criteria
- [ ] AI filter enabled with prop
- [ ] Natural language queries work
- [ ] onAIQuery fires with context
- [ ] Filtered data rendered
- [ ] Filter chips display
- [ ] Tests pass

### Tests
```typescript
it('filters data with AI query', async () => {
  const onAIQuery = jest.fn().mockResolvedValue({
    filterFn: (row) => row.rating > 4 && row.price < 50,
  })

  render(
    <Table
      data={mockData}
      columns={mockColumns}
      aiContext={{ enableAIFilter: true, onAIQuery }}
    />
  )

  const aiFilterInput = screen.getByPlaceholderText('AI filter...')
  await userEvent.type(aiFilterInput, 'high ratings low prices{enter}')

  expect(onAIQuery).toHaveBeenCalled()
  // Verify filtered results
})
```

---

## Spec 16: AI Insights

### Requirements
- [ ] Automatically analyze data for patterns
- [ ] Detect anomalies (outliers)
- [ ] Detect trends (increasing/decreasing)
- [ ] Show insight cards above or below table
- [ ] Highlight affected rows
- [ ] Allow dismissing insights
- [ ] Support custom insight types

### Hook
```typescript
// features/ai-insights.ts
function useAIInsights<TData>({
  data,
  columns,
  enabled,
}: UseAIInsightsOptions<TData>) {
  // Implementation
}
```

### Acceptance Criteria
- [ ] Insights generated automatically
- [ ] Insights displayed in UI
- [ ] Affected rows highlighted
- [ ] Insights dismissible
- [ ] Tests pass

### Tests
```typescript
it('shows AI insights', async () => {
  render(
    <Table
      data={mockData}
      columns={mockColumns}
      aiContext={{ insights: mockInsights }}
    />
  )

  expect(screen.getByText('Anomaly detected')).toBeInTheDocument()
})
```

---

## Spec 17: Conversational AI Interface

### Requirements
- [ ] Chat interface below table
- [ ] Ask questions about data
- [ ] Example: "What's the average age?"
- [ ] Example: "Show me the top 5 products"
- [ ] AI responds and applies actions
- [ ] Actions: sort, filter, highlight, summarize
- [ ] Chat history maintained
- [ ] Keyboard accessible

### Component
```typescript
// components/table-ai-chat.tsx
function TableAIChat<TData>({
  table,
  onQuery,
}: TableAIChatProps<TData>) {
  // Implementation
}
```

### Acceptance Criteria
- [ ] Chat interface renders
- [ ] User can type queries
- [ ] onQuery callback fires
- [ ] AI responses shown
- [ ] Actions applied to table
- [ ] Keyboard accessible
- [ ] Tests pass

### Tests
```typescript
it('processes AI query', async () => {
  const onQuery = jest.fn().mockResolvedValue({
    answer: 'The average age is 30.',
    action: null,
  })

  render(
    <Table
      data={mockData}
      columns={mockColumns}
      aiContext={{ onAIQuery: onQuery }}
    />
  )

  const input = screen.getByPlaceholderText('Ask AI about your data...')
  await userEvent.type(input, "What's the average age?{enter}")

  expect(onQuery).toHaveBeenCalled()
  expect(screen.getByText('The average age is 30.')).toBeInTheDocument()
})
```

---

## Spec 18: Performance Optimization

### Requirements
- [ ] Use React.memo for all sub-components
- [ ] Use useMemo for expensive computations (sorting, filtering)
- [ ] Use useCallback for event handlers
- [ ] Virtualize rows for large datasets
- [ ] Lazy load AI features (code splitting)
- [ ] Tree-shakeable exports
- [ ] Bundle size: <50KB gzipped
- [ ] Performance benchmark: <100ms render for 10,000 rows (virtualized)

### Optimizations
```typescript
// Memoize components
export const TableRow = React.memo(TableRow, (prev, next) => {
  return prev.id === next.id && prev.selected === next.selected
})

// Memoize computations
const sortedData = React.useMemo(() => applySorting(data, sorting), [data, sorting])

// Memoize callbacks
const handleRowClick = React.useCallback((row) => {
  onRowClick?.(row)
}, [onRowClick])

// Lazy load
const AIChat = React.lazy(() => import('./table-ai-chat'))
```

### Acceptance Criteria
- [ ] All components memoized
- [ ] No unnecessary re-renders
- [ ] Performance benchmarks pass
- [ ] Bundle size target met
- [ ] React DevTools Profiler shows clean render
- [ ] Tests pass

### Tests
```typescript
it('does not re-render unchanged rows', () => {
  const { rerender } = render(<Table data={mockData} columns={mockColumns} />)

  const row = screen.getAllByRole('row')[1]
  const renderCount = getRenderCount(row)

  rerender(<Table data={mockData} columns={mockColumns} />)
  expect(getRenderCount(row)).toBe(renderCount) // Same count
})

it('meets performance benchmark', () => {
  const largeData = Array.from({ length: 10000 }, (_, i) => ({ id: i }))

  const startTime = performance.now()
  render(<Table data={largeData} columns={mockColumns} virtualization />)
  const endTime = performance.now()

  expect(endTime - startTime).toBeLessThan(100)
})
```

---

## Spec 19: Documentation & Examples

### Requirements
- [ ] README.md with component overview
- [ ] API documentation (all props, events, types)
- [ ] Usage examples (basic, advanced, AI-powered)
- [ ] Migration guide from UI5 Web Components
- [ ] Storybook stories for all features
- [ ] Accessibility guide (keyboard shortcuts, ARIA)
- [ ] Performance guide (virtualization, optimization tips)
- [ ] Feature comparison table (UI5 vs shadcn-ui5)

### Files
- [ ] `README.md` - Overview and quick start
- [ ] `API.md` - Full API reference
- [ ] `EXAMPLES.md` - Usage examples
- [ ] `MIGRATION.md` - UI5 migration guide
- [ ] `ACCESSIBILITY.md` - A11y documentation
- [ ] `PERFORMANCE.md` - Performance tips
- [ ] `COMPARISON.md` - Feature parity table
- [ ] `table.stories.tsx` - Storybook stories

### Acceptance Criteria
- [ ] All documentation files created
- [ ] Documentation comprehensive and clear
- [ ] All examples runnable
- [ ] Migration guide accurate
- [ ] Storybook stories cover all features
- [ ] Comparison table shows 100% parity

---

## Spec 20: Enterprise Feature Parity Verification

### Requirements
- [ ] All UI5 Table props covered
- [ ] All UI5 Table events covered
- [ ] All UI5 Table slots covered
- [ ] All keyboard shortcuts covered
- [ ] All i18n keys covered
- [ ] All accessibility features covered
- [ ] All enterprise features covered
- [ ] Create feature parity checklist
- [ ] Verify 100% parity

### Feature Parity Checklist

#### Core Features
- [ ] Data rendering
- [ ] Column definitions
- [ ] Header row
- [ ] Body rows
- [ ] Cells
- [ ] Empty state
- [ ] Loading state

#### Selection
- [ ] Single selection
- [ ] Multi selection
- [ ] Select all
- [ ] Selection behaviors (row-selector, row-only)

#### Sorting
- [ ] Column sorting
- [ ] Sort indicators
- [ ] Custom sort functions

#### Virtualization
- [ ] Virtual scrolling
- [ ] Large dataset support (10,000+ rows)

#### Growing
- [ ] Button mode
- [ ] Scroll mode
- [ ] Lazy loading

#### Keyboard Navigation
- [ ] Row-based navigation
- [ ] Cell-based navigation
- [ ] All keyboard shortcuts

#### Accessibility
- [ ] All ARIA attributes
- [ ] Screen reader support
- [ ] WCAG 2.1 AA compliance

#### Internationalization
- [ ] All i18n keys
- [ ] RTL support

#### Theming
- [ ] Light/dark mode
- [ ] Custom themes
- [ ] Tailwind utilities

#### AI Features (NEW - beyond UI5)
- [ ] AI-powered sorting
- [ ] AI-powered filtering
- [ ] AI insights
- [ ] Conversational interface

### Acceptance Criteria
- [ ] 100% feature parity achieved
- [ ] Feature parity document created
- [ ] All items checked off
- [ ] No regressions from UI5
- [ ] Additional AI features implemented

---

## Completion Signal

When ALL specs (1-20) are 100% complete:
- [ ] All unit tests pass
- [ ] All accessibility tests pass (0 violations)
- [ ] All keyboard navigation tests pass
- [ ] All performance benchmarks pass
- [ ] All visual regression tests pass
- [ ] All documentation complete
- [ ] Feature parity at 100%
- [ ] Code review approved
- [ ] Ready for production use

**OUTPUT COMPLETION SIGNAL:**
```
✅ TABLE COMPONENT CONVERSION COMPLETE
✅ 100% Feature Parity Achieved
✅ All Tests Passing
✅ Documentation Complete
✅ Ready for Production
```
