# Input Component - Value States

## Acceptance Criteria

- [x] `valueState` prop accepts: None, Positive, Negative, Critical, Information
- [x] None: Default border color, default focus ring
- [x] Positive: Green border, green focus ring (success state)
- [x] Negative: Red border, red focus ring (error state)
- [x] Critical: Orange/amber border, orange focus ring (warning state)
- [x] Information: Blue border, blue focus ring (info state)
- [x] `valueStateMessage` prop renders message below input
- [x] Value state message inherits color from value state
- [x] Value state icons display inside input (optional, configurable)
- [x] `aria-invalid="true"` set when valueState is Negative
- [x] Value state message linked via `aria-describedby`
- [x] Focused state styling adjusts per value state

## Test Cases

1. **None state (default)**
   - Input: `<Input />`
   - Expected: Gray border, blue focus ring

2. **Positive state**
   - Input: `<Input valueState="Positive" />`
   - Expected: Green border, green focus ring

3. **Negative state**
   - Input: `<Input valueState="Negative" />`
   - Expected: Red border, red focus ring, aria-invalid="true"

4. **Critical state**
   - Input: `<Input valueState="Critical" />`
   - Expected: Orange border, orange focus ring

5. **Information state**
   - Input: `<Input valueState="Information" />`
   - Expected: Blue border, blue focus ring

6. **Value state message**
   - Input: `<Input valueState="Negative" valueStateMessage="Invalid email" />`
   - Expected: Red message text below input

7. **Complex message content**
   - Input: `<Input valueState="Negative" valueStateMessage={<span>Error: <a href="#">Learn more</a></span>} />`
   - Expected: Message with link renders properly

8. **Accessibility linkage**
   - Input: `<Input valueState="Negative" valueStateMessage="Error" />`
   - Expected: Input has aria-describedby pointing to message element

9. **State with icons**
   - Input: `<Input valueState="Negative" showValueStateIcon />`
   - Expected: Error icon visible inside input

10. **Focus styling per state**
    - Input: Focus each value state input
    - Expected: Focus ring color matches value state

## Implementation Notes

- Use CVA variants for value state border/ring colors
- Generate unique IDs for aria-describedby linkage
- Value state icon should be from lucide-react (AlertCircle, CheckCircle, etc.)
- Message container should have role="alert" for Negative state
