# SAP 72 Font Family

These fonts are sourced from the SAP theming base content and are included directly in this repository for self-contained deployment.

## Font Files

- **72-Regular.woff2** - Regular weight (400)
- **72-Italic.woff2** - Italic style
- **72-Light.woff2** - Light weight (300)
- **72-Semibold.woff2** - Semibold weight (600)
- **72-Bold.woff2** - Bold weight (700)
- **72-BoldItalic.woff2** - Bold + Italic
- **72-Black.woff2** - Black weight (900)
- **72-*-full.woff2** - Full character set versions for extended Unicode support

## Font CSS

The `72.css` file contains all `@font-face` declarations for the SAP 72 font family.

## Usage

The fonts are automatically loaded via:
```css
@import url('/fonts/72.css');
```

And configured as the default sans-serif font in `tailwind.config.js`.

## License

These fonts are part of SAP's 72 font family and are subject to SAP's licensing terms.

## Source

Originally extracted from `@sap-theming/theming-base-content` npm package.
The fonts are now self-contained in this repository and no longer require the external package dependency.

## Updating Fonts

To update to newer versions:
```bash
# Temporarily install the package
pnpm add @sap-theming/theming-base-content

# Copy updated fonts
cp node_modules/@sap-theming/theming-base-content/content/Base/baseLib/baseTheme/fonts/72-*.woff2 public/fonts/

# Remove the package
pnpm remove @sap-theming/theming-base-content
```
