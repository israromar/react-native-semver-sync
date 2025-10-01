/**
 * Platform-specific version updaters for iOS and Android
 */

import * as fs from 'fs';
import { glob } from 'glob';
import { IOS_VERSION_PATTERNS, ANDROID_VERSION_PATTERNS } from '../constants';
import type { PlatformUpdateResult } from '../types';

/**
 * Finds iOS project.pbxproj file using glob pattern
 */
async function findIOSProjectFile(searchPath: string): Promise<string | null> {
  try {
    const files = await glob(searchPath);
    return files.length > 0 ? files[0] || null : null;
  } catch {
    return null;
  }
}

/**
 * Updates iOS project version and build number
 */
export async function updateiOSVersion(
  version: string,
  buildNumber: number,
  projectPath?: string
): Promise<PlatformUpdateResult> {
  const searchPath = projectPath || './ios/*.xcodeproj/project.pbxproj';

  try {
    const iosProjectPath = await findIOSProjectFile(searchPath);

    if (!iosProjectPath || !fs.existsSync(iosProjectPath)) {
      return {
        success: false,
        platform: 'ios',
        newVersion: version,
        newBuildNumber: buildNumber,
        error: `iOS project file not found at: ${searchPath}`,
      };
    }

    let content = fs.readFileSync(iosProjectPath, 'utf8');

    // Extract current versions
    const currentVersionMatch = content.match(/MARKETING_VERSION = ([^;]+);/);
    const currentBuildMatch = content.match(/CURRENT_PROJECT_VERSION = (\d+);/);

    const previousVersion = currentVersionMatch
      ? currentVersionMatch[1]
      : undefined;
    const previousBuildNumber = currentBuildMatch
      ? parseInt(currentBuildMatch[1] || '0', 10)
      : undefined;

    // Update MARKETING_VERSION (user-facing version)
    content = content.replace(
      IOS_VERSION_PATTERNS.MARKETING_VERSION,
      `MARKETING_VERSION = ${version};`
    );

    // Update CURRENT_PROJECT_VERSION (build number)
    content = content.replace(
      IOS_VERSION_PATTERNS.CURRENT_PROJECT_VERSION,
      `CURRENT_PROJECT_VERSION = ${buildNumber};`
    );

    fs.writeFileSync(iosProjectPath, content);

    return {
      success: true,
      platform: 'ios',
      previousVersion,
      newVersion: version,
      previousBuildNumber,
      newBuildNumber: buildNumber,
    };
  } catch (error) {
    return {
      success: false,
      platform: 'ios',
      newVersion: version,
      newBuildNumber: buildNumber,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Updates Android app version and build number
 */
export async function updateAndroidVersion(
  version: string,
  buildNumber: number,
  gradlePath?: string
): Promise<PlatformUpdateResult> {
  const androidGradlePath = gradlePath || './android/app/build.gradle';

  try {
    if (!fs.existsSync(androidGradlePath)) {
      return {
        success: false,
        platform: 'android',
        newVersion: version,
        newBuildNumber: buildNumber,
        error: `Android build.gradle not found at: ${androidGradlePath}`,
      };
    }

    let content = fs.readFileSync(androidGradlePath, 'utf8');

    // Extract current versions
    const currentVersionMatch = content.match(/versionName\s+"([^"]+)"/);
    const currentBuildMatch = content.match(/versionCode\s+(\d+)/);

    const previousVersion = currentVersionMatch
      ? currentVersionMatch[1]
      : undefined;
    const previousBuildNumber = currentBuildMatch
      ? parseInt(currentBuildMatch[1] || '0', 10)
      : undefined;

    // Update versionName (user-facing version)
    content = content.replace(
      ANDROID_VERSION_PATTERNS.VERSION_NAME,
      `versionName "${version}"`
    );

    // Update versionCode (build number)
    content = content.replace(
      ANDROID_VERSION_PATTERNS.VERSION_CODE,
      `versionCode ${buildNumber}`
    );

    fs.writeFileSync(androidGradlePath, content);

    return {
      success: true,
      platform: 'android',
      previousVersion,
      newVersion: version,
      previousBuildNumber,
      newBuildNumber: buildNumber,
    };
  } catch (error) {
    return {
      success: false,
      platform: 'android',
      newVersion: version,
      newBuildNumber: buildNumber,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
