# Input Component - AI-Ready Features

## Acceptance Criteria

- [x] Props API is self-documenting with TypeScript
- [x] All props have JSDoc comments for AI consumption
- [x] Component is fully serializable (props can be JSON)
- [x] Supports programmatic value setting without side effects
- [x] Clear separation between user input and programmatic updates
- [x] Event payloads include source information (user vs programmatic)
- [x] Component state is inspectable at runtime
- [x] Supports streaming text input (AI typing simulation)
- [x] Ref exposes useful methods for AI control
- [x] Works in headless/SSR environments

## Test Cases

1. **TypeScript autocomplete**
   - Input: Type `<Input ` in IDE
   - Expected: All props shown with descriptions

2. **JSDoc in IDE**
   - Input: Hover over prop in IDE
   - Expected: Documentation appears

3. **Serializable props**
   - Input: `JSON.stringify(inputProps)`
   - Expected: All props serialize without error

4. **Programmatic value setting**
   - Input: `ref.current.setValue("AI typed this")`
   - Expected: Value updates, no onChange fired

5. **Distinguish user vs programmatic**
   - Input: `onChange` handler
   - Expected: Event includes `source: "user" | "programmatic"`

6. **State inspection**
   - Input: `ref.current.getState()`
   - Expected: Returns { value, focused, valid, etc. }

7. **Streaming text**
   - Input: Set value char by char over time
   - Expected: Input updates smoothly without flicker

8. **Focus control**
   - Input: `ref.current.focus()`
   - Expected: Input receives focus

9. **Selection control**
   - Input: `ref.current.setSelectionRange(0, 5)`
   - Expected: First 5 characters selected

10. **Validate programmatically**
    - Input: `ref.current.checkValidity()`
    - Expected: Returns boolean validity

11. **SSR rendering**
    - Input: Render on server
    - Expected: No errors, proper HTML output

12. **Hydration**
    - Input: SSR then hydrate
    - Expected: No mismatch warnings

13. **Default values for AI**
    - Input: `<Input />` with no props
    - Expected: Sensible defaults, component usable

14. **Error recovery**
    - Input: Pass invalid prop value
    - Expected: Graceful fallback, console warning

## Ref API (Imperative Handle)

```typescript
interface InputRef {
  // DOM access
  focus(): void;
  blur(): void;
  select(): void;
  setSelectionRange(start: number, end: number): void;

  // Value control
  getValue(): string;
  setValue(value: string, options?: { silent?: boolean }): void;
  clear(): void;

  // State inspection
  getState(): {
    value: string;
    focused: boolean;
    valid: boolean;
    valueState: ValueState;
  };

  // Validation
  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;

  // Native element
  nativeElement: HTMLInputElement;
}
```

## AI Integration Patterns

### Pattern 1: AI Form Filling
```typescript
// AI agent fills form
const fillForm = async (data: Record<string, string>) => {
  for (const [field, value] of Object.entries(data)) {
    const ref = formRefs[field];
    await ref.current.setValue(value, { silent: true });
  }
};
```

### Pattern 2: AI Typing Simulation
```typescript
// Simulate AI typing character by character
const typeText = async (ref: InputRef, text: string, delay = 50) => {
  for (let i = 0; i <= text.length; i++) {
    ref.setValue(text.slice(0, i));
    await sleep(delay);
  }
};
```

### Pattern 3: AI Validation
```typescript
// AI validates all inputs
const validateAll = () => {
  return Object.values(formRefs).every(ref =>
    ref.current.checkValidity()
  );
};
```

## Implementation Notes

- Use `useImperativeHandle` for ref methods
- Include `displayName` for DevTools
- Add data attributes for AI selectors: `data-ai-field="email"`
- Support `data-testid` for testing frameworks
- Consider adding `onAIUpdate` callback for AI-specific handling
- Make component work without JS for progressive enhancement
