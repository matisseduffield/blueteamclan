#!/bin/bash

# Blue Team Clan Website - Setup Verification Script
# Run this to verify everything is working correctly

echo "🔍 Blue Team Clan Website Setup Verification"
echo "=============================================="
echo ""

# Check Node.js version
echo "✓ Node.js version:"
node --version
echo ""

# Check npm version
echo "✓ npm version:"
npm --version
echo ""

# Check project dependencies
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  Dependencies installed: YES"
else
    echo "  Dependencies installed: NO (run 'npm install')"
fi
echo ""

# Check project structure
echo "✓ Project structure:"
dirs=("src/app" "src/components" "src/lib" "public/assets")
for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✓ $dir"
    else
        echo "  ✗ $dir (missing)"
    fi
done
echo ""

# Check key files
echo "✓ Key files:"
files=(".github/copilot-instructions.md" "README.md" "DEPLOYMENT.md" "GETTING_STARTED.md" 
        "src/app/page.tsx" "src/lib/constants/index.ts" "src/components/layout/Header.tsx")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (missing)"
    fi
done
echo ""

# Check build
echo "✓ Building project..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  Build status: SUCCESS ✓"
else
    echo "  Build status: FAILED ✗"
    echo "  Run 'npm run build' for details"
fi
echo ""

# Check linting
echo "✓ Linting code..."
npm run lint > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  Lint status: NO ERRORS ✓"
else
    echo "  Lint status: WARNINGS (check with 'npm run lint')"
fi
echo ""

echo "=============================================="
echo "✅ Setup verification complete!"
echo ""
echo "Next steps:"
echo "1. npm run dev          - Start development server"
echo "2. Open localhost:3000  - View website"
echo "3. Edit src/ files      - Changes auto-reload"
echo ""
echo "Deployment:"
echo "See DEPLOYMENT.md for Cloudflare Pages setup"
echo ""
