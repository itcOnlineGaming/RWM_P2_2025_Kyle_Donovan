#!/bin/bash
# Installation script for the Snackbar Notification Library
# 
# Usage: bash install-snackbar.sh /path/to/your/project
#
# This script copies the snackbar library to your SvelteKit project

TARGET_PROJECT=$1

if [ -z "$TARGET_PROJECT" ]; then
  echo "Usage: bash install-snackbar.sh /path/to/your/project"
  echo ""
  echo "Example: bash install-snackbar.sh ../my-calendar-app"
  exit 1
fi

if [ ! -d "$TARGET_PROJECT" ]; then
  echo "Error: Target project directory does not exist: $TARGET_PROJECT"
  exit 1
fi

if [ ! -d "$TARGET_PROJECT/src" ]; then
  echo "Error: Target directory doesn't appear to be a SvelteKit project (no src/ folder)"
  exit 1
fi

# Create lib directory if it doesn't exist
mkdir -p "$TARGET_PROJECT/src/lib"

# Copy snackbar library
echo "📦 Copying snackbar library..."
cp -r demo-standalone/src/lib/snackbar "$TARGET_PROJECT/src/lib/"
echo "   ✓ Snackbar library copied to src/lib/snackbar/"

# Copy service worker (optional but recommended)
if [ -d "$TARGET_PROJECT/static" ]; then
  echo "📱 Copying service worker..."
  cp demo-standalone/static/sw.js "$TARGET_PROJECT/static/"
  echo "   ✓ Service worker copied to static/sw.js"
else
  echo "⚠️  Note: static/ directory not found. Create it and copy demo-standalone/static/sw.js manually for mobile notifications."
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Add SnackbarContainer to your root layout (src/routes/+layout.svelte):"
echo "   <script>"
echo "     import { SnackbarContainer } from '\$lib/snackbar';"
echo "   </script>"
echo "   <slot />"
echo "   <SnackbarContainer />"
echo ""
echo "2. Import and use in your components:"
echo "   import { snackbar, notifyEventCreated } from '\$lib/snackbar';"
echo ""
echo "3. Read LIBRARY_USAGE.md for detailed examples and API reference"
echo ""
