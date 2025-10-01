/**
 * TypeScript type definitions for React Native Semantic Versioning Sync
 */

export type VersionType = 'major' | 'minor' | 'patch';

export interface PlatformConfig {
  /** Path to iOS project.pbxproj file */
  iosProjectPath?: string;
  /** Path to Android build.gradle file */
  androidGradlePath?: string;
  /** Path to package.json file */
  packageJsonPath?: string;
}

export interface VersionSyncOptions {
  /** Platform configuration paths */
  config?: PlatformConfig;
  /** Whether to validate semantic version format */
  validateSemVer?: boolean;
  /** Whether to increment build numbers */
  incrementBuildNumber?: boolean;
  /** Custom build number (overrides auto-increment) */
  customBuildNumber?: number;
  /** Platforms to update */
  platforms?: ('ios' | 'android')[];
  /** Verbose logging */
  verbose?: boolean;
}

export interface VersionInfo {
  /** Current semantic version */
  version: string;
  /** Major version number */
  major: number;
  /** Minor version number */
  minor: number;
  /** Patch version number */
  patch: number;
  /** Pre-release identifier */
  prerelease?: string;
  /** Build metadata */
  buildMetadata?: string;
}

export interface BuildInfo {
  /** Current build number */
  buildNumber: number;
  /** Previous build number */
  previousBuildNumber?: number;
  /** Platform where build number was found */
  source: 'ios' | 'android' | 'manual';
}

export interface PlatformUpdateResult {
  /** Whether the update was successful */
  success: boolean;
  /** Platform that was updated */
  platform: 'ios' | 'android';
  /** Previous version */
  previousVersion?: string;
  /** New version */
  newVersion: string;
  /** Previous build number */
  previousBuildNumber?: number;
  /** New build number */
  newBuildNumber: number;
  /** Error message if update failed */
  error?: string;
}

export interface SyncResult {
  /** Whether the sync was successful */
  success: boolean;
  /** Version information */
  version: VersionInfo;
  /** Build information */
  build: BuildInfo;
  /** Platform update results */
  platforms: PlatformUpdateResult[];
  /** Any errors that occurred */
  errors: string[];
}
