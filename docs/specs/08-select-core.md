# Spec 08: Select Component Core

## Overview
Implement the Select component - dropdown without text input (like native `<select>`).

## Requirements

### Component Structure
- Create `src/components/select/` directory with:
  - `Select.tsx` - Main component
  - `Option.tsx` - Standard option
  - `OptionCustom.tsx` - Custom content option
  - `SelectPopover.tsx` - Dropdown popover
  - `index.ts` - Exports

### Type Definitions
- Create `src/types/select.ts` with:
  - `SelectProps` interface
  - `OptionProps` interface
  - `OptionCustomProps` interface

### Select Props
- `value: string` - Selected option's value
- `disabled: boolean` - Disable interaction
- `readonly: boolean` - Read-only mode
- `required: boolean` - Form validation
- `valueState: ValueState` - Validation state
- `icon: string` - Icon-only mode
- `onChange: (selectedOption: Option) => void` - Selection callback
- `onLiveChange: (selectedOption: Option) => void` - Preview callback

### Key Difference from ComboBox
- NO text input - displays selected option only
- Click anywhere opens dropdown
- Arrow keys navigate without typing
- Type-ahead search by first character

### Selection Mechanisms
1. Value-based: `<Select value="opt1">`
2. Selected prop: `<Option selected>`
3. Auto-select first option if no selection

## Acceptance Criteria
- [ ] Directory structure with all files
- [ ] Type definitions exported
- [ ] Select renders selected option text (not input)
- [ ] Click opens dropdown
- [ ] Options displayed in listbox
- [ ] Clicking option selects it
- [ ] `value` prop controls selection
- [ ] `selected` prop on Option works
- [ ] First option auto-selected if no selection
- [ ] Uses React.forwardRef pattern
- [ ] Tailwind styling throughout

**Output when complete:** `<promise>DONE</promise>`
