/**
 * Semantic versioning utilities following SemVer 2.0.0 specification
 */

import { SEMVER_REGEX } from '../constants';
import type { VersionInfo, VersionType } from '../types';

/**
 * Validates if a version string follows semantic versioning format
 */
export function isValidSemVer(version: string): boolean {
  return SEMVER_REGEX.test(version);
}

/**
 * Parses a semantic version string into components
 */
export function parseVersion(version: string): VersionInfo {
  const match = version.match(SEMVER_REGEX);

  if (!match) {
    throw new Error(`Invalid semantic version: ${version}`);
  }

  const [, major, minor, patch, prerelease, buildMetadata] = match;

  return {
    version,
    major: parseInt(major || '0', 10),
    minor: parseInt(minor || '0', 10),
    patch: parseInt(patch || '0', 10),
    prerelease: prerelease || undefined,
    buildMetadata: buildMetadata || undefined,
  };
}

/**
 * Compares two semantic version strings
 * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
 */
export function compareVersions(v1: string, v2: string): number {
  const version1 = parseVersion(v1);
  const version2 = parseVersion(v2);

  // Compare major
  if (version1.major !== version2.major) {
    return version1.major > version2.major ? 1 : -1;
  }

  // Compare minor
  if (version1.minor !== version2.minor) {
    return version1.minor > version2.minor ? 1 : -1;
  }

  // Compare patch
  if (version1.patch !== version2.patch) {
    return version1.patch > version2.patch ? 1 : -1;
  }

  // Compare prerelease
  if (version1.prerelease && !version2.prerelease) return -1;
  if (!version1.prerelease && version2.prerelease) return 1;
  if (version1.prerelease && version2.prerelease) {
    return version1.prerelease.localeCompare(version2.prerelease);
  }

  return 0;
}

/**
 * Increments a semantic version based on the type
 */
export function incrementVersion(version: string, type: VersionType): string {
  const parsed = parseVersion(version);

  switch (type) {
    case 'major':
      return `${parsed.major + 1}.0.0`;
    case 'minor':
      return `${parsed.major}.${parsed.minor + 1}.0`;
    case 'patch':
      return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
    default:
      throw new Error(`Invalid version type: ${type}`);
  }
}

/**
 * Formats version info back to string
 */
export function formatVersion(versionInfo: VersionInfo): string {
  let version = `${versionInfo.major}.${versionInfo.minor}.${versionInfo.patch}`;

  if (versionInfo.prerelease) {
    version += `-${versionInfo.prerelease}`;
  }

  if (versionInfo.buildMetadata) {
    version += `+${versionInfo.buildMetadata}`;
  }

  return version;
}
