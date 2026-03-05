#!/bin/bash
set -e

echo "=== DashForge Deployment Script ==="
echo ""

# Check Railway CLI
if ! command -v railway &> /dev/null; then
  echo "Error: Railway CLI not installed."
  echo "Install: npm install -g @railway/cli"
  exit 1
fi

# Check if logged in
railway whoami || {
  echo "Please login to Railway first: railway login"
  exit 1
}

echo ""
echo "Step 1: Building all services..."
pnpm build

echo ""
echo "Step 2: Deploying web app..."
railway up --service web --detach

echo ""
echo "Step 3: Deploying WebSocket server..."
railway up --service ws-server --detach

echo ""
echo "Step 4: Deploying simulator..."
railway up --service simulator --detach

echo ""
echo "=== Deployment initiated for all services ==="
echo "Check Railway dashboard for status."
