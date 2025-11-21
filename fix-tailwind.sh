#!/bin/bash

echo "🔧 Fixing Tailwind CSS Configuration..."

cd /Users/hamza/Sites/3-amigos/3amigos-automations

# Remove problematic node_modules folders
echo "Removing conflicting packages..."
rm -rf node_modules/@tailwindcss
rm -rf node_modules/.vite

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Reinstall dependencies
echo "Reinstalling dependencies..."
npm install

# Build assets
echo "Building assets..."
npm run build

echo "✅ Done! Your assets should now be built successfully."

