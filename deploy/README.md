# shadcn-ui5 Demo - Cloud Foundry Deployment

This directory contains the configuration for deploying the shadcn-ui5 demo app to SAP Cloud Foundry.

## Structure

```
deploy/
├── manifest.yml              # Cloud Foundry app manifest
├── Staticfile               # Static buildpack configuration
├── nginx/                   # nginx configuration
│   └── conf/
│       └── includes/
│           └── headers.conf # HTTP headers (CORS, etc.)
└── public/                  # Static files to deploy (gitignored)
```

## Usage

### 1. Build the demo app

From the shadcn-ui5 package root:

```bash
# Build the demo app
cd demos/demo
npm run build
# or yarn build
```

### 2. Copy build to deploy/public

```bash
# From shadcn-ui5 root
cp -r demos/demo/dist/* deploy/public/
```

### 3. Deploy to Cloud Foundry

Login to Cloud Foundry and push:

```bash
cd deploy
cf login
cf push
```

The app will be available at: https://shadcn-ui5-demo.cfapps.eu12.hana.ondemand.com

### 4. Customize deployment

Update `manifest.yml` before deploying:
- Change `name` for a unique app name
- Update `route` to your desired domain
- Adjust `memory` if needed (default: 64M)

## Configuration

### manifest.yml

Cloud Foundry application manifest:
- `name`: shadcn-ui5-demo
- `routes`: URL for accessing the demo app
- `buildpack`: staticfile_buildpack for serving static files
- `memory`: 64M (sufficient for static demo)
- `path`: Serves files from the public directory

### Staticfile

Staticfile buildpack configuration:
- `root: public` - Serve from public directory
- `location_include: includes/*.conf` - Include nginx configs

### nginx/conf/includes/headers.conf

Custom HTTP headers:
- CORS enabled with `Access-Control-Allow-Origin: *`

## Automated Deployment Script

You can create a deployment script in the shadcn-ui5 root:

```bash
#!/bin/bash
# deploy.sh

echo "Building demo app..."
cd demos/demo
npm run build

echo "Copying build to deploy/public..."
cd ../..
rm -rf deploy/public/*
cp -r demos/demo/dist/* deploy/public/

echo "Deploying to Cloud Foundry..."
cd deploy
cf push

echo "Deployment complete!"
```

Make it executable: `chmod +x deploy.sh`

Then deploy with: `./deploy.sh`
