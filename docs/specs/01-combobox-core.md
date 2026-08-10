# Spec 01: ComboBox Core Structure

## Overview
Implement the core ComboBox component with basic input, dropdown, and item selection.

## Requirements

### Component Structure
- Create `src/components/combobox/` directory with:
  - `ComboBox.tsx` - Main component
  - `ComboBoxItem.tsx` - Individual item component
  - `ComboBoxItemGroup.tsx` - Group header component
  - `ComboBoxPopover.tsx` - Dropdown popover component
  - `index.ts` - Exports

### Type Definitions
- Create `src/types/combobox.ts` with:
  - `ComboBoxProps` interface
  - `ComboBoxItemProps` interface
  - `ComboBoxItemGroupProps` interface
  - `ComboBoxFilter` enum (StartsWithPerTerm, StartsWith, Contains, None)
  - `ValueState` enum (None, Positive, Negative, Critical, Information)

### Core Props
- `value: string` - Current value
- `placeholder: string` - Placeholder text
- `disabled: boolean` - Disable interaction
- `readonly: boolean` - Read-only mode
- `filter: ComboBoxFilter` - Filter strategy
- `onChange: (value: string) => void` - Value change callback
- `onSelectionChange: (item: ComboBoxItem | null) => void` - Selection callback
- `className: string` - Custom styling

### Basic Functionality
- Text input that filters items
- Dropdown shows filtered items
- Click item to select
- Selected item updates input value
- Dropdown closes on selection

## Acceptance Criteria
- [ ] Directory structure created with all files
- [ ] Type definitions exported from main index.ts
- [ ] ComboBox renders an input with dropdown trigger
- [ ] Items can be passed as children
- [ ] Clicking dropdown arrow toggles popover
- [ ] Typing filters items (StartsWithPerTerm default)
- [ ] Clicking item selects it and closes popover
- [ ] Selected item value appears in input
- [ ] Component uses React.forwardRef pattern
- [ ] Styling uses cn() and Tailwind classes
- [ ] TypeScript compiles without errors

**Output when complete:** `<promise>DONE</promise>`
