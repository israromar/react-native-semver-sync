/**
 * Constants for React Native Semantic Versioning Sync
 */

import type { PlatformConfig, VersionSyncOptions } from './types';

export const DEFAULT_CONFIG: Required<PlatformConfig> = {
  iosProjectPath: './ios/*.xcodeproj/project.pbxproj',
  androidGradlePath: './android/app/build.gradle',
  packageJsonPath: './package.json',
};

export const DEFAULT_OPTIONS: Required<VersionSyncOptions> = {
  config: DEFAULT_CONFIG,
  validateSemVer: true,
  incrementBuildNumber: true,
  customBuildNumber: undefined as any,
  platforms: ['ios', 'android'],
  verbose: false,
};

export const SEMVER_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const IOS_VERSION_PATTERNS = {
  MARKETING_VERSION: /MARKETING_VERSION = ([^;]+);/g,
  CURRENT_PROJECT_VERSION: /CURRENT_PROJECT_VERSION = (\d+);/g,
};

export const ANDROID_VERSION_PATTERNS = {
  VERSION_NAME: /versionName\s+"([^"]+)"/g,
  VERSION_CODE: /versionCode\s+(\d+)/g,
};

export const CLI_COLORS = {
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
} as const;
