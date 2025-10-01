#!/usr/bin/env node

/**
 * CLI for React Native Semantic Versioning Sync
 */

import { syncVersions, incrementVersion } from './core/api';
import { CLI_COLORS } from './constants';
import type { VersionType } from './types';

const { GREEN, YELLOW, RED, BLUE, RESET, BOLD } = CLI_COLORS;

function log(message: string, color: string = RESET): void {
  console.log(`${color}${message}${RESET}`);
}

function logError(message: string): void {
  log(`❌ ${message}`, RED);
}

function logInfo(message: string): void {
  log(`ℹ️  ${message}`, BLUE);
}

function showHelp(): void {
  log('\n🔧 React Native Semantic Versioning Sync', BOLD);
  log('📚 Following SemVer 2.0.0 specification\n', BLUE);

  log('Usage:', BOLD);
  log('  rn-semver <command> [options]\n');

  log('Commands:', BOLD);
  log('  patch     Increment patch version (1.0.0 → 1.0.1)');
  log('  minor     Increment minor version (1.0.1 → 1.1.0, patch resets to 0)');
  log(
    '  major     Increment major version (1.1.0 → 2.0.0, minor and patch reset to 0)'
  );
  log('  sync      Sync current package.json version to platforms');
  log('  help      Show this help message\n');

  log('Options:', BOLD);
  log('  --verbose, -v     Enable verbose logging');
  log('  --ios-only        Update iOS only');
  log('  --android-only    Update Android only');
  log('  --help, -h        Show help\n');

  log('Examples:', BOLD);
  log('  rn-semver patch           # Bug fix release');
  log('  rn-semver minor           # Feature release');
  log('  rn-semver major           # Breaking change release');
  log('  rn-semver sync            # Sync current version');
  log('  rn-semver patch --verbose # Patch with detailed output\n');

  log('📚 Semantic Versioning Rules:', BOLD);
  log('  • MAJOR: Breaking changes (incompatible API)');
  log('  • MINOR: New features (backward compatible)');
  log('  • PATCH: Bug fixes (backward compatible)\n');
}

function displayResult(result: any): void {
  if (result.success) {
    log('\n🎉 Version sync complete!', GREEN);
    log('📋 Summary:', BOLD);
    log(`   📦 Version: ${result.version.version}`, GREEN);
    log(`   🔢 Build: ${result.build.buildNumber}`, BLUE);

    const platforms = result.platforms.map((p: any) => p.platform).join(' + ');
    log(`   📱 Platforms: ${platforms}`, YELLOW);

    // Show platform details
    result.platforms.forEach((platform: any) => {
      if (platform.success) {
        const prev = platform.previousVersion
          ? ` (was ${platform.previousVersion})`
          : '';
        log(`   ✅ ${platform.platform}: ${platform.newVersion}${prev}`);
      } else {
        log(`   ❌ ${platform.platform}: ${platform.error}`, RED);
      }
    });

    log('\n🚀 Ready for release!', GREEN);
  } else {
    log('\n❌ Version sync failed!', RED);
    result.errors.forEach((error: string) => {
      logError(error);
    });
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  const command = args[0];
  const verbose = args.includes('--verbose') || args.includes('-v');
  const iosOnly = args.includes('--ios-only');
  const androidOnly = args.includes('--android-only');

  let platforms: ('ios' | 'android')[] = ['ios', 'android'];
  if (iosOnly) platforms = ['ios'];
  if (androidOnly) platforms = ['android'];

  const options = {
    verbose,
    platforms,
  };

  try {
    switch (command) {
      case 'patch':
      case 'minor':
      case 'major': {
        logInfo(`Incrementing ${command} version...`);
        const result = await incrementVersion(command as VersionType, options);
        displayResult(result);
        process.exit(result.success ? 0 : 1);
      }

      case 'sync': {
        logInfo('Syncing current version to platforms...');
        const result = await syncVersions(options);
        displayResult(result);
        process.exit(result.success ? 0 : 1);
      }

      case 'help': {
        showHelp();
        break;
      }

      default: {
        logError(`Unknown command: ${command}`);
        log('Run "rn-semver help" for usage information.');
        process.exit(1);
      }
    }
  } catch (error) {
    logError(
      `Failed to execute command: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    process.exit(1);
  }
}

// Always run when invoked via bin
main().catch((error: any) => {
  logError(
    `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
  );
  process.exit(1);
});
