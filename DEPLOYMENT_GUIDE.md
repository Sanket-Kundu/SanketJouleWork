# Cloud Foundry Deployment Guide

## How to Set Up Cloud Foundry Deployment for Any Component

This guide documents the process of setting up Cloud Foundry deployment configuration for deploying static web applications from this repository.

---

## Step 1: Clone the SAP Static Boilerplate

First, clone the SAP static boilerplate repository to examine its structure:

```bash
git clone https://github.tools.sap/SAPDesign/pc-static-boilerplate.git /tmp/pc-static-boilerplate
```

The boilerplate contains:
- `manifest.yml` - Cloud Foundry app configuration
- `Staticfile` - Staticfile buildpack configuration
- `nginx/conf/includes/headers.conf` - Custom nginx headers (CORS)
- `public/` - Directory for static files to deploy
- `.gitignore` - Ignores build artifacts

---

## Step 2: Create Deploy Directory Structure

In your target package directory (e.g., `packages/your-component/`), create the deployment structure:

```bash
cd packages/your-component

# Create directory structure
mkdir -p deploy/nginx/conf/includes
mkdir -p deploy/public
```

---

## Step 3: Create Configuration Files

### 3.1 Create `deploy/manifest.yml`

Cloud Foundry application manifest:

```yaml
---
applications:
- name: your-app-name
  routes:
    - route: your-app-name.cfapps.eu12.hana.ondemand.com
  buildpack: staticfile_buildpack
  memory: 64M
  path: public
```

**Customize:**
- `name`: Unique application name in Cloud Foundry
- `routes[0].route`: Your desired URL
- `memory`: Adjust if needed (64M is good for static files)

### 3.2 Create `deploy/Staticfile`

Staticfile buildpack configuration:

```
root: public
location_include: includes/*.conf
```

### 3.3 Create `deploy/nginx/conf/includes/headers.conf`

Custom nginx headers (enables CORS):

```nginx
add_header 'Access-Control-Allow-Origin' '*';
```

### 3.4 Create `deploy/.gitignore`

Ignore build artifacts:

```gitignore
.DS_Store
public/*
!public/.gitkeep
```

### 3.5 Create `deploy/public/.gitkeep`

Keep the public directory in git:

```bash
touch deploy/public/.gitkeep
```

### 3.6 Create `deploy/README.md`

Documentation for the deployment (customize for your component):

```markdown
# Your Component - Cloud Foundry Deployment

This directory contains the configuration for deploying [Your Component] to SAP Cloud Foundry.

## Structure

\`\`\`
deploy/
├── manifest.yml              # Cloud Foundry app manifest
├── Staticfile               # Static buildpack configuration
├── nginx/                   # nginx configuration
│   └── conf/
│       └── includes/
│           └── headers.conf # HTTP headers (CORS, etc.)
└── public/                  # Static files to deploy (gitignored)
\`\`\`

## Usage

### 1. Build your app

\`\`\`bash
cd path/to/your/app
npm run build
\`\`\`

### 2. Copy build to deploy/public

\`\`\`bash
cd ../..
cp -r path/to/build/output/* deploy/public/
\`\`\`

### 3. Deploy to Cloud Foundry

\`\`\`bash
cd deploy
cf login
cf push
\`\`\`

The app will be available at: https://your-app-name.cfapps.eu12.hana.ondemand.com

### 4. Customize deployment

Update \`manifest.yml\` before deploying:
- Change \`name\` for a unique app name
- Update \`route\` to your desired domain
- Adjust \`memory\` if needed

## Configuration

### manifest.yml

Cloud Foundry application manifest with app configuration.

### Staticfile

Staticfile buildpack configuration for serving static files.

### nginx/conf/includes/headers.conf

Custom HTTP headers (CORS enabled by default).
```

---

## Step 4: Create Deployment Script (Optional)

Create `deploy.sh` in your package root for automated deployment:

```bash
#!/bin/bash
set -e

echo "🚀 Deploying [Your App] to Cloud Foundry"
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Build the app
echo "📦 Building app..."
cd path/to/your/app
npm run build

# Copy build to deploy/public
echo "📋 Copying build to deploy/public..."
cd ../..
rm -rf deploy/public/*
cp -r path/to/build/output/* deploy/public/
cp deploy/public/.gitkeep deploy/public/.gitkeep.tmp 2>/dev/null || true
mv deploy/public/.gitkeep.tmp deploy/public/.gitkeep 2>/dev/null || true

# Deploy to Cloud Foundry
echo "☁️  Deploying to Cloud Foundry..."
cd deploy
cf push

echo ""
echo "✅ Deployment complete!"
echo "🌐 App URL: https://your-app-name.cfapps.eu12.hana.ondemand.com"
```

Make it executable:

```bash
chmod +x deploy.sh
```

---

## Step 5: Deploy

### Option A: Using the deployment script

```bash
./deploy.sh
```

### Option B: Manual deployment

```bash
# 1. Build your app
cd path/to/your/app
npm run build

# 2. Copy build output
cd ../..
cp -r path/to/build/output/* deploy/public/

# 3. Login to Cloud Foundry
cf login

# 4. Deploy
cd deploy
cf push
```

---

## Step 6: Verify Deployment

After deployment, you'll see output like:

```
name:              your-app-name
requested state:   started
routes:            your-app-name.cfapps.eu12.hana.ondemand.com
last uploaded:     [timestamp]
stack:             cflinuxfs4
buildpacks:        staticfile_buildpack

type:            web
instances:       1/1
memory usage:    64M
state:           running
```

Visit your app at the displayed route URL.

---

## Common Cloud Foundry Commands

### View deployed apps
```bash
cf apps
```

### View app details
```bash
cf app your-app-name
```

### View logs
```bash
cf logs your-app-name --recent
```

### Restart app
```bash
cf restart your-app-name
```

### Delete app (and routes)
```bash
cf delete your-app-name -f -r
```

### Update specific manifest properties
```bash
# Scale memory
cf scale your-app-name -m 128M

# Scale instances
cf scale your-app-name -i 2
```

---

## Example: shadcn-ui5 Package

Here's the actual implementation for the shadcn-ui5 package:

### Directory Structure Created

```
packages/shadcn-ui5/
├── deploy/
│   ├── manifest.yml
│   ├── Staticfile
│   ├── .gitignore
│   ├── README.md
│   ├── nginx/
│   │   └── conf/
│   │       └── includes/
│   │           └── headers.conf
│   └── public/
│       └── .gitkeep
└── deploy.sh
```

### manifest.yml

```yaml
---
applications:
- name: shadcn-ui5-demo
  routes:
    - route: shadcn-ui5-demo.cfapps.eu12.hana.ondemand.com
  buildpack: staticfile_buildpack
  memory: 64M
  path: public
```

### deploy.sh

```bash
#!/bin/bash
set -e

echo "🚀 Deploying shadcn-ui5 demo app to Cloud Foundry"
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "📦 Building demo app..."
cd demos/demo
npm run build

echo "📋 Copying build to deploy/public..."
cd ../..
rm -rf deploy/public/*
cp -r demos/demo/dist/* deploy/public/
cp deploy/public/.gitkeep deploy/public/.gitkeep.tmp 2>/dev/null || true
mv deploy/public/.gitkeep.tmp deploy/public/.gitkeep 2>/dev/null || true

echo "☁️  Deploying to Cloud Foundry..."
cd deploy
cf push

echo ""
echo "✅ Deployment complete!"
echo "🌐 App URL: https://shadcn-ui5-demo.cfapps.eu12.hana.ondemand.com"
```

---

## Troubleshooting

### Build directory not found
Make sure you're copying from the correct build output directory. Common locations:
- `dist/`
- `build/`
- `out/`

### App fails to start
Check logs: `cf logs your-app-name --recent`

Common issues:
- Empty public directory
- Missing nginx configuration
- Incorrect path in manifest.yml

### Route already exists
If the route is taken, either:
1. Delete the old app: `cf delete old-app-name -f -r`
2. Choose a different route in manifest.yml

### Memory issues
If the app crashes due to memory, increase in manifest.yml:
```yaml
memory: 128M  # or higher
```

---

## Clean Up

To remove a deployed app:

```bash
# Delete app and its routes
cf delete your-app-name -f -r

# Or just the app (keep routes)
cf delete your-app-name -f
```

To clean local build artifacts:

```bash
rm -rf deploy/public/*
```

---

## Summary Checklist

- [ ] Clone SAP static boilerplate for reference
- [ ] Create `deploy/` directory structure
- [ ] Create `manifest.yml` with unique app name and route
- [ ] Create `Staticfile` configuration
- [ ] Create nginx headers configuration
- [ ] Create `.gitignore` to exclude build artifacts
- [ ] Create `README.md` with deployment instructions
- [ ] (Optional) Create `deploy.sh` automation script
- [ ] Build your app
- [ ] Copy build output to `deploy/public/`
- [ ] Login to Cloud Foundry: `cf login`
- [ ] Deploy: `cf push`
- [ ] Verify deployment at the app URL

---

## Additional Resources

- [Cloud Foundry CLI Documentation](https://docs.cloudfoundry.org/cf-cli/)
- [Staticfile Buildpack Documentation](https://docs.cloudfoundry.org/buildpacks/staticfile/)
- SAP Cloud Foundry: https://help.sap.com/docs/btp/sap-business-technology-platform/cloud-foundry-environment
