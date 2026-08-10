#!/bin/bash
set -e

echo "🚀 Deploying shadcn-ui5 demo app to Cloud Foundry"
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Build the demo app
echo "📦 Building demo app..."
cd demos/demo
npm run build

# Copy build to deploy/public
echo "📋 Copying build to deploy/public..."
cd ../..
rm -rf deploy/public/*
cp -r demos/demo/dist/* deploy/public/
cp deploy/public/.gitkeep deploy/public/.gitkeep.tmp 2>/dev/null || true
mv deploy/public/.gitkeep.tmp deploy/public/.gitkeep 2>/dev/null || true

# Deploy to Cloud Foundry
echo "☁️  Deploying to Cloud Foundry..."
cd deploy
cf push

echo ""
echo "✅ Deployment complete!"
echo "🌐 App URL: https://shadcn-ui5-demo.cfapps.eu12.hana.ondemand.com"
