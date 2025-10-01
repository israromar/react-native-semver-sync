/**
 * Main VersionManager class for React Native Semantic Versioning Sync
 */

import * as fs from 'fs';
import {
  isValidSemVer,
  parseVersion,
  incrementVersion as incrementSemVer,
} from '../utils/semver';
import { updateiOSVersion, updateAndroidVersion } from './platformUpdaters';
import { DEFAULT_OPTIONS } from '../constants';
import type {
  VersionSyncOptions,
  SyncResult,
  VersionType,
  BuildInfo,
  PlatformUpdateResult,
} from '../types';

export class VersionManager {
  private options: Required<VersionSyncOptions>;

  constructor(options: VersionSyncOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Gets the current version from package.json
   */
  private getPackageVersion(): string {
    try {
      const packagePath =
        this.options.config.packageJsonPath || './package.json';
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const version = packageJson.version;

      if (this.options.validateSemVer && !isValidSemVer(version)) {
        throw new Error(`Invalid semantic version in package.json: ${version}`);
      }

      return version;
    } catch (error) {
      throw new Error(
        `Failed to read package.json: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Gets the next build number by reading current build numbers and incrementing
   */
  private async getNextBuildNumber(): Promise<BuildInfo> {
    let maxBuildNumber = 0;
    let source: 'ios' | 'android' | 'manual' = 'manual';

    // Try to get build number from iOS
    if (this.options.platforms.includes('ios')) {
      try {
        const iosProjectPath =
          this.options.config.iosProjectPath ||
          './ios/*.xcodeproj/project.pbxproj';
        if (fs.existsSync(iosProjectPath)) {
          const content = fs.readFileSync(iosProjectPath, 'utf8');
          const matches = content.match(/CURRENT_PROJECT_VERSION = (\d+);/g);
          if (matches && matches.length > 0) {
            const buildMatch = matches[0].match(/(\d+)/);
            if (buildMatch) {
              const iosBuild = parseInt(buildMatch[1] || '0', 10);
              if (iosBuild > maxBuildNumber) {
                maxBuildNumber = iosBuild;
                source = 'ios';
              }
            }
          }
        }
      } catch {
        // Ignore iOS build number read errors
      }
    }

    // Try to get build number from Android
    if (this.options.platforms.includes('android')) {
      try {
        const androidGradlePath =
          this.options.config.androidGradlePath || './android/app/build.gradle';
        if (fs.existsSync(androidGradlePath)) {
          const content = fs.readFileSync(androidGradlePath, 'utf8');
          const match = content.match(/versionCode\s+(\d+)/);
          if (match) {
            const androidBuild = parseInt(match[1] || '0', 10);
            if (androidBuild > maxBuildNumber) {
              maxBuildNumber = androidBuild;
              source = 'android';
            }
          }
        }
      } catch {
        // Ignore Android build number read errors
      }
    }

    // Use custom build number if provided
    if (this.options.customBuildNumber !== undefined) {
      return {
        buildNumber: this.options.customBuildNumber,
        previousBuildNumber: maxBuildNumber || undefined,
        source: 'manual',
      };
    }

    // Increment the highest found build number
    const newBuildNumber = this.options.incrementBuildNumber
      ? maxBuildNumber + 1
      : maxBuildNumber || 1;

    return {
      buildNumber: newBuildNumber,
      previousBuildNumber: maxBuildNumber || undefined,
      source,
    };
  }

  /**
   * Syncs the current package.json version to all platforms
   */
  async syncVersions(): Promise<SyncResult> {
    const errors: string[] = [];
    const platformResults: PlatformUpdateResult[] = [];

    try {
      // Get current version
      const version = this.getPackageVersion();
      const versionInfo = parseVersion(version);

      // Get build number
      const buildInfo = await this.getNextBuildNumber();

      // Update platforms
      if (this.options.platforms.includes('ios')) {
        const iosResult = await updateiOSVersion(
          version,
          buildInfo.buildNumber,
          this.options.config.iosProjectPath
        );
        platformResults.push(iosResult);
        if (!iosResult.success && iosResult.error) {
          errors.push(`iOS: ${iosResult.error}`);
        }
      }

      if (this.options.platforms.includes('android')) {
        const androidResult = await updateAndroidVersion(
          version,
          buildInfo.buildNumber,
          this.options.config.androidGradlePath
        );
        platformResults.push(androidResult);
        if (!androidResult.success && androidResult.error) {
          errors.push(`Android: ${androidResult.error}`);
        }
      }

      const success = platformResults.every((result) => result.success);

      return {
        success,
        version: versionInfo,
        build: buildInfo,
        platforms: platformResults,
        errors,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      errors.push(errorMessage);

      return {
        success: false,
        version: { version: '0.0.0', major: 0, minor: 0, patch: 0 },
        build: { buildNumber: 0, source: 'manual' },
        platforms: platformResults,
        errors,
      };
    }
  }

  /**
   * Increments the package.json version and syncs to all platforms
   */
  async incrementVersion(type: VersionType): Promise<SyncResult> {
    try {
      // Get current version and increment it
      const currentVersion = this.getPackageVersion();
      const newVersion = incrementSemVer(currentVersion, type);

      // Update package.json
      const packagePath =
        this.options.config.packageJsonPath || './package.json';
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      packageJson.version = newVersion;
      fs.writeFileSync(
        packagePath,
        JSON.stringify(packageJson, null, 2) + '\n'
      );

      // Sync to platforms
      return await this.syncVersions();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      return {
        success: false,
        version: { version: '0.0.0', major: 0, minor: 0, patch: 0 },
        build: { buildNumber: 0, source: 'manual' },
        platforms: [],
        errors: [errorMessage],
      };
    }
  }
}
