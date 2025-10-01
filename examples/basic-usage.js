#!/usr/bin/env node

/**
 * Basic usage example for React Native Semantic Versioning Sync
 */

import {
  syncVersions,
  incrementVersion,
  VersionManager,
} from 'react-native-semver-sync';

async function basicExample() {
  console.log('🔧 React Native Semantic Versioning Sync - Basic Example\n');

  try {
    // Example 1: Sync current package.json version to platforms
    console.log('📦 Syncing current version...');
    const syncResult = await syncVersions({
      verbose: true,
      platforms: ['ios', 'android'],
    });

    if (syncResult.success) {
      console.log(
        `✅ Synced version ${syncResult.version.version} with build ${syncResult.build.buildNumber}`
      );
    } else {
      console.log('❌ Sync failed:', syncResult.errors);
    }

    // Example 2: Increment patch version
    console.log('\n🔧 Incrementing patch version...');
    const patchResult = await incrementVersion('patch', {
      verbose: true,
    });

    if (patchResult.success) {
      console.log(
        `✅ Updated to version ${patchResult.version.version} with build ${patchResult.build.buildNumber}`
      );
    } else {
      console.log('❌ Patch increment failed:', patchResult.errors);
    }

    // Example 3: Using VersionManager class for advanced usage
    console.log('\n⚙️ Using VersionManager for advanced configuration...');
    const manager = new VersionManager({
      config: {
        iosProjectPath: './ios/MyApp.xcodeproj/project.pbxproj',
        androidGradlePath: './android/app/build.gradle',
        packageJsonPath: './package.json',
      },
      platforms: ['ios'], // iOS only
      verbose: true,
    });

    const advancedResult = await manager.syncVersions();
    if (advancedResult.success) {
      console.log(
        `✅ Advanced sync completed for version ${advancedResult.version.version}`
      );
    } else {
      console.log('❌ Advanced sync failed:', advancedResult.errors);
    }
  } catch (error) {
    console.error('❌ Example failed:', error.message);
  }
}

// Run the example
basicExample();
