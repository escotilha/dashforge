#!/bin/bash
set -e

echo "=== DashForge Local Development Setup ==="
echo ""

# Check prerequisites
for cmd in node pnpm docker; do
  if ! command -v $cmd &> /dev/null; then
    echo "Error: $cmd is required but not installed."
    exit 1
  fi
done

echo "Step 1: Installing dependencies..."
pnpm install

echo ""
echo "Step 2: Setting up environment..."
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example"
  echo "Please update .env.local with your actual values."
else
  echo ".env.local already exists, skipping."
fi

echo ""
echo "Step 3: Starting Docker services (ClickHouse + Redis)..."
docker compose -f docker/docker-compose.yml up -d

echo ""
echo "Step 4: Waiting for services to be ready..."
sleep 5

echo ""
echo "Step 5: Building shared packages..."
pnpm --filter @dashforge/shared build 2>/dev/null || true

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Available commands:"
echo "  pnpm dev                    - Start all services in dev mode"
echo "  pnpm --filter web dev       - Start only the web app"
echo "  pnpm --filter ws-server dev - Start the WebSocket server"
echo "  pnpm --filter simulator dev - Start the data simulator"
echo "  pnpm build                  - Build all services"
echo ""
echo "To seed ClickHouse with demo data:"
echo "  pnpm --filter simulator seed"
echo ""
echo "Make sure to update .env.local with your Supabase credentials!"
