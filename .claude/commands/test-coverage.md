Open the HTML coverage report in the browser.

## Steps

1. Check if the coverage report exists at `coverage/index.html`.

2. **If it does NOT exist**, tell the user:
   > No coverage report found. Run `/test` first to generate it.
   Then stop — do not open anything.

3. **If it exists**, check how old the report is by running:
   ```
   stat -f "%Sm" coverage/index.html
   ```

4. **If the report is older than 10 minutes**, warn the user:
   > Coverage report was last generated at **{timestamp}**. It may be stale — consider running `/test` to refresh it.
   Then ask the user whether to open it anyway or run `/test` first.

5. **If the report is recent**, run:
   ```
   open coverage/index.html
   ```
   and confirm it was opened with the timestamp.
