/**
 * React Native Semantic Versioning Sync
 *
 * A comprehensive library for managing semantic versions and build numbers
 * across React Native iOS and Android projects following SemVer 2.0.0 specification.
 *
 * @author Israr Khan
 * @license MIT
 */

export { VersionManager } from './core/VersionManager';
export { syncVersions, incrementVersion } from './core/api';
export { isValidSemVer, compareVersions } from './utils/semver';
export {
  updateiOSVersion,
  updateAndroidVersion,
} from './core/platformUpdaters';

// Types
export type {
  VersionType,
  PlatformConfig,
  VersionSyncOptions,
  VersionInfo,
  BuildInfo,
} from './types';

// Constants
export { DEFAULT_CONFIG } from './constants';
