# Input Component - Number Type

## Acceptance Criteria

- [x] `type="Number"` renders number input
- [x] `min` prop sets minimum allowed value
- [x] `max` prop sets maximum allowed value
- [x] `step` prop sets increment/decrement step (default: "any")
- [x] Native spinner controls visible (browser default)
- [x] `hideStepButtons` prop hides native spinners via CSS
- [x] `maxLength` prop ignored for Number type
- [x] Arrow Up/Down increment/decrement by step
- [x] Invalid numbers show browser validation
- [x] `valueAsNumber` accessible for numeric operations
- [x] Decimal/comma handling based on locale
- [x] Scientific notation supported (e.g., 1e10)

## Test Cases

1. **Basic number input**
   - Input: `<Input type="Number" />`
   - Expected: Renders number input with spinners

2. **Min constraint**
   - Input: `<Input type="Number" min={0} defaultValue="-5" />`
   - Expected: Shows validation error for negative value

3. **Max constraint**
   - Input: `<Input type="Number" max={100} defaultValue="150" />`
   - Expected: Shows validation error for value > 100

4. **Step**
   - Input: `<Input type="Number" step={0.5} defaultValue="1" />`
   - Action: Press Arrow Up
   - Expected: Value becomes 1.5

5. **Step any**
   - Input: `<Input type="Number" step="any" />`
   - Expected: Any decimal value allowed

6. **Hide spinners**
   - Input: `<Input type="Number" hideStepButtons />`
   - Expected: Native increment/decrement buttons hidden

7. **maxLength ignored**
   - Input: `<Input type="Number" maxLength={3} />`
   - Action: Type "12345"
   - Expected: Full value entered (maxLength doesn't apply)

8. **Arrow Up**
   - Input: `<Input type="Number" step={1} value="5" />`
   - Action: Press Arrow Up
   - Expected: Value becomes 6

9. **Arrow Down**
   - Input: `<Input type="Number" step={1} value="5" />`
   - Action: Press Arrow Down
   - Expected: Value becomes 4

10. **Arrow Up at max**
    - Input: `<Input type="Number" max={10} value="10" />`
    - Action: Press Arrow Up
    - Expected: Value stays 10

11. **Arrow Down at min**
    - Input: `<Input type="Number" min={0} value="0" />`
    - Action: Press Arrow Down
    - Expected: Value stays 0

12. **Decimal input**
    - Input: `<Input type="Number" />`
    - Action: Type "3.14159"
    - Expected: Accepts decimal value

13. **Scientific notation**
    - Input: `<Input type="Number" />`
    - Action: Type "1e5"
    - Expected: Accepts and evaluates to 100000

14. **Invalid characters blocked**
    - Input: `<Input type="Number" />`
    - Action: Type "abc"
    - Expected: Characters not entered

15. **getValue as number**
    - Input: Access value programmatically
    - Expected: Can get numeric value via parseFloat or valueAsNumber

## Implementation Notes

- Pass min, max, step to native input only for Number type
- CSS to hide spinners: `input::-webkit-inner-spin-button { display: none; }`
- Consider locale-aware decimal separator handling
- Validate step applies to values: (value - min) % step === 0
