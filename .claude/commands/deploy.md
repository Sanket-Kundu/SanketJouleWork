Manually deploy both demo apps to GitHub Pages.

Use this when the GitHub Actions deploy workflow is broken or you need an immediate deploy.

## Steps

1. Build both demo apps:
   ```
   npm run build:demo
   npm run build:el-demo
   ```

2. If either build fails, stop and report the error.

3. Combine the outputs (same as CI does):
   ```
   rm -rf dist-combined
   mkdir -p dist-combined/fx-layout
   cp -r demos/demo/dist/* dist-combined/
   cp -r demos/el-demo/dist/* dist-combined/fx-layout/
   ```

4. Deploy to GitHub Pages:
   ```
   npx gh-pages -d dist-combined
   ```

5. Clean up:
   ```
   rm -rf dist-combined
   ```

6. Confirm the deploy succeeded and tell the user both sites are live:
   - Demo: https://pages.github.tools.sap/ui/fx-components/
   - El-Demo: https://pages.github.tools.sap/ui/fx-components/fx-layout/
