Trigger a release of the fx-components library.

## Argument

$ARGUMENTS should be one of:
- `patch` — bump patch version (0.1.11 → 0.1.12)
- `minor` — bump minor version (0.1.11 → 0.2.0)
- `major` — bump major version (0.1.11 → 1.0.0)
- A specific version like `0.1.12` or `1.0.0`

If no argument is provided, default to `patch`.

## Steps

1. Parse the argument:
   - If it's `patch`, `minor`, or `major`, use it as the bump type.
   - If it's a specific semver version (like `0.1.12`), that's the target version.
   - If empty, use `patch`.

2. Fetch the latest `main` from origin and read **both** versions:
   ```
   git fetch origin main
   ```
   - **Local version:** read from `package.json`
   - **Remote version:** read from `git show origin/main:package.json`

   Compare the two:
   - **Same version** → all good, proceed normally using that version.
   - **Remote is ahead** (remote version > local version) → warn the user that the remote has a newer version, show both versions, and ask if they want to continue. Use the **remote** version as the base for the bump.

3. Calculate and show the new version that will be released (based on the remote version).

4. Ask the user to confirm before proceeding.

5. Trigger the GitHub Actions release workflow using the `gh` CLI:
   ```
   GH_HOST=github.tools.sap gh workflow run release.yaml -f version=<bump_type>
   ```
   Note: The GitHub workflow only accepts `patch`, `minor`, or `major` — not specific versions. If a specific version was requested, determine the correct bump type by comparing with the current version.

6. Confirm the workflow was triggered and provide a link to monitor it:
   ```
   GH_HOST=github.tools.sap gh run list --workflow=release.yaml --limit 1
   ```

7. Show the user a summary:
   - Previous version → New version
   - Link to the workflow run
   - Remind them the workflow will: bump version, commit, push, and trigger Piper.
     Piper's Release stage then creates the `vX.Y.Z` git tag and GitHub Release
     (via `githubPublishRelease`), which is what marks the pipeline run as released.
