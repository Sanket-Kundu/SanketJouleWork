Run the component test suite with code coverage.

## Arguments

- `$ARGUMENTS` — optional filter string (e.g., "Button", "dialog") to run only matching test files. If empty, run all tests.

## Steps

1. If `$ARGUMENTS` is provided, run:
   ```
   npm run test:coverage -- $ARGUMENTS
   ```
   Otherwise run:
   ```
   npm run test:coverage
   ```

2. Report the results to the user — how many tests passed/failed, any failure details, and the coverage summary.
