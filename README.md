# React Native Semantic Versioning Sync

[![npm version](https://badge.fury.io/js/react-native-semver-sync.svg)](https://badge.fury.io/js/react-native-semver-sync)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive library for managing semantic versions and build numbers across React Native iOS and Android projects following **SemVer 2.0.0** specification.

## ✨ Features

- 🔧 **SemVer 2.0.0 Compliance**: Strict adherence to semantic versioning specification
- 📱 **Cross-Platform Sync**: Automatic version synchronization between package.json, iOS, and Android
- 🔢 **Build Number Management**: Proper build number handling for App Store/Google Play requirements
- 🚀 **CLI Interface**: Easy-to-use command-line interface
- 📚 **Programmatic API**: TypeScript API for Node build scripts (not for RN runtime)
- ⚡ **Zero Configuration**: Works out of the box with standard React Native projects
- 🛡️ **Type Safe**: Full TypeScript support with comprehensive type definitions

## 📦 Installation

Install as a development dependency:

```bash
npm install --save-dev react-native-semver-sync
# or
yarn add -D react-native-semver-sync
```

## 🚀 Quick Start

### CLI Usage

```bash
# Increment patch version (1.0.0 → 1.0.1)
npx rn-semver patch

# Increment minor version (1.0.1 → 1.1.0, patch resets to 0)
npx rn-semver minor

# Increment major version (1.1.0 → 2.0.0, minor and patch reset to 0)
npx rn-semver major

# Sync current package.json version to platforms
npx rn-semver sync
```

### Programmatic Usage (Node scripts only)

```javascript
import { syncVersions, incrementVersion } from 'react-native-semver-sync';

// Sync current package.json version
const result = await syncVersions();

// Increment version and sync
const patchResult = await incrementVersion('patch');
console.log(`Updated to version ${patchResult.version.version}`);
```

## 📚 Semantic Versioning Rules

This library follows **SemVer 2.0.0** specification strictly:

### Version Format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (incompatible API changes)
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Reset Rules

- **PATCH** version MUST be reset to 0 when **MINOR** is incremented
- **PATCH** and **MINOR** MUST be reset to 0 when **MAJOR** is incremented

### Build Numbers

- **Always increment** (never reset)
- Required for App Store/Google Play (must be higher than previous)
- Internal identifier, not visible to users

## 🔧 CLI Commands

### Basic Commands

```bash
rn-semver patch     # Bug fix release (1.0.0 → 1.0.1)
rn-semver minor     # Feature release (1.0.1 → 1.1.0)
rn-semver major     # Breaking change release (1.1.0 → 2.0.0)
rn-semver sync      # Sync current version to platforms
rn-semver help      # Show help information
```

### Options

```bash
--verbose, -v       # Enable verbose logging
--ios-only          # Update iOS only
--android-only      # Update Android only
--help, -h          # Show help
```

### Examples

```bash
# Bug fix with verbose output
rn-semver patch --verbose

# Feature release for iOS only
rn-semver minor --ios-only

# Major release for Android only
rn-semver major --android-only
```

## 📱 Platform Support

### iOS

Updates the following in `ios/*.xcodeproj/project.pbxproj`:
- **MARKETING_VERSION**: User-facing version (e.g., "1.2.3")
- **CURRENT_PROJECT_VERSION**: Build number (e.g., "42")

### Android

Updates the following in `android/app/build.gradle`:
- **versionName**: User-facing version (e.g., "1.2.3")
- **versionCode**: Build number (e.g., 42)

## 🛠️ API Reference

### Functions

#### `syncVersions(options?)`

Syncs the current package.json version to iOS and Android platforms.

```typescript
import { syncVersions } from 'react-native-semver-sync';

const result = await syncVersions({
  platforms: ['ios', 'android'], // Default: both
  verbose: true,                  // Default: false
});
```

#### `incrementVersion(type, options?)`

Increments the package.json version and syncs to all platforms.

```typescript
import { incrementVersion } from 'react-native-semver-sync';

const result = await incrementVersion('patch', {
  platforms: ['ios'],
  verbose: true,
});
```

> Note: Convenience functions like `incrementPatch`, `incrementMinor`, `incrementMajor` are not exported. Use `incrementVersion('patch' | 'minor' | 'major')` instead, preferably via the CLI.

### VersionManager Class

For advanced usage:

```typescript
import { VersionManager } from 'react-native-semver-sync';

const manager = new VersionManager({
  config: {
    iosProjectPath: './ios/MyApp.xcodeproj/project.pbxproj',
    androidGradlePath: './android/app/build.gradle',
    packageJsonPath: './package.json',
  },
  platforms: ['ios', 'android'],
  verbose: true,
});

const result = await manager.syncVersions();
```

### Types

```typescript
interface SyncResult {
  success: boolean;
  version: VersionInfo;
  build: BuildInfo;
  platforms: PlatformUpdateResult[];
  errors: string[];
}

interface VersionInfo {
  version: string;
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  buildMetadata?: string;
}
```

## ⚙️ Configuration

### Default Paths

The library automatically detects standard React Native project structure:

```
your-project/
├── package.json                          # Version source
├── ios/YourApp.xcodeproj/project.pbxproj # iOS versions
└── android/app/build.gradle              # Android versions
```

### Custom Paths

```typescript
import { syncVersions } from 'react-native-semver-sync';

await syncVersions({
  config: {
    iosProjectPath: './ios/CustomApp.xcodeproj/project.pbxproj',
    androidGradlePath: './android/app/build.gradle',
    packageJsonPath: './package.json',
  },
});
```

## 📋 NPM Scripts Integration

Add to your `package.json`:

```json
{
  "scripts": {
    "version:patch": "rn-semver patch",
    "version:minor": "rn-semver minor", 
    "version:major": "rn-semver major",
    "version:sync": "rn-semver sync"
  }
}
```

Then use:

```bash
npm run version:patch
npm run version:minor
npm run version:major
npm run version:sync
```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Release
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
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Increment version
        run: npx rn-semver patch
      
      - name: Commit version bump
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .
          git commit -m "chore: bump version" || exit 0
          git push
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for your changes
5. Run tests: `npm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need for proper semantic versioning in React Native projects
- Built with [react-native-builder-bob](https://github.com/callstack/react-native-builder-bob)
- Follows [Semantic Versioning 2.0.0](https://semver.org/) specification

## 📞 Support

- 🐛 [Report Issues](https://github.com/israromar/react-native-semver-sync/issues)
- 💬 [Discussions](https://github.com/israromar/react-native-semver-sync/discussions)
- 📧 Email: iisraromar@gmail.com

---

Made with ❤️ for the React Native community