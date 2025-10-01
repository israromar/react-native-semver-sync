/**
 * Main API functions for React Native Semantic Versioning Sync
 */

import { VersionManager } from './VersionManager';
import type { VersionSyncOptions, SyncResult, VersionType } from '../types';

/**
 * Syncs the current package.json version to iOS and Android platforms
 */
export async function syncVersions(
  options?: VersionSyncOptions
): Promise<SyncResult> {
  const manager = new VersionManager(options);
  return await manager.syncVersions();
}

/**
 * Increments the package.json version and syncs to all platforms
 */
export async function incrementVersion(
  type: VersionType,
  options?: VersionSyncOptions
): Promise<SyncResult> {
  const manager = new VersionManager(options);
  return await manager.incrementVersion(type);
}

/**
 * Convenience functions for specific version types
 */
export async function incrementPatch(
  options?: VersionSyncOptions
): Promise<SyncResult> {
  return await incrementVersion('patch', options);
}

export async function incrementMinor(
  options?: VersionSyncOptions
): Promise<SyncResult> {
  return await incrementVersion('minor', options);
}

export async function incrementMajor(
  options?: VersionSyncOptions
): Promise<SyncResult> {
  return await incrementVersion('major', options);
}
