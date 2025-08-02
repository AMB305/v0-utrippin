#!/bin/bash

# 1. Delete index.html
if [ -f "index.html" ]; then
  rm index.html
  echo "✅ Deleted index.html"
else
  echo "ℹ️ index.html not found, skipping deletion."
fi

# 2. Remove src/main.tsx
if [ -f "src/main.tsx" ]; then
  rm src/main.tsx
  echo "✅ Removed src/main.tsx"
else
  echo "ℹ️ src/main.tsx not found, skipping removal."
fi

# 3. Rename src/pages/Index.tsx to src/pages/index.tsx
if [ -f "src/pages/Index.tsx" ]; then
  mv src/pages/Index.tsx src/pages/index.tsx
  echo "✅ Renamed src/pages/Index.tsx to src/pages/index.tsx"
else
  echo "ℹ️ src/pages/Index.tsx not found, skipping rename."
fi

# 4. Create a placeholder favicon.svg if it doesn't exist
if [ ! -d "public" ]; then
  mkdir public
  echo "✅ Created public directory."
fi

if [ ! -f "public/favicon.svg" ]; then
  # Create a minimal SVG file. You can replace this with your actual favicon content.
  echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="90">U</text></svg>' > public/favicon.svg
  echo "✅ Created placeholder public/favicon.svg"
else
  echo "ℹ️ public/favicon.svg already exists, skipping creation."
fi

echo "✨ Cleanup and renaming complete. Don't forget to commit these changes!"
