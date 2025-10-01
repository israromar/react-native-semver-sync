#!/bin/bash

# CLI Examples for React Native Semantic Versioning Sync

echo "🔧 React Native Semantic Versioning Sync - CLI Examples"
echo "======================================================="

echo ""
echo "📚 Help and Information:"
echo "------------------------"
echo "$ rn-semver help"
rn-semver help

echo ""
echo "🔧 Basic Version Management:"
echo "----------------------------"

echo ""
echo "1. Sync current package.json version to platforms:"
echo "$ rn-semver sync"
# rn-semver sync

echo ""
echo "2. Increment patch version (bug fixes):"
echo "$ rn-semver patch"
# rn-semver patch

echo ""
echo "3. Increment minor version (new features):"
echo "$ rn-semver minor"
# rn-semver minor

echo ""
echo "4. Increment major version (breaking changes):"
echo "$ rn-semver major"
# rn-semver major

echo ""
echo "⚙️ Advanced Options:"
echo "--------------------"

echo ""
echo "5. Verbose output:"
echo "$ rn-semver patch --verbose"
# rn-semver patch --verbose

echo ""
echo "6. iOS only update:"
echo "$ rn-semver sync --ios-only"
# rn-semver sync --ios-only

echo ""
echo "7. Android only update:"
echo "$ rn-semver minor --android-only"
# rn-semver minor --android-only

echo ""
echo "📋 NPM Scripts Integration:"
echo "---------------------------"
echo "Add these to your package.json scripts:"
echo ""
echo '{
  "scripts": {
    "version:patch": "rn-semver patch",
    "version:minor": "rn-semver minor", 
    "version:major": "rn-semver major",
    "version:sync": "rn-semver sync"
  }
}'

echo ""
echo "Then use:"
echo "$ npm run version:patch"
echo "$ npm run version:minor"
echo "$ npm run version:major"
echo "$ npm run version:sync"

echo ""
echo "🚀 CI/CD Integration:"
echo "---------------------"
echo "Example GitHub Actions workflow:"
echo ""
echo 'name: Release
on:
  push:
    branches: [main]
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npx rn-semver patch
      - run: git add .
      - run: git commit -m "chore: bump version"
      - run: git push'

echo ""
echo "✨ Done! Happy versioning! 🎉"