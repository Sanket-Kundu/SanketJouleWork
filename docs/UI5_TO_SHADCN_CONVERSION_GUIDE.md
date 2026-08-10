# UI5 Web Components to shadcn-ui5 Conversion Guide

This guide provides a repeatable methodology for converting UI5 Web Components into modern, AI-ready shadcn-ui5 React components with full enterprise feature parity.

## Philosophy

**Why Convert?**
- **Modern React**: Native hooks, composition patterns, and concurrent rendering support
- **Tailwind Theming**: CSS variables + utility classes = infinite theme flexibility
- **AI-Ready**: Clean props API perfect for generative UI and AI agents
- **Performance**: Tree-shakeable, minimal runtime, no Shadow DOM overhead
- **Developer Experience**: TypeScript-first, IDE autocompletion, familiar React patterns

**Core Principles:**
1. **Feature Parity First** - Every enterprise feature must be preserved
2. **Accessibility is Non-Negotiable** - WCAG 2.1 AA compliance minimum
3. **AI-Optimized API** - Props should be self-documenting and composable
4. **Performance by Default** - Lazy loading, memoization, minimal re-renders
5. **Theme Flexibility** - CSS variables for runtime theming

---

## Conversion Workflow

### Phase 1: Research the UI5 Component

1. **Find the source** in the UI5 Web Components repo:
   ```
   packages/main/src/[ComponentName].ts
   packages/main/src/[ComponentName].hbs (template)
   packages/main/src/themes/[ComponentName].css
   packages/main/src/i18n/messagebundle.properties
   ```

2. **Document ALL features** by category:
   - Core properties and their types
   - Value states and semantic feedback
   - Slots (named content areas)
   - Events and their payloads
   - Keyboard shortcuts
   - ARIA attributes and roles
   - CSS custom properties
   - i18n strings
   - Mobile-specific behavior

3. **Create a feature checklist** to ensure nothing is missed

### Phase 2: Design the React API

1. **Props Interface**: Map UI5 properties to React props
   ```typescript
   // UI5: <ui5-input value="hello" value-state="Error" />
   // React: <Input value="hello" valueState="Negative" />
   ```

2. **Controlled + Uncontrolled**: Support both patterns
   ```typescript
   interface InputProps {
     value?: string;           // Controlled
     defaultValue?: string;    // Uncontrolled
     onChange?: (value: string) => void;
   }
   ```

3. **Event Details**: Create typed event payloads
   ```typescript
   interface InputChangeDetail {
     value: string;
     nativeEvent: React.ChangeEvent;
   }
   ```

4. **Composition**: Child components for slots
   ```typescript
   // UI5: <ui5-input><ui5-icon slot="icon" /></ui5-input>
   // React: <Input icon={<SearchIcon />} />
   // Or: <Input><Input.Icon><SearchIcon /></Input.Icon></Input>
   ```

### Phase 3: Implement with Tailwind

1. **Use class-variance-authority (cva)** for variants:
   ```typescript
   const inputVariants = cva("base-classes", {
     variants: {
       valueState: {
         None: "border-input",
         Negative: "border-red-500",
         // ...
       }
     }
   });
   ```

2. **Map CSS custom properties to Tailwind**:
   ```
   UI5: --_ui5_input_border_radius → Tailwind: rounded-md
   UI5: --sapField_BorderColor → Tailwind: border-input (via CSS var)
   ```

3. **Use the cn() utility** for conditional classes:
   ```typescript
   className={cn(inputVariants({ valueState }), className)}
   ```

### Phase 4: Accessibility Implementation

1. **ARIA Attributes**: Map from UI5's accessibility implementation
   ```typescript
   <input
     role="combobox"
     aria-expanded={open}
     aria-invalid={valueState === "Negative"}
     aria-required={required}
     aria-label={accessibleName}
     aria-describedby={errorId}
   />
   ```

2. **Keyboard Navigation**: Implement all UI5 shortcuts
   ```typescript
   const handleKeyDown = (e: KeyboardEvent) => {
     switch (e.key) {
       case "Escape": closeAndRevert(); break;
       case "Enter": submit(); break;
       // ...
     }
   };
   ```

3. **Screen Reader Announcements**: Use aria-live regions
   ```typescript
   const { announce } = useAnnounce();
   announce("3 suggestions available");
   ```

### Phase 5: Internationalization

1. **Extract i18n keys** from UI5's messagebundle.properties
2. **Create a locale hook or context**:
   ```typescript
   const { t } = useLocale();
   <span>{t("INPUT_SUGGESTIONS_ONE_HIT")}</span>
   ```

3. **Support RTL** via CSS logical properties:
   ```css
   padding-inline-start: 0.5rem; /* instead of padding-left */
   ```

### Phase 6: Testing with Ralph Wiggum

Use spec-driven development to ensure feature completeness:

1. **Write specs** for each feature area
2. **Implement** until spec passes
3. **Verify** with automated tests
4. **Iterate** until 100% acceptance

---

## File Structure Template

```
src/
├── components/
│   └── [component-name]/
│       ├── [ComponentName].tsx      # Main component
│       ├── [SubComponent].tsx       # Child components
│       ├── [ComponentName]Popover.tsx # If has dropdown
│       └── index.ts                 # Exports
├── types/
│   └── [component-name].ts          # Types and interfaces
├── hooks/
│   └── use[Feature].ts              # Component-specific hooks
└── index.ts                         # Add exports
```

---

## Types Template

```typescript
// types/[component-name].ts

// Enums for fixed values
export enum ValueState {
  None = "None",
  Positive = "Positive",
  Negative = "Negative",
  Critical = "Critical",
  Information = "Information",
}

export enum InputType {
  Text = "Text",
  Email = "Email",
  Number = "Number",
  Password = "Password",
  Tel = "Tel",
  URL = "URL",
  Search = "Search",
}

// Event detail interfaces
export interface InputChangeDetail {
  value: string;
  previousValue: string;
}

// Main props interface
export interface InputProps {
  // Value
  value?: string;
  defaultValue?: string;

  // Behavior
  type?: InputType | `${InputType}`;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;

  // Validation
  valueState?: ValueState | `${ValueState}`;
  valueStateMessage?: React.ReactNode;

  // Constraints
  maxLength?: number;
  minLength?: number;
  pattern?: string;

  // Display
  placeholder?: string;
  showClearIcon?: boolean;

  // Accessibility
  accessibleName?: string;
  accessibleNameRef?: string;

  // Slots
  icon?: React.ReactNode;

  // Events
  onChange?: (detail: InputChangeDetail) => void;
  onInput?: (value: string) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;

  // Standard
  className?: string;
  id?: string;
  name?: string;
}
```

---

## Component Template

```typescript
// components/[component-name]/[ComponentName].tsx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { ValueState, type InputProps } from "../../types/input";

const inputVariants = cva(
  [
    "flex h-10 w-full rounded-md border bg-background px-3 py-2",
    "text-sm ring-offset-background",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      valueState: {
        [ValueState.None]: "border-input focus:ring-ring",
        [ValueState.Positive]: "border-green-500 focus:ring-green-500",
        [ValueState.Negative]: "border-red-500 focus:ring-red-500",
        [ValueState.Critical]: "border-orange-500 focus:ring-orange-500",
        [ValueState.Information]: "border-blue-500 focus:ring-blue-500",
      },
    },
    defaultVariants: {
      valueState: ValueState.None,
    },
  }
);

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "Text",
      valueState = ValueState.None,
      disabled,
      readonly,
      value: controlledValue,
      defaultValue = "",
      onChange,
      onInput,
      ...props
    },
    ref
  ) => {
    // Controlled + uncontrolled support
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const value = controlledValue ?? internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }

      onInput?.(newValue);
      onChange?.({ value: newValue, previousValue: value });
    };

    return (
      <input
        ref={ref}
        type={type.toLowerCase()}
        className={cn(inputVariants({ valueState: valueState as ValueState }), className)}
        disabled={disabled}
        readOnly={readonly}
        value={value}
        onChange={handleChange}
        aria-invalid={valueState === ValueState.Negative}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
```

---

## Feature Parity Checklist

Use this checklist for each component conversion:

### Core Features
- [ ] All properties mapped to props
- [ ] Controlled and uncontrolled modes
- [ ] All events with typed payloads
- [ ] Default values match UI5

### Value States
- [ ] None state styling
- [ ] Positive (Success) state
- [ ] Negative (Error) state
- [ ] Critical (Warning) state
- [ ] Information state
- [ ] Value state messages

### Accessibility
- [ ] Proper ARIA roles
- [ ] aria-label/labelledby support
- [ ] aria-describedby for errors
- [ ] aria-invalid for error state
- [ ] aria-required for required
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Screen reader announcements

### Internationalization
- [ ] All strings externalized
- [ ] RTL support
- [ ] Locale-aware formatting

### Visual
- [ ] All themes supported
- [ ] Responsive design
- [ ] Mobile-specific UI
- [ ] Icons and slots
- [ ] Transitions/animations

### Enterprise
- [ ] Form integration
- [ ] Validation support
- [ ] Clear icon
- [ ] Read-only mode
- [ ] Disabled mode

---

## AI-Ready Design Principles

### 1. Self-Documenting Props
```typescript
// Good: Clear, typed, documented
interface InputProps {
  /** Current value of the input */
  value?: string;
  /** Visual feedback state for validation */
  valueState?: ValueState;
}

// Bad: Ambiguous, untyped
interface InputProps {
  v?: any;
  state?: string;
}
```

### 2. Composable Components
```typescript
// AI can easily compose these
<Form>
  <Input
    label="Email"
    type="Email"
    required
    valueState={errors.email ? "Negative" : "None"}
    valueStateMessage={errors.email}
  />
</Form>
```

### 3. Predictable Behavior
```typescript
// Always same behavior regardless of controlled/uncontrolled
<Input defaultValue="initial" />  // Uncontrolled
<Input value={state} onChange={setState} />  // Controlled
```

### 4. Event Payloads with Context
```typescript
// Rich event details help AI understand what happened
onChange?.({
  value: newValue,
  previousValue: oldValue,
  source: "user" | "programmatic",
  valid: isValid,
});
```

---

## Performance Guidelines

### 1. Memoize Expensive Computations
```typescript
const filteredItems = useMemo(
  () => items.filter(item => item.text.includes(filter)),
  [items, filter]
);
```

### 2. Use Callbacks for Event Handlers
```typescript
const handleChange = useCallback((e) => {
  onChange?.(e.target.value);
}, [onChange]);
```

### 3. Lazy Load Heavy Features
```typescript
// Only load suggestions popover when needed
const SuggestionsPopover = lazy(() => import('./SuggestionsPopover'));
```

### 4. Virtualize Long Lists
```typescript
// For suggestion lists > 50 items
import { useVirtualizer } from '@tanstack/react-virtual';
```

---

## Testing Requirements

### Unit Tests
- All props variations
- Controlled/uncontrolled behavior
- Event firing
- Accessibility attributes

### Integration Tests
- Form submission
- Keyboard navigation
- Screen reader compatibility

### Visual Tests
- All value states
- All themes
- Responsive breakpoints
- RTL layout

---

## Ralph Wiggum Spec Format

Create specs in `docs/specs/` with this format:

```markdown
# [Component] - [Feature Area]

## Acceptance Criteria

- [ ] Criterion 1: Specific, testable requirement
- [ ] Criterion 2: Another requirement
- [ ] Criterion 3: Edge case handling

## Test Cases

1. **Test case name**: Description of test
   - Input: What to do
   - Expected: What should happen

## Implementation Notes

Any specific guidance for implementation.
```

---

## Quick Reference: UI5 to React Mapping

| UI5 Pattern | React Pattern |
|-------------|---------------|
| `property="value"` | `prop={value}` |
| `@event="handler"` | `onEvent={handler}` |
| `slot="name"` | `name={<Component />}` or children |
| `:host([disabled])` | `disabled && "..."` class |
| `::part(name)` | Sub-component with className |
| CSS custom property | Tailwind class or CSS variable |
| `<template>` | JSX return |
| `this.fireEvent()` | `callback?.()` |

---

## Conclusion

Following this guide ensures:
1. **Complete feature parity** with UI5 Web Components
2. **Modern React patterns** for maintainability
3. **AI-friendly APIs** for generative UI
4. **Enterprise-grade** accessibility and i18n
5. **Performance optimized** implementations

Each conversion improves the ecosystem and proves that modern React + Tailwind can match and exceed traditional web components.
