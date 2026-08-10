# RTL (Right-to-Left) Support

The shadcn-ui5 Calendar component has built-in support for RTL languages (Arabic, Hebrew, etc.).

## How It Works

1. **Automatic Layout Flip**: Tailwind CSS automatically flips layouts when `dir="rtl"` is set on a parent element
2. **Icon Rotation**: Navigation arrows (ChevronLeft/ChevronRight) rotate 180° in RTL mode using `rtl:rotate-180`
3. **Grid Direction**: The day/month/year grids automatically reverse in RTL
4. **Text Alignment**: All text automatically aligns to the right in RTL mode

## Usage

Simply set `dir="rtl"` on a parent element:

```tsx
<div dir="rtl">
  <Calendar selectionMode="Single" />
</div>
```

Or dynamically:

```tsx
const [isRTL, setIsRTL] = useState(false);

<div dir={isRTL ? 'rtl' : 'ltr'}>
  <Calendar selectionMode="Single" />
</div>
```

## What Gets Flipped

✅ **Automatically handled by Tailwind:**
- Padding/margin (pl-3 becomes pr-3 in RTL)
- Flexbox direction (flex-row reverses)
- Grid layout direction
- Border radius (rounded-l-none becomes rounded-r-none)
- Text alignment

✅ **Manually handled:**
- Navigation arrow icons (rotate 180°)

## Testing RTL

The demo app includes an "RTL Toggle" button to test RTL behavior:

```bash
yarn demo:calendar
# Click "Toggle RTL" button in the header
```

## Browser Support

RTL works in all modern browsers that support:
- CSS `dir` attribute
- CSS logical properties (automatically used by Tailwind)
- Flexbox/Grid (all modern browsers)

## Notes

- Week numbers stay on the left/right as appropriate for the direction
- Date formatting remains in the configured locale format
- Keyboard navigation adapts (ArrowLeft/Right flip behavior)
- All interactive elements (buttons, inputs) flip correctly
